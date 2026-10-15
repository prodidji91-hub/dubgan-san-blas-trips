import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Users,
  Mail,
  Phone,
  Building,
  CreditCard,
  ShieldCheck,
  Info,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  Check
} from 'lucide-react';
import { Language, content } from '../translations/content';
import { images } from '../pictures/images';
import { MolaAccent } from './MolaAccent';
import { MolaBorderDark } from './MolaBorderDark';
import { COUNTRY_CODES, validateAndFormatWhatsApp } from '../utils/phone';

interface BookingPageProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  initialTourId?: string;
  onNavigateHome: () => void;
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
  imageKey: string;
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
    imageKey: 'tour1',
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
    imageKey: 'tour2',
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
    imageKey: 'aguja',
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
    imageKey: 'chichime',
  },
};

export const BookingPage: React.FC<BookingPageProps> = ({
  currentLang,
  onLanguageChange,
  initialTourId = 'shared-full-day',
  onNavigateHome,
}) => {
  const t = content[currentLang];

  // State
  const [activeTour, setActiveTour] = useState<string>(initialTourId);
  const [startDate, setStartDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+507');
  const [whatsappLocal, setWhatsappLocal] = useState<string>('');
  const [pickupHotel, setPickupHotel] = useState<string>('');
  const [notBookedYet, setNotBookedYet] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Workflow step: 'fill_details' | 'review_booking'
  const [step, setStep] = useState<'fill_details' | 'review_booking'>('fill_details');

  // UI State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [isCabinLoading, setIsCabinLoading] = useState<boolean>(false);
  const [checkoutNotice, setCheckoutNotice] = useState<{
    isConfigMissing?: boolean;
    es: string;
    en: string;
  } | null>(null);
  const [whatsappModalData, setWhatsappModalData] = useState<any | null>(null);

  // Sync initialTourId
  useEffect(() => {
    if (initialTourId && TOURS_PRICING[initialTourId]) {
      setActiveTour(initialTourId);
    }
  }, [initialTourId]);

  const currentConfig = TOURS_PRICING[activeTour] || TOURS_PRICING['shared-full-day'];
  const isDayTrip = currentConfig.category === 'day_trip';
  const isCabinPackage = currentConfig.category === 'cabin_package';
  const isPrivate = currentConfig.id === 'private-full-day';
  const isPrivateExceeded = isPrivate && guests > 3;

  // Calculate Departure Date
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

  const calculateTotal = (): number => {
    if (isPrivate) {
      return 850;
    }
    return guests * currentConfig.basePrice;
  };

  const totalCalculated = calculateTotal();

  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const todayIso = new Date().toISOString().split('T')[0];

  const validateForm = (): { valid: boolean; normalizedWhatsapp?: string } => {
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg(currentLang === 'es' ? 'Por favor ingresa tu nombre y apellido.' : 'Please enter your full name.');
      return { valid: false };
    }

    if (!startDate) {
      setErrorMsg(currentLang === 'es' ? 'Por favor selecciona la fecha de viaje.' : 'Please select your travel date.');
      return { valid: false };
    }

    if (!guests || guests < 1) {
      setErrorMsg(currentLang === 'es' ? 'Por favor indica al menos 1 viajero.' : 'Please enter at least 1 guest.');
      return { valid: false };
    }

    if (isPrivate && guests > 3) {
      setErrorMsg(currentLang === 'es' ? 'El tour privado tiene un límite máximo de 3 personas.' : 'The private tour is limited to a maximum of 3 guests.');
      return { valid: false };
    }

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg(currentLang === 'es' ? 'Por favor ingresa un correo electrónico válido.' : 'Please enter a valid email address.');
      return { valid: false };
    }

    const phoneValidation = validateAndFormatWhatsApp(countryCode, whatsappLocal);
    if (!phoneValidation.success) {
      setErrorMsg(currentLang === 'es' ? phoneValidation.errorEs! : phoneValidation.errorEn!);
      return { valid: false };
    }

    const hotelText = notBookedYet
      ? currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet'
      : pickupHotel.trim();

    if (!hotelText) {
      setErrorMsg(currentLang === 'es' ? 'Por favor indica tu hotel de recogida o marca "Aún no reservado".' : 'Please indicate your pickup hotel or check "Not booked yet".');
      return { valid: false };
    }

    return { valid: true, normalizedWhatsapp: phoneValidation.e164! };
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateForm();
    if (v.valid) {
      setStep('review_booking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Day Trip Online Checkout Handler
  const handleDayTripCheckout = async () => {
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
        window.location.href = resData.checkoutUrl;
      } else {
        if (resData.code === 'MISSING_MERCHANT_CONFIG' || response.status === 503) {
          setCheckoutNotice({
            isConfigMissing: true,
            es: `Tu solicitud fue registrada en el sistema (Ref: ${resData.bookingReference || 'DUBGAN-REQ'}). El portal de pago en línea de PagueloFacil está en preparación. Puedes contactar a Billy por WhatsApp (+507 6421-7424) para pagar.`,
            en: `Your booking was saved in storage (Ref: ${resData.bookingReference || 'DUBGAN-REQ'}). PagueloFacil online checkout is in preparation. You can contact Billy on WhatsApp (+507 6421-7424) to complete payment.`,
          });
        } else {
          setCheckoutNotice({
            isConfigMissing: false,
            es: resData.errorEs || 'No se pudo procesar la solicitud en este momento. Por favor reintenta o contacta a Billy por WhatsApp.',
            en: resData.errorEn || 'Failed to process request at this moment. Please retry or contact Billy on WhatsApp.',
          });
        }
      }
    } catch {
      setCheckoutNotice({
        isConfigMissing: false,
        es: 'Error de conexión con el servicio de reserva. Por favor reintenta o contacta a Billy por WhatsApp.',
        en: 'Network error with booking service. Please retry or contact Billy on WhatsApp.',
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Cabin Package Submission Handler
  const handleCabinRequest = async () => {
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
            ? (resData.errorEs || 'No se pudo registrar la solicitud de cabaña. Por favor reintenta.')
            : (resData.errorEn || 'Failed to save cabin request. Please retry.')
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
        `💰 *${currentLang === 'es' ? 'Monto total del paquete' : 'Full Package Amount'}:* $${totalCalculated} USD`,
        ``,
        `👤 *${currentLang === 'es' ? 'Nombre completo' : 'Full Name'}:* ${fullName.trim()}`,
        `📧 *${currentLang === 'es' ? 'Correo electrónico' : 'Email'}:* ${email.trim()}`,
        `📱 *${currentLang === 'es' ? 'WhatsApp' : 'WhatsApp'}:* ${whatsappNumber.trim()}`,
        `🏨 *${currentLang === 'es' ? 'Hotel de recogida' : 'Pickup Hotel'}:* ${hotelText}`,
        message.trim() ? `💬 *${currentLang === 'es' ? 'Mensaje' : 'Message'}:* ${message.trim()}` : null,
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
      });

      // Modal data is set, keeping user on page without auto-opening WhatsApp
    } catch {
      setErrorMsg(
        currentLang === 'es'
          ? 'Error de conexión al guardar la solicitud de cabaña. Intenta de nuevo.'
          : 'Network error while attempting to save cabin inquiry. Please retry.'
      );
    } finally {
      setIsCabinLoading(false);
    }
  };

  const getTourImage = (key: string) => {
    switch (key) {
      case 'tour2':
        return images.tours.tour2.src;
      case 'aguja':
        return images.aguja.src;
      case 'chichime':
        return images.chichime.src;
      case 'tour1':
      default:
        return images.tours.tour1.src;
    }
  };

  return (
    <div className="min-h-screen bg-[#102B35] text-[#F6F2E9] font-sans flex flex-col selection:bg-[#B79A62] selection:text-[#102B35]">
      
      {/* Top Brand & Navigation Header Bar */}
      <header className="bg-[#173642] border-b border-[#B79A62]/40 py-4 px-4 sm:px-8 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Back to Tours Button */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B79A62] hover:text-[#F6F2E9] transition-colors py-2 px-3 border border-[#B79A62]/40 bg-[#102B35]"
          >
            <ArrowLeft className="w-4 h-4 text-[#B79A62]" />
            <span>{currentLang === 'es' ? 'VOLVER A TOURS' : 'BACK TO TOURS'}</span>
          </button>

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
            <img
              src={images.logo.src}
              alt="Dubgan San Blas Trips"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="hidden sm:block text-left">
              <p className="font-serif-editorial text-2xl font-bold leading-none text-[#F6F2E9]">
                Dubgan
              </p>
              <p className="text-[9px] font-bold text-[#B79A62] tracking-[0.14em] uppercase">
                SAN BLAS TRIPS
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-xs font-bold tracking-widest">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 transition-colors ${
                currentLang === 'en' ? 'bg-[#B79A62] text-[#173642]' : 'text-[#F6F2E9]/70 hover:text-[#F6F2E9]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('es')}
              className={`px-2.5 py-1 transition-colors ${
                currentLang === 'es' ? 'bg-[#B79A62] text-[#173642]' : 'text-[#F6F2E9]/70 hover:text-[#F6F2E9]'
              }`}
            >
              ES
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Page Title Lockup */}
        <div className="mb-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <p className="eyebrow-gold">
              {currentLang === 'es' ? 'RESERVA OFICIAL EN LÍNEA' : 'OFFICIAL ONLINE RESERVATION'}
            </p>
            <MolaAccent size="sm" />
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#F6F2E9] tracking-tight">
            {currentLang === 'es' ? 'RESERVA TU VIAJE A SAN BLAS' : 'BOOK YOUR SAN BLAS TRIP'}
          </h1>

          <p className="text-sm sm:text-base text-[#F6F2E9]/80 max-w-2xl mx-auto font-normal">
            {currentLang === 'es'
              ? 'Completa los datos de tu viaje abajo para continuar con el pago seguro de pasadíos o la solicitud de disponibilidad de cabañas.'
              : 'Complete your travel details below to proceed with secure day trip payment or cabin availability requests.'}
          </p>

          <div className="w-16 h-[2px] bg-[#B79A62] mx-auto mt-4" />
        </div>

        {/* 2-Column Responsive Grid: Reservation Form Left, Live Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Reservation Form */}
          <div className="lg:col-span-7 bg-[#173642] border-2 border-[#B79A62] p-6 sm:p-10 shadow-2xl space-y-6">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-[#B79A62]/30 pb-4">
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === 'fill_details' ? 'bg-[#B79A62] text-[#173642]' : 'bg-[#102B35] text-[#F6F2E9] border border-[#B79A62]'
                }`}>
                  1
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step === 'fill_details' ? 'text-[#B79A62]' : 'text-[#F6F2E9]/60'
                }`}>
                  {currentLang === 'es' ? '1. Datos de Reserva' : '1. Enter Details'}
                </span>
              </div>

              <span className="text-xs text-[#F6F2E9]/40">• • •</span>

              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === 'review_booking' ? 'bg-[#B79A62] text-[#173642]' : 'bg-[#102B35] text-[#F6F2E9]/60 border border-[#B79A62]/30'
                }`}>
                  2
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step === 'review_booking' ? 'text-[#B79A62]' : 'text-[#F6F2E9]/60'
                }`}>
                  {currentLang === 'es' ? '2. Revisar y Confirmar' : '2. Review & Confirm'}
                </span>
              </div>
            </div>

            {/* Error Notice */}
            {errorMsg && (
              <div className="flex items-start gap-3 bg-[#D96848]/20 border-l-4 border-[#D96848] text-[#F6F2E9] p-4 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-[#D96848] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#D96848] uppercase tracking-wider">
                    {currentLang === 'es' ? 'Atención' : 'Please Note'}
                  </p>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* STEP 1: FILL DETAILS */}
            {step === 'fill_details' && (
              <form onSubmit={handleProceedToReview} className="space-y-6">
                
                {/* 1. Tour Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                    {t.form.tourLabel} *
                  </label>
                  <select
                    value={activeTour}
                    onChange={(e) => {
                      setActiveTour(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-semibold shadow-xs"
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

                {/* 2. Date & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{isCabinPackage ? t.form.arrivalDateLabel : t.form.dateLabel} *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayIso}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs"
                    />

                    {isCabinPackage && (
                      <div className="pt-2 p-2.5 bg-[#102B35] border border-[#B79A62]/40 space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#B79A62]">
                          {t.form.departureDateLabel}:
                        </p>
                        <p className="text-xs font-bold text-[#F6F2E9]">
                          {startDate ? (
                            `${formatReadable(departureDateStr)} (${departureDateStr})`
                          ) : (
                            <span className="text-[#F6F2E9]/40 italic">
                              {currentLang === 'es' ? 'Selecciona fecha de llegada' : 'Select arrival date'}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Guests Input */}
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
                        className="px-3.5 py-3 bg-[#102B35] hover:bg-[#B79A62] hover:text-[#102B35] text-[#F6F2E9] font-bold transition-colors border border-[#B79A62] border-r-0"
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
                        className={`w-full px-4 py-3 text-center bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-bold shadow-xs ${
                          isPrivateExceeded ? 'border-[#D96848] text-[#D96848]' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (isPrivate && guests >= 3) return;
                          setGuests(guests + 1);
                        }}
                        disabled={isPrivate && guests >= 3}
                        className={`px-3.5 py-3 bg-[#102B35] text-[#F6F2E9] font-bold transition-colors border border-[#B79A62] border-l-0 ${
                          isPrivate && guests >= 3
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#B79A62] hover:text-[#102B35]'
                        }`}
                      >
                        +
                      </button>
                    </div>

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
                    className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] placeholder-[#F6F2E9]/40 focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs"
                  />
                </div>

                {/* 4. Email & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
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
                      className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] placeholder-[#F6F2E9]/40 focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{t.form.phoneLabel} *</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-xs sm:text-sm font-medium shadow-xs shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#102B35] text-[#F6F2E9]">
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
                        className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] placeholder-[#F6F2E9]/40 focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs"
                      />
                    </div>
                    <p className="text-[10px] text-[#F6F2E9]/60 italic">
                      {t.form.phoneHelp}
                    </p>
                  </div>

                </div>

                {/* 5. Pickup Hotel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{t.form.hotelLabel} *</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#F6F2E9] hover:text-[#B79A62] transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={notBookedYet}
                        onChange={(e) => {
                          setNotBookedYet(e.target.checked);
                          if (e.target.checked) setPickupHotel('');
                        }}
                        className="w-4 h-4 text-[#B79A62] border-[#B79A62] rounded-xs accent-[#B79A62]"
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
                    className={`w-full px-4 py-3 bg-[#102B35] border text-[#F6F2E9] placeholder-[#F6F2E9]/40 focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs transition-opacity ${
                      notBookedYet ? 'opacity-60 italic border-dashed border-[#B79A62]' : 'border-[#B79A62]'
                    }`}
                  />
                </div>

                {/* 6. Message */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                    {t.form.messageLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.form.messagePlaceholder}
                    className="w-full px-4 py-3 bg-[#102B35] border border-[#B79A62] text-[#F6F2E9] placeholder-[#F6F2E9]/40 focus:outline-none focus:ring-1 focus:ring-[#B79A62] text-sm font-medium shadow-xs resize-y"
                  />
                </div>

                {/* Proceed Button */}
                <button
                  type="submit"
                  disabled={isPrivateExceeded}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl"
                >
                  <span>{currentLang === 'es' ? 'CONTINUAR A REVISAR RESERVA' : 'CONTINUE TO REVIEW BOOKING'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

            {/* STEP 2: REVIEW BOOKING BEFORE PAYMENT */}
            {step === 'review_booking' && (
              <div className="space-y-6 animate-in fade-in">
                
                <div className="bg-[#102B35] p-5 border border-[#B79A62] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#B79A62]/30 pb-3">
                    <h3 className="font-serif-editorial text-xl font-bold text-[#B79A62]">
                      {currentLang === 'es' ? 'Resumen Final de tu Reserva' : 'Final Booking Summary Review'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep('fill_details')}
                      className="text-xs font-bold uppercase tracking-wider text-[#B79A62] hover:underline flex items-center gap-1"
                    >
                      <span>{currentLang === 'es' ? 'Modificar Datos' : 'Edit Details'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Cliente:' : 'Guest:'}</p>
                      <p className="font-bold text-[#F6F2E9] text-sm">{fullName}</p>
                    </div>

                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Tour / Paquete:' : 'Tour / Package:'}</p>
                      <p className="font-bold text-[#F6F2E9]">{currentLang === 'es' ? currentConfig.titleEs : currentConfig.titleEn}</p>
                    </div>

                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Fecha de Viaje:' : 'Travel Date:'}</p>
                      <p className="font-bold text-[#F6F2E9]">{formatReadable(startDate)} {isCabinPackage ? `(${currentConfig.nights} noches)` : ''}</p>
                    </div>

                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Viajeros:' : 'Guests:'}</p>
                      <p className="font-bold text-[#F6F2E9]">{guests} {guests === 1 ? (currentLang === 'es' ? 'persona' : 'guest') : (currentLang === 'es' ? 'personas' : 'guests')}</p>
                    </div>

                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Correo Electrónico:' : 'Email:'}</p>
                      <p className="font-bold text-[#F6F2E9]">{email}</p>
                    </div>

                    <div>
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">WhatsApp:</p>
                      <p className="font-bold text-[#F6F2E9]">{whatsappNumber}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[#F6F2E9]/60 uppercase tracking-wider text-[10px]">{currentLang === 'es' ? 'Hotel de Recogida:' : 'Pickup Hotel:'}</p>
                      <p className="font-bold text-[#F6F2E9]">{notBookedYet ? (currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet') : pickupHotel}</p>
                    </div>
                  </div>
                </div>

                {/* Comarca Tax Exclusion Warning Notice */}
                <div className="bg-[#102B35] p-4 border-l-4 border-[#B79A62] text-xs space-y-1.5">
                  <p className="font-bold text-[#B79A62] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#B79A62]" />
                    <span>{currentLang === 'es' ? '⚠️ EXCLUSIÓN IMPORTANTE DE IMPUESTOS' : '⚠️ IMPORTANT TAX EXCLUSION NOTICE'}</span>
                  </p>
                  <p className="leading-relaxed text-[#F6F2E9]/90">
                    {currentLang === 'es'
                      ? 'La tarifa calculada arriba cubre únicamente el tour y hospedaje/transporte contratado. NO incluye los impuestos obligatorios de entrada a la Comarca Guna Yala ($20 USD por persona para extranjeros / $7 USD para panameños + $5 USD de impuesto de puerto por persona), los cuales deben pagarse directamente en efectivo en el punto de entrada a San Blas.'
                      : 'The calculated rate above covers only the contracted tour and transportation/lodging. It does NOT include mandatory Guna Yala Comarca entrance taxes ($20 USD per person for foreigners / $7 USD for Panamanians + $5 USD port fee per person), which must be paid directly in cash at the San Blas entry border.'}
                  </p>
                </div>

                {/* Checkout Notice if any */}
                {checkoutNotice && (
                  <div className="p-4 bg-[#102B35] text-[#F6F2E9] border border-[#B79A62] space-y-2 text-xs">
                    <p className="font-bold text-[#B79A62] uppercase tracking-wider">
                      {checkoutNotice.isConfigMissing ? 'Pago en Línea en Preparación' : 'Aviso de Pago'}
                    </p>
                    <p className="leading-relaxed">{currentLang === 'es' ? checkoutNotice.es : checkoutNotice.en}</p>
                  </div>
                )}

                {/* Review Step Buttons */}
                <div className="space-y-3 pt-2">
                  {isDayTrip ? (
                    <button
                      type="button"
                      onClick={handleDayTripCheckout}
                      disabled={isCheckoutLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl"
                    >
                      {isCheckoutLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                          <span>{currentLang === 'es' ? 'CONECTANDO CON PAGUELOFACIL...' : 'CONNECTING TO PAGUELOFACIL...'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-[#173642]" />
                          <span>{currentLang === 'es' ? 'CONFIRMAR Y IR AL PAGO CON PAGUELOFACIL' : 'CONFIRM & PROCEED TO PAGUELOFACIL PAYMENT'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCabinRequest}
                      disabled={isCabinLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl"
                    >
                      {isCabinLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                          <span>{currentLang === 'es' ? 'GUARDANDO SOLICITUD EN SISTEMA...' : 'SAVING INQUIRY IN STORAGE...'}</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 fill-[#173642]" />
                          <span>{currentLang === 'es' ? 'CONFIRMAR SOLICITUD DE DISPONIBILIDAD' : 'CONFIRM AVAILABILITY REQUEST'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep('fill_details')}
                    className="w-full py-3 bg-transparent hover:bg-white/5 text-[#F6F2E9] border border-[#B79A62]/40 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {currentLang === 'es' ? 'VOLVER Y EDITAR DATOS' : 'GO BACK & EDIT DETAILS'}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Live Booking Summary Card (Sticky Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-[#173642] text-[#F6F2E9] border-2 border-[#B79A62] p-6 sm:p-8 shadow-2xl space-y-6 relative">
              
              {/* Card Photo Banner */}
              <div className="aspect-[16/9] overflow-hidden bg-[#102B35] border border-[#B79A62]/40 relative">
                <img
                  src={getTourImage(currentConfig.imageKey)}
                  alt={currentConfig.titleEs}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#B79A62] text-[#173642] font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 shadow">
                  {currentLang === 'es' ? currentConfig.badgeEs : currentConfig.badgeEn}
                </div>
              </div>

              {/* Summary Header */}
              <div className="border-b border-[#B79A62]/40 pb-3 space-y-1">
                <p className="eyebrow-gold">{t.form.summaryTitle}</p>
                <h4 className="font-serif-editorial text-2xl font-bold text-[#F6F2E9]">
                  {currentLang === 'es' ? currentConfig.titleEs : currentConfig.titleEn}
                </h4>
              </div>

              {/* Live Details Rows */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                
                <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10">
                  <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                    {isCabinPackage ? (currentLang === 'es' ? 'Llegada:' : 'Arrival:') : (currentLang === 'es' ? 'Fecha:' : 'Date:')}
                  </span>
                  <span className="font-bold text-[#F6F2E9]">
                    {startDate ? formatReadable(startDate) : (currentLang === 'es' ? 'Por definir' : 'Pending')}
                  </span>
                </div>

                {isCabinPackage && (
                  <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10 text-[#B79A62]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      {currentLang === 'es' ? 'Salida calculada:' : 'Calculated Departure:'}
                    </span>
                    <span className="font-bold">
                      {departureDateStr ? formatReadable(departureDateStr) : '—'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10">
                  <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B79A62]" />
                    {currentLang === 'es' ? 'Viajeros:' : 'Guests:'}
                  </span>
                  <span className="font-bold text-[#F6F2E9]">
                    {guests} {guests === 1 ? (currentLang === 'es' ? 'persona' : 'guest') : (currentLang === 'es' ? 'personas' : 'guests')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#F6F2E9]/10">
                  <span className="text-[#F6F2E9]/70 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#B79A62]" />
                    {currentLang === 'es' ? 'Hotel:' : 'Hotel:'}
                  </span>
                  <span className="font-bold text-[#F6F2E9] truncate max-w-[170px]">
                    {notBookedYet ? (currentLang === 'es' ? 'Aún no reservado' : 'Not booked yet') : (pickupHotel || '—')}
                  </span>
                </div>

                {/* Rate Calculation */}
                <div className="py-3 bg-[#102B35] p-3.5 border border-[#B79A62]/30 space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#B79A62]">
                    {currentLang === 'es' ? 'Cálculo de Tarifa' : 'Rate Calculation'}
                  </p>
                  
                  {isPrivate ? (
                    <p className="text-xs text-[#F6F2E9]/90">
                      {currentLang === 'es' ? 'Tarifa Plana Privada: $850 USD total (1–3 pers)' : 'Private Flat Rate: $850 USD total (1–3 guests)'}
                    </p>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <span>${currentConfig.basePrice} USD × {guests} {guests === 1 ? (currentLang === 'es' ? 'persona' : 'guest') : (currentLang === 'es' ? 'personas' : 'guests')}</span>
                      <span className="font-bold text-[#F6F2E9]">${totalCalculated} USD</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-2 flex items-baseline justify-between border-t-2 border-[#B79A62]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#B79A62]">
                      {t.form.summaryEstimatedTotal}
                    </p>
                    <p className="text-[10px] text-[#F6F2E9]/60">
                      {currentLang === 'es' ? 'Monto total del tour' : 'Full tour amount'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#B79A62]">
                      ${totalCalculated} <span className="text-sm font-sans font-normal text-[#F6F2E9]">USD</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Tax Exclusions Box */}
              <div className="bg-[#102B35] p-3.5 border-l-3 border-[#B79A62] text-[11px] text-[#F6F2E9]/80 space-y-1">
                <p className="font-bold text-[#B79A62] uppercase tracking-wider text-[10px]">
                  {currentLang === 'es' ? 'Impuestos de la Comarca (Efectivo al ingresar):' : 'Comarca Taxes (Cash upon entry):'}
                </p>
                <p className="leading-relaxed">
                  {t.form.taxNotice}
                </p>
              </div>

            </div>

            {/* Contact Box */}
            <div className="bg-[#173642] border border-[#B79A62]/40 p-5 shadow-sm text-[#F6F2E9] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#B79A62] uppercase tracking-wider">
                  {currentLang === 'es' ? 'Atención Directa' : 'Direct Support'}
                </p>
                <p className="text-xs text-[#F6F2E9]/80">Billy: +507 6421-7424</p>
              </div>
              <a
                href="https://wa.me/50764217424"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#B79A62] text-[#173642] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#173642]" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* Modal Prompt for Cabin Packages */}
        {whatsappModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102B35]/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#173642] max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#B79A62] text-[#F6F2E9] space-y-6 relative">
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-[#B79A62] shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#F6F2E9]">
                    {currentLang === 'es' ? 'Solicitud Recibida' : 'Request Received'}
                  </h3>
                  <p className="text-xs text-[#F6F2E9]/90 mt-1.5 leading-relaxed">
                    {currentLang === 'es'
                      ? 'Hemos recibido tu solicitud de disponibilidad. Billy revisará las fechas solicitadas y se pondrá en contacto contigo para confirmar la disponibilidad. No es necesario realizar ningún pago por el momento.'
                      : 'Your availability request has been received successfully. Billy will review your requested dates and contact you to confirm availability. No payment is required at this stage.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#102B35] p-4 border border-[#B79A62]/40 space-y-2 text-xs">
                <p className="font-bold text-[#B79A62]">
                  {currentLang === 'es' ? 'Información importante:' : 'Important information:'}
                </p>
                <ul className="space-y-1 text-[#F6F2E9]/85 list-disc list-inside">
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

              <div className="bg-[#102B35] p-3.5 border border-[#B79A62]/40 space-y-1.5 text-xs">
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
                  className="px-5 py-3.5 bg-transparent hover:bg-white/10 text-[#F6F2E9] border border-[#B79A62]/40 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {currentLang === 'es' ? 'CERRAR' : 'CLOSE'}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0E2833] border-t border-[#B79A62]/30 py-8 text-center text-xs text-[#F6F2E9]/60">
        <p>Dubgan San Blas Trips — Guna Yala, Panamá. All rights reserved.</p>
      </footer>

    </div>
  );
};
