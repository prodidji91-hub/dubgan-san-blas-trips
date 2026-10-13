import type { Context } from '@netlify/functions';
import { verifyRequestSession, verifySameOrigin } from './lib/admin-auth-store.js';
import {
  getBookingByReferenceWithMeta,
  updateBookingWithETag,
  BookingRecord,
} from './lib/booking-store.js';

const ALLOWED_HOSTNAMES = [
  'checkout.paguelofacil.com',
  'sandbox.paguelofacil.com',
  'secure.paguelofacil.com',
  'gw.paguelofacil.com',
];

function isAllowedPagueloFacilUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') return false;
    return ALLOWED_HOSTNAMES.includes(parsed.hostname);
  } catch {
    return false;
  }
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

    const { reference, confirmedAvailability } = body;

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

    if (confirmedAvailability !== true) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'AVAILABILITY_UNCONFIRMED',
          errorEs: 'Debes confirmar la disponibilidad de las cabañas antes de aprobar.',
          errorEn: 'You must check and confirm cabin availability prior to approving.',
        }),
        { status: 400, headers }
      );
    }

    const envMode: 'sandbox' | 'production' =
      (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
        ? 'production'
        : 'sandbox';

    // 2. LOAD SAVED BOOKING FROM STORAGE WITH ETAG
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

    let { record, etag } = metaBooking;

    // 3. VALIDATE CABIN RATES ($265/person for 2 nights, $355/person for 3 nights)
    let basePrice = 265;
    if (record.nights === 3 || record.tourId === 'island-hopping-3-nights') {
      basePrice = 355;
    }
    const validatedFullAmount = record.guests * basePrice;

    // Reuse existing checkout URL if already present and valid
    if (record.checkoutDetails?.checkoutUrl && isAllowedPagueloFacilUrl(record.checkoutDetails.checkoutUrl)) {
      return new Response(
        JSON.stringify({
          success: true,
          reference: record.reference,
          checkoutUrl: record.checkoutDetails.checkoutUrl,
          bookingStatus: 'awaiting_payment',
          paymentStatus: 'unpaid',
          fullAmountUSD: validatedFullAmount,
          isReused: true,
        }),
        { status: 200, headers }
      );
    }

    // Lock check: prevent concurrent approval clicks
    if (record.checkoutDetails?.checkoutState === 'generating') {
      const timeSinceLock = Date.now() - new Date(record.updatedAt).getTime();
      if (timeSinceLock < 30000) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'APPROVAL_IN_PROGRESS',
            errorEs: 'Ya existe una generación de enlace de pago en curso para esta consulta. Por favor espera un momento.',
            errorEn: 'A payment link generation is already in progress for this request. Please wait a moment.',
          }),
          { status: 429, headers }
        );
      }
    }

    // 4. RECORD AVAILABILITY APPROVAL & SET ATOMIC GENERATING LOCK
    const lockResult = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      bookingStatus: 'awaiting_payment',
      pricing: {
        ...rec.pricing,
        basePrice,
        fullAmountUSD: validatedFullAmount,
      },
      checkoutDetails: {
        ...rec.checkoutDetails,
        checkoutState: 'generating',
      },
    }));

    if (!lockResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'CONCURRENT_UPDATE_CONFLICT',
          errorEs: 'Conflicto de actualización concurrente. Por favor reintenta la aprobación.',
          errorEn: 'Concurrent update conflict. Please retry the approval action.',
        }),
        { status: 409, headers }
      );
    }

    etag = lockResult.newEtag;

    // 5. GENERATE PAGUELOFACIL CHECKOUT LINK
    const cclwKey = process.env.PAGUELOFACIL_CCLW || process.env.CCLW || process.env.PAGUELOFACIL_SECRET_KEY;

    if (!cclwKey) {
      await updateBookingWithETag(reference, envMode, etag, (rec) => ({
        ...rec,
        bookingStatus: 'awaiting_payment',
        checkoutDetails: {
          ...rec.checkoutDetails,
          checkoutState: 'failed',
          failedAt: new Date().toISOString(),
          errorReason: 'MISSING_MERCHANT_CONFIG',
        },
      }));

      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_MERCHANT_CONFIG',
          reference,
          bookingStatus: 'awaiting_payment',
          paymentStatus: 'unpaid',
          errorEs: 'Disponibilidad aprobada. Sin embargo, la variable de entorno PAGUELOFACIL_CCLW está pendiente en Netlify para generar el enlace de pago.',
          errorEn: 'Availability approved. However, PAGUELOFACIL_CCLW is pending in Netlify environment variables to generate payment link.',
        }),
        { status: 503, headers }
      );
    }

    const baseUrl = envMode === 'production'
      ? (process.env.PAGUELOFACIL_PRODUCTION_URL || 'https://secure.paguelofacil.com')
      : (process.env.PAGUELOFACIL_SANDBOX_URL || 'https://sandbox.paguelofacil.com');

    const conceptDescription = `Dubgan San Blas: ${record.tourTitleEs || record.tourId} (${record.date}) - ${record.guests} pers`;

    const formData = new URLSearchParams();
    formData.append('CCLW', cclwKey);
    formData.append('CMTN', validatedFullAmount.toFixed(2));
    formData.append('CDSC', conceptDescription);
    formData.append('PARM_1', reference);

    const pfEndpoint = `${baseUrl.replace(/\/$/, '')}/LinkDeamon.cfm`;

    let pfResponse: Response;
    try {
      pfResponse = await fetch(pfEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
    } catch (fetchErr: any) {
      await updateBookingWithETag(reference, envMode, etag, (rec) => ({
        ...rec,
        bookingStatus: 'awaiting_payment',
        checkoutDetails: {
          ...rec.checkoutDetails,
          checkoutState: 'failed',
          failedAt: new Date().toISOString(),
          errorReason: `PAGUELOFACIL_CONNECTION_ERROR: ${fetchErr?.message || String(fetchErr)}`,
        },
      }));

      return new Response(
        JSON.stringify({
          success: false,
          code: 'PAGUELOFACIL_CONNECTION_ERROR',
          reference,
          bookingStatus: 'awaiting_payment',
          errorEs: 'Disponibilidad aprobada. Error al conectar con PagueloFacil. Utiliza la opción de reintento.',
          errorEn: 'Availability approved. Connection error with PagueloFacil. Use retry option.',
          details: fetchErr?.message || String(fetchErr),
        }),
        { status: 502, headers }
      );
    }

    let responseData: any = null;
    try {
      responseData = await pfResponse.json();
    } catch {
      const textRaw = await pfResponse.text();
      await updateBookingWithETag(reference, envMode, etag, (rec) => ({
        ...rec,
        bookingStatus: 'awaiting_payment',
        checkoutDetails: {
          ...rec.checkoutDetails,
          checkoutState: 'failed',
          failedAt: new Date().toISOString(),
          errorReason: `PAGUELOFACIL_INVALID_RESPONSE: ${textRaw.slice(0, 150)}`,
        },
      }));

      return new Response(
        JSON.stringify({
          success: false,
          code: 'PAGUELOFACIL_INVALID_RESPONSE',
          reference,
          bookingStatus: 'awaiting_payment',
          errorEs: 'Disponibilidad aprobada. Respuesta no válida del proveedor de pagos. Utiliza la opción de reintento.',
          errorEn: 'Availability approved. Invalid payment provider response. Use retry option.',
        }),
        { status: 502, headers }
      );
    }

    const checkoutUrl = responseData?.data?.url || responseData?.data?.checkoutUrl || responseData?.url;

    if (!checkoutUrl || typeof checkoutUrl !== 'string' || !isAllowedPagueloFacilUrl(checkoutUrl)) {
      const providerMsg = responseData?.headerStatus?.description || responseData?.message || responseData?.error || 'Unknown provider response';

      await updateBookingWithETag(reference, envMode, etag, (rec) => ({
        ...rec,
        bookingStatus: 'awaiting_payment',
        checkoutDetails: {
          ...rec.checkoutDetails,
          checkoutState: 'failed',
          failedAt: new Date().toISOString(),
          errorReason: providerMsg,
        },
      }));

      return new Response(
        JSON.stringify({
          success: false,
          code: 'PAGUELOFACIL_LINK_GENERATION_FAILED',
          reference,
          bookingStatus: 'awaiting_payment',
          errorEs: 'Disponibilidad aprobada. No se pudo generar el enlace de pago de PagueloFacil. Utiliza la opción de reintento.',
          errorEn: 'Availability approved. Failed to generate PagueloFacil payment link. Use retry option.',
          providerMessage: providerMsg,
        }),
        { status: 502, headers }
      );
    }

    // 6. SAVE SUCCESSFUL CHECKOUT LINK REFERENCE
    const finalUpdate = await updateBookingWithETag(reference, envMode, etag, (rec) => ({
      ...rec,
      bookingStatus: 'awaiting_payment',
      paymentStatus: 'unpaid',
      checkoutDetails: {
        checkoutUrl,
        generatedAt: new Date().toISOString(),
        checkoutState: 'completed',
      },
    }));

    return new Response(
      JSON.stringify({
        success: true,
        reference,
        checkoutUrl,
        bookingStatus: 'awaiting_payment',
        paymentStatus: 'unpaid',
        fullAmountUSD: validatedFullAmount,
        record: finalUpdate.record,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al aprobar la disponibilidad de la cabaña.',
        errorEn: 'An unexpected internal error occurred while approving cabin availability.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
