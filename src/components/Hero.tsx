import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  const t = content[currentLang];

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const toursSection = document.querySelector('#tours');
    if (toursSection) {
      toursSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const defaultWhatsappMsg = encodeURIComponent(
    currentLang === 'es'
      ? 'Hola Dubgan San Blas Trips, me gustaría consultar información para mi viaje a Guna Yala.'
      : 'Hello Dubgan San Blas Trips, I would like to inquire about information for my trip to Guna Yala.'
  );

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-between overflow-hidden bg-[#173642] pt-24 pb-16">
      
      {/* Full-width Aerial Photography Background with Vibrant Natural Caribbean Tones */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={images.hero.src}
          alt={currentLang === 'es' ? images.hero.altEs : images.hero.altEn}
          className="w-full h-full object-cover object-center animate-hero-slow scale-105 filter brightness-100 saturate-[1.1]"
        />
        
        {/* Soft, Light Scrim Overlay targeted for Text Readability without Heavy Dark Mass */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#173642]/85 via-[#173642]/50 to-transparent w-full md:w-3/5 lg:w-1/2" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173642]/60 via-transparent to-[#173642]/30" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between min-h-[75vh]">
        
        {/* Left-aligned Hero Typography */}
        <div className="max-w-2xl space-y-5 pt-8 sm:pt-12">
          
          {/* Small Gold Eyebrow */}
          <p className="eyebrow-gold">
            {t.hero.eyebrow}
          </p>

          {/* Large White Serif Heading */}
          <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl font-bold text-[#F6F2E9] tracking-tight leading-[0.95] drop-shadow-md">
            {t.hero.title}
          </h1>

          {/* Gold Serif Subtitle */}
          <p className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl italic text-[#B79A62] tracking-wide font-normal">
            {t.hero.subtitle}
          </p>

          {/* Thin Gold Divider */}
          <div className="gold-divider" />

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-[#F6F2E9] font-normal leading-relaxed max-w-xl drop-shadow">
            {t.hero.description}
          </p>

          {/* Refined CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            
            {/* Primary Gold CTA */}
            <a
              href="#tours"
              onClick={handleExploreClick}
              className="inline-flex items-center justify-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:shadow-[#B79A62]/20"
            >
              <span>{t.hero.btnExplore}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary Transparent WhatsApp CTA */}
            <a
              href={`https://wa.me/50761436120?text=${defaultWhatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 text-[#F6F2E9] border border-[#F6F2E9]/60 hover:border-[#F6F2E9] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#B79A62]" />
              <span>{t.hero.btnWhatsapp}</span>
            </a>

          </div>

        </div>

        {/* Bottom-right Location Stamp */}
        <div className="self-end text-right pt-12 pb-4 sm:pb-0 border-t sm:border-t-0 border-[#B79A62]/30 w-full sm:w-auto">
          <p className="font-serif-editorial text-lg sm:text-xl font-bold text-[#F6F2E9] tracking-wider uppercase drop-shadow">
            {t.hero.locationTitle}
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B79A62]">
            {t.hero.locationSub}
          </p>
        </div>

      </div>

    </section>
  );
};
