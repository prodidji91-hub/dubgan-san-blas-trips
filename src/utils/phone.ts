import parsePhoneNumberFromString from 'libphonenumber-js';

export const COUNTRY_CODES = [
  { code: '+507', country: 'Panamá 🇵🇦' },
  { code: '+1', country: 'United States / Canada 🇺🇸/🇨🇦' },
  { code: '+57', country: 'Colombia 🇨🇴' },
  { code: '+52', country: 'México 🇲🇽' },
  { code: '+34', country: 'España 🇪🇸' },
  { code: '+44', country: 'United Kingdom 🇬🇧' },
  { code: '+33', country: 'France 🇫🇷' },
  { code: '+49', country: 'Germany 🇩🇪' },
  { code: '+506', country: 'Costa Rica 🇨🇷' },
  { code: '+54', country: 'Argentina 🇦🇷' },
  { code: '+56', country: 'Chile 🇨🇱' },
  { code: '+55', country: 'Brasil 🇧🇷' },
  { code: '+51', country: 'Perú 🇵🇪' },
  { code: '+593', country: 'Ecuador 🇪🇨' },
  { code: '+39', country: 'Italia 🇮🇹' },
  { code: '+41', country: 'Switzerland 🇨🇭' },
];

export function validateAndFormatWhatsApp(countryCode: string, localNumber: string): { success: boolean; e164?: string; errorEs?: string; errorEn?: string } {
  const trimmedLocal = localNumber.trim();
  if (!trimmedLocal) {
    return {
      success: false,
      errorEs: 'El número de WhatsApp es requerido.',
      errorEn: 'WhatsApp phone number is required.',
    };
  }

  const full = trimmedLocal.startsWith('+') ? trimmedLocal : `${countryCode} ${trimmedLocal}`;
  const parsed = parsePhoneNumberFromString(full);

  if (!parsed || !parsed.isValid()) {
    return {
      success: false,
      errorEs: 'Número de WhatsApp no válido. Por favor verifica el código de país y el número.',
      errorEn: 'Invalid WhatsApp phone number. Please check the country code and number.',
    };
  }

  return {
    success: true,
    e164: parsed.format('E.164'),
  };
}

export function getWhatsAppDisplayInfo(rawNumber?: string, language: 'es' | 'en' = 'es') {
  if (!rawNumber) {
    return {
      valid: false,
      display: 'N/A',
      waDigits: '',
      warning: language === 'es' ? 'Sin número' : 'No number',
    };
  }

  const parsed = parsePhoneNumberFromString(rawNumber.trim());
  if (parsed && parsed.isValid()) {
    return {
      valid: true,
      display: rawNumber,
      waDigits: parsed.number.replace('+', ''),
      warning: null,
    };
  }

  return {
    valid: false,
    display: rawNumber,
    waDigits: '',
    warning: language === 'es' ? 'Número sin código de país o incompleto (requiere corrección)' : 'Number lacks country code or incomplete (requires correction)',
  };
}
