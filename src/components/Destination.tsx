import React from 'react';
import { Compass, Shield, Anchor } from 'lucide-react';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderDark } from './MolaBorderDark';

interface DestinationProps {
  currentLang: Language;
}

export const Destination: React.FC<DestinationProps> = ({ currentLang }) => {
  const t = content[currentLang];

  return (
    <section id="destination" className="py-24 bg-[#EDE5D7] text-[#173642] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <p className="eyebrow-gold">{t.destination.eyebrow}</p>
            <MolaAccent size="sm" />
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#173642]">
            {t.destination.title}
          </h2>

          <div className="gold-divider" />

          <p className="text-base sm:text-lg text-[#173642]/85 leading-relaxed font-normal">
            {t.destination.description}
          </p>
        </div>

      </div>

      {/* Light Ornamental Border Below Header */}
      <div className="my-10">
        <MolaBorderDark />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 3 Key Pillars Cards in Warm Ivory with Soft Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="relative p-8 bg-[#F6F2E9] border border-[#B79A62]/40 space-y-4 hover:border-[#B79A62] transition-all duration-300 shadow-md">
            {/* Decorative Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#B79A62]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#B79A62]" />

            <div className="w-12 h-12 rounded-full border border-[#B79A62] bg-[#EDE5D7] text-[#B79A62] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                {t.destination.card1Title}
              </h3>
              <MolaAccent size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-[#173642]/80 leading-relaxed font-normal">
              {t.destination.card1Desc}
            </p>
          </div>

          <div className="relative p-8 bg-[#F6F2E9] border border-[#B79A62]/40 space-y-4 hover:border-[#B79A62] transition-all duration-300 shadow-md">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#B79A62]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#B79A62]" />

            <div className="w-12 h-12 rounded-full border border-[#B79A62] bg-[#EDE5D7] text-[#B79A62] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                {t.destination.card2Title}
              </h3>
              <MolaAccent size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-[#173642]/80 leading-relaxed font-normal">
              {t.destination.card2Desc}
            </p>
          </div>

          <div className="relative p-8 bg-[#F6F2E9] border border-[#B79A62]/40 space-y-4 hover:border-[#B79A62] transition-all duration-300 shadow-md">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#B79A62]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#B79A62]" />

            <div className="w-12 h-12 rounded-full border border-[#B79A62] bg-[#EDE5D7] text-[#B79A62] flex items-center justify-center">
              <Anchor className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#173642]">
                {t.destination.card3Title}
              </h3>
              <MolaAccent size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-[#173642]/80 leading-relaxed font-normal">
              {t.destination.card3Desc}
            </p>
          </div>

        </div>

      </div>

      {/* Light Ornamental Border */}
      <div className="mt-12">
        <MolaBorderDark />
      </div>

    </section>
  );
};
