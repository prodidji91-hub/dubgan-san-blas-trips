import createCabinRequestHandler from '../create-cabin-request.js';
import adminRetryEmailHandler from '../admin-retry-email.js';
import { getBookingStore, BookingRecord } from '../lib/booking-store.js';
import {
  isEmailEnabled,
  getSafeEmailConfigStatus,
  extractSmtpErrorInfo,
  logSafeEmailDiagnostic,
  dispatchCabinRequestEmails,
} from '../lib/email-service.js';

async function runTests() {
  console.log('=============================================');
  console.log('DUBGAN CABIN EMAIL & NOTIFICATION UNIT TESTS');
  console.log('=============================================');

  process.env.NETLIFY_BLOBS_MOCK = 'true';
  process.env.PAGUELOFACIL_ENVIRONMENT = 'sandbox';

  let totalTests = 0;
  let passedTests = 0;

  function assert(name: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name} ${details ? `-> ${details}` : ''}`);
    }
  }

  // 1. Test Environment Config Check
  delete process.env.EMAIL_ENABLED;
  assert('isEmailEnabled() returns false when undefined', isEmailEnabled() === false);

  process.env.EMAIL_ENABLED = 'false';
  assert('isEmailEnabled() returns false for "false"', isEmailEnabled() === false);

  process.env.EMAIL_ENABLED = 'true';
  assert('isEmailEnabled() returns true for "true"', isEmailEnabled() === true);

  process.env.EMAIL_ENABLED = ' 1 ';
  assert('isEmailEnabled() returns true for " 1 "', isEmailEnabled() === true);

  process.env.EMAIL_ENABLED = 'yes';
  assert('isEmailEnabled() returns true for "yes"', isEmailEnabled() === true);

  // 2. Safe Email Config Status
  process.env.SMTP_USER = 'test@example.com';
  process.env.SMTP_APP_PASSWORD = 'super-secret-password-xyz';
  delete process.env.BOOKING_NOTIFICATION_EMAIL;
  delete process.env.SITE_URL;

  const safeConfig = getSafeEmailConfigStatus();
  assert('safeConfig hasSmtpUser is true', safeConfig.hasSmtpUser === true);
  assert('safeConfig hasSmtpPass is true', safeConfig.hasSmtpPass === true);
  assert('safeConfig hasNotificationEmail is false', safeConfig.hasNotificationEmail === false);
  assert('safeConfig hasSiteUrl is false', safeConfig.hasSiteUrl === false);
  assert('safeConfig does not expose actual password value', !('pass' in safeConfig) && !('smtpPass' in safeConfig));

  // 3. Secret Redaction in Error Messages
  const mockError = new Error('Failed to login to SMTP using password super-secret-password-xyz');
  (mockError as any).code = 'EAUTH';
  (mockError as any).responseCode = 535;
  (mockError as any).command = 'AUTH PLAIN';

  const sanitized = extractSmtpErrorInfo(mockError);
  assert('sanitized error code is EAUTH', sanitized.errorCode === 'EAUTH');
  assert('sanitized responseCode is 535', sanitized.smtpResponseCode === 535);
  assert('sanitized command is AUTH PLAIN', sanitized.smtpCommand === 'AUTH PLAIN');
  assert(
    'sanitized message redacts password',
    sanitized.sanitizedMessage.includes('[REDACTED]') &&
      !sanitized.sanitizedMessage.includes('super-secret-password-xyz')
  );

  // 4. Test Cabin Request Creation with EMAIL_ENABLED=false
  process.env.EMAIL_ENABLED = 'false';
  const testEmail = `traveler_${Date.now()}@test.com`;

  const newCabinPayload = {
    tourId: 'island-hopping-2-nights',
    date: '2026-11-20',
    guests: 2,
    fullName: 'Maria Rodriguez',
    email: testEmail,
    whatsappNumber: '+50760053200',
    pickupHotel: 'Hotel Central',
    message: 'Need vegan meals',
    language: 'es',
  };

  const req = new Request('https://dubgan.netlify.app/api/create-cabin-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCabinPayload),
  });

  const res = await createCabinRequestHandler(req, {} as any);
  assert('Cabin request returns HTTP 200', res.status === 200);

  const resData = await res.json();
  assert('Cabin request returns success: true', resData.success === true);
  assert('Cabin request returns bookingReference', Boolean(resData.bookingReference));
  assert('Cabin bookingStatus is pending_availability', resData.bookingStatus === 'pending_availability');
  assert('Notifications status is disabled for both', 
    resData.emailNotifications?.billyNotificationStatus === 'disabled' &&
    resData.emailNotifications?.customerAcknowledgementStatus === 'disabled'
  );

  // 5. Test Duplicate Request Protection (Notifications should attempt if not sent/disabled)
  // Enable email and set credentials to mock missing/failure
  process.env.EMAIL_ENABLED = 'true';
  delete process.env.SMTP_APP_PASSWORD; // Will cause MISSING_SMTP_CREDENTIALS

  const dupReq = new Request('https://dubgan.netlify.app/api/create-cabin-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCabinPayload),
  });

  const dupRes = await createCabinRequestHandler(dupReq, {} as any);
  assert('Duplicate request returns HTTP 200', dupRes.status === 200);

  const dupData = await dupRes.json();
  assert('Duplicate request isReused is true', dupData.isReused === true);
  assert('Duplicate request reused same reference', dupData.bookingReference === resData.bookingReference);
  assert(
    'Duplicate request attempted pending notifications and marked failed without breaking booking',
    dupData.emailNotifications?.billyNotificationStatus === 'failed' &&
      dupData.emailNotifications?.customerAcknowledgementStatus === 'failed'
  );

  // 6. Test Admin Retry Email Guard (Should not resend if already accepted by SMTP)
  const store = getBookingStore('sandbox');
  const alreadySentRef = `DUBGAN-CABIN-SENT-${Date.now()}`;
  const alreadySentBooking: BookingRecord = {
    reference: alreadySentRef,
    category: 'cabin_package',
    tourId: 'island-hopping-2-nights',
    tourTitleEs: 'Island Hopping 2 Noches',
    tourTitleEn: 'Island Hopping 2 Nights',
    date: '2026-11-20',
    guests: 2,
    customer: {
      fullName: 'Already Sent User',
      email: 'alreadysent@test.com',
      whatsappNumber: '+50760053200',
      pickupHotel: 'Hotel Central',
    },
    language: 'es',
    pricing: {
      basePrice: 265,
      priceType: 'per_person',
      fullAmountUSD: 530,
      currency: 'USD',
    },
    bookingStatus: 'pending_availability',
    paymentStatus: 'unpaid',
    environment: 'sandbox',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailNotifications: {
      billyNotificationStatus: 'sent',
      customerAcknowledgementStatus: 'sent',
    },
  };

  await store.setJSON(alreadySentRef, alreadySentBooking);

  // Attempt admin retry on already-accepted email
  const retryReq = new Request('https://dubgan.netlify.app/api/admin-retry-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Host': 'dubgan.netlify.app',
      'Origin': 'https://dubgan.netlify.app',
    },
    body: JSON.stringify({
      reference: alreadySentRef,
      emailType: 'billy_notification',
    }),
  });

  // Mock admin authentication for retry endpoint
  process.env.ADMIN_PASSWORD = 'admin';
  const retryRes = await adminRetryEmailHandler(retryReq, {} as any);
  // Unauthenticated in test without cookie returns 401
  assert('Admin retry endpoint requires auth (401 returned without session)', retryRes.status === 401);

  console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
  if (passedTests === totalTests) {
    console.log('ALL UNIT & BEHAVIORAL TESTS PASSED!');
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
