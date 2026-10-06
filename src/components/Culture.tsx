import React from 'react';
import { ArrowRight, Camera } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';

interface CultureProps {
  currentLang: Language;
}

export const Culture: React.FC<CultureProps> = ({ currentLang }) => {
  const t = content[currentLang];

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const dest = document.querySelector('#destination');
    if (dest) {
      dest.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="culture" className="bg-[#F6F2E9] text-[#173642] py-0 relative overflow-hidden">
      
      {/* Split-Screen Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
        
        {/* LEFT HALF: Authentic Guna Textile Craftsmanship Photography on Soft Sand */}
        <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-[100%] bg-[#EDE5D7] overflow-hidden group p-4 sm:p-8 lg:p-12 flex items-center justify-center">
          
          <div className="relative w-full h-full min-h-[380px] lg:min-h-[100%] overflow-hidden border-2 border-[#B79A62]/40 shadow-xl">
            <img
              src={images.culture.src}
              alt={currentLang === 'es' ? images.culture.altEs : images.culture.altEn}
              className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Refined Decorative Mola Corner Brackets */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#B79A62] pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#B79A62] pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#B79A62] pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#B79A62] pointer-events-none" />

            <div className="absolute top-6 left-6 px-3 py-1 bg-[#F6F2E9]/95 text-[#173642] border border-[#B79A62] text-[11px] font-bold uppercase tracking-widest shadow-sm">
              Mola Craftsmanship
            </div>
          </div>

        </div>

        {/* RIGHT HALF: Warm Ivory Background with Refined Editorial Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 lg:py-24 space-y-6 relative bg-[#F6F2E9]">
          
          {/* Eyebrow & Small Layered Angular Rectangular Spiral Accent */}
          <div className="flex items-center gap-3">
            <span className="eyebrow-gold">{t.culture.eyebrow}</span>
            <MolaAccent size="sm" />
          </div>

          {/* Large Editorial Serif Heading */}
          <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#173642] leading-[1.05] tracking-tight">
            {t.culture.titleLine1} <br />
            <span className="italic font-normal text-[#B79A62]">{t.culture.titleLine2}</span>
          </h2>

          {/* Thin Gold Divider */}
          <div className="gold-divider" />

          {/* Body Copy */}
          <p className="text-base sm:text-lg text-[#173642]/85 font-normal leading-relaxed max-w-xl">
            {t.culture.body}
          </p>

          {/* Respectful Visitor Guidance Callout */}
          <div className="border-l-2 border-[#B79A62] pl-4 py-1 space-y-1 my-2 bg-[#EDE5D7]/50 p-4 rounded-r">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#397D80]">
              <Camera className="w-3.5 h-3.5 text-[#B79A62]" />
              <span>{t.culture.guidanceTitle}</span>
            </div>
            <p className="text-xs text-[#173642]/80">
              {t.culture.guidanceText}
            </p>
          </div>

          {/* Gold Button */}
          <div className="pt-2">
            <a
              href="#destination"
              onClick={handleLearnMoreClick}
              className="inline-flex items-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md"
            >
              <span>{t.culture.btnLearnMore}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Subtle Angular Geometric Accent Line */}
          <div className="pt-6 flex items-center gap-3 opacity-30">
            <div className="w-12 h-[1px] bg-[#173642]" />
            <div className="w-3 h-3 border border-[#173642]" />
            <div className="w-12 h-[1px] bg-[#173642]" />
          </div>

        </div>

      </div>

    </section>
  );
};
