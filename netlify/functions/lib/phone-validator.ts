import parsePhoneNumberFromString from 'libphonenumber-js';

export function validateAndNormalizePhone(whatsappNumber: string): { success: boolean; e164?: string } {
  if (!whatsappNumber || typeof whatsappNumber !== 'string' || !whatsappNumber.trim()) {
    return { success: false };
  }

  const parsed = parsePhoneNumberFromString(whatsappNumber.trim());
  if (!parsed || !parsed.isValid()) {
    return { success: false };
  }

  return {
    success: true,
    e164: parsed.format('E.164'),
  };
}
