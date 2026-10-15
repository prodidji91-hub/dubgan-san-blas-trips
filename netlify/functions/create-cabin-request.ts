import type { Context } from '@netlify/functions';
import {
  createBookingRecord,
  findExistingIdempotentBooking,
  BookingRecord,
} from './lib/booking-store.js';
import { validateAndNormalizePhone } from './lib/phone-validator.js';

interface CabinPackageRequest {
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

const CABIN_TOURS: Record<
  string,
  {
    titleEs: string;
    titleEn: string;
    basePrice: number;
    nights: number;
  }
> = {
  'island-hopping-2-nights': {
    titleEs: 'Island Hopping — 2 Noches',
    titleEn: 'Island Hopping — 2 Nights',
    basePrice: 265,
    nights: 2,
  },
  'island-hopping-3-nights': {
    titleEs: 'Island Hopping — 3 Noches',
    titleEn: 'Island Hopping — 3 Nights',
    basePrice: 355,
    nights: 3,
  },
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getTodayInPanama(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Panama',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

function calculateDepartureDate(arrivalStr: string, nightsCount: number): string {
  const [y, m, d] = arrivalStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + nightsCount);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async (req: Request, _context: Context) => {
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
    let body: CabinPackageRequest;
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
    const cabinTour = CABIN_TOURS[tourId];
    if (!cabinTour) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_CABIN_TOUR_ID',
          errorEs:
            'ID de paquete de cabaña no válido. Utiliza island-hopping-2-nights o island-hopping-3-nights.',
          errorEn:
            'Invalid cabin package tour ID. Use island-hopping-2-nights or island-hopping-3-nights.',
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

    // 3. Arrival Date Validation (Panama Time)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_DATE',
          errorEs: 'Fecha de llegada no válida. Formato requerido: YYYY-MM-DD.',
          errorEn: 'Invalid arrival date format. Required: YYYY-MM-DD.',
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
          errorEs: `La fecha de llegada (${date}) no puede ser anterior a la fecha actual en Panamá (${todayPanama}).`,
          errorEn: `Arrival date (${date}) cannot be in the past relative to Panama local time (${todayPanama}).`,
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

    const phoneValidation = validateAndNormalizePhone(whatsappNumber);
    if (!phoneValidation.success) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_WHATSAPP',
          errorEs: 'El número de WhatsApp no es válido o requiere un código de país válido (ej. +50760053200).',
          errorEn: 'Invalid WhatsApp phone number or requires a valid country code (e.g. +50760053200).',
        }),
        { status: 400, headers }
      );
    }
    const normalizedWhatsapp = phoneValidation.e164!;

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

    // 5. Calculate Rates and Departure Date
    const departureDate = calculateDepartureDate(date, cabinTour.nights);
    const fullAmountUSD = guestNum * cabinTour.basePrice;

    // Environment separation
    const envMode = (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
      ? 'production'
      : 'sandbox';

    // 6. IDEMPOTENCY & DUPLICATE SUBMISSION CHECK
    const idempotentCheck = await findExistingIdempotentBooking(
      email.trim(),
      tourId,
      date,
      guestNum,
      fullAmountUSD,
      envMode
    );

    if (idempotentCheck.found && idempotentCheck.parameterMatch && idempotentCheck.existingRecord) {
      const existing = idempotentCheck.existingRecord;
      return new Response(
        JSON.stringify({
          success: true,
          bookingReference: existing.reference,
          tourId,
          tourTitleEs: cabinTour.titleEs,
          tourTitleEn: cabinTour.titleEn,
          arrivalDate: date,
          departureDate,
          nights: cabinTour.nights,
          guests: guestNum,
          fullAmountUSD,
          bookingStatus: existing.bookingStatus,
          paymentStatus: existing.paymentStatus,
          environment: envMode,
          createdAt: existing.createdAt,
          isReused: true,
        }),
        { status: 200, headers }
      );
    }

    // Construct Unique Booking Reference
    const reference = `DUBGAN-CABIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    const newRecord: BookingRecord = {
      reference,
      category: 'cabin_package',
      tourId,
      tourTitleEs: cabinTour.titleEs,
      tourTitleEn: cabinTour.titleEn,
      date,
      departureDate,
      nights: cabinTour.nights,
      guests: guestNum,
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        whatsappNumber: normalizedWhatsapp,
        pickupHotel: pickupHotel.trim(),
        message: message?.trim() || undefined,
      },
      language,
      pricing: {
        basePrice: cabinTour.basePrice,
        priceType: 'per_person',
        fullAmountUSD,
        currency: 'USD',
      },
      bookingStatus: 'pending_availability',
      paymentStatus: 'unpaid',
      environment: envMode,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 7. Save in Netlify Blobs using conditional write onlyIfNew: true
    const createRes = await createBookingRecord(newRecord);
    if (!createRes.success) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'STORAGE_FAILED',
          errorEs: 'Error al registrar la solicitud en Netlify Blobs.',
          errorEn: 'Failed to persist cabin inquiry in Netlify Blobs storage.',
        }),
        { status: 500, headers }
      );
    }

    // Return successful saved response
    return new Response(
      JSON.stringify({
        success: true,
        bookingReference: reference,
        tourId,
        tourTitleEs: cabinTour.titleEs,
        tourTitleEn: cabinTour.titleEn,
        arrivalDate: date,
        departureDate,
        nights: cabinTour.nights,
        guests: guestNum,
        fullAmountUSD,
        bookingStatus: 'pending_availability',
        paymentStatus: 'unpaid',
        environment: envMode,
        createdAt: nowIso,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al procesar la solicitud de cabaña.',
        errorEn: 'An unexpected error occurred while processing cabin package request.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
