import React, { useState } from 'react';
import { Play, X, Compass } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';

interface StorytellingProps {
  currentLang: Language;
}

export const Storytelling: React.FC<StorytellingProps> = ({ currentLang }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const t = content[currentLang];

  return (
    <section className="relative py-28 md:py-36 bg-[#102B35] text-[#F6F2E9] overflow-hidden">
      
      {/* Background Photography with Golden Hour Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={images.story.src}
          alt={currentLang === 'es' ? images.story.altEs : images.story.altEn}
          className="w-full h-full object-cover object-center filter brightness-90 saturate-[1.2]"
        />
        {/* Dark Navy Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102B35] via-[#102B35]/80 to-[#102B35]/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-6">
            <p className="eyebrow-gold">
              {t.story.eyebrow}
            </p>

            <h2 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-bold text-[#F6F2E9] tracking-tight leading-[0.95]">
              {t.story.titleLine1} <br />
              <span className="italic text-[#B79A62] font-normal">{t.story.titleLine2}</span>
            </h2>

            <div className="gold-divider" />

            <p className="text-base sm:text-lg md:text-xl text-[#F6F2E9]/90 font-normal leading-relaxed max-w-2xl">
              {t.story.description}
            </p>
          </div>

          {/* Right Column: Elegant Circular Video Play Button */}
          <div className="lg:col-span-4 flex items-center justify-start lg:justify-center">
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="group relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#B79A62] bg-[#102B35]/80 text-[#B79A62] hover:bg-[#B79A62] hover:text-[#102B35] transition-all duration-500 shadow-2xl backdrop-blur-sm"
              aria-label={t.story.playVideo}
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              <span className="absolute -inset-3 rounded-full border border-[#B79A62]/30 animate-ping opacity-30" />
            </button>
          </div>

        </div>
      </div>

      {/* Immersive Video / Story Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102B35]/95 backdrop-blur-md animate-in fade-in">
          
          <button
            type="button"
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 p-3 text-[#F6F2E9] hover:text-[#B79A62]"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full bg-[#102B35] border border-[#B79A62] p-8 text-center space-y-6 relative text-[#F6F2E9]">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B79A62]">
              <Compass className="w-4 h-4" />
              <span>Guna Yala Story</span>
            </div>

            <h3 className="font-serif-editorial text-3xl sm:text-4xl font-bold">
              {t.story.titleLine1} {t.story.titleLine2}
            </h3>

            <div className="aspect-video bg-black overflow-hidden relative border border-[#B79A62]/30">
              <img src={images.story.src} alt="Guna Yala Story" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-6 space-y-3">
                <p className="font-serif-editorial text-2xl text-[#F6F2E9] italic">
                  "Where the ocean meets ancient Caribbean heritage."
                </p>
                <p className="text-xs text-[#B79A62] uppercase tracking-widest">
                  Dubgan San Blas Trips • Panama
                </p>
              </div>
            </div>

            <p className="text-xs text-[#F6F2E9]/70 max-w-xl mx-auto">
              {t.story.description}
            </p>

            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              className="bg-[#B79A62] text-[#102B35] px-8 py-3 text-xs font-bold uppercase tracking-wider"
            >
              Close Story
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
