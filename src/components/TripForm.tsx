import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Mail,
  Phone,
  Building,
  CreditCard,
  ShieldCheck,
  Info,
  Lock,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderDark } from './MolaBorderDark';
import { COUNTRY_CODES, validateAndFormatWhatsApp } from '../utils/phone';

interface TripFormProps {
  currentLang: Language;
  selectedTourId?: string;
  onTourChange?: (tourId: string) => void;
}

interface TourPricing {
  id: string;
  titleEs: string;
  titleEn: string;
  badgeEs: string;
  badgeEn: string;
  basePrice: number;
  priceType: 'flat' | 'per_person';
  category: 'day_trip' | 'cabin_package';
  nights?: number;
  maxGuests?: number;
}

const TOURS_PRICING: Record<string, TourPricing> = {
  'shared-full-day': {
    id: 'shared-full-day',
    titleEs: 'Full Day en San Blas - Compartido ($135 por persona)',
    titleEn: 'Full Day in San Blas - Shared ($135 per person)',
    badgeEs: 'Pasadía Compartido',
    badgeEn: 'Shared Day Trip',
    basePrice: 135,
    priceType: 'per_person',
    category: 'day_trip',
  },
  'private-full-day': {
    id: 'private-full-day',
    titleEs: 'San Blas Private Full Day ($850 hasta 3 personas)',
    titleEn: 'San Blas Full-Day Private Experience ($850 up to 3 people)',
    badgeEs: 'Tour Privado',
    badgeEn: 'Private Tour',
    basePrice: 850,
    priceType: 'flat',
    category: 'day_trip',
    maxGuests: 3,
  },
  'island-hopping-2-nights': {
    id: 'island-hopping-2-nights',
    titleEs: 'Island Hopping — 2 Noches ($265 por persona)',
    titleEn: 'Island Hopping — 2 Nights ($265 per person)',
    badgeEs: '2 Noches Hospedaje',
    badgeEn: '2 Nights Accommodation',
    basePrice: 265,
    priceType: 'per_person',
    category: 'cabin_package',
    nights: 2,
  },
  'island-hopping-3-nights': {
    id: 'island-hopping-3-nights',
    titleEs: 'Island Hopping — 3 Noches ($355 por persona)',
    titleEn: 'Island Hopping — 3 Nights ($355 per person)',
    badgeEs: '3 Noches Hospedaje',
    badgeEn: '3 Nights Accommodation',
    basePrice: 355,
    priceType: 'per_person',
    category: 'cabin_package',
    nights: 3,
  },
};

