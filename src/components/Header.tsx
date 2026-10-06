import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { images } from '../pictures/images';
import { Language, content } from '../translations/content';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: t.nav.home },
    { href: '#map', label: currentLang === 'es' ? 'Mapa' : 'Island Map' },
    { href: '#tours', label: t.nav.tours },
    { href: '#culture', label: t.nav.gunaYala },
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F6F2E9]/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-[#B79A62]/30'
          : 'bg-gradient-to-b from-[#173642]/75 via-[#173642]/30 to-transparent py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Area */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3.5 sm:gap-4 group focus:outline-none"
          >
            <div className="relative h-13 sm:h-15 md:h-16 w-auto shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src={images.logo.src}
                alt={currentLang === 'es' ? images.logo.altEs : images.logo.altEn}
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span
                className={`font-brand-marcellus text-2xl sm:text-3xl font-medium tracking-wider leading-none transition-colors duration-300 ${
                  isScrolled ? 'text-[#173642]' : 'text-[#F6F2E9]'
                }`}
              >
                DUBGAN
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#B79A62] tracking-[0.28em] uppercase mt-1">
                SAN BLAS TRIPS
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
              isScrolled ? 'text-[#173642]' : 'text-[#F6F2E9]/95'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-[#B79A62] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B79A62] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: EN | ES Selector & Gold WhatsApp Button */}
          <div className="hidden sm:flex items-center gap-5">
            
            {/* Language Toggle Selector */}
            <div
              className={`flex items-center gap-1.5 text-xs font-bold tracking-widest transition-colors duration-300 ${
                isScrolled ? 'text-[#173642]' : 'text-[#F6F2E9]'
              }`}
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 transition-colors ${
                  currentLang === 'en' ? 'text-[#B79A62] border-b-2 border-[#B79A62]' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label="Switch language to English"
              >
                EN
              </button>
              <span className="opacity-30">|</span>
              <button
                type="button"
                onClick={() => onLanguageChange('es')}
                className={`px-2 py-1 transition-colors ${
                  currentLang === 'es' ? 'text-[#B79A62] border-b-2 border-[#B79A62]' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label="Cambiar idioma a Español"
              >
                ES
              </button>
            </div>

            {/* Gold WhatsApp CTA Button */}
            <a
              href="https://wa.me/50761436120"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] px-4 py-2.5 rounded-none text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#173642]" />
              <span>+507 6143-6120</span>
            </a>

          </div>

          {/* Mobile Menu Icon Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => onLanguageChange(currentLang === 'en' ? 'es' : 'en')}
                className="px-2 py-1 text-[#B79A62] border border-[#B79A62]/50 rounded text-[11px] font-bold"
              >
                {currentLang === 'en' ? 'ES 🇵🇦' : 'EN 🇺🇸'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors focus:outline-none ${
                isScrolled ? 'text-[#173642] hover:text-[#B79A62]' : 'text-[#F6F2E9] hover:text-[#B79A62]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6F2E9] border-b border-[#B79A62]/40 px-6 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 text-[#173642]">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[#173642] hover:text-[#B79A62] font-bold text-sm uppercase tracking-wider py-1 border-b border-[#B79A62]/10"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-[#173642]/80 pt-2">
              <span>Language:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-1 text-xs font-bold ${
                    currentLang === 'en' ? 'bg-[#B79A62] text-[#173642]' : 'border border-[#B79A62]/40 text-[#173642]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('es')}
                  className={`px-3 py-1 text-xs font-bold ${
                    currentLang === 'es' ? 'bg-[#B79A62] text-[#173642]' : 'border border-[#B79A62]/40 text-[#173642]'
                  }`}
                >
                  ES
                </button>
              </div>
            </div>

            <a
              href="https://wa.me/50761436120"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#B79A62] text-[#173642] py-3 text-xs font-bold uppercase tracking-wider shadow"
            >
              <MessageCircle className="w-4 h-4 fill-[#173642]" />
              <span>WhatsApp: +507 6143-6120</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
