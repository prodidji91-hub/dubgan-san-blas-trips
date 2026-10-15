import nodemailer from 'nodemailer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { BookingRecord } from './booking-store.js';

function renderWhatsAppHtml(rawNumber?: string): string {
  if (!rawNumber) return 'N/A';
  const parsed = parsePhoneNumberFromString(rawNumber.trim());
  if (parsed && parsed.isValid()) {
    const digits = parsed.number.replace('+', '');
    const escaped = escapeHtml(rawNumber);
    return `<a href="https://wa.me/${digits}">${escaped}</a>`;
  }
  return `<span style="color: #b91c1c; font-family: monospace;">⚠️ ${escapeHtml(rawNumber)} (Requiere código de país / Corrections needed)</span>`;
}

export interface EmailSendResult {
  success: boolean;
  disabled?: boolean;
  messageId?: string;
  recipient: string;
  errorReason?: string;
}

/**
 * Escapes HTML characters in untrusted user strings to prevent HTML injection in emails.
 */
export function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Creates Nodemailer Transporter using Gmail SMTP credentials from server environment variables.
 */
function createTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_APP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // TLS
    auth: {
      user: smtpUser.trim(),
      pass: smtpPass.trim(),
    },
  });
}

/**
 * Checks if external email sending is enabled via environment variable EMAIL_ENABLED.
 * Defaults to false for safe development.
 */
export function isEmailEnabled(): boolean {
  return process.env.EMAIL_ENABLED === 'true';
}

/**
 * Determines final recipient address, applying EMAIL_TEST_RECIPIENT override if defined.
 */
function getRecipient(requestedRecipient: string): string {
  const testOverride = process.env.EMAIL_TEST_RECIPIENT;
  if (testOverride && testOverride.trim()) {
    return testOverride.trim();
  }
  return requestedRecipient.trim();
}

/**
 * Sends notification email to Billy upon new cabin inquiry.
 */
