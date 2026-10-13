import type { Context } from '@netlify/functions';
import {
  getBookingByReferenceWithMeta,
  updateBookingWithETag,
  saveSanitizedWebhookEvent,
  BookingRecord,
  SanitizedWebhookEvent,
  EmailLogEntry,
} from './lib/booking-store.js';
import {
  sendPaymentConfirmationCustomerEmail,
  sendPaymentConfirmationBillyNotification,
  EmailSendResult,
} from './lib/email-service.js';

export interface WebhookFields {
  status?: string | boolean;
  operationType?: string;
  totalPay?: string | number;
  requestPayAmount?: string | number;
  codOper?: string | number;
  idtx?: string;
  reference?: string;
}

/**
 * Parses POST request body (JSON or urlencoded form) into documented webhook fields.
 */
async function parseWebhookBody(req: Request): Promise<WebhookFields> {
  const fields: WebhookFields = {};

  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await req.json();
      if (json && typeof json === 'object') {
        fields.status = json.status ?? json.Status;
        fields.operationType = json.operationType ?? json.OperationType ?? json.type;
        fields.totalPay = json.totalPay ?? json.TotalPay ?? json.total ?? json.Total;
        fields.requestPayAmount = json.requestPayAmount ?? json.RequestPayAmount;
        fields.codOper = json.codOper ?? json.CodOper ?? json.code;
        fields.idtx = json.idtx ?? json.idTx ?? json.idTxn ?? json.txId;
        fields.reference = json.reference ?? json.PARM_1 ?? json.parm_1 ?? json.parm1 ?? json.CustomId;
      }
    } else {
      const text = await req.text();
      const search = new URLSearchParams(text);
      fields.status = search.get('status') || search.get('Status') || undefined;
      fields.operationType = search.get('operationType') || search.get('OperationType') || search.get('type') || undefined;
      fields.totalPay = search.get('totalPay') || search.get('TotalPay') || search.get('total') || search.get('Total') || undefined;
      fields.requestPayAmount = search.get('requestPayAmount') || search.get('RequestPayAmount') || undefined;
      fields.codOper = search.get('codOper') || search.get('CodOper') || search.get('code') || undefined;
      fields.idtx = search.get('idtx') || search.get('idTx') || search.get('txId') || undefined;
      fields.reference = search.get('reference') || search.get('PARM_1') || search.get('parm_1') || search.get('parm1') || search.get('CustomId') || undefined;
    }
  } catch {
    // Ignore parse error
  }

  return fields;
}

/**
 * Converts a dollar amount (e.g., 135.00 or "135.00") to integer USD cents.
 */
