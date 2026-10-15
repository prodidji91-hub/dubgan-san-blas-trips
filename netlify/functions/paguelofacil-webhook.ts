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
 * Hardened Server-Side API Transaction Verification using PAGUELOFACIL_API_TOKEN.
 * Enforces strict matching, amount verification from API response, currency checks, and ambiguity rejection.
 */
async function verifyTransactionWithApi(
  payload: WebhookFields,
  expectedAmountUSD: number
): Promise<{ verified: boolean; code?: string; txData?: any; message?: string }> {
  const apiToken = process.env.PAGUELOFACIL_API_TOKEN || process.env.PAGUELOFACIL_TOKEN;
  if (!apiToken) {
    return { verified: false, code: 'API_TOKEN_MISSING', message: 'PAGUELOFACIL_API_TOKEN is not configured.' };
  }
  const reference = payload.reference;
  if (!reference || typeof reference !== 'string') {
    return { verified: false, code: 'MISSING_BOOKING_REFERENCE', message: 'Missing booking reference.' };
  }

  const url = `https://admin.paguelofacil.com/PFManagementServices/api/v1/MerchantTransactions?Filter=reference::${encodeURIComponent(reference)}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { verified: false, code: 'API_HTTP_ERROR', message: `API responded with status ${res.status}` };
    }
    const json = await res.json();
    const txList = json?.data || json?.transactions || json || [];
    if (!Array.isArray(txList)) {
      return { verified: false, code: 'INVALID_API_RESPONSE_FORMAT', message: 'API response is not an array.' };
    }

    // Filter matching transactions for this reference
    const matches = txList.filter((tx: any) => {
      const txRef = tx.reference || tx.PARM_1 || tx.parm_1 || tx.customId;
      return txRef === reference;
    });

    if (matches.length === 0) {
      return { verified: false, code: 'API_VERIFICATION_FAILED', message: 'No matching transaction found via API lookup.' };
    }

    // Safety Correction 8: Reject ambiguous matches if multiple transactions exist for the same reference
    if (matches.length > 1) {
      return { verified: false, code: 'AMBIGUOUS_TRANSACTION_MATCH', message: 'Multiple matching transactions found for reference. Rejected.' };
    }

    const match = matches[0];

    // Check Approval Status
    const txStatus = String(match.status ?? match.Status ?? match.code ?? '');
    const isApproved = txStatus === '1' || txStatus === '100' || txStatus === 'true' || txStatus.toLowerCase() === 'approved';
    if (!isApproved) {
      return { verified: false, code: 'API_VERIFICATION_FAILED', message: `Transaction status is not approved: ${txStatus}` };
    }

    // Safety Correction 2 & 3: Verify amount exclusively against authenticated API response in integer USD cents
    const apiAmountVal = match.totalPay ?? match.amount ?? match.TotalPay;
    if (apiAmountVal === undefined || apiAmountVal === null) {
      return { verified: false, code: 'API_VERIFICATION_FAILED', message: 'API transaction missing amount field.' };
    }
    const apiAmountCents = toIntegerCents(apiAmountVal);
    const expectedCents = Math.round(expectedAmountUSD * 100);

    if (apiAmountCents !== expectedCents) {
      return { verified: false, code: 'AMOUNT_MISMATCH', message: `API amount (${apiAmountCents} cents) does not match expected booking amount (${expectedCents} cents).` };
    }

    // Safety Correction 4: Currency check if present
    const apiCurrency = String(match.currency ?? match.Currency ?? 'USD').toUpperCase();
    if (apiCurrency && apiCurrency !== 'USD') {
      return { verified: false, code: 'CURRENCY_MISMATCH', message: `API currency (${apiCurrency}) is not USD.` };
    }

    // Transaction ID check
    const txId = match.idTx || match.idtx || match.txId;
    if (!txId) {
      return { verified: false, code: 'API_VERIFICATION_FAILED', message: 'API transaction missing transaction ID (idTx).' };
    }

    return { verified: true, txData: match };
  } catch (err: any) {
    console.error('[Webhook] API verification error:', err);
    return { verified: false, code: 'API_VERIFICATION_FAILED', message: err?.message || String(err) };
  }
}

/**
 * Verification & Processing logic for verified transactions.
 * Enforces strict API query verification, amount checks in integer USD cents, idempotency, and ETag safety.
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

  // 0. Hardened Server-Side API Verification using PAGUELOFACIL_API_TOKEN
  const apiVerification = await verifyTransactionWithApi(payload, record.pricing.fullAmountUSD);
  if (!apiVerification.verified) {
    return {
      success: false,
      code: apiVerification.code || 'API_VERIFICATION_FAILED',
      responseStatus: apiVerification.code === 'AMBIGUOUS_TRANSACTION_MATCH' ? 422 : 401,
      message: apiVerification.message || 'Transaction could not be verified via PagueloFacil MerchantTransactions API query.',
    };
  }

  // 1. Cabin Availability Check
  if (record.category === 'cabin_package' && record.bookingStatus === 'pending_availability') {
    return {
      success: false,
      code: 'AVAILABILITY_NOT_APPROVED',
      responseStatus: 422,
      message: 'Cannot confirm payment for cabin package because cabin availability has not been approved yet.',
    };
  }

  // TEMPORARY PUBLIC LAUNCH SAFETY: Automatic payment confirmation is paused until real production API response and webhook delivery are verified end-to-end.
  // Unverified transactions can NEVER mark a booking as paid or confirmed.
  return {
    success: true,
    code: 'AUTOMATIC_CONFIRMATION_TEMPORARILY_DISABLED',
    responseStatus: 202,
    record,
    message: 'Webhook received and logged in audit storage. Automatic payment confirmation is temporarily disabled for public launch.',
  };

  const match = apiVerification.txData;
  const providerTxId = String(match.idTx || match.idtx || match.txId || payload.idtx || `PF-${Date.now()}`);

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
      providerTxId,
      status: 'Approved',
      amountPaidUSD: record.pricing.fullAmountUSD,
      paymentDate: new Date().toISOString(),
      providerCode: match.status || payload.codOper || '1',
      environment: envMode,
      verifiedAt: new Date().toISOString(),
      verificationMethod: 'authenticated_api_query',
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

    const verifyResult = await processVerifiedTransaction(payload, envMode);

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
      verificationStatus: verifyResult.success && verifyResult.code === 'PAYMENT_CONFIRMED' ? 'verified_via_api' : 'unverified_pending_provider_spec',
    };

    await saveSanitizedWebhookEvent(sanitizedEvent);

    return new Response(
      JSON.stringify({
        success: verifyResult.success,
        verified: verifyResult.success && verifyResult.code === 'PAYMENT_CONFIRMED',
        code: verifyResult.code,
        eventId: sanitizedEvent.eventId,
        message: verifyResult.message,
      }),
      { status: verifyResult.responseStatus, headers }
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
