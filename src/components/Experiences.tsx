import React, { useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  X,
  Check,
  Clock,
  ShieldCheck,
  AlertCircle,
  Info,
  Briefcase
} from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';
import { toursData, TourDetail } from '../data/toursData';
import { MolaAccent } from './MolaAccent';
import { MolaBorderLight } from './MolaBorderLight';
import { MolaBorderDark } from './MolaBorderDark';

interface ExperiencesProps {
  currentLang: Language;
}

export const Experiences: React.FC<ExperiencesProps> = ({ currentLang }) => {
  const [selectedTour, setSelectedTour] = useState<TourDetail | null>(null);
  const t = content[currentLang];

  const getTourImage = (key: string) => {
    switch (key) {
      case 'tour2':
        return images.tours.tour2.src;
      case 'tour1':
      default:
        return images.tours.tour1.src;
    }
  };

  const getWhatsAppLink = (tour: TourDetail) => {
    const text = currentLang === 'es' ? tour.whatsappMessageEs : tour.whatsappMessageEn;
    return `https://wa.me/50761436120?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tours" className="py-24 bg-[#F6F2E9] text-[#173642] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section with MolaAccent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#B79A62]/30 pb-8">
          
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <p className="eyebrow-gold">
                {currentLang === 'es' ? 'EXPERIENCIAS CONFIRMADAS' : 'CONFIRMED TOUR EXPERIENCES'}
              </p>
              <MolaAccent size="sm" />
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#173642] tracking-tight">
              {currentLang === 'es' ? 'TOURS A SAN BLAS' : 'SAN BLAS ISLAND TOURS'}
            </h2>
          </div>

          <div className="lg:col-span-5 text-sm sm:text-base text-[#173642]/80 font-normal leading-relaxed">
            <p>
              {currentLang === 'es'
                ? 'Descubre nuestras experiencias oficiales en Guna Yala. Elige entre nuestro tour privado exclusivo de $850 (hasta 3 personas) o nuestro pasadía compartido.'
                : 'Discover our official Guna Yala experiences. Choose between our exclusive $850 Private Experience (up to 3 guests) or our Shared Day Trip.'}
            </p>
          </div>

        </div>

        {/* 2-Column Responsive Layout for Private & Shared Tours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {toursData.map((tour) => {
            const tourImg = getTourImage(tour.imageKey);
            const badgeText = currentLang === 'es' ? tour.badgeEs : tour.badgeEn;
            const titleText = currentLang === 'es' ? tour.titleEs : tour.titleEn;
            const subtitleText = currentLang === 'es' ? tour.subtitleEs : tour.subtitleEn;
            const priceText = currentLang === 'es' ? tour.priceDisplayEs : tour.priceDisplayEn;
            const shortDesc = currentLang === 'es' ? tour.shortDescriptionEs : tour.shortDescriptionEn;

            return (
              <div
                key={tour.id}
                className="group bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-[#B79A62]/40 flex flex-col justify-between relative"
              >
                <div>
                  {/* Photo Banner with Distinction Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE5D7]">
                    <img
                      src={tourImg}
                      alt={titleText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Visual Badge Distinction */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 uppercase tracking-widest border shadow-md ${
                          tour.isPrivate
                            ? 'bg-[#B79A62] text-[#173642] border-[#F6F2E9]'
                            : 'bg-[#173642] text-[#F6F2E9] border-[#B79A62]'
                        }`}
                      >
                        {badgeText}
                      </span>
                    </div>

                    {/* Price Banner Overlay on Image */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#173642]/90 via-[#173642]/60 to-transparent p-4 pt-10 text-right">
                      <p className="font-serif-editorial text-lg sm:text-xl font-bold text-[#F6F2E9]">
                        {priceText}
                      </p>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-6 sm:p-8 space-y-4">
                    
                    <div className="space-y-1">
                      <p className="eyebrow-gold">{subtitleText}</p>
                      <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#173642] group-hover:text-[#397D80] transition-colors leading-tight">
                        {titleText}
                      </h3>
                    </div>

                    <div className="w-12 h-[1px] bg-[#B79A62]" />

                    <p className="text-xs sm:text-sm text-[#173642]/85 leading-relaxed font-normal">
                      {shortDesc}
                    </p>

                    {/* Quick Inclusions Summary */}
                    <div className="space-y-2 pt-2 border-t border-[#EDE5D7]">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#B79A62]">
                        {currentLang === 'es' ? 'Incluye Destacado:' : 'Key Inclusions:'}
                      </p>
                      <ul className="space-y-1.5 text-xs text-[#173642]/90">
                        {(currentLang === 'es' ? tour.inclusionsEs : tour.inclusionsEn).slice(0, 4).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#397D80] shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Footer CTA Buttons */}
                <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#EDE5D7] mt-6 pt-6">
                  
                  <button
                    type="button"
                    onClick={() => setSelectedTour(tour)}
                    className="inline-flex items-center justify-center gap-2 bg-[#173642] hover:bg-[#397D80] text-[#F6F2E9] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow"
                  >
                    <Info className="w-4 h-4 text-[#B79A62]" />
                    <span>{currentLang === 'es' ? 'VER TOUR DETALLADO' : 'VIEW TOUR DETAILS'}</span>
                  </button>

                  <a
                    href={getWhatsAppLink(tour)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#173642]" />
                    <span>{currentLang === 'es' ? 'CONSULTAR POR WHATSAPP' : 'INQUIRE ON WHATSAPP'}</span>
                  </a>

                </div>

              </div>
            );
          })}
        </div>

        {/* Informational Disclaimer */}
        <p className="text-center text-xs text-[#173642]/70 mt-12 italic font-serif-editorial text-base">
          * {currentLang === 'es'
            ? 'Los precios e información presentados corresponden a los datos confirmados oficialmente. Impuestos de la comarca no están incluidos en la tarifa base.'
            : 'Prices and details correspond to officially confirmed tour data. Comarca entry taxes are separate from base rates.'}
        </p>

      </div>

      {/* Complete Tour Detail Modal Drawer */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#173642]/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          
          <div className="bg-[#F6F2E9] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border-2 border-[#B79A62] relative text-[#173642] space-y-8">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTour(null)}
              className="absolute top-4 right-4 p-2 text-[#173642] hover:text-[#B79A62] transition-colors z-20"
              aria-label="Close tour details"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Lockup */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest border ${
                    selectedTour.isPrivate
                      ? 'bg-[#B79A62] text-[#173642] border-[#173642]'
                      : 'bg-[#173642] text-[#F6F2E9] border-[#B79A62]'
                  }`}
                >
                  {currentLang === 'es' ? selectedTour.badgeEs : selectedTour.badgeEn}
                </span>
                <MolaAccent size="sm" />
              </div>

              <h3 className="font-serif-editorial text-3xl sm:text-4xl font-bold leading-tight">
                {currentLang === 'es' ? selectedTour.titleEs : selectedTour.titleEn}
              </h3>

              <p className="text-sm font-semibold text-[#B79A62] uppercase tracking-wider">
                {currentLang === 'es' ? selectedTour.subtitleEs : selectedTour.subtitleEn}
              </p>
            </div>

            {/* Price Banner */}
            <div className="bg-[#173642] text-[#F6F2E9] p-4 sm:p-5 border-l-4 border-[#B79A62] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62]">
                  {currentLang === 'es' ? 'Estructura de Tarifa:' : 'Pricing Structure:'}
                </p>
                <p className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#F6F2E9]">
                  {currentLang === 'es' ? selectedTour.priceDisplayEs : selectedTour.priceDisplayEn}
                </p>
              </div>

              {selectedTour.isPrivate && (
                <div className="text-xs text-[#F6F2E9]/80 font-mono bg-[#0E2833] px-3 py-1.5 border border-[#B79A62]/30">
                  {currentLang === 'es' ? 'Tarifa Total para 3 personas' : 'Flat rate for up to 3 guests'}
                </div>
              )}
            </div>

            {/* Tour Hero Photo */}
            <div className="aspect-[16/9] overflow-hidden bg-[#EDE5D7] relative shadow-md">
              <img
                src={getTourImage(selectedTour.imageKey)}
                alt={selectedTour.titleEs}
                className="w-full h-full object-cover"
              />
            </div>

            <MolaBorderLight />

            {/* Full Narrative Description */}
            <p className="text-sm sm:text-base text-[#173642]/90 leading-relaxed font-normal">
              {currentLang === 'es' ? selectedTour.fullDescriptionEs : selectedTour.fullDescriptionEn}
            </p>

            {/* Inclusions Box */}
            <div className="bg-white p-6 border border-[#B79A62]/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#B79A62]/20 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#397D80]" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#173642]">
                  {currentLang === 'es' ? '¿Qué Incluye este Tour?' : "What's Included"}
                </h4>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#173642]">
                {(currentLang === 'es' ? selectedTour.inclusionsEs : selectedTour.inclusionsEn).map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#397D80] shrink-0 mt-0.5" />
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>

              {/* Lunch Options if available */}
              {selectedTour.lunchOptionsEs && selectedTour.lunchOptionsEn && (
                <div className="pt-3 border-t border-[#EDE5D7] text-xs">
                  <span className="font-bold text-[#B79A62] uppercase tracking-wider">
                    {currentLang === 'es' ? 'Opciones de Almuerzo Buffet: ' : 'Buffet Lunch Options: '}
                  </span>
                  <span className="text-[#173642]/90">
                    {(currentLang === 'es' ? selectedTour.lunchOptionsEs : selectedTour.lunchOptionsEn).join(' • ')}
                  </span>
                </div>
              )}
            </div>

            {/* Important Info / Exclusions Box */}
            <div className="bg-[#EDE5D7]/60 p-6 border-l-4 border-[#D96848] space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#D96848]" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#173642]">
                  {currentLang === 'es' ? 'Impuestos y Exclusiones Importantes' : 'Taxes & Important Info'}
                </h4>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#173642]/90">
                {(currentLang === 'es' ? selectedTour.exclusionsEs : selectedTour.exclusionsEn).map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D96848] font-bold">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>

              {/* Extra Important Info lines if shared tour */}
              {selectedTour.importantInfoEs && selectedTour.importantInfoEn && (
                <div className="pt-2 space-y-1 text-xs text-[#173642]/80 font-medium border-t border-[#D96848]/20">
                  {(currentLang === 'es' ? selectedTour.importantInfoEs : selectedTour.importantInfoEn).map((info, i) => (
                    <p key={i}>ℹ️ {info}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Itinerary Timeline (If Shared Tour) */}
            {selectedTour.itineraryTimeline && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between border-b border-[#B79A62]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#B79A62]" />
                    <h4 className="text-base font-bold uppercase tracking-wider text-[#173642]">
                      {currentLang === 'es' ? 'Itinerario Detallado del Pasadía' : 'Detailed Day Trip Itinerary'}
                    </h4>
                  </div>
                  <MolaAccent size="sm" />
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#B79A62]/40">
                  {selectedTour.itineraryTimeline.map((step, idx) => (
                    <div key={idx} className="relative space-y-1.5">
                      
                      {/* Timeline Dot */}
                      <div className="absolute -left-6 sm:-left-8 top-1 w-3.5 h-3.5 rounded-full bg-[#B79A62] border-2 border-[#F6F2E9] shadow-sm" />

                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#B79A62]">
                        <span>{step.time}</span>
                      </div>

                      <h5 className="font-serif-editorial text-xl font-bold text-[#173642]">
                        {currentLang === 'es' ? step.titleEs : step.titleEn}
                      </h5>

                      <p className="text-xs sm:text-sm text-[#173642]/85 leading-relaxed">
                        {currentLang === 'es' ? step.descriptionEs : step.descriptionEn}
                      </p>

                      {/* Step Activity Highlights */}
                      {step.activitiesEs && step.activitiesEn && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(currentLang === 'es' ? step.activitiesEs : step.activitiesEn).map((act, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-white border border-[#B79A62]/30 px-2.5 py-1 text-[#173642] font-semibold"
                            >
                              ✓ {act}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations / What to Bring (If Available) */}
            {selectedTour.recommendationsEs && selectedTour.recommendationsEn && (
              <div className="bg-white p-6 border border-[#B79A62]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#B79A62]" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#173642]">
                    {currentLang === 'es' ? '¿Qué Llevar? — Recomendaciones' : 'What to Bring — Recommendations'}
                  </h4>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#173642]/90">
                  {(currentLang === 'es' ? selectedTour.recommendationsEs : selectedTour.recommendationsEn).map((rec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Marketing Closing Statement */}
            {selectedTour.marketingClosingEs && selectedTour.marketingClosingEn && (
              <div className="text-center py-4 px-6 bg-[#173642] text-[#F6F2E9] border border-[#B79A62]">
                <p className="font-serif-editorial text-lg italic text-[#B79A62]">
                  "{currentLang === 'es' ? selectedTour.marketingClosingEs : selectedTour.marketingClosingEn}"
                </p>
              </div>
            )}

            <MolaBorderDark />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={getWhatsAppLink(selectedTour)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-[#173642]" />
                <span>
                  {currentLang === 'es'
                    ? 'CONSULTAR DISPONIBILIDAD EN WHATSAPP'
                    : 'INQUIRE AVAILABILITY ON WHATSAPP'}
                </span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                className="px-6 py-4 bg-transparent hover:bg-[#173642]/10 text-[#173642] border border-[#173642]/30 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {currentLang === 'es' ? 'CERRAR' : 'CLOSE'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
