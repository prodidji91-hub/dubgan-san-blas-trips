import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderLight } from './MolaBorderLight';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = content[currentLang];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Light Cultural Border Divider Above Footer */}
      <MolaBorderLight />

      <footer className="bg-[#173642] text-[#F6F2E9] border-t border-[#B79A62]/40 pt-16 pb-12 relative overflow-hidden">
        
        {/* Subtle Angular Rectangular Spiral Backdrop in Footer Corner */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none p-6" aria-hidden="true">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
            <path
              d="M 5 95 L 5 5 L 95 5 L 95 75 L 25 75 L 25 25 L 75 25 L 75 55 L 45 55 L 45 38 L 60 38"
              stroke="#B79A62"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Brand Info - Genuine Transparent PNG Displayed with Marcellus typography */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-13 sm:h-14 w-auto shrink-0">
                  <img
                    src={images.logo.src}
                    alt={currentLang === 'es' ? images.logo.altEs : images.logo.altEn}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center select-none">
                  <span className="font-brand-dubgan text-2xl sm:text-3xl font-semibold text-[#F6F2E9] leading-none tracking-[0.01em]">
                    Dubgan
                  </span>
                  <span className="font-brand-subtitle text-[10px] font-medium text-[#B79A62] tracking-[0.14em] uppercase mt-1 leading-tight">
                    SAN BLAS TRIPS
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F6F2E9]/80 leading-relaxed max-w-sm font-normal">
                {t.footer.tagline}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#B79A62]">
                <MolaAccent size="sm" />
                <span>GUNA YALA • SAN BLAS • PANAMA</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="eyebrow-gold">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-2 text-xs font-semibold uppercase tracking-wider text-[#F6F2E9]/85">
                <li>
                  <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-[#B79A62] transition-colors">
                    {t.nav.home}
                  </a>
                </li>
                <li>
                  <a href="#tours" onClick={(e) => handleNavClick(e, '#tours')} className="hover:text-[#B79A62] transition-colors">
                    {t.nav.tours}
                  </a>
                </li>
                <li>
                  <a href="#culture" onClick={(e) => handleNavClick(e, '#culture')} className="hover:text-[#B79A62] transition-colors">
                    {t.nav.gunaYala}
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-[#B79A62] transition-colors">
                    {t.nav.about}
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-[#B79A62] transition-colors">
                    {t.nav.contact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="eyebrow-gold">
                {t.footer.directContact}
              </h3>

              <div className="space-y-1">
                <p className="text-xs text-[#F6F2E9]/60">{t.footer.phoneLabel}</p>
                <a
                  href="https://wa.me/50764217424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono font-bold text-lg text-[#F6F2E9] hover:text-[#B79A62] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#B79A62]" />
                  <span>+507 6421-7424</span>
                </a>
              </div>

              <div>
                <a
                  href="https://wa.me/50764217424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow"
                >
                  <MessageCircle className="w-4 h-4 fill-[#173642]" />
                  <span>WhatsApp: +507 6421-7424</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#B79A62]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6F2E9]/60">
            <p>© 2026 {t.footer.copyright}</p>
            <p className="text-[11px] font-mono text-[#B79A62]">{t.footer.legalNote}</p>
          </div>

        </div>
      </footer>
    </>
  );
};
