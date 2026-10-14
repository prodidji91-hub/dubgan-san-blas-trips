import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Users,
  Mail,
  Phone,
  Building,
  CreditCard,
  Copy,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Loader2,
  Filter,
  ShieldAlert,
  ChevronRight,
  Check,
  Info,
} from 'lucide-react';
import { MolaAccent } from './MolaAccent';
import { MolaBorderDark } from './MolaBorderDark';

interface BookingRecord {
  reference: string;
  category: 'day_trip' | 'cabin_package';
  tourId: string;
  tourTitleEs: string;
  tourTitleEn: string;
  date: string;
  departureDate?: string;
  nights?: number;
  guests: number;
  customer: {
    fullName: string;
    email: string;
    whatsappNumber: string;
    pickupHotel: string;
    message?: string;
  };
  language: 'es' | 'en';
  pricing: {
    basePrice: number;
    priceType: 'flat' | 'per_person';
    fullAmountUSD: number;
    currency: 'USD';
  };
  bookingStatus:
    | 'awaiting_payment'
    | 'checkout_failed'
    | 'pending_availability'
    | 'confirmed'
    | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  checkoutDetails?: {
    checkoutUrl?: string;
    providerMessage?: string;
    generatedAt?: string;
    failedAt?: string;
    errorReason?: string;
    checkoutState?: 'idle' | 'generating' | 'completed' | 'failed';
  };
  environment: 'sandbox' | 'production';
  createdAt: string;
  updatedAt: string;
}

type FilterTab = 'pending_cabins' | 'awaiting_payment' | 'day_trips' | 'all';

