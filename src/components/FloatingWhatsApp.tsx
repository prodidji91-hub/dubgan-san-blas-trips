import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../translations/content';

interface FloatingWhatsAppProps {
  currentLang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ currentLang }) => {
  const defaultMsg = encodeURIComponent(
    currentLang === 'es'
      ? 'Hola Dubgan San Blas Trips, me gustaría consultar sobre un viaje a Guna Yala.'
      : 'Hello Dubgan San Blas Trips, I would like to inquire about a trip to Guna Yala.'
  );

  return (
    <a
      href={`https://wa.me/50761436120?text=${defaultMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#B79A62] hover:bg-[#a38752] text-[#102B35] px-4 py-3 rounded-none shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#102B35]"
      aria-label="WhatsApp direct contact"
    >
      <MessageCircle className="w-5 h-5 fill-[#102B35] text-[#B79A62] shrink-0" />
      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
        WhatsApp Us
      </span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B79A62] opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#397D80]" />
      </span>
    </a>
  );
};
