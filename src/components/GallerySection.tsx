import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';

interface GallerySectionProps {
  currentLang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ currentLang }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = content[currentLang];

  const galleryItems = images.gallery;

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev! === 0 ? galleryItems.length - 1 : prev! - 1));
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev! === galleryItems.length - 1 ? 0 : prev! + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, galleryItems.length]);

  const selectedItem = selectedIndex !== null ? galleryItems[selectedIndex] : null;

  return (
    <section id="gallery" className="py-24 bg-[#EDE5D7] text-[#173642] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <p className="eyebrow-gold">{t.gallerySection.eyebrow}</p>
            <MolaAccent size="sm" />
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#173642]">
            {t.gallerySection.title}
          </h2>

          <div className="gold-divider" />

          <p className="text-base sm:text-lg text-[#173642]/80 font-normal">
            {t.gallerySection.subtitle}
          </p>
        </div>

        {/* Responsive Grid with Decorative Mola Pattern Dividers */}
        <div className="relative">
          
          {/* Embedded Mola Patterns Matching Homepage Hero Ornament (MolaBorderDark) */}
          <svg className="sr-only" aria-hidden="true">
            <defs>
              <pattern
                id="molaGalleryHorizPattern"
                x="0"
                y="0"
                width="80"
                height="14"
                patternUnits="userSpaceOnUse"
              >
                <rect width="80" height="14" fill="#0A1C23" />
                {/* Gold Outer Angular Spiral (#B79A62) */}
                <path
                  d="M 3,13 L 3,1 L 37,1 L 38,10 L 10,10 L 10,4 L 28,4 L 28,7 L 18,7"
                  stroke="#B79A62"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                />
                {/* Coral Interlocking Spiral (#D96848) */}
                <path
                  d="M 77,1 L 77,13 L 43,13 L 42,4 L 70,4 L 70,10 L 52,10 L 52,7 L 62,7"
                  stroke="#D96848"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                />
                {/* Turquoise Accent (#397D80) */}
                <path
                  d="M 7,11 L 7,3 L 31,3 L 31,8 L 15,8"
                  stroke="#397D80"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                />
                <line x1="37" y1="7" x2="43" y2="7" stroke="#D49A3A" strokeWidth="1.5" strokeLinecap="square" />
              </pattern>
            </defs>
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {galleryItems.map((item, idx) => (
              <div key={item.id} className="flex flex-col space-y-3">
                
                {/* Photograph Card */}
                <div
                  onClick={() => setSelectedIndex(idx)}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#F6F2E9] border-2 border-[#B79A62]/50 shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={item.src}
                    alt={currentLang === 'es' ? item.altEs : item.altEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#173642]/90 via-[#173642]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif-editorial text-2xl font-bold text-[#F6F2E9]">
                          {currentLang === 'es' ? item.titleEs : item.titleEn}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B79A62]">
                          Guna Yala
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#B79A62] text-[#173642] flex items-center justify-center shadow-md">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Mola-Pattern Divider directly beneath each photograph */}
                <div
                  className="w-full h-[14px] relative overflow-hidden select-none border-y border-[#B79A62]/70 shadow-xs"
                  aria-hidden="true"
                >
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 14">
                    <rect width="100%" height="14" fill="url(#molaGalleryHorizPattern)" />
                  </svg>
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
                  <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#173642]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-3 text-[#F6F2E9] hover:text-[#B79A62]"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev! === 0 ? galleryItems.length - 1 : prev! - 1))}
            className="absolute left-4 sm:left-8 p-3 text-[#F6F2E9] hover:text-[#B79A62]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full text-center space-y-4">
            <div className="max-h-[75vh] overflow-hidden border-2 border-[#B79A62] mx-auto bg-black inline-block shadow-2xl">
              <img
                src={selectedItem.src}
                alt={currentLang === 'es' ? selectedItem.altEs : selectedItem.altEn}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <MolaAccent size="sm" />
              <h3 className="font-serif-editorial text-2xl font-bold text-[#F6F2E9]">
                {currentLang === 'es' ? selectedItem.titleEs : selectedItem.titleEn}
              </h3>
              <MolaAccent size="sm" />
            </div>
            <p className="text-xs text-[#B79A62] uppercase tracking-widest">
              {selectedIndex! + 1} / {galleryItems.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev! === galleryItems.length - 1 ? 0 : prev! + 1))}
            className="absolute right-4 sm:right-8 p-3 text-[#F6F2E9] hover:text-[#B79A62]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

    </section>
  );
};
