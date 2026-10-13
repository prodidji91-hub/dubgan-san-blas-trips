import type { Context } from '@netlify/functions';
import {
  createBookingRecord,
  findExistingIdempotentBooking,
  updateBookingWithETag,
  BookingRecord,
} from './lib/booking-store.js';

const ALLOWED_HOSTNAMES = [
  'checkout.paguelofacil.com',
  'sandbox.paguelofacil.com',
  'secure.paguelofacil.com',
  'gw.paguelofacil.com',
];

interface DayTripRequest {
  tourId: string;
  date: string;
  guests: number;
  fullName: string;
  email: string;
  whatsappNumber: string;
  pickupHotel: string;
  message?: string;
  language?: 'es' | 'en';
}

const TOUR_PRICES: Record<string, { titleEs: string; titleEn: string; calculatePrice: (g: number) => number }> = {
  'shared-full-day': {
    titleEs: 'Full Day en San Blas - Compartido',
    titleEn: 'Full Day in San Blas - Shared',
    calculatePrice: (guests: number) => guests * 135,
  },
  'private-full-day': {
    titleEs: 'San Blas Private Full Day (1–3 personas)',
    titleEn: 'San Blas Full-Day Private Experience (1–3 guests)',
    calculatePrice: () => 850,
  },
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getTodayInPanama(): string {
  // America/Panama time YYYY-MM-DD
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Panama',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

function isAllowedPagueloFacilUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    return ALLOWED_HOSTNAMES.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default async (req: Request, _context: Context) => {
  // CORS Headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  try {
    let body: DayTripRequest;
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

    const {
      tourId,
      date,
      guests,
      fullName,
      email,
      whatsappNumber,
      pickupHotel,
      message,
      language = 'en',
    } = body;

    // 1. Tour ID Validation
    if (!tourId || !TOUR_PRICES[tourId]) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_TOUR_ID',
          errorEs: 'ID de tour no válido. El pago en línea solo aplica para pasadías (shared-full-day o private-full-day).',
          errorEn: 'Invalid tour ID. Online checkout applies exclusively to day trips (shared-full-day or private-full-day).',
        }),
        { status: 400, headers }
      );
    }

    // 2. Guest Count Validation
    const guestNum = Number(guests);
    if (!Number.isInteger(guestNum) || guestNum < 1) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_GUESTS',
          errorEs: 'La cantidad de viajeros debe ser un número entero positivo mayor o igual a 1.',
          errorEn: 'Guest count must be a positive integer greater than or equal to 1.',
        }),
        { status: 400, headers }
      );
    }

    if (tourId === 'private-full-day' && guestNum > 3) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'PRIVATE_TOUR_CAP_EXCEEDED',
          errorEs: 'El tour privado tiene un límite máximo de 3 personas.',
          errorEn: 'The private tour is limited to a maximum of 3 guests.',
        }),
        { status: 400, headers }
      );
    }

    // 3. Date Validation (America/Panama timezone)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_DATE',
          errorEs: 'Fecha de viaje no válida. Formato requerido: YYYY-MM-DD.',
          errorEn: 'Invalid travel date format. Required: YYYY-MM-DD.',
        }),
        { status: 400, headers }
      );
    }

    const todayPanama = getTodayInPanama();
    if (date < todayPanama) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'PAST_DATE',
          errorEs: `La fecha de viaje (${date}) no puede ser anterior a la fecha actual en Panamá (${todayPanama}).`,
          errorEn: `Travel date (${date}) cannot be in the past relative to Panama local time (${todayPanama}).`,
        }),
        { status: 400, headers }
      );
    }

    // 4. Contact Fields Validation
    if (!fullName || !fullName.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_NAME',
          errorEs: 'El nombre completo es requerido.',
          errorEn: 'Full name is required.',
        }),
        { status: 400, headers }
      );
    }

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_EMAIL',
          errorEs: 'El correo electrónico no es válido.',
          errorEn: 'Invalid email address.',
        }),
        { status: 400, headers }
      );
    }

    if (!whatsappNumber || !whatsappNumber.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_WHATSAPP',
          errorEs: 'El número de WhatsApp es requerido.',
          errorEn: 'WhatsApp phone number is required.',
        }),
        { status: 400, headers }
      );
    }

    if (!pickupHotel || !pickupHotel.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_HOTEL',
          errorEs: 'El hotel de recogida o la opción "Aún no reservado" es requerido.',
          errorEn: 'Pickup hotel or "Not booked yet" option is required.',
        }),
        { status: 400, headers }
      );
    }

    // 5. Server-Side Price Calculation (Never trust price from browser)
    const tourInfo = TOUR_PRICES[tourId];
    const fullAmount = tourInfo.calculatePrice(guestNum);

    // Environment & Provider Config
    const cclwKey = process.env.PAGUELOFACIL_CCLW || process.env.CCLW || process.env.PAGUELOFACIL_SECRET_KEY;
    const envMode: 'sandbox' | 'production' = (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
      ? 'production'
      : 'sandbox';

    const nowIso = new Date().toISOString();

    // 6. IDEMPOTENCY & DUPLICATE SUBMISSION CHECK
    const idempotentCheck = await findExistingIdempotentBooking(
      email.trim(),
      tourId,
      date,
      guestNum,
      fullAmount,
      envMode
    );

    let orderId: string;
    let currentETag: string | undefined;

    if (idempotentCheck.found && idempotentCheck.parameterMatch && idempotentCheck.existingRecord) {
      const existing = idempotentCheck.existingRecord;
      orderId = existing.reference;
      currentETag = idempotentCheck.etag;

      // Case 1: Active checkoutUrl already generated and valid
      if (existing.checkoutDetails?.checkoutUrl && isAllowedPagueloFacilUrl(existing.checkoutDetails.checkoutUrl)) {
        return new Response(
          JSON.stringify({
            success: true,
            orderId: existing.reference,
            checkoutUrl: existing.checkoutDetails.checkoutUrl,
            fullAmountCalculated: existing.pricing.fullAmountUSD,
            currency: 'USD',
            environment: envMode,
            isReused: true,
          }),
          { status: 200, headers }
        );
      }

      // Case 2: Concurrent lock check - payment link generation in progress
      if (existing.checkoutDetails?.checkoutState === 'generating') {
        const timeSinceLock = Date.now() - new Date(existing.updatedAt).getTime();
        // If locked within the last 30 seconds, prevent duplicate generation
        if (timeSinceLock < 30000) {
          return new Response(
            JSON.stringify({
              success: false,
              code: 'CHECKOUT_GENERATION_IN_PROGRESS',
              bookingReference: orderId,
              errorEs: 'Ya hay una generación de enlace de pago en proceso para esta reserva. Por favor espera un momento.',
              errorEn: 'A payment link generation is currently in progress for this booking. Please wait a moment.',
            }),
            { status: 429, headers }
          );
        }
      }

      // Set generating lock via conditional update with ETag
      const lockResult = await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
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
            bookingReference: orderId,
            errorEs: 'Conflicto de actualización concurrente. Por favor reintenta.',
            errorEn: 'Concurrent update conflict. Please retry.',
          }),
          { status: 409, headers }
        );
      }
      currentETag = lockResult.newEtag;
    } else {
      // Create new booking record with unique orderId
      orderId = `DUBGAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newBooking: BookingRecord = {
        reference: orderId,
        category: 'day_trip',
        tourId,
        tourTitleEs: tourInfo.titleEs,
        tourTitleEn: tourInfo.titleEn,
        date,
        guests: guestNum,
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          whatsappNumber: whatsappNumber.trim(),
          pickupHotel: pickupHotel.trim(),
          message: message?.trim() || undefined,
        },
        language,
        pricing: {
          basePrice: tourId === 'private-full-day' ? 850 : 135,
          priceType: tourId === 'private-full-day' ? 'flat' : 'per_person',
          fullAmountUSD: fullAmount,
          currency: 'USD',
        },
        bookingStatus: 'awaiting_payment',
        paymentStatus: 'unpaid',
        checkoutDetails: {
          checkoutState: 'generating',
        },
        environment: envMode,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const createRes = await createBookingRecord(newBooking);
      if (!createRes.success) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'STORAGE_FAILED',
            errorEs: 'No se pudo guardar la reserva en Netlify Blobs antes de conectar con el portal de pago.',
            errorEn: 'Failed to record booking in Netlify Blobs storage prior to payment link generation.',
          }),
          { status: 500, headers }
        );
      }
    }

    // Check Merchant Credentials
    if (!cclwKey) {
      await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
        bookingStatus: 'checkout_failed',
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
          bookingReference: orderId,
          errorEs: 'Configuración de comerciante de PagueloFacil pendiente. La variable de entorno PAGUELOFACIL_CCLW debe configurarse en Netlify.',
          errorEn: 'PagueloFacil merchant configuration pending. The environment variable PAGUELOFACIL_CCLW must be configured in Netlify.',
        }),
        { status: 503, headers }
      );
    }

    // Determine Gateway URL
    const baseUrl = envMode === 'production'
      ? (process.env.PAGUELOFACIL_PRODUCTION_URL || 'https://secure.paguelofacil.com')
      : (process.env.PAGUELOFACIL_SANDBOX_URL || 'https://sandbox.paguelofacil.com');

    const conceptDescription = `Dubgan San Blas: ${tourInfo.titleEs} (${date}) - ${guestNum} pers`;

    // 7. Request fresh payment link from PagueloFacil LinkDeamon via POST (application/x-www-form-urlencoded)
    // Documented API parameters: CCLW, CMTN, CDSC, PARM_1
    const formData = new URLSearchParams();
    formData.append('CCLW', cclwKey);
    formData.append('CMTN', fullAmount.toFixed(2));
    formData.append('CDSC', conceptDescription);
    formData.append('PARM_1', orderId);

    const pfEndpoint = `${baseUrl.replace(/\/$/, '')}/LinkDeamon.cfm`;

    let pfResponse: Response;
    try {
      pfResponse = await fetch(pfEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
    } catch (fetchErr: any) {
      await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
        bookingStatus: 'checkout_failed',
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
          bookingReference: orderId,
          errorEs: 'Error al conectar con la pasarela de pago PagueloFacil. Puedes reintentar con el código de reserva.',
          errorEn: 'Unable to establish connection with PagueloFacil payment gateway. You can retry using the booking reference.',
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
      await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
        bookingStatus: 'checkout_failed',
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
          bookingReference: orderId,
          errorEs: 'Respuesta no válida del proveedor de pagos.',
          errorEn: 'Invalid response from payment provider.',
          raw: textRaw.slice(0, 300),
        }),
        { status: 502, headers }
      );
    }

    // Parse returned checkout URL
    const checkoutUrl = responseData?.data?.url || responseData?.data?.checkoutUrl || responseData?.url;

    if (!checkoutUrl || typeof checkoutUrl !== 'string') {
      const providerMsg = responseData?.headerStatus?.description || responseData?.message || responseData?.error || 'Unknown provider response';
      
      await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
        bookingStatus: 'checkout_failed',
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
          bookingReference: orderId,
          errorEs: 'No se pudo generar el enlace de pago de PagueloFacil.',
          errorEn: 'Failed to generate PagueloFacil payment link.',
          providerMessage: providerMsg,
        }),
        { status: 502, headers }
      );
    }

    // 8. Validate returned checkout URL
    if (!isAllowedPagueloFacilUrl(checkoutUrl)) {
      await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
        ...rec,
        bookingStatus: 'checkout_failed',
        checkoutDetails: {
          ...rec.checkoutDetails,
          checkoutState: 'failed',
          failedAt: new Date().toISOString(),
          errorReason: 'UNTRUSTED_CHECKOUT_DOMAIN',
        },
      }));

      return new Response(
        JSON.stringify({
          success: false,
          code: 'UNTRUSTED_CHECKOUT_DOMAIN',
          bookingReference: orderId,
          errorEs: 'El enlace de pago devuelto no pertenece a un dominio verificado de PagueloFacil.',
          errorEn: 'The returned payment link domain is not a verified PagueloFacil domain.',
        }),
        { status: 502, headers }
      );
    }

    // 9. UPDATE BOOKING RECORD WITH SUCCESSFUL PAYMENT LINK REFERENCE
    await updateBookingWithETag(orderId, envMode, currentETag, (rec) => ({
      ...rec,
      bookingStatus: 'awaiting_payment',
      checkoutDetails: {
        checkoutUrl,
        generatedAt: new Date().toISOString(),
        checkoutState: 'completed',
      },
    }));

    // Return success payload
    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        checkoutUrl,
        fullAmountCalculated: fullAmount,
        currency: 'USD',
        environment: envMode,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al procesar la solicitud.',
        errorEn: 'An unexpected internal error occurred while processing checkout.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
