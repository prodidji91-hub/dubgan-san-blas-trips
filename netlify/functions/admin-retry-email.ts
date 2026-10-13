import type { Context } from '@netlify/functions';
import { verifyRequestSession, verifySameOrigin } from './lib/admin-auth-store.js';
import {
  getBookingByReferenceWithMeta,
  updateBookingWithETag,
  BookingRecord,
  EmailLogEntry,
} from './lib/booking-store.js';
import {
  sendCabinRequestBillyNotification,
  sendCabinRequestCustomerAcknowledgement,
  sendCabinApprovalPaymentLink,
  sendPaymentConfirmationCustomerEmail,
  sendPaymentConfirmationBillyNotification,
  EmailSendResult,
} from './lib/email-service.js';

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
        errorEs: 'Método no permitido. Utiliza POST.',
        errorEn: 'Method not allowed. Use POST.',
      }),
      { status: 405, headers }
    );
  }

  // 1. CSRF Same-Origin Verification
  if (!verifySameOrigin(req)) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'CSRF_REJECTED',
        errorEs: 'Solicitud rechazada por política de seguridad CSRF (origen no válido).',
        errorEn: 'Request rejected by CSRF security policy (untrusted origin).',
      }),
      { status: 403, headers }
    );
  }

  // 2. VERIFY ADMIN AUTHENTICATION
  const auth = await verifyRequestSession(req);
  if (!auth.authenticated) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'UNAUTHORIZED',
        errorEs: 'Acceso no autorizado. Sesión de administración no válida o expirada.',
        errorEn: 'Unauthorized access. Admin session invalid or expired.',
      }),
      { status: 401, headers }
    );
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_JSON',
          errorEs: 'Cuerpo de solicitud JSON no válido.',
          errorEn: 'Invalid JSON request body.',
        }),
        { status: 400, headers }
      );
    }

    const { reference, emailType } = body;

    if (!reference || typeof reference !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_REFERENCE',
          errorEs: 'El código de referencia de la reserva es requerido.',
          errorEn: 'Booking reference is required.',
        }),
        { status: 400, headers }
      );
    }

    const validEmailTypes = [
      'billy_notification',
      'customer_acknowledgement',
      'customer_payment_link',
      'customer_payment_confirmation',
      'billy_payment_confirmation',
    ];

    if (!emailType || !validEmailTypes.includes(emailType)) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_EMAIL_TYPE',
          errorEs: 'Tipo de correo electrónico no válido.',
          errorEn: 'Invalid email notification type.',
        }),
        { status: 400, headers }
      );
    }

    const envMode: 'sandbox' | 'production' =
      (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
        ? 'production'
        : 'sandbox';

    const metaBooking = await getBookingByReferenceWithMeta(reference, envMode);
    if (!metaBooking) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'BOOKING_NOT_FOUND',
          errorEs: `Reserva ${reference} no encontrada en la base de datos de Netlify Blobs.`,
          errorEn: `Booking ${reference} not found in Netlify Blobs storage.`,
        }),
        { status: 404, headers }
      );
    }

    const { record, etag } = metaBooking;

    let sendResult: EmailSendResult;

    if (emailType === 'billy_notification') {
      sendResult = await sendCabinRequestBillyNotification(record);
    } else if (emailType === 'customer_acknowledgement') {
      sendResult = await sendCabinRequestCustomerAcknowledgement(record);
    } else if (emailType === 'customer_payment_link') {
      sendResult = await sendCabinApprovalPaymentLink(record);
    } else if (emailType === 'customer_payment_confirmation') {
      sendResult = await sendPaymentConfirmationCustomerEmail(record);
    } else {
      sendResult = await sendPaymentConfirmationBillyNotification(record);
    }

    const nowIso = new Date().toISOString();
    const newLogEntry: EmailLogEntry = {
      type: emailType,
      recipient: sendResult.recipient,
      status: sendResult.disabled ? 'disabled' : sendResult.success ? 'sent' : 'failed',
      sentAt: nowIso,
      errorReason: sendResult.errorReason,
    };

    const statusValue = sendResult.disabled ? 'disabled' : sendResult.success ? 'sent' : 'failed';

    const updateRes = await updateBookingWithETag(reference, envMode, etag, (rec) => {
      const currentLogs = rec.emailNotifications?.logs || [];
      const currentNotifications = rec.emailNotifications || {};

      return {
        ...rec,
        emailNotifications: {
          ...currentNotifications,
          ...(emailType === 'billy_notification' ? { billyNotificationStatus: statusValue } : {}),
          ...(emailType === 'customer_acknowledgement' ? { customerAcknowledgementStatus: statusValue } : {}),
          ...(emailType === 'customer_payment_link' ? { customerPaymentLinkStatus: statusValue } : {}),
          ...(emailType === 'customer_payment_confirmation' ? { customerPaymentConfirmationStatus: statusValue } : {}),
          ...(emailType === 'billy_payment_confirmation' ? { billyPaymentConfirmationStatus: statusValue } : {}),
          logs: [newLogEntry, ...currentLogs].slice(0, 20),
        },
      };
    });

    return new Response(
      JSON.stringify({
        success: sendResult.success,
        disabled: sendResult.disabled,
        emailResult: sendResult,
        record: updateRes.record,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al reintentar el envío del correo.',
        errorEn: 'An unexpected internal error occurred while retrying email notification.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
