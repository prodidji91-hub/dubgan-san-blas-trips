import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';

interface FAQSectionProps {
  currentLang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ currentLang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = content[currentLang];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#F6F2E9] text-[#102B35] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <MolaAccent size="sm" />
            <p className="eyebrow-gold">{t.faq.eyebrow}</p>
            <MolaAccent size="sm" />
          </div>
          
          <h2 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#102B35]">
            {t.faq.title}
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {t.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#B79A62]/30 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-serif-editorial text-xl font-bold text-[#102B35] hover:text-[#B79A62] transition-colors focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B79A62] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-[#22252A]/85 leading-relaxed font-normal border-t border-[#F6F2E9]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
