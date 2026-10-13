import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Compass, Sparkles } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';

interface GallerySectionProps {
  currentLang: Language;
}

// Staggered floating configurations for organic, non-synchronous movement
const FLOATING_CONFIGS = [
  { anim: 'floatGallery1', duration: 14.5, delay: -3.2, offsetClass: 'mt-0' },
  { anim: 'floatGallery2', duration: 16.8, delay: -7.5, offsetClass: 'mt-4' },
  { anim: 'floatGallery3', duration: 13.2, delay: -1.8, offsetClass: '-mt-2' },
  { anim: 'floatGallery4', duration: 18.4, delay: -11.4, offsetClass: 'mt-3' },
  { anim: 'floatGallery5', duration: 15.6, delay: -5.7, offsetClass: 'mt-1' },
  { anim: 'floatGallery6', duration: 17.2, delay: -9.1, offsetClass: '-mt-3' },
  { anim: 'floatGallery1', duration: 19.1, delay: -13.6, offsetClass: 'mt-5' },
  { anim: 'floatGallery2', duration: 14.0, delay: -2.4, offsetClass: 'mt-2' },
  { anim: 'floatGallery3', duration: 16.4, delay: -8.8, offsetClass: '-mt-1' },
  { anim: 'floatGallery4', duration: 15.2, delay: -4.3, offsetClass: 'mt-4' },
  { anim: 'floatGallery5', duration: 18.0, delay: -12.1, offsetClass: 'mt-0' },
  { anim: 'floatGallery6', duration: 13.8, delay: -6.5, offsetClass: '-mt-2' },
  { anim: 'floatGallery1', duration: 17.5, delay: -10.2, offsetClass: 'mt-3' },
  { anim: 'floatGallery2', duration: 15.9, delay: -3.9, offsetClass: 'mt-1' },
  { anim: 'floatGallery3', duration: 19.5, delay: -14.8, offsetClass: 'mt-4' },
];

