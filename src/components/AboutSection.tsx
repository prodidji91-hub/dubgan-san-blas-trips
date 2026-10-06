import React from 'react';
import { MessageCircle, Calendar, Users, Compass } from 'lucide-react';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderLight } from './MolaBorderLight';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = content[currentLang];

  const defaultWhatsappMsg = encodeURIComponent(
    currentLang === 'es'
      ? 'Hola Dubgan San Blas Trips, me gustaría conversar sobre las fechas y opciones disponibles para mi viaje.'
      : 'Hello Dubgan San Blas Trips, I would like to chat about available dates and options for my trip.'
  );

  return (
    <section id="about" className="py-24 bg-[#F6F2E9] text-[#102B35] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white p-8 sm:p-14 border border-[#B79A62]/40 shadow-xl space-y-10 relative overflow-hidden">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <p className="eyebrow-gold">{t.aboutSection.eyebrow}</p>
              <MolaAccent size="sm" />
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#102B35] leading-tight">
              {t.aboutSection.title}
            </h2>

            <p className="text-base sm:text-lg text-[#22252A]/85 font-normal leading-relaxed">
              {t.aboutSection.description}
            </p>
          </div>

          {/* Light Ornamental Divider Below Intro Block */}
          <MolaBorderLight />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div className="p-6 bg-[#F6F2E9]/60 border border-[#B79A62]/30 space-y-2">
              <Calendar className="w-6 h-6 text-[#B79A62]" />
              <h3 className="font-serif-editorial text-xl font-bold text-[#102B35]">
                {currentLang === 'es' ? '1. Tus Fechas' : '1. Your Dates'}
              </h3>
              <p className="text-xs text-[#22252A]/80">
                {currentLang === 'es'
                  ? 'Indícanos la fecha o mes en que planeas tu viaje a San Blas.'
                  : 'Let us know which date or month you plan your trip to San Blas.'}
              </p>
            </div>

            <div className="p-6 bg-[#F6F2E9]/60 border border-[#B79A62]/30 space-y-2">
              <Users className="w-6 h-6 text-[#397D80]" />
              <h3 className="font-serif-editorial text-xl font-bold text-[#102B35]">
                {currentLang === 'es' ? '2. Tu Grupo' : '2. Your Group'}
              </h3>
              <p className="text-xs text-[#22252A]/80">
                {currentLang === 'es'
                  ? 'Cuéntanos cuántas personas viajan contigo (pareja, familia o grupo).'
                  : 'Tell us how many people are traveling with you (couple, family, or group).'}
              </p>
            </div>

            <div className="p-6 bg-[#F6F2E9]/60 border border-[#B79A62]/30 space-y-2">
              <Compass className="w-6 h-6 text-[#102B35]" />
              <h3 className="font-serif-editorial text-xl font-bold text-[#102B35]">
                {currentLang === 'es' ? '3. Tu Estilo' : '3. Your Style'}
              </h3>
              <p className="text-xs text-[#22252A]/80">
                {currentLang === 'es'
                  ? 'Pasadía de recorrido, estancia en cabaña o embarcación privada.'
                  : 'Day trip, overnight cabana stay, or private boat excursion.'}
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#B79A62]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="font-serif-editorial text-xl font-bold text-[#102B35]">
                {t.aboutSection.boxTitle}
              </p>
              <p className="text-xs sm:text-sm text-[#22252A]/70 max-w-lg">
                {t.aboutSection.boxText}
              </p>
            </div>

            <a
              href={`https://wa.me/50761436120?text=${defaultWhatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B79A62] hover:bg-[#a38752] text-[#102B35] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-[#102B35]" />
              <span>{t.aboutSection.ctaWhatsapp}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
