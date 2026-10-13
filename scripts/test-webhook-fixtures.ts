import handler, {
  processVerifiedTransaction,
  toIntegerCents,
  WebhookFields,
} from '../netlify/functions/paguelofacil-webhook.js';
import {
  createBookingRecord,
  getBookingByReferenceWithMeta,
  BookingRecord,
  getBookingStore,
} from '../netlify/functions/lib/booking-store.js';

async function runWebhookTests() {
  console.log('=== RUNNING CORRECTED PAGUELOFACIL WEBHOOK TESTS ===\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Detail: ${detail}`);
      failedTests++;
    }
  }

  process.env.NETLIFY_BLOBS_MOCK = 'true';
  process.env.PAGUELOFACIL_ENVIRONMENT = 'sandbox';
  process.env.PAGUELOFACIL_CCLW = 'TEST_CCLW_KEY_123';
  process.env.EMAIL_ENABLED = 'false';

  // 1. Create Test Fixture 1: Day Trip Booking awaiting payment
  const dayTripRef = `DUBGAN-TEST-DAY-${Date.now()}`;
  const dayTripRecord: BookingRecord = {
    reference: dayTripRef,
    category: 'day_trip',
    tourId: 'shared-full-day',
    tourTitleEs: 'Pasadía Compartido',
    tourTitleEn: 'Shared Full Day',
    date: '2026-11-20',
    guests: 2,
    customer: {
      fullName: 'Jane Test',
      email: 'jane@example.com',
      whatsappNumber: '+50760000000',
      pickupHotel: 'Marriott Panama',
    },
    language: 'es',
    pricing: {
      basePrice: 135,
      priceType: 'per_person',
      fullAmountUSD: 270,
      currency: 'USD',
    },
    bookingStatus: 'awaiting_payment',
    paymentStatus: 'unpaid',
    environment: 'sandbox',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await createBookingRecord(dayTripRecord);

  // 2. Create Test Fixture 2: Cabin Package Booking pending availability
  const cabinPendingRef = `DUBGAN-TEST-CABIN-PENDING-${Date.now()}`;
  const cabinPendingRecord: BookingRecord = {
    reference: cabinPendingRef,
    category: 'cabin_package',
    tourId: 'island-hopping-2-nights',
    tourTitleEs: 'Cabañas - 2 Noches',
    tourTitleEn: 'Cabins - 2 Nights',
    date: '2026-11-25',
    departureDate: '2026-11-27',
    nights: 2,
    guests: 2,
    customer: {
      fullName: 'Carlos Cabin',
      email: 'carlos@example.com',
      whatsappNumber: '+50761111111',
      pickupHotel: 'Riu Plaza',
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
  };

  await createBookingRecord(cabinPendingRecord);

  // TEST 1: GET Request Rejection Test (HTTP 405 Method Not Allowed)
  const reqGet = new Request('http://localhost/api/paguelofacil-webhook?idtx=123', {
    method: 'GET',
  });
  const resGet = await handler(reqGet, {} as any);
  assert(resGet.status === 405, 'GET requests are rejected with 405 Method Not Allowed');

  // TEST 2: Unverified POST Webhook Test (Logs sanitized event, does NOT alter booking state)
  const reqPostUnverified = new Request('http://localhost/api/paguelofacil-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: true,
      operationType: 'AUTH_CAPTURE',
      totalPay: '270.00',
      requestPayAmount: '270.00',
      codOper: '1',
      idtx: 'TX_WEBHOOK_001',
      reference: dayTripRef,
      CCLW: 'SECRET_CARD_KEY_123', // Sensitive field that MUST be stripped
    }),
  });

  const resPostUnverified = await handler(reqPostUnverified, {} as any);
  const jsonPostUnverified = await resPostUnverified.json();
  assert(
    resPostUnverified.status === 202 && jsonPostUnverified.code === 'WEBHOOK_LOGGED_UNVERIFIED',
    'Unverified POST webhook logs event and returns 202 Accepted',
    JSON.stringify(jsonPostUnverified)
  );

  // Verify that dayTripRecord was NOT modified in storage
  const dayTripCheck = await getBookingByReferenceWithMeta(dayTripRef, 'sandbox');
  assert(
    dayTripCheck?.record.paymentStatus === 'unpaid' && dayTripCheck?.record.bookingStatus === 'awaiting_payment',
    'Unverified webhook does NOT alter bookingStatus or paymentStatus of existing booking'
  );

  // TEST 3: Integer Cents Helper Test
  const cents1 = toIntegerCents('270.00');
  const cents2 = toIntegerCents(270);
  const cents3 = toIntegerCents('135.50');
  assert(
    cents1 === 27000 && cents2 === 27000 && cents3 === 13550,
    'toIntegerCents correctly converts amounts to integer USD cents'
  );

  // TEST 4: Simulated Verified Event - Approved Capture Processing
  const verifiedPayload: WebhookFields = {
    status: true,
    operationType: 'AUTH_CAPTURE',
    totalPay: '270.00',
    requestPayAmount: '270.00',
    codOper: '1',
    idtx: 'TX_VERIFIED_1001',
    reference: dayTripRef,
  };

  const resVerified = await processVerifiedTransaction(verifiedPayload, 'sandbox');
  assert(
    resVerified.responseStatus === 200 &&
      resVerified.code === 'PAYMENT_CONFIRMED' &&
      resVerified.record?.paymentStatus === 'paid' &&
      resVerified.record?.bookingStatus === 'confirmed',
    'Simulated verified approved capture updates booking to paid & confirmed',
    JSON.stringify(resVerified)
  );

  // TEST 5: Simulated Verified Event - Duplicate Idempotency Test
  const resDuplicate = await processVerifiedTransaction(verifiedPayload, 'sandbox');
  assert(
    resDuplicate.responseStatus === 200 && resDuplicate.code === 'ALREADY_PROCESSED',
    'Duplicate verified transaction returns ALREADY_PROCESSED idempotently'
  );

  // TEST 6: Simulated Verified Event - Amount Mismatch in USD Cents
  const mismatchedPayload: WebhookFields = {
    status: true,
    operationType: 'AUTH_CAPTURE',
    totalPay: '250.00', // Mismatched ($250 vs expected $270)
    codOper: '1',
    idtx: 'TX_VERIFIED_1002',
    reference: dayTripRef,
  };
  const resMismatched = await processVerifiedTransaction(mismatchedPayload, 'sandbox');
  assert(
    resMismatched.responseStatus === 400 && resMismatched.code === 'AMOUNT_MISMATCH',
    'Amount mismatch in integer USD cents returns HTTP 400 AMOUNT_MISMATCH'
  );

  // TEST 7: Simulated Verified Event - Unapproved Cabin Package Rejection
  const unapprovedCabinPayload: WebhookFields = {
    status: true,
    operationType: 'AUTH_CAPTURE',
    totalPay: '530.00',
    codOper: '1',
    idtx: 'TX_VERIFIED_1003',
    reference: cabinPendingRef,
  };
  const resUnapprovedCabin = await processVerifiedTransaction(unapprovedCabinPayload, 'sandbox');
  assert(
    resUnapprovedCabin.responseStatus === 422 && resUnapprovedCabin.code === 'AVAILABILITY_NOT_APPROVED',
    'Unapproved cabin package payment returns HTTP 422 AVAILABILITY_NOT_APPROVED'
  );

  // TEST 8: Simulated Verified Event - Out-Of-Order Declined Ignored
  const declinedPayload: WebhookFields = {
    status: false,
    operationType: 'AUTH_CAPTURE',
    totalPay: '270.00',
    codOper: '0',
    idtx: 'TX_VERIFIED_1004',
    reference: dayTripRef,
  };
  const resDeclined = await processVerifiedTransaction(declinedPayload, 'sandbox');
  assert(
    resDeclined.responseStatus === 200 && resDeclined.code === 'OUT_OF_ORDER_DECLINED_IGNORED',
    'Declined event received after paid status is safely ignored'
  );

  // TEST 9: Simulated Verified Event - Reversal Flagging
  const reversalPayload: WebhookFields = {
    status: true,
    operationType: 'REVERSAL',
    totalPay: '270.00',
    codOper: '1',
    idtx: 'TX_VERIFIED_1005',
    reference: dayTripRef,
  };
  const resReversal = await processVerifiedTransaction(reversalPayload, 'sandbox');
  assert(
    resReversal.responseStatus === 200 && resReversal.code === 'REVERSAL_FLAGGED',
    'Reversal event flags booking for admin review without initiating automatic refund'
  );

  console.log(`\n=== TEST SUMMARY ===`);
  console.log(`Total Passed: ${passedTests}`);
  console.log(`Total Failed: ${failedTests}`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runWebhookTests().catch((err) => {
  console.error('Fatal error running corrected fixture tests:', err);
  process.exit(1);
});
