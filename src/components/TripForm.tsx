import React, { useState } from 'react';
import { MessageCircle, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language, content } from '../translations/content';
import { MolaAccent } from './MolaAccent';
import { MolaBorderLight } from './MolaBorderLight';

interface TripFormProps {
  currentLang: Language;
}

export const TripForm: React.FC<TripFormProps> = ({ currentLang }) => {
  const t = content[currentLang];

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    travelers: '',
    tour: '',
    message: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.date.trim() || !formData.travelers.trim()) {
      setErrorMsg(
        currentLang === 'es'
          ? 'Por favor completa los campos requeridos (*).'
          : 'Please complete all required fields (*).'
      );
      return;
    }

    const selectedTourName = formData.tour
      ? formData.tour
      : currentLang === 'es'
      ? 'Consulta General'
      : 'General Inquiry';

    const messageLines = [
      currentLang === 'es'
        ? `🌴 *NUEVA CONSULTA - DUBGAN SAN BLAS TRIPS*`
        : `🌴 *NEW INQUIRY - DUBGAN SAN BLAS TRIPS*`,
      ``,
      `👤 *${currentLang === 'es' ? 'Nombre' : 'Name'}:* ${formData.name}`,
      `📅 *${currentLang === 'es' ? 'Fecha' : 'Date'}:* ${formData.date}`,
      `👥 *${currentLang === 'es' ? 'Viajeros' : 'Travelers'}:* ${formData.travelers}`,
      `⛵ *${currentLang === 'es' ? 'Experiencia' : 'Experience'}:* ${selectedTourName}`,
      formData.message.trim()
        ? `💬 *${currentLang === 'es' ? 'Mensaje' : 'Message'}:* ${formData.message}`
        : null,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/50761436120?text=${encodeURIComponent(messageLines)}`;

    setSuccessMsg(true);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setSuccessMsg(false);
    }, 800);
  };

  return (
    <section id="contact" className="py-0 bg-[#F6F2E9] text-[#173642] relative">
      
      {/* Light Cultural Border Above Booking Section */}
      <MolaBorderLight />

      <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white border-2 border-[#B79A62]/40 p-8 sm:p-14 shadow-xl space-y-8 relative">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="eyebrow-gold">{t.form.eyebrow}</p>
              <MolaAccent size="sm" />
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#173642]">
              {t.form.title}
            </h2>
            <div className="gold-divider" />
            <p className="text-sm sm:text-base text-[#173642]/80 font-normal">
              {t.form.subtitle}
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="flex items-center gap-3 bg-[#D96848]/10 border border-[#D96848] text-[#173642] p-4 text-xs font-bold tracking-wider">
              <AlertCircle className="w-5 h-5 text-[#D96848] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 bg-[#397D80]/20 border border-[#397D80] text-[#173642] p-4 text-xs font-bold tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-[#397D80] shrink-0" />
              <span>{currentLang === 'es' ? 'Abriendo WhatsApp...' : 'Opening WhatsApp...'}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.form.namePlaceholder}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.dateLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder={t.form.datePlaceholder}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.travelersLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  placeholder={t.form.travelersPlaceholder}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                  {t.form.tourLabel}
                </label>
                <select
                  value={formData.tour}
                  onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] focus:outline-none focus:border-[#B79A62] text-sm font-medium"
                >
                  <option value="">{t.form.tourDefault}</option>
                  <option value="San Blas Private Full Day ($850)">
                    {currentLang === 'es'
                      ? 'San Blas Private Full Day ($850 hasta 3 personas)'
                      : 'San Blas Private Full Day ($850 up to 3 people)'}
                  </option>
                  <option value="San Blas Shared Full Day ($135)">
                    {currentLang === 'es'
                      ? 'Full Day en San Blas - Compartido ($135 por persona)'
                      : 'Full Day in San Blas - Shared ($135 per person)'}
                  </option>
                  <option value="Island Hopping — 2 Nights ($265)">
                    {currentLang === 'es'
                      ? 'Island Hopping — 2 noches ($265 por persona)'
                      : 'Island Hopping — 2 Nights ($265 per person)'}
                  </option>
                  <option value="Island Hopping — 3 Nights ($355)">
                    {currentLang === 'es'
                      ? 'Island Hopping — 3 noches ($355 por persona)'
                      : 'Island Hopping — 3 Nights ($355 per person)'}
                  </option>
                  <option value="General Inquiry">
                    {currentLang === 'es' ? 'Consulta General' : 'General Inquiry'}
                  </option>
                </select>
              </div>

            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#B79A62]">
                {t.form.messageLabel}
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t.form.messagePlaceholder}
                className="w-full px-4 py-3 bg-[#F6F2E9] border border-[#B79A62]/40 text-[#173642] placeholder-[#173642]/40 focus:outline-none focus:border-[#B79A62] text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-[#B79A62] hover:bg-[#a38752] text-[#173642] py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-[#173642]" />
              <span>{t.form.btnSubmit}</span>
              <Send className="w-3.5 h-3.5" />
            </button>

          </form>

          {/* Prompt Required Notice */}
          <div className="pt-4 border-t border-[#B79A62]/20 text-center">
            <p className="text-xs text-[#173642]/70 font-serif-editorial text-sm">
              ℹ️ {t.form.notice}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
