import React from 'react';
import { Calendar, ArrowRight, MessageCircle, ShieldCheck, CreditCard, Compass } from 'lucide-react';
import { Language, content } from '../translations/content';
import { images } from '../pictures/images';
import { MolaAccent } from './MolaAccent';
import { MolaBorderDark } from './MolaBorderDark';

interface BookingCTAProps {
  currentLang: Language;
  onOpenBookingPage: (tourId?: string) => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ currentLang, onOpenBookingPage }) => {
  const t = content[currentLang];

  return (
    <section id="contact" className="py-0 bg-[#F6F2E9] text-[#173642] relative scroll-mt-20">
      
      {/* Light Mola Border Above Banner */}
      <MolaBorderDark />

      <div className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury CTA Banner Container */}
        <div className="bg-[#173642] text-[#F6F2E9] border-2 border-[#B79A62] p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden text-center space-y-8">
          
          {/* Subtle Background Scrim & Image */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
            <img
              src={images.hero.src}
              alt="San Blas Islands"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173642] via-[#173642]/80 to-[#173642]" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            
            <div className="flex items-center justify-center gap-3">
              <p className="eyebrow-gold">
                {currentLang === 'es' ? 'TU AVENTURA EN GUNA YALA TE ESPERA' : 'YOUR GUNA YALA ADVENTURE AWAITS'}
              </p>
              <MolaAccent size="sm" />
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#F6F2E9] tracking-tight leading-tight">
              {currentLang === 'es' ? '¿Listo para Reservar tu Viaje a San Blas?' : 'Ready to Book Your San Blas Trip?'}
            </h2>

            <div className="w-16 h-[2px] bg-[#B79A62] mx-auto" />

            <p className="text-sm sm:text-base md:text-lg text-[#F6F2E9]/90 font-normal leading-relaxed">
              {currentLang === 'es'
                ? 'Reserva en línea tu pasadío compartido ($135/persona), tour privado de lujo ($850 total) o tu paquete de hospedaje en cabañas de 2 o 3 noches con confirmación segura.'
                : 'Book your shared day trip ($135/person), luxury private charter ($850 total), or 2/3-night island hopping cabin package online with secure confirmation.'}
            </p>

          </div>

          {/* Highlights Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
            
            <div className="bg-[#102B35]/90 border border-[#B79A62]/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-[#B79A62]">
                <CreditCard className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {currentLang === 'es' ? 'Pago Online Seguro' : 'Secure Online Payment'}
                </span>
              </div>
              <p className="text-xs text-[#F6F2E9]/80">
                {currentLang === 'es' ? 'Checkout directo con PagueloFacil para pasadíos' : 'Direct checkout with PagueloFacil for day trips'}
              </p>
            </div>

            <div className="bg-[#102B35]/90 border border-[#B79A62]/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-[#B79A62]">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {currentLang === 'es' ? 'Cabañas Confirmadas' : 'Confirmed Cabins'}
                </span>
              </div>
              <p className="text-xs text-[#F6F2E9]/80">
                {currentLang === 'es' ? 'Verificación de disponibilidad de hospedaje' : 'Availability verification for island stays'}
              </p>
            </div>

            <div className="bg-[#102B35]/90 border border-[#B79A62]/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-[#B79A62]">
                <Compass className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {currentLang === 'es' ? 'Operador Oficial' : 'Official Operator'}
                </span>
              </div>
              <p className="text-xs text-[#F6F2E9]/80">
                {currentLang === 'es' ? 'Experiencias autóctonas en Guna Yala con Billy' : 'Authentic Guna Yala experiences with Billy'}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            <button
              type="button"
              onClick={() => onOpenBookingPage()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#173642]" />
              <span>{currentLang === 'es' ? 'IR A LA PÁGINA DE RESERVA' : 'GO TO RESERVATION PAGE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/50764217424"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 text-[#F6F2E9] border border-[#B79A62] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow"
            >
              <MessageCircle className="w-4 h-4 text-[#B79A62]" />
              <span>WhatsApp: +507 6421-7424</span>
            </a>

          </div>

        </div>

      </div>

    </section>
  );
};