export function toIntegerCents(val: string | number | undefined): number {
  if (val === undefined || val === null || val === '') return 0;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Verification & Processing logic for verified transactions once provider authentication is established.
 * Compares exact amounts in integer USD cents, enforces cabin pre-approval, conditional writes, and idempotency.
 */
export async function processVerifiedTransaction(
  payload: WebhookFields,
  envMode: 'sandbox' | 'production'
): Promise<{ success: boolean; code: string; responseStatus: number; record?: BookingRecord; message?: string }> {
  const reference = payload.reference;
  if (!reference || typeof reference !== 'string') {
    return {
      success: false,
      code: 'MISSING_BOOKING_REFERENCE',
      responseStatus: 400,
      message: 'Missing booking reference in transaction payload.',
    };
  }

  const metaBooking = await getBookingByReferenceWithMeta(reference, envMode);
  if (!metaBooking) {
    return {
      success: false,
      code: 'BOOKING_NOT_FOUND',
      responseStatus: 404,
      message: `Booking reference ${reference} not found in Netlify Blobs storage.`,
    };
  }

  let { record, etag } = metaBooking;

  // 1. Amount Check in Integer USD Cents
  const receivedTotalCents = toIntegerCents(payload.totalPay);
  const expectedTotalCents = Math.round(record.pricing.fullAmountUSD * 100);

  if (receivedTotalCents !== expectedTotalCents) {
    return {
      success: false,
      code: 'AMOUNT_MISMATCH',
      responseStatus: 400,
      message: `Paid amount (${receivedTotalCents} cents) does not match calculated booking amount (${expectedTotalCents} cents).`,
    };
  }

  // 2. Cabin Availability Check
  if (record.category === 'cabin_package' && record.bookingStatus === 'pending_availability') {
    return {
      success: false,
      code: 'AVAILABILITY_NOT_APPROVED',
      responseStatus: 422,
      message: 'Cannot confirm payment for cabin package because cabin availability has not been approved yet.',
    };
  }

  const opType = String(payload.operationType || 'AUTH_CAPTURE').toUpperCase();
  const rawStatus = String(payload.status || '').toLowerCase();
  const isApproved =
    payload.status === true ||
    rawStatus === 'true' ||
    rawStatus === 'approved' ||
    rawStatus === '1' ||
    rawStatus === '100' ||
    String(payload.codOper) === '1';

  const isDeclined =
    payload.status === false ||
    rawStatus === 'false' ||
    rawStatus === 'declined' ||
    rawStatus === '0' ||
    rawStatus === 'failed';

  // 3. Reversal Event Handling
  if (opType === 'REVERSAL' || opType === 'REFUND') {
    const reversalRes = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      paymentDetails: {
        ...rec.paymentDetails,
        providerTxId: payload.idtx || rec.paymentDetails?.providerTxId,
        reversalFlagged: true,
        reversalReason: `Received ${opType} event from PagueloFacil`,
      },
    }));

    return {
      success: true,
      code: 'REVERSAL_FLAGGED',
      responseStatus: 200,
      record: reversalRes.record,
      message: 'Reversal event flagged for admin review without automatic refund.',
    };
  }

  // 4. Approved Captured Funds
  if (isApproved) {
    if (record.paymentStatus === 'paid' && record.bookingStatus === 'confirmed') {
      return {
        success: true,
        code: 'ALREADY_PROCESSED',
        responseStatus: 200,
        record,
        message: 'Booking is already marked paid and confirmed.',
      };
    }

    const paidRes = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      verificationPending: false,
      unverifiedNotificationReceived: false,
      paymentDetails: {
        providerTxId: payload.idtx || `PF-${Date.now()}`,
        status: 'Approved',
        amountPaidUSD: record.pricing.fullAmountUSD,
        paymentDate: new Date().toISOString(),
        providerCode: payload.codOper || '1',
        environment: envMode,
        verifiedAt: new Date().toISOString(),
        verificationMethod: 'provider_signature',
      },
    }));

    let currentRecord = paidRes.record || record;
    etag = paidRes.newEtag;

    // Dispatch Confirmation Emails
    let customerEmailResult: EmailSendResult = { success: false, disabled: true, recipient: currentRecord.customer.email };
    let billyEmailResult: EmailSendResult = { success: false, disabled: true, recipient: 'victorinodio17@gmail.com' };

    try {
      customerEmailResult = await sendPaymentConfirmationCustomerEmail(currentRecord);
    } catch (custErr) {
      console.error('[Webhook] Customer email dispatch error:', custErr);
    }

    try {
      billyEmailResult = await sendPaymentConfirmationBillyNotification(currentRecord);
    } catch (billyErr) {
      console.error('[Webhook] Billy email dispatch error:', billyErr);
    }

    const nowIso = new Date().toISOString();
    const newLogs: EmailLogEntry[] = [
      {
        type: 'customer_payment_confirmation',
        recipient: customerEmailResult.recipient,
        status: customerEmailResult.disabled ? 'disabled' : customerEmailResult.success ? 'sent' : 'failed',
        sentAt: nowIso,
        errorReason: customerEmailResult.errorReason,
      },
      {
        type: 'billy_payment_confirmation',
        recipient: billyEmailResult.recipient,
        status: billyEmailResult.disabled ? 'disabled' : billyEmailResult.success ? 'sent' : 'failed',
        sentAt: nowIso,
        errorReason: billyEmailResult.errorReason,
      },
    ];

    const finalRecord = await updateBookingWithETag(reference, envMode, etag, (rec) => {
      const currentLogs = rec.emailNotifications?.logs || [];
      return {
        ...rec,
        emailNotifications: {
          ...rec.emailNotifications,
          customerPaymentConfirmationStatus: customerEmailResult.disabled ? 'disabled' : customerEmailResult.success ? 'sent' : 'failed',
          billyPaymentConfirmationStatus: billyEmailResult.disabled ? 'disabled' : billyEmailResult.success ? 'sent' : 'failed',
          logs: [...newLogs, ...currentLogs].slice(0, 20),
        },
      };
    });

    return {
      success: true,
      code: 'PAYMENT_CONFIRMED',
      responseStatus: 200,
      record: finalRecord.record || currentRecord,
      message: 'Payment verified and booking confirmed.',
    };
  }

  // 5. Out-of-Order Declined Event Protection
  if (isDeclined) {
    if (record.paymentStatus === 'paid') {
      return {
        success: true,
        code: 'OUT_OF_ORDER_DECLINED_IGNORED',
        responseStatus: 200,
        record,
        message: 'Declined notification ignored because booking is already paid.',
      };
    }

    const declinedRes = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      paymentStatus: 'failed',
      paymentDetails: {
        ...rec.paymentDetails,
        providerTxId: payload.idtx || rec.paymentDetails?.providerTxId,
        status: 'Declined',
        amountPaidUSD: receivedTotalCents / 100,
        paymentDate: new Date().toISOString(),
        providerCode: payload.codOper || '0',
        environment: envMode,
      },
    }));

    return {
      success: true,
      code: 'PAYMENT_DECLINED_LOGGED',
      responseStatus: 200,
      record: declinedRes.record,
      message: 'Declined payment recorded.',
    };
  }

  return {
    success: true,
    code: 'PAYMENT_STATUS_PENDING',
    responseStatus: 200,
    record,
    message: 'Pending or unhandled payment status recorded.',
  };
}