export async function sendCabinRequestBillyNotification(
  booking: BookingRecord
): Promise<EmailSendResult> {
  const billyEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'victorinodio17@gmail.com';
  const targetRecipient = getRecipient(billyEmail);

  if (!isEmailEnabled()) {
    console.log(`[Email Service] EMAIL_ENABLED is false. Skipping Billy notification for ${booking.reference}`);
    return {
      success: true,
      disabled: true,
      recipient: targetRecipient,
      errorReason: 'EMAIL_ENABLED=false',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: 'MISSING_SMTP_CREDENTIALS: SMTP_USER or SMTP_APP_PASSWORD not set.',
    };
  }

  const siteUrl = process.env.SITE_URL || 'https://dubgan.netlify.app';
  const adminUrl = `${siteUrl.replace(/\/$/, '')}/admin/bookings`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #173642; background-color: #F6F2E9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #B79A62; padding: 30px;">
        <h2 style="color: #102B35; border-bottom: 2px solid #B79A62; padding-bottom: 10px; margin-top: 0;">
          🌴 Nueva Consulta de Cabaña Registrada
        </h2>
        <p style="font-size: 14px; color: #173642;">
          Hola Billy, se ha registrado una nueva solicitud de hospedaje en cabañas en el sitio web de Dubgan San Blas Trips.
        </p>

        <div style="background-color: #F6F2E9; border-left: 4px solid #B79A62; padding: 15px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 3px 0;"><strong>Código de Reserva:</strong> <span style="font-family: monospace; font-size: 14px; color: #102B35;">${escapeHtml(booking.reference)}</span></p>
          <p style="margin: 3px 0;"><strong>Paquete:</strong> ${escapeHtml(booking.tourTitleEs)}</p>
          <p style="margin: 3px 0;"><strong>Fecha de Llegada:</strong> ${escapeHtml(booking.date)}</p>
          <p style="margin: 3px 0;"><strong>Fecha de Salida Calculada:</strong> ${escapeHtml(booking.departureDate)} (${booking.nights} noches)</p>
          <p style="margin: 3px 0;"><strong>Cantidad de Viajeros:</strong> ${booking.guests} personas</p>
          <p style="margin: 3px 0;"><strong>Monto Total Calculado:</strong> $${booking.pricing.fullAmountUSD} USD</p>
        </div>

        <h3 style="color: #102B35; font-size: 15px; margin-top: 20px;">Datos del Cliente:</h3>
        <ul style="font-size: 13px; padding-left: 20px; color: #173642;">
          <li><strong>Nombre Completo:</strong> ${escapeHtml(booking.customer.fullName)}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${escapeHtml(booking.customer.email)}">${escapeHtml(booking.customer.email)}</a></li>
          <li><strong>WhatsApp:</strong> ${renderWhatsAppHtml(booking.customer.whatsappNumber)}</li>
          <li><strong>Hotel de Recogida:</strong> ${escapeHtml(booking.customer.pickupHotel)}</li>
          ${booking.customer.message ? `<li><strong>Mensaje / Nota:</strong> "${escapeHtml(booking.customer.message)}"</li>` : ''}
        </ul>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #EDE5D7;">
          <a href="${adminUrl}" style="background-color: #102B35; color: #F6F2E9; text-decoration: none; padding: 12px 25px; font-weight: bold; font-size: 13px; display: inline-block; border: 1px solid #B79A62;">
            Aprobar o Revisar en Panel de Administración
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const smtpUser = process.env.SMTP_USER!;
    const info = await transporter.sendMail({
      from: `"Dubgan San Blas Trips" <${smtpUser.trim()}>`,
      to: targetRecipient,
      subject: `[NUEVA SOLICITUD DE CABAÑA] - Ref: ${booking.reference} (${booking.customer.fullName})`,
      html: htmlContent,
    });

    return {
      success: true,
      recipient: targetRecipient,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service] Error sending Billy notification:`, err);
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: err?.message || String(err),
    };
  }
}

/**
 * Sends acknowledgement email to customer upon saving cabin request (pending availability).
 */
export async function sendCabinRequestCustomerAcknowledgement(
  booking: BookingRecord
): Promise<EmailSendResult> {
  const targetRecipient = getRecipient(booking.customer.email);

  if (!isEmailEnabled()) {
    console.log(`[Email Service] EMAIL_ENABLED is false. Skipping customer acknowledgement for ${booking.reference}`);
    return {
      success: true,
      disabled: true,
      recipient: targetRecipient,
      errorReason: 'EMAIL_ENABLED=false',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: 'MISSING_SMTP_CREDENTIALS: SMTP_USER or SMTP_APP_PASSWORD not set.',
    };
  }

  const isEs = booking.language === 'es';

  const subject = isEs
    ? `Recibimos tu solicitud de cabaña - Dubgan San Blas Trips (Ref: ${booking.reference})`
    : `We received your cabin inquiry - Dubgan San Blas Trips (Ref: ${booking.reference})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #173642; background-color: #F6F2E9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #B79A62; padding: 30px;">
        <h2 style="color: #102B35; border-bottom: 2px solid #B79A62; padding-bottom: 10px; margin-top: 0;">
          🌴 Dubgan San Blas Trips
        </h2>

        <p style="font-size: 14px; font-weight: bold; color: #102B35;">
          ${isEs ? `Hola ${escapeHtml(booking.customer.fullName)},` : `Hello ${escapeHtml(booking.customer.fullName)},`}
        </p>

        <p style="font-size: 14px; color: #173642;">
          ${
            isEs
              ? `Hemos recibido exitosamente tu consulta de hospedaje en cabañas. Queremos informarte que <strong>la disponibilidad de la cabaña está actualmente PENDIENTE de verificación</strong> con nuestra comunidad local en Guna Yala.`
              : `We have successfully received your cabin accommodation inquiry. Please note that <strong>cabin availability is currently PENDING verification</strong> with our local team in Guna Yala.`
          }
        </p>

        <div style="background-color: #102B35; color: #F6F2E9; padding: 15px; margin: 20px 0; border-left: 4px solid #B79A62; font-size: 13px;">
          <p style="margin: 0; font-weight: bold; color: #B79A62; font-size: 12px; text-transform: uppercase;">
            ${isEs ? '⚠️ AVISO IMPORTANTE SOBRE TU RESERVA' : '⚠️ IMPORTANT NOTICE ABOUT YOUR RESERVATION'}
          </p>
          <p style="margin: 8px 0 0 0; line-height: 1.5;">
            ${
              isEs
                ? `Esta solicitud <strong>NO constituye una reserva confirmada ni se ha realizado ningún cargo</strong>. Tan pronto Billy confirme la disponibilidad de las cabañas para tus fechas, te enviaremos por correo y WhatsApp tu enlace seguro de pago de PagueloFacil.`
                : `This inquiry <strong>is NOT a confirmed reservation and no payment has been taken</strong>. As soon as Billy confirms cabin availability for your dates, we will send you your secure PagueloFacil payment link by email and WhatsApp.`
            }
          </p>
        </div>

        <h3 style="color: #102B35; font-size: 15px; margin-top: 20px;">
          ${isEs ? 'Resumen de la Solicitud:' : 'Inquiry Summary:'}
        </h3>

        <div style="background-color: #F6F2E9; padding: 15px; font-size: 13px; border: 1px solid #EDE5D7;">
          <p style="margin: 3px 0;"><strong>${isEs ? 'Código de Referencia:' : 'Reference Code:'}</strong> <span style="font-family: monospace; font-size: 14px; color: #102B35;">${escapeHtml(booking.reference)}</span></p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Paquete Solicitado:' : 'Requested Package:'}</strong> ${escapeHtml(isEs ? booking.tourTitleEs : booking.tourTitleEn)}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Fecha de Llegada:' : 'Arrival Date:'}</strong> ${escapeHtml(booking.date)}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Fecha de Salida Calculada:' : 'Calculated Departure:'}</strong> ${escapeHtml(booking.departureDate)} (${booking.nights} ${isEs ? 'noches' : 'nights'})</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Cantidad de Viajeros:' : 'Party Size:'}</strong> ${booking.guests} ${booking.guests === 1 ? (isEs ? 'persona' : 'guest') : (isEs ? 'personas' : 'guests')}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Monto Total Estimado:' : 'Estimated Full Amount:'}</strong> $${booking.pricing.fullAmountUSD} USD</p>
        </div>

        <p style="font-size: 13px; color: #173642; margin-top: 25px;">
          ${
            isEs
              ? `Si tienes alguna duda o deseas atención inmediata, puedes contactar a Billy directamente por WhatsApp al <strong>+507 6421-7424</strong> indicando tu código de referencia.`
              : `If you have any questions or require immediate assistance, you can contact Billy directly on WhatsApp at <strong>+507 6421-7424</strong> with your reference code.`
          }
        </p>

        <p style="font-size: 12px; color: #102B35; font-weight: bold; margin-top: 30px; border-top: 1px solid #EDE5D7; padding-top: 15px;">
          Dubgan San Blas Trips — Guna Yala, Panamá
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const smtpUser = process.env.SMTP_USER!;
    const info = await transporter.sendMail({
      from: `"Dubgan San Blas Trips" <${smtpUser.trim()}>`,
      to: targetRecipient,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      recipient: targetRecipient,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service] Error sending customer acknowledgement:`, err);
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: err?.message || String(err),
    };
  }
}

/**
 * Sends payment link email to customer after Billy approves availability.
 */
export async function sendCabinApprovalPaymentLink(
  booking: BookingRecord
): Promise<EmailSendResult> {
  const targetRecipient = getRecipient(booking.customer.email);

  if (!isEmailEnabled()) {
    console.log(`[Email Service] EMAIL_ENABLED is false. Skipping payment link email for ${booking.reference}`);
    return {
      success: true,
      disabled: true,
      recipient: targetRecipient,
      errorReason: 'EMAIL_ENABLED=false',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: 'MISSING_SMTP_CREDENTIALS: SMTP_USER or SMTP_APP_PASSWORD not set.',
    };
  }

  const checkoutUrl = booking.checkoutDetails?.checkoutUrl || '';
  const isEs = booking.language === 'es';

  const subject = isEs
    ? `¡Cabaña disponible! Enlace de pago para tu reserva - Dubgan San Blas Trips (Ref: ${booking.reference})`
    : `Cabin available! Payment link for your booking - Dubgan San Blas Trips (Ref: ${booking.reference})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #173642; background-color: #F6F2E9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #B79A62; padding: 30px;">
        <h2 style="color: #102B35; border-bottom: 2px solid #B79A62; padding-bottom: 10px; margin-top: 0;">
          🌴 ¡Disponibilidad Confirmada en Guna Yala!
        </h2>

        <p style="font-size: 14px; font-weight: bold; color: #102B35;">
          ${isEs ? `Hola ${escapeHtml(booking.customer.fullName)},` : `Hello ${escapeHtml(booking.customer.fullName)},`}
        </p>

        <p style="font-size: 14px; color: #173642;">
          ${
            isEs
              ? `¡Excelentes noticias! Billy y el equipo de Dubgan San Blas Trips han verificado y <strong>confirmado la disponibilidad de cabaña</strong> para tu viaje del <strong>${escapeHtml(booking.date)} al ${escapeHtml(booking.departureDate)}</strong>.`
              : `Great news! Billy and the Dubgan San Blas Trips team have verified and <strong>confirmed cabin availability</strong> for your trip from <strong>${escapeHtml(booking.date)} to ${escapeHtml(booking.departureDate)}</strong>.`
          }
        </p>

        <div style="background-color: #F6F2E9; padding: 20px; margin: 20px 0; border: 1px solid #B79A62; text-align: center;">
          <p style="font-size: 13px; color: #173642; margin-top: 0;">
            ${
              isEs
                ? `Para asegurar tu reserva, por favor realiza el pago del monto total ($${booking.pricing.fullAmountUSD} USD) mediante nuestro portal seguro de PagueloFacil:`
                : `To confirm your reservation, please complete payment for the full amount ($${booking.pricing.fullAmountUSD} USD) via our secure PagueloFacil portal:`
            }
          </p>

          ${
            checkoutUrl
              ? `<a href="${checkoutUrl}" style="background-color: #B79A62; color: #102B35; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 14px; display: inline-block; margin: 15px 0; border: 1px solid #102B35; text-transform: uppercase;">
                  ${isEs ? 'PAGAR AHORA CON PAGUELOFACIL' : 'PAY NOW WITH PAGUELOFACIL'}
                </a>
                <p style="font-size: 11px; color: #173642; word-break: break-all; margin-bottom: 0;">
                  ${checkoutUrl}
                </p>`
              : `<p style="color: #D96848; font-weight: bold; font-size: 13px;">${isEs ? 'Enlace de pago en preparación.' : 'Payment link in preparation.'}</p>`
          }
        </div>

        <div style="background-color: #102B35; color: #F6F2E9; padding: 12px 15px; font-size: 12px; border-left: 4px solid #B79A62;">
          <p style="margin: 0; font-weight: bold; color: #B79A62;">
            ${isEs ? 'ℹ️ REQUISITO DE PAGO' : 'ℹ️ PAYMENT REQUIREMENT'}
          </p>
          <p style="margin: 5px 0 0 0; line-height: 1.4;">
            ${
              isEs
                ? `El pago del monto completo es requerido para garantizar el hospedaje. Una vez completado el pago, tu reserva quedará oficialmente confirmada.`
                : `Full payment is required to guarantee accommodation. Once payment is completed, your reservation will be officially confirmed.`
            }
          </p>
        </div>

        <h3 style="color: #102B35; font-size: 15px; margin-top: 25px;">
          ${isEs ? 'Detalles de la Reserva:' : 'Booking Details:'}
        </h3>

        <div style="background-color: #F6F2E9; padding: 15px; font-size: 13px; border: 1px solid #EDE5D7;">
          <p style="margin: 3px 0;"><strong>${isEs ? 'Código de Reserva:' : 'Booking Reference:'}</strong> <span style="font-family: monospace; font-size: 14px; color: #102B35;">${escapeHtml(booking.reference)}</span></p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Paquete:' : 'Package:'}</strong> ${escapeHtml(isEs ? booking.tourTitleEs : booking.tourTitleEn)}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Llegada:' : 'Arrival:'}</strong> ${escapeHtml(booking.date)}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Salida:' : 'Departure:'}</strong> ${escapeHtml(booking.departureDate)} (${booking.nights} ${isEs ? 'noches' : 'nights'})</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Viajeros:' : 'Party Size:'}</strong> ${booking.guests} ${booking.guests === 1 ? (isEs ? 'persona' : 'guest') : (isEs ? 'personas' : 'guests')}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Hotel de Recogida:' : 'Pickup Hotel:'}</strong> ${escapeHtml(booking.customer.pickupHotel)}</p>
          <p style="margin: 3px 0; font-size: 14px; font-weight: bold; color: #B79A62;"><strong>${isEs ? 'Monto Total:' : 'Full Amount:'}</strong> $${booking.pricing.fullAmountUSD} USD</p>
        </div>

        <p style="font-size: 12px; color: #102B35; font-weight: bold; margin-top: 30px; border-top: 1px solid #EDE5D7; padding-top: 15px;">
          Dubgan San Blas Trips — Guna Yala, Panamá (+507 6421-7424)
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const smtpUser = process.env.SMTP_USER!;
    const info = await transporter.sendMail({
      from: `"Dubgan San Blas Trips" <${smtpUser.trim()}>`,
      to: targetRecipient,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      recipient: targetRecipient,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service] Error sending payment link email:`, err);
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: err?.message || String(err),
    };
  }
}

/**
 * Sends payment confirmation email to customer after a verified PagueloFacil transaction.
 */
export async function sendPaymentConfirmationCustomerEmail(
  booking: BookingRecord
): Promise<EmailSendResult> {
  const targetRecipient = getRecipient(booking.customer.email);

  if (!isEmailEnabled()) {
    console.log(`[Email Service] EMAIL_ENABLED is false. Skipping customer payment confirmation for ${booking.reference}`);
    return {
      success: true,
      disabled: true,
      recipient: targetRecipient,
      errorReason: 'EMAIL_ENABLED=false',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: 'MISSING_SMTP_CREDENTIALS: SMTP_USER or SMTP_APP_PASSWORD not set.',
    };
  }

  const isEs = booking.language === 'es';
  const amountPaid = booking.paymentDetails?.amountPaidUSD || booking.pricing.fullAmountUSD;

  const subject = isEs
    ? `¡Pago Confirmado! Tu reserva en Dubgan San Blas Trips (Ref: ${booking.reference})`
    : `Payment Confirmed! Your Dubgan San Blas Trips reservation (Ref: ${booking.reference})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #173642; background-color: #F6F2E9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #B79A62; padding: 30px;">
        <h2 style="color: #102B35; border-bottom: 2px solid #B79A62; padding-bottom: 10px; margin-top: 0;">
          🌴 ¡Pago Recibido y Reserva Confirmada!
        </h2>

        <p style="font-size: 14px; font-weight: bold; color: #102B35;">
          ${isEs ? `Hola ${escapeHtml(booking.customer.fullName)},` : `Hello ${escapeHtml(booking.customer.fullName)},`}
        </p>

        <p style="font-size: 14px; color: #173642;">
          ${
            isEs
              ? `Hemos recibido exitosamente el pago de tu viaje con Dubgan San Blas Trips. ¡Tu reserva está oficialmente <strong>CONFIRMADA</strong>!`
              : `We have successfully received payment for your trip with Dubgan San Blas Trips. Your reservation is officially <strong>CONFIRMED</strong>!`
          }
        </p>

        <div style="background-color: #F6F2E9; border-left: 4px solid #28A745; padding: 15px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 3px 0;"><strong>${isEs ? 'Código de Reserva:' : 'Booking Reference:'}</strong> <span style="font-family: monospace; font-size: 14px; color: #102B35;">${escapeHtml(booking.reference)}</span></p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Tour / Paquete:' : 'Tour / Package:'}</strong> ${escapeHtml(isEs ? booking.tourTitleEs : booking.tourTitleEn)}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Fecha de Viaje:' : 'Travel Date:'}</strong> ${escapeHtml(booking.date)}${booking.departureDate ? ` ${isEs ? 'al' : 'to'} ${escapeHtml(booking.departureDate)}` : ''}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Viajeros:' : 'Guests:'}</strong> ${booking.guests} ${booking.guests === 1 ? (isEs ? 'persona' : 'guest') : (isEs ? 'personas' : 'guests')}</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Monto Pagado:' : 'Amount Paid:'}</strong> $${amountPaid} USD</p>
          <p style="margin: 3px 0;"><strong>${isEs ? 'Hotel / Punto de Recogida:' : 'Pickup Hotel:'}</strong> ${escapeHtml(booking.customer.pickupHotel)}</p>
        </div>

        <h3 style="color: #102B35; font-size: 15px; margin-top: 20px;">
          ${isEs ? 'Información de Contacto Guardada:' : 'Contact Information Saved:'}
        </h3>
        <ul style="font-size: 13px; padding-left: 20px; color: #173642;">
          <li><strong>${isEs ? 'Nombre:' : 'Name:'}</strong> ${escapeHtml(booking.customer.fullName)}</li>
          <li><strong>${isEs ? 'Correo Electrónico:' : 'Email:'}</strong> ${escapeHtml(booking.customer.email)}</li>
          <li><strong>WhatsApp:</strong> ${renderWhatsAppHtml(booking.customer.whatsappNumber)}</li>
        </ul>

        <p style="font-size: 13px; color: #173642; margin-top: 25px;">
          ${
            isEs
              ? `Billy y nuestro equipo local se pondrán en contacto contigo por WhatsApp antes de tu viaje para coordinar la hora exacta de recogida en tu hotel.`
              : `Billy and our local team will get in touch with you via WhatsApp prior to your trip to coordinate exact hotel pickup arrangements.`
          }
        </p>

        <p style="font-size: 12px; color: #102B35; font-weight: bold; margin-top: 30px; border-top: 1px solid #EDE5D7; padding-top: 15px;">
          Dubgan San Blas Trips — Guna Yala, Panamá (+507 6421-7424)
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const smtpUser = process.env.SMTP_USER!;
    const info = await transporter.sendMail({
      from: `"Dubgan San Blas Trips" <${smtpUser.trim()}>`,
      to: targetRecipient,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      recipient: targetRecipient,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service] Error sending customer payment confirmation:`, err);
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: err?.message || String(err),
    };
  }
}

/**
 * Sends payment notification email to Billy after a verified PagueloFacil payment.
 */
export async function sendPaymentConfirmationBillyNotification(
  booking: BookingRecord
): Promise<EmailSendResult> {
  const billyEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'victorinodio17@gmail.com';
  const targetRecipient = getRecipient(billyEmail);

  if (!isEmailEnabled()) {
    console.log(`[Email Service] EMAIL_ENABLED is false. Skipping Billy payment notification for ${booking.reference}`);
    return {
      success: true,
      disabled: true,
      recipient: targetRecipient,
      errorReason: 'EMAIL_ENABLED=false',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: 'MISSING_SMTP_CREDENTIALS: SMTP_USER or SMTP_APP_PASSWORD not set.',
    };
  }

  const siteUrl = process.env.SITE_URL || 'https://dubgan.netlify.app';
  const adminUrl = `${siteUrl.replace(/\/$/, '')}/admin/bookings`;
  const amountPaid = booking.paymentDetails?.amountPaidUSD || booking.pricing.fullAmountUSD;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #173642; background-color: #F6F2E9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #28A745; padding: 30px;">
        <h2 style="color: #102B35; border-bottom: 2px solid #28A745; padding-bottom: 10px; margin-top: 0;">
          💰 ¡Pago Confirmado Recibido!
        </h2>
        <p style="font-size: 14px; color: #173642;">
          Hola Billy, se ha verificado exitosamente un pago en PagueloFacil para la reserva de Dubgan San Blas Trips.
        </p>

        <div style="background-color: #F6F2E9; border-left: 4px solid #28A745; padding: 15px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 3px 0;"><strong>Código de Reserva:</strong> <span style="font-family: monospace; font-size: 14px; color: #102B35;">${escapeHtml(booking.reference)}</span></p>
          <p style="margin: 3px 0;"><strong>Tour / Paquete:</strong> ${escapeHtml(booking.tourTitleEs)}</p>
          <p style="margin: 3px 0;"><strong>Fecha de Viaje:</strong> ${escapeHtml(booking.date)}${booking.departureDate ? ` al ${escapeHtml(booking.departureDate)}` : ''}</p>
          <p style="margin: 3px 0;"><strong>Viajeros:</strong> ${booking.guests} personas</p>
          <p style="margin: 3px 0; font-size: 14px; font-weight: bold; color: #28A745;"><strong>Monto Pagado:</strong> $${amountPaid} USD</p>
          ${booking.paymentDetails?.providerTxId ? `<p style="margin: 3px 0;"><strong>ID de Transacción PagueloFacil:</strong> ${escapeHtml(booking.paymentDetails.providerTxId)}</p>` : ''}
        </div>

        <h3 style="color: #102B35; font-size: 15px; margin-top: 20px;">Datos del Cliente:</h3>
        <ul style="font-size: 13px; padding-left: 20px; color: #173642;">
          <li><strong>Nombre Completo:</strong> ${escapeHtml(booking.customer.fullName)}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${escapeHtml(booking.customer.email)}">${escapeHtml(booking.customer.email)}</a></li>
          <li><strong>WhatsApp:</strong> ${renderWhatsAppHtml(booking.customer.whatsappNumber)}</li>
          <li><strong>Hotel de Recogida:</strong> ${escapeHtml(booking.customer.pickupHotel)}</li>
          ${booking.customer.message ? `<li><strong>Mensaje / Nota:</strong> "${escapeHtml(booking.customer.message)}"</li>` : ''}
        </ul>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #EDE5D7;">
          <a href="${adminUrl}" style="background-color: #102B35; color: #F6F2E9; text-decoration: none; padding: 12px 25px; font-weight: bold; font-size: 13px; display: inline-block; border: 1px solid #B79A62;">
            Ver Reserva en Panel de Administración
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const smtpUser = process.env.SMTP_USER!;
    const info = await transporter.sendMail({
      from: `"Dubgan San Blas Trips" <${smtpUser.trim()}>`,
      to: targetRecipient,
      subject: `[PAGO CONFIRMADO] - Ref: ${booking.reference} (${booking.customer.fullName})`,
      html: htmlContent,
    });

    return {
      success: true,
      recipient: targetRecipient,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[Email Service] Error sending Billy payment confirmation notification:`, err);
    return {
      success: false,
      recipient: targetRecipient,
      errorReason: err?.message || String(err),
    };
  }
}