export const AdminBookings: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Bookings list state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending_cabins');
  const [envMode, setEnvMode] = useState<string>('sandbox');

  // Approval action state (tracking checkboxes per booking)
  const [checkedAvailability, setCheckedAvailability] = useState<Record<string, boolean>>({});
  const [actionLoadingRef, setActionLoadingRef] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ ref: string; type: 'success' | 'error'; text: string } | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // 1. Check Session Status on Mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
      });
      const data = await response.json();

      setIsConfigured(data.isConfigured !== false);
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchBookings();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 2. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: passwordInput }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        fetchBookings();
      } else {
        setAuthError(data.errorEs || 'Contraseña de administración incorrecta.');
      }
    } catch {
      setAuthError('Error de conexión al autenticar con el servidor.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // Ignore errors on logout
    }
    setIsAuthenticated(false);
    setBookings([]);
  };

  // 4. Fetch Bookings List
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    setActionNotice(null);

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Sesión de administración expirada. Por favor ingresa tu contraseña.');
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.bookings || []);
        setEnvMode(data.environment || 'sandbox');
      } else {
        setActionNotice({
          ref: 'global',
          type: 'error',
          text: data.errorEs || 'Error al obtener la lista de reservas.',
        });
      }
    } catch {
      setActionNotice({
        ref: 'global',
        type: 'error',
        text: 'Error de conexión al cargar reservas.',
      });
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // 5. Approve Cabin Availability
  const handleApproveCabin = async (ref: string) => {
    if (!checkedAvailability[ref]) return;

    setActionLoadingRef(ref);
    setActionNotice(null);

    try {
      const response = await fetch('/api/admin/approve-cabin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          confirmedAvailability: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActionNotice({
          ref,
          type: 'success',
          text: '¡Disponibilidad aprobada y enlace de pago de PagueloFacil generado exitosamente!',
        });
        fetchBookings();
      } else {
        setActionNotice({
          ref,
          type: 'error',
          text: data.errorEs || 'Error al aprobar la cabaña o generar el enlace de pago.',
        });
        fetchBookings();
      }
    } catch {
      setActionNotice({
        ref,
        type: 'error',
        text: 'Error de conexión al intentar aprobar la solicitud de cabaña.',
      });
    } finally {
      setActionLoadingRef(null);
    }
  };

  // 6. Decline Cabin Availability
  const handleDeclineCabin = async (ref: string) => {
    if (!window.confirm(`¿Estás seguro de marcar la reserva ${ref} como "NO DISPONIBLE"?`)) {
      return;
    }

    setActionLoadingRef(ref);
    setActionNotice(null);

    try {
      const response = await fetch('/api/admin/decline-cabin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          reason: 'Cabaña no disponible para las fechas solicitadas.',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActionNotice({
          ref,
          type: 'success',
          text: 'La reserva fue marcada como NO DISPONIBLE.',
        });
        fetchBookings();
      } else {
        setActionNotice({
          ref,
          type: 'error',
          text: data.errorEs || 'No se pudo rechazar la reserva.',
        });
      }
    } catch {
      setActionNotice({
        ref,
        type: 'error',
        text: 'Error de conexión al marcar la reserva como no disponible.',
      });
    } finally {
      setActionLoadingRef(null);
    }
  };

  // 7. Copy Link to Clipboard
  const handleCopyLink = (ref: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 3000);
  };

  // 8. Generate WhatsApp Share URL
  const getWhatsAppShareUrl = (booking: BookingRecord) => {
    const rawPhone = booking.customer.whatsappNumber.replace(/[^0-9+]/g, '');
    const phone = rawPhone.startsWith('+') ? rawPhone.slice(1) : rawPhone;
    const checkoutUrl = booking.checkoutDetails?.checkoutUrl || '';

    const textEs = `Hola ${booking.customer.fullName}, ¡Excelentes noticias de Dubgan San Blas Trips! 🌴\n\nHemos verificado la disponibilidad para tu paquete "${booking.tourTitleEs}" (${booking.date} al ${booking.departureDate || booking.date}).\n\nPuedes realizar el pago de $${booking.pricing.fullAmountUSD} USD de forma segura en el siguiente enlace de PagueloFacil:\n${checkoutUrl}\n\nQuedamos atentos a tus comentarios para confirmar tu reserva. ¡Gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(textEs)}`;
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'pending_cabins') {
      return b.category === 'cabin_package' && b.bookingStatus === 'pending_availability';
    }
    if (activeFilter === 'awaiting_payment') {
      return b.bookingStatus === 'awaiting_payment';
    }
    if (activeFilter === 'day_trips') {
      return b.category === 'day_trip';
    }
    return true;
  });

  // Counts for filter tabs
  const countPendingCabins = bookings.filter(
    (b) => b.category === 'cabin_package' && b.bookingStatus === 'pending_availability'
  ).length;

  const countAwaitingPayment = bookings.filter(
    (b) => b.bookingStatus === 'awaiting_payment'
  ).length;

  const countDayTrips = bookings.filter((b) => b.category === 'day_trip').length;

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#102B35] text-[#F6F2E9] flex flex-col items-center justify-center p-4 selection:bg-[#B79A62] selection:text-[#102B35]">
        <div className="max-w-md w-full bg-[#F6F2E9] text-[#173642] p-8 shadow-2xl border-2 border-[#B79A62] space-y-6 relative">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#173642] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#B79A62]">
              <Lock className="w-6 h-6 text-[#B79A62]" />
            </div>
            <h2 className="font-serif-editorial text-3xl font-bold text-[#173642]">
              Gestión de Reservas
            </h2>
            <p className="text-xs text-[#173642]/70 font-semibold uppercase tracking-wider">
              Dubgan San Blas Trips — Panel de Administración
            </p>
          </div>

          <MolaBorderDark />

          {!isConfigured && (
            <div className="p-4 bg-[#D96848]/15 border-l-4 border-[#D96848] text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#D96848] font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Autenticación Pendiente</span>
              </div>
              <p className="text-[#173642]">
                La variable de entorno <code className="font-mono font-bold bg-[#EDE5D7] px-1">ADMIN_PASSWORD</code> debe ser configurada en el panel de Netlify.
              </p>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-[#D96848]/15 border-l-4 border-[#D96848] text-xs font-semibold text-[#173642] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#D96848] shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                Contraseña de Administración *
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa tu contraseña de administración"
                className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/50 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] font-bold text-xs uppercase tracking-widest transition-all shadow flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Iniciar Sesión en Panel</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-[#173642]/60 italic font-serif-editorial">
            Acceso privado protegido con autenticación verificada en servidor.
          </p>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#173642] font-sans selection:bg-[#B79A62] selection:text-[#102B35]">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#102B35] text-[#F6F2E9] border-b-2 border-[#B79A62] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#173642] rounded-full border border-[#B79A62] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#B79A62]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#F6F2E9]">
                  Dubgan San Blas Trips
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold bg-[#B79A62] text-[#173642] px-2 py-0.5">
                  {envMode}
                </span>
              </div>
              <p className="text-xs text-[#B79A62] font-medium uppercase tracking-wider">
                Panel Privado de Gestión de Reservas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchBookings()}
              disabled={isLoadingBookings}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#173642] hover:bg-[#397D80] text-[#F6F2E9] border border-[#B79A62]/40 text-xs font-bold uppercase tracking-wider transition-colors shadow"
              title="Actualizar lista de reservas"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B79A62] ${isLoadingBookings ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D96848]/20 hover:bg-[#D96848]/40 text-[#F6F2E9] border border-[#D96848]/40 text-xs font-bold uppercase tracking-wider transition-colors shadow"
            >
              <LogOut className="w-3.5 h-3.5 text-[#D96848]" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Global Action Banner */}
        {actionNotice && actionNotice.ref === 'global' && (
          <div
            className={`p-4 border-l-4 text-xs font-semibold flex items-center justify-between gap-3 ${
              actionNotice.type === 'success'
                ? 'bg-[#397D80]/15 border-[#397D80] text-[#173642]'
                : 'bg-[#D96848]/15 border-[#D96848] text-[#173642]'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-[#B79A62]" />
              <span>{actionNotice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-xs underline font-bold uppercase tracking-wider"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="bg-white border border-[#B79A62]/40 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Tab 1: Pending Cabins */}
            <button
              type="button"
              onClick={() => setActiveFilter('pending_cabins')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeFilter === 'pending_cabins'
                  ? 'bg-[#B79A62] text-[#173642] shadow'
                  : 'bg-[#F6F2E9] text-[#173642]/80 hover:bg-[#EDE5D7]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Solicitudes de Cabañas</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#102B35] text-[#F6F2E9] font-mono">
                {countPendingCabins}
              </span>
            </button>

            {/* Tab 2: Awaiting Payment */}
            <button
              type="button"
              onClick={() => setActiveFilter('awaiting_payment')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeFilter === 'awaiting_payment'
                  ? 'bg-[#B79A62] text-[#173642] shadow'
                  : 'bg-[#F6F2E9] text-[#173642]/80 hover:bg-[#EDE5D7]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Por Pagar / Enlace Creado</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#102B35] text-[#F6F2E9] font-mono">
                {countAwaitingPayment}
              </span>
            </button>

            {/* Tab 3: Day Trips */}
            <button
              type="button"
              onClick={() => setActiveFilter('day_trips')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeFilter === 'day_trips'
                  ? 'bg-[#B79A62] text-[#173642] shadow'
                  : 'bg-[#F6F2E9] text-[#173642]/80 hover:bg-[#EDE5D7]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Pasadías de Un Día</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#102B35] text-[#F6F2E9] font-mono">
                {countDayTrips}
              </span>
            </button>

            {/* Tab 4: All */}
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeFilter === 'all'
                  ? 'bg-[#173642] text-[#F6F2E9] shadow'
                  : 'bg-[#F6F2E9] text-[#173642]/80 hover:bg-[#EDE5D7]'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Todas ({bookings.length})</span>
            </button>

          </div>

          <span className="text-xs text-[#173642]/60 italic font-mono hidden lg:inline-block pr-2">
            Base de datos: Netlify Blobs ({envMode})
          </span>

        </div>

        {/* Bookings Loading Spinner */}
        {isLoadingBookings && (
          <div className="py-16 text-center space-y-3 bg-white border border-[#B79A62]/30 p-8 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#B79A62] mx-auto" />
            <p className="text-sm font-bold text-[#173642] uppercase tracking-wider">
              Cargando registros de reservas desde Netlify Blobs...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingBookings && filteredBookings.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white border border-[#B79A62]/30 p-8 shadow-xs">
            <Info className="w-8 h-8 text-[#B79A62] mx-auto" />
            <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
              No hay reservas en esta categoría
            </h3>
            <p className="text-xs text-[#173642]/70 max-w-md mx-auto">
              Actualmente no existen solicitudes bajo el filtro seleccionado. Selecciona "Todas" para ver el registro completo.
            </p>
          </div>
        )}

        {/* Bookings List Grid */}
        {!isLoadingBookings && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {filteredBookings.map((b) => {
              const isPendingCabin =
                b.category === 'cabin_package' && b.bookingStatus === 'pending_availability';
              const isAwaitingPayment = b.bookingStatus === 'awaiting_payment';
              const isCancelled = b.bookingStatus === 'cancelled';
              const hasCheckoutUrl = Boolean(b.checkoutDetails?.checkoutUrl);

              return (
                <div
                  key={b.reference}
                  className={`bg-white border-2 shadow-lg transition-all space-y-6 p-6 sm:p-8 relative ${
                    isPendingCabin
                      ? 'border-[#B79A62]'
                      : isCancelled
                      ? 'border-[#D96848]/40 opacity-80'
                      : 'border-[#173642]/30'
                  }`}
                >
                  
                  {/* Card Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE5D7] pb-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-[#102B35] bg-[#EDE5D7] px-2.5 py-1 border border-[#B79A62]/40">
                          {b.reference}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border ${
                            b.category === 'cabin_package'
                              ? 'bg-[#102B35] text-[#B79A62] border-[#B79A62]'
                              : 'bg-[#B79A62] text-[#102B35] border-[#102B35]'
                          }`}
                        >
                          {b.category === 'cabin_package' ? 'Cabaña' : 'Pasadía Un Día'}
                        </span>
                      </div>

                      <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                        {b.tourTitleEs || b.tourId}
                      </h3>
                    </div>

                    {/* Status Badges Lockup */}
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Availability Badge */}
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border flex items-center gap-1.5 ${
                          isPendingCabin
                            ? 'bg-[#B79A62]/20 border-[#B79A62] text-[#173642]'
                            : isAwaitingPayment
                            ? 'bg-[#397D80]/20 border-[#397D80] text-[#173642]'
                            : isCancelled
                            ? 'bg-[#D96848]/20 border-[#D96848] text-[#D96848]'
                            : 'bg-[#EDE5D7] border-[#173642]/30 text-[#173642]'
                        }`}
                      >
                        {isPendingCabin && <Clock className="w-3.5 h-3.5 text-[#B79A62]" />}
                        {isAwaitingPayment && <CheckCircle2 className="w-3.5 h-3.5 text-[#397D80]" />}
                        {isCancelled && <XCircle className="w-3.5 h-3.5 text-[#D96848]" />}
                        <span>
                          {isPendingCabin
                            ? 'Pendiente Disponibilidad'
                            : isAwaitingPayment
                            ? 'Disponibilidad Aprobada / Por Pagar'
                            : isCancelled
                            ? 'No Disponible / Cancelado'
                            : b.bookingStatus}
                        </span>
                      </span>

                      {/* Payment Badge */}
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border ${
                          b.paymentStatus === 'paid'
                            ? 'bg-[#397D80] text-white border-[#397D80]'
                            : 'bg-[#102B35] text-[#F6F2E9] border-[#102B35]'
                        }`}
                      >
                        {b.paymentStatus === 'paid' ? 'PAGADO' : 'NO PAGADO'}
                      </span>

                    </div>

                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs sm:text-sm">
                    
                    {/* Left Column: Dates & Guests (4 cols) */}
                    <div className="md:col-span-4 bg-[#F6F2E9] p-4 border border-[#B79A62]/30 space-y-3">
                      <div className="space-y-1 border-b border-[#B79A62]/20 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                          Fecha de Llegada / Viaje
                        </span>
                        <div className="font-bold text-[#173642] flex items-center gap-1.5 text-sm">
                          <Calendar className="w-4 h-4 text-[#B79A62]" />
                          <span>{b.date}</span>
                        </div>
                      </div>

                      {b.departureDate && (
                        <div className="space-y-1 border-b border-[#B79A62]/20 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                            Fecha de Salida Calculada ({b.nights} noches)
                          </span>
                          <div className="font-bold text-[#173642] flex items-center gap-1.5 text-sm">
                            <Calendar className="w-4 h-4 text-[#B79A62]" />
                            <span>{b.departureDate}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 border-b border-[#B79A62]/20 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                          Cantidad de Viajeros
                        </span>
                        <div className="font-bold text-[#173642] flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#B79A62]" />
                          <span>{b.guests} {b.guests === 1 ? 'persona' : 'personas'}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                          Monto Total de la Reserva
                        </span>
                        <p className="font-serif-editorial text-2xl font-bold text-[#B79A62]">
                          ${b.pricing?.fullAmountUSD || 0} USD
                        </p>
                      </div>
                    </div>

                    {/* Middle Column: Customer Details (5 cols) */}
                    <div className="md:col-span-5 bg-[#F6F2E9] p-4 border border-[#B79A62]/30 space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block border-b border-[#B79A62]/20 pb-1">
                        Datos del Cliente
                      </span>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-sm text-[#173642]">{b.customer?.fullName}</p>
                        
                        <p className="flex items-center gap-2 text-[#173642]/90">
                          <Mail className="w-3.5 h-3.5 text-[#B79A62] shrink-0" />
                          <a href={`mailto:${b.customer?.email}`} className="hover:underline">
                            {b.customer?.email}
                          </a>
                        </p>

                        <p className="flex items-center gap-2 text-[#173642]/90">
                          <Phone className="w-3.5 h-3.5 text-[#B79A62] shrink-0" />
                          <a
                            href={`https://wa.me/${b.customer?.whatsappNumber?.replace(/[^0-9+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-mono font-bold text-[#102B35]"
                          >
                            {b.customer?.whatsappNumber}
                          </a>
                        </p>

                        <p className="flex items-center gap-2 text-[#173642]/90 pt-1">
                          <Building className="w-3.5 h-3.5 text-[#B79A62] shrink-0" />
                          <span><strong>Hotel:</strong> {b.customer?.pickupHotel}</span>
                        </p>
                      </div>

                      {b.customer?.message && (
                        <div className="pt-2 border-t border-[#B79A62]/20 text-xs">
                          <span className="font-bold text-[#B79A62] block text-[10px] uppercase tracking-wider">
                            Nota / Mensaje del cliente:
                          </span>
                          <p className="italic text-[#173642]/80 bg-white p-2 border border-[#B79A62]/20 mt-1">
                            "{b.customer.message}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Creation Timestamp & Meta (3 cols) */}
                    <div className="md:col-span-3 bg-[#102B35] text-[#F6F2E9] p-4 border border-[#B79A62] space-y-2 text-xs flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                          Fecha de Solicitud
                        </span>
                        <p className="font-mono text-[11px] text-[#F6F2E9]/90">
                          {new Date(b.createdAt).toLocaleString('es-PA')}
                        </p>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-[#B79A62]/30">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62] block">
                          Idioma Preferido
                        </span>
                        <p className="font-semibold text-xs uppercase text-[#F6F2E9]">
                          {b.language === 'es' ? 'Español' : 'English'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Individual Booking Action Notice */}
                  {actionNotice && actionNotice.ref === b.reference && (
                    <div
                      className={`p-3 border-l-4 text-xs font-semibold flex items-center justify-between gap-2 ${
                        actionNotice.type === 'success'
                          ? 'bg-[#397D80]/15 border-[#397D80] text-[#173642]'
                          : 'bg-[#D96848]/15 border-[#D96848] text-[#173642]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-[#B79A62]" />
                        <span>{actionNotice.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActionNotice(null)}
                        className="text-xs font-bold underline"
                      >
                        OK
                      </button>
                    </div>
                  )}

                  {/* ACTION SECTION 1: CABIN APPROVAL CONTROLS */}
                  {isPendingCabin && (
                    <div className="bg-[#173642]/5 border-2 border-[#B79A62] p-5 space-y-4">
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-[#173642] uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-[#B79A62]" />
                        <span>Aprobación de Disponibilidad de Cabañas (Billy)</span>
                      </div>

                      {/* Confirmation Checkbox Requirement */}
                      <label className="flex items-start gap-3 cursor-pointer bg-white p-3 border border-[#B79A62]/40 select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(checkedAvailability[b.reference])}
                          onChange={(e) =>
                            setCheckedAvailability({
                              ...checkedAvailability,
                              [b.reference]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 mt-0.5 text-[#B79A62] border-[#B79A62] focus:ring-[#B79A62] accent-[#B79A62]"
                        />
                        <span className="text-xs font-semibold text-[#173642]">
                          Confirmo que verifiqué la disponibilidad de la cabaña con la comunidad local en Guna Yala para las fechas {b.date} al {b.departureDate}.
                        </span>
                      </label>

                      {/* Approval & Decline Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          disabled={
                            !checkedAvailability[b.reference] || actionLoadingRef === b.reference
                          }
                          onClick={() => handleApproveCabin(b.reference)}
                          className={`flex-1 py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2 ${
                            !checkedAvailability[b.reference] || actionLoadingRef === b.reference
                              ? 'bg-[#EDE5D7] text-[#173642]/40 cursor-not-allowed border border-[#173642]/20'
                              : 'bg-[#B79A62] hover:bg-[#a38752] text-[#173642]'
                          }`}
                        >
                          {actionLoadingRef === b.reference ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#173642]" />
                              <span>Procesando Aprobación y Enlace...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Aprobar Disponibilidad y Crear Enlace de Pago</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={actionLoadingRef === b.reference}
                          onClick={() => handleDeclineCabin(b.reference)}
                          className="py-3.5 px-5 bg-transparent hover:bg-[#D96848]/10 text-[#D96848] border border-[#D96848] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>No Disponible</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* ACTION SECTION 2: PAYMENT LINK CONTROLS (When checkoutUrl exists) */}
                  {hasCheckoutUrl && (
                    <div className="bg-[#102B35] text-[#F6F2E9] border-2 border-[#B79A62] p-5 space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-[#B79A62]/30 pb-2">
                        <span className="text-xs font-bold text-[#B79A62] uppercase tracking-wider flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Enlace de Pago PagueloFacil Generado</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#F6F2E9]/70">
                          {b.checkoutDetails?.generatedAt ? new Date(b.checkoutDetails.generatedAt).toLocaleString('es-PA') : ''}
                        </span>
                      </div>

                      {/* Display Checkout URL */}
                      <div className="bg-[#173642] p-3 border border-[#B79A62]/40 font-mono text-xs text-[#B79A62] truncate select-all flex items-center justify-between gap-2">
                        <span className="truncate">{b.checkoutDetails?.checkoutUrl}</span>
                        <a
                          href={b.checkoutDetails?.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-[#F6F2E9] transition-colors"
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Copy & Share Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        
                        {/* Copy Link Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(b.reference, b.checkoutDetails!.checkoutUrl!)}
                          className="flex-1 py-3 px-4 bg-[#173642] hover:bg-[#397D80] text-[#F6F2E9] border border-[#B79A62]/50 text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
                        >
                          {copiedRef === b.reference ? (
                            <>
                              <Check className="w-4 h-4 text-[#B79A62]" />
                              <span>¡Enlace Copiado al Portapapeles!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#B79A62]" />
                              <span>Copiar Enlace</span>
                            </>
                          )}
                        </button>

                        {/* Share on WhatsApp Button */}
                        <a
                          href={getWhatsAppShareUrl(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4 fill-[#173642]" />
                          <span>Compartir por WhatsApp</span>
                        </a>

                      </div>

                      <p className="text-[11px] text-[#F6F2E9]/80 italic">
                        ℹ️ <strong>Aviso:</strong> Billy debe presionar <strong>ENVIAR</strong> en WhatsApp para entregar el mensaje y el enlace de pago al cliente.
                      </p>

                    </div>
                  )}

                  {/* RETRY LINK GENERATION IF CHECKOUT FAILED OR MERCH CONFIG MISSING */}
                  {isAwaitingPayment && !hasCheckoutUrl && (
                    <div className="bg-[#D96848]/10 border-2 border-[#D96848] p-4 text-xs space-y-3">
                      <div className="flex items-center gap-2 text-[#D96848] font-bold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" />
                        <span>Enlace de Pago Pendiente de Generación</span>
                      </div>

                      <p className="text-[#173642]">
                        {b.checkoutDetails?.errorReason === 'MISSING_MERCHANT_CONFIG'
                          ? 'La disponibilidad fue aprobada pero la variable PAGUELOFACIL_CCLW debe ser configurada en Netlify para generar el enlace.'
                          : `Razón de falla: ${b.checkoutDetails?.errorReason || 'Error al conectar con la pasarela de pagos.'}`}
                      </p>

                      <button
                        type="button"
                        disabled={actionLoadingRef === b.reference}
                        onClick={() => {
                          setCheckedAvailability({ ...checkedAvailability, [b.reference]: true });
                          handleApproveCabin(b.reference);
                        }}
                        className="py-2.5 px-4 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${actionLoadingRef === b.reference ? 'animate-spin' : ''}`} />
                        <span>Reintentar Generación de Enlace de Pago</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
};
