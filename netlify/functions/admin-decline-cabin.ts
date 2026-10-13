import type { Context } from '@netlify/functions';
import { verifyRequestSession, verifySameOrigin } from './lib/admin-auth-store.js';
import {
  getBookingByReferenceWithMeta,
  updateBookingWithETag,
} from './lib/booking-store.js';

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

  // 0. CSRF Same-Origin Verification
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

  // 1. VERIFY ADMIN AUTHENTICATION
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

    const { reference, reason } = body;

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
          errorEs: `Reserva ${reference} no encontrada.`,
          errorEn: `Booking ${reference} not found.`,
        }),
        { status: 404, headers }
      );
    }

    const { record, etag } = metaBooking;

    // Safety check: Do not alter paid or confirmed bookings
    if (record.paymentStatus === 'paid' || record.bookingStatus === 'confirmed') {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'CANNOT_DECLINE_PAID_BOOKING',
          errorEs: 'No se puede rechazar una reserva que ya ha sido pagada o confirmada.',
          errorEn: 'Cannot decline a booking that has already been paid or confirmed.',
        }),
        { status: 400, headers }
      );
    }

    // Update status to cancelled / unavailable
    const updateRes = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      bookingStatus: 'cancelled',
      checkoutDetails: {
        ...rec.checkoutDetails,
        errorReason: reason || 'Cabaña no disponible para las fechas solicitadas (Rechazado por administración).',
      },
    }));

    return new Response(
      JSON.stringify({
        success: true,
        reference,
        bookingStatus: 'cancelled',
        record: updateRes.record,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al marcar la cabaña como no disponible.',
        errorEn: 'An unexpected internal error occurred while declining cabin request.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