export const GallerySection: React.FC<GallerySectionProps> = ({ currentLang }) => {
  // Centerpiece featured photo index (default to index 3: San Blas Archipelago aerial view)
  const [featuredIndex, setFeaturedIndex] = useState(3);
  // Fullscreen lightbox modal index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const t = content[currentLang];
  const galleryItems = images.gallery;
  const featuredItem = galleryItems[featuredIndex] || galleryItems[0];

  // Detect and observe reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Lightbox keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % galleryItems.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
        );
      }
    },
    [lightboxIndex, galleryItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Desktop layout organization:
  // Top row (5 items), Mid left (2 items), Center (1 featured item), Mid right (2 items), Bottom row (5 items)
  // We partition the 14 non-featured items gracefully around the centerpiece
  const nonFeaturedItems = galleryItems
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter((entry) => entry.originalIndex !== featuredIndex);

  const topRowItems = nonFeaturedItems.slice(0, 5);
  const midLeftItems = nonFeaturedItems.slice(5, 7);
  const midRightItems = nonFeaturedItems.slice(7, 9);
  const bottomRowItems = nonFeaturedItems.slice(9, 14);

  return (
    <section
      id="gallery"
      className="relative bg-[#EDE5D7] text-[#173642] py-16 sm:py-20 lg:py-24 overflow-x-clip"
    >
      {/* Embedded Mola Pattern Definitions matching Guna Yala textile borders */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3">
              <p className="eyebrow-gold">{t.gallerySection.eyebrow}</p>
              <MolaAccent size="sm" />
            </div>

            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173642] tracking-tight">
              {t.gallerySection.title}
            </h2>

            <div className="gold-divider !my-2" />

            <p className="text-sm sm:text-base text-[#173642]/80 font-normal">
              {t.gallerySection.subtitle}
            </p>
          </div>

          {/* Quick Collection Counter Badge */}
          <div className="flex items-center gap-3 self-start md:self-end bg-[#F6F2E9] px-4 py-2.5 rounded-full border border-[#B79A62]/40 shadow-xs">
            <Compass className="w-4 h-4 text-[#B79A62]" aria-hidden="true" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#173642]/70">
              {currentLang === 'es' ? 'Colección Continua' : 'Floating Collection'}
            </span>
            <span className="font-mono text-xs font-bold text-[#B79A62] ml-0.5">
              15 {currentLang === 'es' ? 'Fotografías' : 'Photographs'}
            </span>
          </div>
        </div>

        {/* Top Decorative Mola Textile Accent Band */}
        <div
          className="w-full h-[14px] relative overflow-hidden select-none border-y border-[#B79A62]/70 rounded-t-lg mb-8 shadow-xs"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 14">
            <rect width="100%" height="14" fill="url(#molaGalleryHorizPattern)" />
          </svg>
          <div className="absolute top-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
        </div>

        {/* ============================================================ */}
        {/* DESKTOP LAYOUT (lg & xl): BALANCED CENTERED COMPOSITION     */}
        {/* Centered large photograph with 14 floating satellites       */}
        {/* ============================================================ */}
        <div className="hidden lg:block relative py-6">
          <div className="flex flex-col gap-8 xl:gap-10">
            
            {/* ROW 1: Top Arc (5 photographs) */}
            <div className="grid grid-cols-5 gap-6 xl:gap-8 items-center justify-items-center">
              {topRowItems.map((entry, idx) => {
                const config = FLOATING_CONFIGS[entry.originalIndex % FLOATING_CONFIGS.length];
                const animStyle = prefersReducedMotion
                  ? {}
                  : {
                      animation: `${config.anim} ${config.duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${config.delay}s infinite`,
                    };

                return (
                  <div
                    key={entry.item.id}
                    className={`floating-item-wrapper w-full max-w-[210px] xl:max-w-[230px] ${config.offsetClass}`}
                    style={animStyle}
                  >
                    <div
                      onClick={() => setFeaturedIndex(entry.originalIndex)}
                      className="group relative rounded-2xl bg-[#0A1C23] border border-[#B79A62]/40 overflow-hidden shadow-lg
                                 transition-all duration-400 ease-out cursor-pointer
                                 hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[#B79A62] hover:shadow-2xl hover:shadow-black/50"
                      title={currentLang === 'es' ? 'Haz clic para destacar' : 'Click to feature in center'}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1C23]">
                        <img
                          src={entry.item.src}
                          alt={currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(entry.originalIndex);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-[#0A1C23]/80 hover:bg-[#0A1C23] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={currentLang === 'es' ? 'Ampliar foto' : 'Expand photo'}
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Legible Caption Bar Beneath Image */}
                      <div className="p-2.5 bg-[#0E2830] border-t border-[#B79A62]/25">
                        <h4 className="font-serif-editorial text-xs font-bold text-[#F6F2E9] truncate group-hover:text-[#D49A3A] transition-colors">
                          {currentLang === 'es' ? entry.item.titleEs : entry.item.titleEn}
                        </h4>
                        <p className="text-[11px] text-[#F6F2E9]/70 line-clamp-1 mt-0.5 leading-snug">
                          {currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ROW 2: Middle Horizon (2 Left Satellites + 1 LARGE CENTERPIECE + 2 Right Satellites) */}
            <div className="grid grid-cols-12 gap-6 xl:gap-8 items-center">
              
              {/* Left Flank (2 Satellites in 3 columns) */}
              <div className="col-span-3 flex flex-col gap-6 xl:gap-8 items-end justify-center">
                {midLeftItems.map((entry) => {
                  const config = FLOATING_CONFIGS[entry.originalIndex % FLOATING_CONFIGS.length];
                  const animStyle = prefersReducedMotion
                    ? {}
                    : {
                        animation: `${config.anim} ${config.duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${config.delay}s infinite`,
                      };

                  return (
                    <div
                      key={entry.item.id}
                      className={`floating-item-wrapper w-full max-w-[210px] xl:max-w-[230px] ${config.offsetClass}`}
                      style={animStyle}
                    >
                      <div
                        onClick={() => setFeaturedIndex(entry.originalIndex)}
                        className="group relative rounded-2xl bg-[#0A1C23] border border-[#B79A62]/40 overflow-hidden shadow-lg
                                   transition-all duration-400 ease-out cursor-pointer
                                   hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[#B79A62] hover:shadow-2xl hover:shadow-black/50"
                        title={currentLang === 'es' ? 'Haz clic para destacar' : 'Click to feature in center'}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1C23]">
                          <img
                            src={entry.item.src}
                            alt={currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIndex(entry.originalIndex);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#0A1C23]/80 hover:bg-[#0A1C23] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={currentLang === 'es' ? 'Ampliar foto' : 'Expand photo'}
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-2.5 bg-[#0E2830] border-t border-[#B79A62]/25">
                          <h4 className="font-serif-editorial text-xs font-bold text-[#F6F2E9] truncate group-hover:text-[#D49A3A] transition-colors">
                            {currentLang === 'es' ? entry.item.titleEs : entry.item.titleEn}
                          </h4>
                          <p className="text-[11px] text-[#F6F2E9]/70 line-clamp-1 mt-0.5 leading-snug">
                            {currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CENTERPIECE: LARGER CENTRAL PHOTOGRAPH (6 Columns) */}
              <div className="col-span-6 flex justify-center items-center px-2">
                <div
                  className="floating-item-wrapper w-full max-w-[420px] xl:max-w-[460px]"
                  style={
                    prefersReducedMotion
                      ? {}
                      : {
                          animation: `floatGalleryCenter 17s cubic-bezier(0.45, 0.05, 0.55, 0.95) -4s infinite`,
                        }
                  }
                >
                  <div
                    className="group relative rounded-3xl bg-[#0A1C23] border-2 border-[#B79A62] overflow-hidden shadow-2xl shadow-[#0A1C23]/40
                               transition-all duration-400 ease-out
                               hover:-translate-y-3 hover:scale-[1.025] hover:shadow-black/70 hover:border-[#D49A3A]"
                  >
                    {/* Featured Image Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1C23]">
                      <img
                        src={featuredItem.src}
                        alt={currentLang === 'es' ? featuredItem.altEs : featuredItem.altEn}
                        loading="eager"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Cultural Badge Overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1C23]/85 backdrop-blur-md border border-[#B79A62]/60 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-[#B79A62]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6F2E9]">
                          {currentLang === 'es' ? 'Destacado' : 'Centerpiece'}
                        </span>
                      </div>

                      {/* Expand Lightbox Button */}
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(featuredIndex)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-[#0A1C23]/85 hover:bg-[#0A1C23] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/60 backdrop-blur-md shadow-md transition-all hover:scale-110"
                        title={currentLang === 'es' ? 'Ver en tamaño completo' : 'View full size'}
                        aria-label={currentLang === 'es' ? 'Ver en tamaño completo' : 'View full size'}
                      >
                        <ZoomIn className="w-4 h-4 text-[#B79A62]" />
                      </button>
                    </div>

                    {/* Prominent Caption Card Beneath Central Image */}
                    <div className="p-4 sm:p-5 bg-[#0E2830] border-t-2 border-[#B79A62]/40 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#B79A62]">
                          Guna Yala • {currentLang === 'es' ? 'San Blas, Panamá' : 'San Blas, Panama'}
                        </span>
                        <span className="text-[10px] font-mono text-[#F6F2E9]/60 font-semibold">
                          {featuredIndex + 1} / {galleryItems.length}
                        </span>
                      </div>

                      <h3 className="font-serif-editorial text-xl xl:text-2xl font-bold text-[#F6F2E9] tracking-tight group-hover:text-[#D49A3A] transition-colors">
                        {currentLang === 'es' ? featuredItem.titleEs : featuredItem.titleEn}
                      </h3>

                      <p className="text-xs text-[#F6F2E9]/85 leading-relaxed font-normal">
                        {currentLang === 'es' ? featuredItem.altEs : featuredItem.altEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Flank (2 Satellites in 3 columns) */}
              <div className="col-span-3 flex flex-col gap-6 xl:gap-8 items-start justify-center">
                {midRightItems.map((entry) => {
                  const config = FLOATING_CONFIGS[entry.originalIndex % FLOATING_CONFIGS.length];
                  const animStyle = prefersReducedMotion
                    ? {}
                    : {
                        animation: `${config.anim} ${config.duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${config.delay}s infinite`,
                      };

                  return (
                    <div
                      key={entry.item.id}
                      className={`floating-item-wrapper w-full max-w-[210px] xl:max-w-[230px] ${config.offsetClass}`}
                      style={animStyle}
                    >
                      <div
                        onClick={() => setFeaturedIndex(entry.originalIndex)}
                        className="group relative rounded-2xl bg-[#0A1C23] border border-[#B79A62]/40 overflow-hidden shadow-lg
                                   transition-all duration-400 ease-out cursor-pointer
                                   hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[#B79A62] hover:shadow-2xl hover:shadow-black/50"
                        title={currentLang === 'es' ? 'Haz clic para destacar' : 'Click to feature in center'}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1C23]">
                          <img
                            src={entry.item.src}
                            alt={currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIndex(entry.originalIndex);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#0A1C23]/80 hover:bg-[#0A1C23] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={currentLang === 'es' ? 'Ampliar foto' : 'Expand photo'}
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-2.5 bg-[#0E2830] border-t border-[#B79A62]/25">
                          <h4 className="font-serif-editorial text-xs font-bold text-[#F6F2E9] truncate group-hover:text-[#D49A3A] transition-colors">
                            {currentLang === 'es' ? entry.item.titleEs : entry.item.titleEn}
                          </h4>
                          <p className="text-[11px] text-[#F6F2E9]/70 line-clamp-1 mt-0.5 leading-snug">
                            {currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROW 3: Bottom Arc (5 photographs) */}
            <div className="grid grid-cols-5 gap-6 xl:gap-8 items-center justify-items-center">
              {bottomRowItems.map((entry, idx) => {
                const config = FLOATING_CONFIGS[entry.originalIndex % FLOATING_CONFIGS.length];
                const animStyle = prefersReducedMotion
                  ? {}
                  : {
                      animation: `${config.anim} ${config.duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${config.delay}s infinite`,
                    };

                return (
                  <div
                    key={entry.item.id}
                    className={`floating-item-wrapper w-full max-w-[210px] xl:max-w-[230px] ${config.offsetClass}`}
                    style={animStyle}
                  >
                    <div
                      onClick={() => setFeaturedIndex(entry.originalIndex)}
                      className="group relative rounded-2xl bg-[#0A1C23] border border-[#B79A62]/40 overflow-hidden shadow-lg
                                 transition-all duration-400 ease-out cursor-pointer
                                 hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[#B79A62] hover:shadow-2xl hover:shadow-black/50"
                      title={currentLang === 'es' ? 'Haz clic para destacar' : 'Click to feature in center'}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1C23]">
                        <img
                          src={entry.item.src}
                          alt={currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(entry.originalIndex);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-[#0A1C23]/80 hover:bg-[#0A1C23] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={currentLang === 'es' ? 'Ampliar foto' : 'Expand photo'}
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-2.5 bg-[#0E2830] border-t border-[#B79A62]/25">
                        <h4 className="font-serif-editorial text-xs font-bold text-[#F6F2E9] truncate group-hover:text-[#D49A3A] transition-colors">
                          {currentLang === 'es' ? entry.item.titleEs : entry.item.titleEn}
                        </h4>
                        <p className="text-[11px] text-[#F6F2E9]/70 line-clamp-1 mt-0.5 leading-snug">
                          {currentLang === 'es' ? entry.item.altEs : entry.item.altEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE & TABLET LAYOUT (< 1024px): RESPONSIVE FLOATING VIEW */}
        {/* Featured Showcase + Balanced 2-to-3-Column Floating Grid    */}
        {/* ============================================================ */}
        <div className="lg:hidden space-y-8">
          
          {/* Main Mobile Featured Showcase Card with Gentle Float */}
          <div
            className="floating-item-wrapper max-w-lg mx-auto"
            style={
              prefersReducedMotion
                ? {}
                : {
                    animation: 'floatGalleryCenter 15s cubic-bezier(0.45, 0.05, 0.55, 0.95) -3s infinite',
                  }
            }
          >
            <div className="relative rounded-2xl bg-[#0A1C23] border-2 border-[#B79A62] overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1C23]">
                <img
                  src={featuredItem.src}
                  alt={currentLang === 'es' ? featuredItem.altEs : featuredItem.altEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0A1C23]/80 backdrop-blur-xs border border-[#B79A62]/60">
                  <Sparkles className="w-3 h-3 text-[#B79A62]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#F6F2E9]">
                    {currentLang === 'es' ? 'Destacado' : 'Spotlight'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(featuredIndex)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#0A1C23]/80 text-[#F6F2E9] border border-[#B79A62]/60 backdrop-blur-xs"
                  aria-label={currentLang === 'es' ? 'Ver en tamaño completo' : 'View full size'}
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#B79A62]" />
                </button>
              </div>

              <div className="p-4 bg-[#0E2830] border-t border-[#B79A62]/40">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#B79A62]">
                  {featuredIndex + 1} / {galleryItems.length} • San Blas
                </span>
                <h3 className="font-serif-editorial text-lg font-bold text-[#F6F2E9] mt-0.5">
                  {currentLang === 'es' ? featuredItem.titleEs : featuredItem.titleEn}
                </h3>
                <p className="text-xs text-[#F6F2E9]/80 mt-1 leading-relaxed">
                  {currentLang === 'es' ? featuredItem.altEs : featuredItem.altEn}
                </p>
              </div>
            </div>
          </div>

          {/* Quick-Browse Horizontal Floating Strip */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#173642]/70 text-center">
              {currentLang === 'es' ? 'Toca cualquier foto para destacarla o ampliarla' : 'Tap any photo to feature or view'}
            </p>

            {/* Mobile/Tablet 2-to-3 column floating grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
              {galleryItems.map((item, idx) => {
                const isSelected = idx === featuredIndex;
                const config = FLOATING_CONFIGS[idx % FLOATING_CONFIGS.length];
                const animStyle = prefersReducedMotion
                  ? {}
                  : {
                      animation: `${config.anim} ${config.duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${config.delay}s infinite`,
                    };

                return (
                  <div
                    key={item.id}
                    className="floating-item-wrapper w-full"
                    style={animStyle}
                  >
                    <div
                      onClick={() => setFeaturedIndex(idx)}
                      className={`group relative rounded-xl bg-[#0A1C23] overflow-hidden shadow-md cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-2 border-[#B79A62] ring-2 ring-[#B79A62]/40 scale-[1.02]'
                          : 'border border-[#B79A62]/30 hover:border-[#B79A62]'
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1C23]">
                        <img
                          src={item.src}
                          alt={currentLang === 'es' ? item.altEs : item.altEn}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(idx);
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-[#0A1C23]/80 text-[#F6F2E9] border border-[#B79A62]/40"
                          aria-label={currentLang === 'es' ? 'Ampliar foto' : 'Expand photo'}
                        >
                          <ZoomIn className="w-3 h-3 text-[#B79A62]" />
                        </button>
                      </div>

                      <div className="p-2 bg-[#0E2830] border-t border-[#B79A62]/20">
                        <h4 className="font-serif-editorial text-[11px] font-bold text-[#F6F2E9] truncate">
                          {currentLang === 'es' ? item.titleEs : item.titleEn}
                        </h4>
                        <p className="text-[10px] text-[#F6F2E9]/65 truncate">
                          {currentLang === 'es' ? item.altEs : item.altEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Decorative Mola Textile Accent Band */}
        <div
          className="w-full h-[14px] relative overflow-hidden select-none border-y border-[#B79A62]/70 rounded-b-lg mt-10 shadow-xs"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 14">
            <rect width="100%" height="14" fill="url(#molaGalleryHorizPattern)" />
          </svg>
          <div className="absolute top-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-80" />
        </div>

      </div>

      {/* ============================================================ */}
      {/* FULLSCREEN LIGHTBOX MODAL (Preserved for high-res viewing)    */}
      {/* ============================================================ */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#0A1C23]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={
            currentLang === 'es'
              ? galleryItems[lightboxIndex]?.titleEs
              : galleryItems[lightboxIndex]?.titleEn
          }
        >
          {/* Top Bar with Title, Counter and Close Button */}
          <div className="flex items-center justify-between text-[#F6F2E9] max-w-6xl mx-auto w-full pb-2 border-b border-[#B79A62]/30">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B79A62]">
                Dubgan Gallery
              </span>
              <span className="text-xs text-[#F6F2E9]/60 font-mono">
                {lightboxIndex + 1} / {galleryItems.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full hover:bg-white/10 text-[#F6F2E9] hover:text-[#B79A62] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B79A62]"
              aria-label={currentLang === 'es' ? 'Cerrar vista completa' : 'Close full size view'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image with Previous/Next Controls */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full py-4 select-none">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + galleryItems.length) % galleryItems.length
                )
              }
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#173642]/80 hover:bg-[#173642] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B79A62]"
              aria-label={currentLang === 'es' ? 'Foto anterior' : 'Previous photograph'}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryItems[lightboxIndex].src}
              alt={
                currentLang === 'es'
                  ? galleryItems[lightboxIndex].altEs
                  : galleryItems[lightboxIndex].altEn
              }
              className="max-h-[75vh] max-w-full w-auto object-contain rounded-xl border border-[#B79A62]/40 shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % galleryItems.length)
              }
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#173642]/80 hover:bg-[#173642] text-[#F6F2E9] hover:text-[#B79A62] border border-[#B79A62]/40 shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B79A62]"
              aria-label={currentLang === 'es' ? 'Siguiente foto' : 'Next photograph'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-3xl mx-auto w-full text-center space-y-1 pt-2 border-t border-[#B79A62]/30">
            <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#F6F2E9]">
              {currentLang === 'es'
                ? galleryItems[lightboxIndex].titleEs
                : galleryItems[lightboxIndex].titleEn}
            </h4>
            <p className="text-xs sm:text-sm text-[#F6F2E9]/80 font-normal">
              {currentLang === 'es'
                ? galleryItems[lightboxIndex].altEs
                : galleryItems[lightboxIndex].altEn}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