export default async (req: Request, _context: Context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // REQUIREMENT 4: POST ONLY. GET requests must never change booking or payment state.
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        errorEs: 'Método no permitido. Solo se aceptan solicitudes POST para el webhook.',
        errorEn: 'Method not allowed. Only POST requests are accepted for the webhook.',
      }),
      { status: 405, headers }
    );
  }

  try {
    const payload = await parseWebhookBody(req);

    const envMode: 'sandbox' | 'production' =
      (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
        ? 'production'
        : 'sandbox';

    // REQUIREMENT 5: Until provider authentication AND reliable booking-reference mapping are established:
    // - Keep notifications unverified.
    // - Do not mark bookings paid or confirmed.
    // - Do not send payment-confirmation emails.
    // - Store ONLY sanitized event details needed for review.
    // - Never store CCLW, card tokens or full sensitive payloads.
    // - Prevent unauthenticated notifications from altering existing booking records.

    const sanitizedEvent: SanitizedWebhookEvent = {
      eventId: `wh_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      idtx: payload.idtx ? String(payload.idtx) : undefined,
      status: payload.status,
      operationType: payload.operationType ? String(payload.operationType) : undefined,
      totalPayCents: toIntegerCents(payload.totalPay),
      requestPayAmountCents: toIntegerCents(payload.requestPayAmount),
      codOper: payload.codOper ? String(payload.codOper) : undefined,
      reference: payload.reference ? String(payload.reference) : undefined,
      receivedAt: new Date().toISOString(),
      environment: envMode,
      verificationStatus: 'unverified_pending_provider_spec',
    };

    await saveSanitizedWebhookEvent(sanitizedEvent);

    return new Response(
      JSON.stringify({
        success: true,
        verified: false,
        code: 'WEBHOOK_LOGGED_UNVERIFIED',
        eventId: sanitizedEvent.eventId,
        messageEs: 'Evento de notificación recibido y guardado en registro sanitizado de auditoría. La confirmación automática de la reserva permanece desactivada hasta establecer la autenticación del webhook con PagueloFacil.',
        messageEn: 'Notification event received and saved in sanitized audit log. Automatic booking confirmation remains disabled until webhook authentication is established with PagueloFacil.',
      }),
      { status: 202, headers }
    );
  } catch (err: any) {
    console.error('[Webhook] Error processing PagueloFacil webhook:', err);
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Error interno al guardar el registro de la notificación.',
        errorEn: 'Internal error recording webhook notification.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