export const TripForm: React.FC<TripFormProps> = ({
  currentLang,
  selectedTourId = 'shared-full-day',
  onTourChange,
}) => {
  const t = content[currentLang];

  // Form Fields
  const [activeTour, setActiveTour] = useState<string>(selectedTourId);
  const [startDate, setStartDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+507');
  const [whatsappLocal, setWhatsappLocal] = useState<string>('');
  const [pickupHotel, setPickupHotel] = useState<string>('');
  const [notBookedYet, setNotBookedYet] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // UI State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [checkoutNotice, setCheckoutNotice] = useState<{
    isConfigMissing?: boolean;
    es: string;
    en: string;
  } | null>(null);
  const [whatsappModalData, setWhatsappModalData] = useState<any | null>(null);

  // Sync external selected tour
  useEffect(() => {
    if (selectedTourId && TOURS_PRICING[selectedTourId]) {
      setActiveTour(selectedTourId);
    }
  }, [selectedTourId]);

  const handleTourChange = (newTourId: string) => {
    setActiveTour(newTourId);
    setErrorMsg(null);
    setCheckoutNotice(null);
    if (onTourChange) {
      onTourChange(newTourId);
    }
  };

  const currentConfig = TOURS_PRICING[activeTour] || TOURS_PRICING['shared-full-day'];
  const isDayTrip = currentConfig.category === 'day_trip';
  const isCabinPackage = currentConfig.category === 'cabin_package';
  const isPrivate = currentConfig.id === 'private-full-day';
  const isPrivateExceeded = isPrivate && guests > 3;

  // Calculate Departure Date for Cabin Packages
  const calculateDepartureDate = (arrivalStr: string, nightsCount?: number): string => {
    if (!arrivalStr || !nightsCount) return '';
    const [y, m, d] = arrivalStr.split('-').map(Number);
    if (!y || !m || !d) return '';
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + nightsCount);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const departureDateStr = isCabinPackage ? calculateDepartureDate(startDate, currentConfig.nights) : '';

  const formatReadable = (dateStr: string): string => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(currentLang === 'es' ? 'es-PA' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate pricing
  const calculateTotal = (): number => {
    if (isPrivate) {
      return 850;
    }
    return guests * currentConfig.basePrice;
  };

  const totalCalculated = calculateTotal();

  // Validate email format
  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const todayIso = new Date().toISOString().split('T')[0];

  // Client-side validations shared by both flows
  const validateForm = (): { valid: boolean; normalizedWhatsapp?: string } => {
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor ingresa tu nombre y apellido.'
          : 'Please enter your full name.'
      );
      return { valid: false };
    }

    if (!startDate) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor selecciona la fecha de viaje.'
          : 'Please select your travel date.'
      );
      return { valid: false };
    }

    if (!guests || guests < 1) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor indica al menos 1 viajero.'
          : 'Please enter at least 1 guest.'
      );
      return { valid: false };
    }

    if (isPrivate && guests > 3) {
      setErrorMsg(
        currentLang === 'es'
          ? 'El tour privado tiene un límite máximo de 3 personas.'
          : 'The private tour is limited to a maximum of 3 guests.'
      );
      return { valid: false };
    }

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor ingresa un correo electrónico válido.'
          : 'Please enter a valid email address.'
      );
      return { valid: false };
    }

    const phoneValidation = validateAndFormatWhatsApp(countryCode, whatsappLocal);
    if (!phoneValidation.success) {
      setErrorMsg(
        currentLang === 'es' ? phoneValidation.errorEs! : phoneValidation.errorEn!
      );
      return { valid: false };
    }

    const hotelText = notBookedYet
      ? currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet'
      : pickupHotel.trim();

    if (!hotelText) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor indica tu hotel de recogida o marca "Aún no reservado".'
          : 'Please indicate your pickup hotel or check "Not booked yet".'
      );
      return { valid: false };
    }

    return { valid: true, normalizedWhatsapp: phoneValidation.e164! };
  };

  const [isCabinLoading, setIsCabinLoading] = useState<boolean>(false);

  // Day Trip Online Checkout Handler (Netlify Function POST -> PagueloFacil)
  const handleDayTripCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutNotice(null);

    const v = validateForm();
    if (!v.valid) return;

    setIsCheckoutLoading(true);

    const hotelText = notBookedYet
      ? currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet'
      : pickupHotel.trim();

    try {
      const payload = {
        tourId: activeTour,
        date: startDate,
        guests,
        fullName: fullName.trim(),
        email: email.trim(),
        whatsappNumber: v.normalizedWhatsapp!,
        pickupHotel: hotelText,
        message: message.trim(),
        language: currentLang,
      };

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.checkoutUrl) {
        // Redirect visitor to verified PagueloFacil domain checkout URL
        window.location.href = resData.checkoutUrl;
      } else {
        // Handle server error, storage error, or missing merchant config gracefully
        if (resData.code === 'MISSING_MERCHANT_CONFIG' || response.status === 503) {
          setCheckoutNotice({
            isConfigMissing: true,
            es: `Tu solicitud fue registrada en la base de datos (Ref: ${resData.bookingReference || 'DUBGAN-REQ'}). El checkout en línea de PagueloFacil está en preparación. Puedes contactar a Billy directamente por WhatsApp (+507 6421-7424) para completar tu pago.`,
            en: `Your booking record was saved in storage (Ref: ${resData.bookingReference || 'DUBGAN-REQ'}). PagueloFacil online checkout is in preparation. You can contact Billy directly on WhatsApp (+507 6421-7424) to complete payment.`,
          });
        } else {
          setCheckoutNotice({
            isConfigMissing: false,
            es: resData.errorEs || 'No se pudo procesar la solicitud en este momento. Por favor reintenta o contacta a Billy por WhatsApp.',
            en: resData.errorEn || 'Failed to process request at this moment. Please retry or contact Billy on WhatsApp.',
          });
        }
      }
    } catch (err: any) {
      setCheckoutNotice({
        isConfigMissing: false,
        es: 'Ocurrió un problema de conexión con el servicio de reserva en Netlify. Puedes reintentar o contactar a Billy directamente por WhatsApp.',
        en: 'A network connection issue occurred with Netlify booking service. You can retry or contact Billy directly on WhatsApp.',
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Submission handler for Cabin Packages (Netlify Function -> Netlify Blobs -> Optional WhatsApp Handoff)
  const handleCabinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutNotice(null);

    const v = validateForm();
    if (!v.valid) return;

    setIsCabinLoading(true);

    const hotelText = notBookedYet
      ? currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet'
      : pickupHotel.trim();

    const tourName = currentLang === 'es' ? currentConfig.titleEs : currentConfig.titleEn;
    const readableArrival = formatReadable(startDate);
    const readableDeparture = formatReadable(departureDateStr);

    try {
      const payload = {
        tourId: activeTour,
        date: startDate,
        guests,
        fullName: fullName.trim(),
        email: email.trim(),
        whatsappNumber: v.normalizedWhatsapp!,
        pickupHotel: hotelText,
        message: message.trim(),
        language: currentLang,
      };

      const response = await fetch('/api/create-cabin-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setErrorMsg(
          currentLang === 'es'
            ? (resData.errorEs || 'No se pudo registrar la solicitud de cabaña en la base de datos de Netlify. Por favor reintenta.')
            : (resData.errorEn || 'Failed to persist cabin request in Netlify storage. Please retry.')
        );
        return;
      }

      const bookingRef = resData.bookingReference;

      const messageLines = [
        currentLang === 'es'
          ? `🌴 *CONSULTA DE DISPONIBILIDAD DE CABAÑAS — DUBGAN SAN BLAS TRIPS*`
          : `🌴 *CABIN AVAILABILITY REQUEST — DUBGAN SAN BLAS TRIPS*`,
        ``,
        `🔖 *${currentLang === 'es' ? 'Código de Reserva Guardado' : 'Saved Booking Reference'}:* ${bookingRef}`,
        `⛵ *${currentLang === 'es' ? 'Paquete' : 'Package'}:* ${tourName}`,
        `📅 *${currentLang === 'es' ? 'Fecha de llegada' : 'Arrival Date'}:* ${readableArrival} (${startDate})`,
        `🏁 *${currentLang === 'es' ? 'Fecha de salida calculada' : 'Calculated Departure Date'}:* ${readableDeparture} (${departureDateStr})`,
        `🌙 *${currentLang === 'es' ? 'Duración' : 'Duration'}:* ${currentConfig.nights} ${currentLang === 'es' ? 'Noches' : 'Nights'}`,
        `👥 *${currentLang === 'es' ? 'Número de viajeros' : 'Number of Guests'}:* ${guests}`,
        `💰 *${currentLang === 'es' ? 'Monto total del paquete' : 'Full Package Amount'}:* $${totalCalculated} USD ($${currentConfig.basePrice} USD × ${guests})`,
        ``,
        `👤 *${currentLang === 'es' ? 'Nombre completo' : 'Full Name'}:* ${fullName.trim()}`,
        `📧 *${currentLang === 'es' ? 'Correo electrónico' : 'Email'}:* ${email.trim()}`,
        `📱 *${currentLang === 'es' ? 'WhatsApp (con código)' : 'WhatsApp (with code)'}:* ${countryCode} ${whatsappLocal}`,
        `🏨 *${currentLang === 'es' ? 'Hotel de recogida' : 'Pickup Hotel'}:* ${hotelText}`,
        message.trim()
          ? `💬 *${currentLang === 'es' ? 'Mensaje / Notas' : 'Message / Notes'}:* ${message.trim()}`
          : null,
        ``,
        currentLang === 'es'
          ? `ℹ️ *Nota:* Esta solicitud de cabaña fue guardada en el sistema con estado "Pendiente de Disponibilidad" (No pagado). Una vez aprobada por Billy, recibiré el enlace para pagar el monto total.`
          : `ℹ️ *Notice:* This cabin request has been saved in storage as "Pending Availability" (Unpaid). Once approved by Billy, I will receive the link to pay the full amount.`,
      ]
        .filter(Boolean)
        .join('\n');

      const whatsappUrl = `https://wa.me/50764217424?text=${encodeURIComponent(messageLines)}`;

      setWhatsappModalData({
        bookingRef,
        fullName: fullName.trim(),
        tourName,
        arrival: readableArrival || startDate,
        departure: readableDeparture || departureDateStr,
        guests,
        totalCalculated,
        hotelText,
        whatsappUrl,
        rawText: messageLines,
      });

      // Modal data is set, keeping user on page without auto-opening WhatsApp
    } catch (err: any) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Error de conexión al intentar guardar la consulta de cabaña. Intenta de nuevo.'
          : 'Network error while attempting to save cabin inquiry. Please retry.'
      );
    } finally {
      setIsCabinLoading(false);
    }
  };

  return (
    <section id="contact" className="py-0 bg-[#F6F2E9] text-[#173642] relative scroll-mt-20">
      
      {/* Light Cultural Border Above Booking Section */}
      <MolaBorderDark />

      <div className="py-20 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <p className="eyebrow-gold">{t.form.eyebrow}</p>
            <MolaAccent size="sm" />
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#173642] tracking-tight">
            {t.form.title}
          </h2>

          <div className="w-16 h-[2px] bg-[#B79A62] mx-auto" />

          <p className="text-sm sm:text-base text-[#173642]/80 leading-relaxed font-normal">
            {t.form.notice}
          </p>
        </div>

        {/* Dynamic Category Banner: Day Trip vs Cabin Package */}
        <div className="bg-[#173642] text-[#F6F2E9] border-2 border-[#B79A62] p-5 sm:p-7 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B79A62]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-[#B79A62]/20 border border-[#B79A62] flex items-center justify-center shrink-0">
              {isDayTrip ? (
                <CreditCard className="w-6 h-6 text-[#B79A62]" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#B79A62]" />
              )}
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B79A62] bg-[#102B35] px-2.5 py-0.5 border border-[#B79A62]/40">
                  {isDayTrip
                    ? currentLang === 'es' ? 'PASADÍA • PAGO COMPLETO DIRECTO' : 'DAY TRIP • FULL PAYMENT CHECKOUT'
                    : currentLang === 'es' ? 'CABAÑAS • REQUIERE APROBACIÓN DE DISPONIBILIDAD' : 'CABINS • REQUIRES AVAILABILITY APPROVAL'}
                </span>
              </div>

              {/* Rules Explanation Text */}
              <p className="text-sm sm:text-base font-serif-editorial text-[#F6F2E9] leading-snug">
                {isDayTrip ? (
                  currentLang === 'es'
                    ? 'Los pasadíos (compartido y privado) se pagan por el monto total. Avanzan directamente hacia el pago con PagueloFacil.'
                    : 'Day trips (shared and private) are paid in full. They proceed directly toward PagueloFacil checkout.'
                ) : (
                  currentLang === 'es'
                    ? '“La disponibilidad de las cabañas debe confirmarse antes del pago. Una vez aprobada, recibirás un enlace seguro para pagar el total.”'
                    : '“Cabin availability must be confirmed before payment. Once approved, you will receive a secure link to pay the full amount.”'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Form Inputs on Left, Booking Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Form Container (7 Columns on Desktop) */}
          <div className="lg:col-span-7 bg-white border-2 border-[#B79A62]/40 p-6 sm:p-10 shadow-xl space-y-6">
            
            <div className="border-b border-[#EDE5D7] pb-4">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                {currentLang === 'es' ? '1. Datos de tu Reserva' : '1. Enter Reservation Details'}
              </h3>
            </div>

            {/* Client Validation Error Banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 bg-[#D96848]/15 border-l-4 border-[#D96848] text-[#173642] p-4 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-[#D96848] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#D96848] uppercase tracking-wider">
                    {currentLang === 'es' ? 'Atención' : 'Please Note'}
                  </p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={isDayTrip ? handleDayTripCheckout : handleCabinRequest} className="space-y-6">
              
              {/* 1. Tour Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center justify-between">
                  <span>{t.form.tourLabel} *</span>
                  <span className="text-[10px] text-[#173642]/60 lowercase font-normal">
                    {isDayTrip ? (currentLang === 'es' ? 'pasadía directo' : 'direct day trip') : (currentLang === 'es' ? 'requiere aprobación' : 'requires approval')}
                  </span>
                </label>
                <select
                  value={activeTour}
                  onChange={(e) => handleTourChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] focus:outline-none focus:border-[#B79A62] text-sm font-semibold shadow-xs"
                >
                  <optgroup label={currentLang === 'es' ? 'Pasadías de Un Día (Pago Directo)' : 'Day Trips (Direct Checkout)'}>
                    <option value="shared-full-day">
                      {currentLang === 'es'
                        ? 'Full Day en San Blas - Compartido ($135 USD por persona)'
                        : 'Full Day in San Blas - Shared ($135 USD per person)'}
                    </option>
                    <option value="private-full-day">
                      {currentLang === 'es'
                        ? 'San Blas Private Full Day ($850 USD total 1–3 personas)'
                        : 'San Blas Full-Day Private Experience ($850 USD total 1–3 guests)'}
                    </option>
                  </optgroup>
                  <optgroup label={currentLang === 'es' ? 'Paquetes de Cabañas (Aprobación Previa)' : 'Cabin Packages (Availability Approval)'}>
                    <option value="island-hopping-2-nights">
                      {currentLang === 'es'
                        ? 'Island Hopping — 2 Noches ($265 USD por persona)'
                        : 'Island Hopping — 2 Nights ($265 USD per person)'}
                    </option>
                    <option value="island-hopping-3-nights">
                      {currentLang === 'es'
                        ? 'Island Hopping — 3 Noches ($355 USD por persona)'
                        : 'Island Hopping — 3 Nights ($355 USD per person)'}
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* 2. Date & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Date Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>
                      {isCabinPackage ? t.form.arrivalDateLabel : t.form.dateLabel} *
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    min={todayIso}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs"
                  />

                  {/* Calculated Departure Date for Cabin Packages */}
                  {isCabinPackage && (
                    <div className="pt-2 p-2.5 bg-[#173642]/10 border border-[#B79A62]/40 space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B79A62]">
                        {t.form.departureDateLabel}:
                      </p>
                      <p className="text-xs font-bold text-[#173642]">
                        {startDate ? (
                          `${formatReadable(departureDateStr)} (${departureDateStr})`
                        ) : (
                          <span className="text-[#173642]/50 italic">
                            {currentLang === 'es'
                              ? 'Selecciona fecha de llegada'
                              : 'Select arrival date'}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-[#173642]/70">
                        {currentLang === 'es'
                          ? `Estadía confirmada de ${currentConfig.nights} noches`
                          : `Confirmed ${currentConfig.nights}-night package stay`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Number of Guests */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{t.form.travelersLabel} *</span>
                    </span>
                    {isPrivate && (
                      <span className="text-[10px] text-[#D96848] font-bold">
                        {currentLang === 'es' ? '1–3 personas' : '1–3 guests'}
                      </span>
                    )}
                  </label>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="px-3.5 py-3 bg-[#EDE5D7] hover:bg-[#B79A62] hover:text-[#173642] text-[#173642] font-bold transition-colors border border-[#B79A62]/40 border-r-0"
                      aria-label="Decrease guests"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      required
                      min={1}
                      max={isPrivate ? 3 : undefined}
                      value={guests}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setGuests(isNaN(val) ? 1 : Math.max(1, val));
                      }}
                      className={`w-full px-4 py-3 text-center bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] focus:outline-none focus:border-[#B79A62] text-sm font-bold shadow-xs ${
                        isPrivateExceeded ? 'border-[#D96848] bg-[#D96848]/10 text-[#D96848]' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (isPrivate && guests >= 3) {
                          return;
                        }
                        setGuests(guests + 1);
                      }}
                      disabled={isPrivate && guests >= 3}
                      className={`px-3.5 py-3 bg-[#EDE5D7] text-[#173642] font-bold transition-colors border border-[#B79A62]/40 border-l-0 ${
                        isPrivate && guests >= 3
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#B79A62] hover:text-[#173642]'
                      }`}
                      aria-label="Increase guests"
                    >
                      +
                    </button>
                  </div>

                  {/* Private Tour Validation Notice */}
                  {isPrivateExceeded && (
                    <p className="text-[11px] font-bold text-[#D96848] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t.form.privateMaxError}
                    </p>
                  )}
                </div>

              </div>

              {/* 3. Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.form.namePlaceholder}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs"
                />
              </div>

              {/* 4. Contact Grid: Email & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>{t.form.emailLabel} *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.form.emailPlaceholder}
                    className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs"
                  />
                </div>

                {/* WhatsApp with Country Code Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>{t.form.phoneLabel} *</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] focus:outline-none focus:border-[#B79A62] text-xs sm:text-sm font-medium shadow-xs shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={whatsappLocal}
                      onChange={(e) => setWhatsappLocal(e.target.value)}
                      placeholder={t.form.phonePlaceholder || "6005-3200"}
                      className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs"
                    />
                  </div>
                  <p className="text-[10px] text-[#173642]/70 italic">
                    {t.form.phoneHelp}
                  </p>
                </div>

              </div>

              {/* 5. Pickup Hotel with "Not booked yet" toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>{t.form.hotelLabel} *</span>
                  </label>
                  
                  {/* Quick Checkbox for "Not booked yet" */}
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#173642] hover:text-[#B79A62] transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={notBookedYet}
                      onChange={(e) => {
                        setNotBookedYet(e.target.checked);
                        if (e.target.checked) {
                          setPickupHotel('');
                        }
                      }}
                      className="w-4 h-4 text-[#B79A62] border-[#B79A62] rounded-xs focus:ring-[#B79A62] accent-[#B79A62]"
                    />
                    <span className="font-semibold text-[11px] uppercase tracking-wider text-[#B79A62]">
                      {t.form.notBookedYet}
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  disabled={notBookedYet}
                  value={notBookedYet ? (currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet') : pickupHotel}
                  onChange={(e) => setPickupHotel(e.target.value)}
                  placeholder={t.form.hotelPlaceholder}
                  className={`w-full px-4 py-3 bg-[#F6F2E9] border text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs transition-opacity ${
                    notBookedYet
                      ? 'opacity-60 bg-[#EDE5D7] italic border-dashed border-[#B79A62]'
                      : 'border-[#B79A62]/40'
                  }`}
                />
              </div>

              {/* 6. Optional Message */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.messageLabel}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.form.messagePlaceholder}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs resize-y"
                />
              </div>

              {/* ACTION AREA FOR DAY TRIPS (Netlify Function POST -> PagueloFacil Checkout) */}
              {isDayTrip && (
                <div className="pt-4 border-t border-[#EDE5D7] space-y-4">
                  {checkoutNotice && (
                    <div className="p-4 bg-[#102B35] text-[#F6F2E9] border border-[#B79A62] space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#B79A62]">
                        <Info className="w-4 h-4 shrink-0" />
                        <span className="font-bold uppercase tracking-wider text-[11px]">
                          {checkoutNotice.isConfigMissing
                            ? (currentLang === 'es' ? 'Pago en Línea en Preparación' : 'Online Checkout in Preparation')
                            : (currentLang === 'es' ? 'Aviso de Pago' : 'Payment Notice')}
                        </span>
                      </div>
                      <p className="leading-relaxed text-[#F6F2E9]/90">
                        {currentLang === 'es' ? checkoutNotice.es : checkoutNotice.en}
                      </p>
                      <div className="pt-1 flex flex-wrap gap-3 items-center">
                        <a
                          href="https://wa.me/50764217424"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#B79A62] font-bold text-xs hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#B79A62] text-[#102B35]" />
                          <span>{currentLang === 'es' ? 'Contactar a Billy por WhatsApp (+507 6421-7424)' : 'Contact Billy on WhatsApp (+507 6421-7424)'}</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCheckoutLoading || isPrivateExceeded}
                    className={`w-full flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                      isCheckoutLoading || isPrivateExceeded
                        ? 'bg-[#EDE5D7] text-[#173642]/50 cursor-not-allowed border border-[#173642]/20'
                        : 'bg-[#B79A62] hover:bg-[#a38752] text-[#173642] hover:shadow-2xl'
                    }`}
                  >
                    {isCheckoutLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                        <span>{currentLang === 'es' ? 'GENERANDO PAGO SEGURO...' : 'GENERATING SECURE CHECKOUT...'}</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-[#173642]" />
                        <span>{t.form.continueToPayment}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ACTION AREA FOR CABIN PACKAGES */}
              {isCabinPackage && (
                <div className="pt-4 border-t border-[#EDE5D7] space-y-3">
                  <div className="p-3 bg-[#173642]/5 border-l-4 border-[#B79A62] text-xs text-[#173642]">
                    <p className="font-bold text-[#B79A62] uppercase tracking-wider text-[11px]">
                      {currentLang === 'es' ? 'Aprobación Previa Necesaria' : 'Availability Approval Required'}
                    </p>
                    <p>{t.form.cabinApprovalNotice}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isCabinLoading}
                    className={`w-full flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                      isCabinLoading
                        ? 'bg-[#EDE5D7] text-[#173642]/50 cursor-not-allowed border border-[#173642]/20'
                        : 'bg-[#B79A62] hover:bg-[#a38752] text-[#173642] hover:shadow-2xl'
                    }`}
                  >
                    {isCabinLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                        <span>{currentLang === 'es' ? 'GUARDANDO SOLICITUD EN SISTEMA...' : 'SAVING INQUIRY IN STORAGE...'}</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 fill-[#173642]" />
                        <span>{t.form.btnRequestCabinAvailability}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

            </form>

          </div>

          {/* Booking Summary & Review Column (5 Columns on Desktop, Sticky) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            <div className="bg-[#173642] text-[#F6F2E9] border-2 border-[#B79A62] p-6 sm:p-8 shadow-2xl space-y-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B79A62]/10 rounded-bl-full pointer-events-none" />

              {/* Summary Header */}
              <div className="border-b border-[#B79A62]/40 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="eyebrow-gold">{t.form.summaryTitle}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#B79A62] text-[#173642] uppercase tracking-wider">
                    {currentLang === 'es' ? currentConfig.badgeEs : currentConfig.badgeEn}
                  </span>
                </div>
                <h4 className="font-serif-editorial text-2xl font-bold text-[#F6F2E9]">
                  {currentLang === 'es' ? currentConfig.titleEs : currentConfig.titleEn}
                </h4>
              </div>

              {/* Summary Itemized Details */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Dates Row */}
                <div className="py-2 border-b border-[#F6F2E9]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      {isCabinPackage
                        ? (currentLang === 'es' ? 'Llegada:' : 'Arrival:')
                        : (currentLang === 'es' ? 'Fecha seleccionada:' : 'Selected Date:')}
                    </span>
                    <span className="font-bold text-[#F6F2E9]">
                      {startDate ? formatReadable(startDate) : (currentLang === 'es' ? 'Por definir' : 'Pending')}
                    </span>
                  </div>

                  {isCabinPackage && (
                    <div className="flex items-center justify-between text-xs pt-1 text-[#B79A62]">
                      <span>{currentLang === 'es' ? 'Salida calculada:' : 'Calculated Departure:'}</span>
                      <span className="font-bold">
                        {departureDateStr ? formatReadable(departureDateStr) : '—'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Party Size Row */}
                <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10">
                  <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B79A62]" />
                    {currentLang === 'es' ? 'Cantidad de viajeros:' : 'Party Size:'}
                  </span>
                  <span className="font-bold text-[#F6F2E9]">
                    {guests} {guests === 1 ? (currentLang === 'es' ? 'persona' : 'guest') : (currentLang === 'es' ? 'personas' : 'guests')}
                  </span>
                </div>

                {/* Pickup Hotel Row */}
                <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10">
                  <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#B79A62]" />
                    {currentLang === 'es' ? 'Hotel de recogida:' : 'Pickup Hotel:'}
                  </span>
                  <span className="font-bold text-[#F6F2E9] truncate max-w-[180px]">
                    {notBookedYet
                      ? (currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet')
                      : (pickupHotel || '—')}
                  </span>
                </div>

                {/* Rate Calculation Breakdown */}
                <div className="py-3 bg-[#102B35]/80 p-3.5 border border-[#B79A62]/30 space-y-1.5">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#B79A62]">
                    {currentLang === 'es' ? 'Desglose de Tarifa Completa' : 'Full Rate Breakdown'}
                  </p>
                  
                  {isPrivate ? (
                    <div>
                      <p className="text-xs text-[#F6F2E9]/90">
                        {currentLang === 'es'
                          ? 'Tour Privado: $850 USD total (monto completo para 1–3 personas).'
                          : 'Private Tour: $850 USD total (full amount for 1–3 guests).'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        ${currentConfig.basePrice} USD × {guests} {guests === 1 ? (currentLang === 'es' ? 'persona' : 'guest') : (currentLang === 'es' ? 'personas' : 'guests')}
                      </span>
                      <span className="font-bold text-[#F6F2E9]">
                        ${totalCalculated} USD
                      </span>
                    </div>
                  )}
                </div>

                {/* Full Amount Total Display */}
                <div className="pt-2 flex items-baseline justify-between border-t-2 border-[#B79A62]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#B79A62]">
                      {t.form.summaryEstimatedTotal}
                    </p>
                    <p className="text-[10px] text-[#F6F2E9]/60">
                      {currentLang === 'es' ? 'Pago del monto total' : 'Full tour payment'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#B79A62]">
                      ${totalCalculated} <span className="text-sm font-sans font-normal text-[#F6F2E9]">USD</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Exclusions Notice */}
              <div className="bg-[#102B35] p-3.5 border-l-3 border-[#B79A62] text-[11px] text-[#F6F2E9]/80 space-y-1">
                <p className="font-bold text-[#B79A62] uppercase tracking-wider text-[10px]">
                  {currentLang === 'es' ? 'Impuestos de la Comarca (Efectivo en frontera):' : 'Comarca Entry Taxes (Cash at border):'}
                </p>
                <p className="leading-relaxed">
                  {t.form.taxNotice}
                </p>
              </div>

            </div>

            {/* Quick Contact Info */}
            <div className="bg-white border border-[#B79A62]/40 p-5 shadow-sm text-[#173642] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#173642] uppercase tracking-wider">
                  {currentLang === 'es' ? 'Contacto Directo con Billy' : 'Direct Contact with Billy'}
                </p>
                <p className="text-xs text-[#173642]/70">
                  +507 6421-7424
                </p>
              </div>
              <a
                href="https://wa.me/50764217424"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#173642] hover:bg-[#397D80] text-[#F6F2E9] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* Modal Prompt for Cabin Packages WhatsApp Handoff (Request Saved Notice) */}
        {whatsappModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173642]/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#F6F2E9] max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#B79A62] text-[#173642] space-y-6 relative">
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-[#B79A62] shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                    {currentLang === 'es' ? 'Solicitud Recibida' : 'Request Received'}
                  </h3>
                  <p className="text-xs text-[#173642]/90 mt-1.5 leading-relaxed font-semibold">
                    {currentLang === 'es'
                      ? 'Hemos recibido tu solicitud de disponibilidad. Billy revisará las fechas solicitadas y se pondrá en contacto contigo para confirmar la disponibilidad. No es necesario realizar ningún pago por el momento.'
                      : 'Your availability request has been received successfully. Billy will review your requested dates and contact you to confirm availability. No payment is required at this stage.'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 border border-[#B79A62]/40 space-y-2 text-xs">
                <p className="font-bold text-[#B79A62]">
                  {currentLang === 'es' ? 'Información importante:' : 'Important information:'}
                </p>
                <ul className="space-y-1 text-[#173642]/85 list-disc list-inside">
                  <li>
                    {currentLang === 'es'
                      ? 'Tu solicitud de reserva ya está guardada de forma segura en nuestro sistema.'
                      : 'Your reservation request is already safely saved in our system.'}
                  </li>
                  <li>
                    {currentLang === 'es'
                      ? 'WhatsApp es un método de comunicación opcional (no necesitas enviar otra solicitud).'
                      : 'WhatsApp is an optional communication method (you do not need to send another request).'}
                  </li>
                  <li>
                    {currentLang === 'es'
                      ? 'La reserva no está confirmada hasta que Billy revise y confirme la disponibilidad.'
                      : 'The reservation is not confirmed until availability has been reviewed and confirmed.'}
                  </li>
                </ul>
              </div>

              <div className="bg-white p-3.5 border border-[#B79A62]/40 space-y-1.5 text-xs">
                <p className="text-[#B79A62] font-mono font-bold">
                  <strong>{currentLang === 'es' ? 'Código de Reserva:' : 'Booking Reference:'}</strong> {whatsappModalData.bookingRef}
                </p>
                <p><strong>{currentLang === 'es' ? 'Cliente:' : 'Guest:'}</strong> {whatsappModalData.fullName}</p>
                <p><strong>{currentLang === 'es' ? 'Paquete:' : 'Package:'}</strong> {whatsappModalData.tourName}</p>
                <p><strong>{currentLang === 'es' ? 'Fecha de llegada:' : 'Arrival Date:'}</strong> {whatsappModalData.arrival}</p>
                <p><strong>{currentLang === 'es' ? 'Fecha de salida calculada:' : 'Calculated Departure:'}</strong> {whatsappModalData.departure}</p>
                <p><strong>{currentLang === 'es' ? 'Viajeros:' : 'Guests:'}</strong> {whatsappModalData.guests}</p>
                <p><strong>{currentLang === 'es' ? 'Monto total:' : 'Full Amount:'}</strong> ${whatsappModalData.totalCalculated} USD</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={whatsappModalData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all shadow"
                >
                  <MessageCircle className="w-4 h-4 fill-[#173642]" />
                  <span>{currentLang === 'es' ? 'Contactar a Billy por WhatsApp (Opcional)' : 'Contact Billy on WhatsApp (Optional)'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setWhatsappModalData(null)}
                  className="px-5 py-3.5 bg-transparent hover:bg-[#173642]/10 text-[#173642] border border-[#173642]/30 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {currentLang === 'es' ? 'CERRAR' : 'CLOSE'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </section>
  );
};
