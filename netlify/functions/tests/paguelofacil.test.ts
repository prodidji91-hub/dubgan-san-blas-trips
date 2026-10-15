import { processVerifiedTransaction, WebhookFields } from '../paguelofacil-webhook.js';
import { getBookingStore } from '../lib/booking-store.js';

async function runTests() {
  console.log('========================================');
  console.log('PAGUELOFACIL SECURE VERIFICATION TESTS');
  console.log('========================================');

  process.env.NETLIFY_BLOBS_MOCK = 'true';
  process.env.PAGUELOFACIL_API_TOKEN = 'test-secret-token';

  const store = getBookingStore('sandbox');
  const testRef = `DUBGAN-TEST-${Date.now()}`;
  const testBooking = {
    reference: testRef,
    category: 'day_trip' as const,
    tourId: 'shared-full-day',
    tourTitleEs: 'Full Day Test',
    tourTitleEn: 'Full Day Test',
    date: '2026-11-01',
    guests: 2,
    customer: {
      fullName: 'Test User',
      email: 'test@example.com',
      whatsappNumber: '+50760000000',
      pickupHotel: 'Panama City',
    },
    language: 'en' as const,
    pricing: {
      basePrice: 135,
      priceType: 'per_person' as const,
      fullAmountUSD: 270,
      currency: 'USD' as const,
    },
    bookingStatus: 'awaiting_payment' as const,
    paymentStatus: 'unpaid' as const,
    environment: 'sandbox' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await store.setJSON(testRef, testBooking);
  const originalFetch = global.fetch;

  let passedCount = 0;
  let totalCount = 0;

  async function testScenario(name: string, mockApiResponse: any, payload: WebhookFields, expectedCode: string) {
    totalCount++;
    global.fetch = async () => new Response(JSON.stringify(mockApiResponse), { status: 200 });
    const res = await processVerifiedTransaction(payload, 'sandbox');
    const passed = res.code === expectedCode;
    if (passed) {
      passedCount++;
      console.log(`[PASS] ${name} (Code: ${res.code})`);
    } else {
      console.log(`[FAIL] ${name} -> Expected ${expectedCode}, got ${res.code} (Message: ${res.message})`);
    }
  }

  // 1. Valid verified payment
  await testScenario(
    'Valid verified payment',
    { data: [{ reference: testRef, status: '1', totalPay: '270.00', currency: 'USD', idTx: 'tx_001' }] },
    { reference: testRef, totalPay: '270.00', idtx: 'tx_001' },
    'PAYMENT_CONFIRMED'
  );

  // 2. Invalid payment status
  await testScenario(
    'Invalid payment status',
    { data: [{ reference: testRef, status: '0', totalPay: '270.00', currency: 'USD', idTx: 'tx_002' }] },
    { reference: testRef, totalPay: '270.00', idtx: 'tx_002' },
    'API_VERIFICATION_FAILED'
  );

  // 3. Incorrect amount
  await testScenario(
    'Incorrect amount',
    { data: [{ reference: testRef, status: '1', totalPay: '100.00', currency: 'USD', idTx: 'tx_003' }] },
    { reference: testRef, totalPay: '100.00', idtx: 'tx_003' },
    'AMOUNT_MISMATCH'
  );

  // 4. Incorrect currency
  await testScenario(
    'Incorrect currency',
    { data: [{ reference: testRef, status: '1', totalPay: '270.00', currency: 'EUR', idTx: 'tx_004' }] },
    { reference: testRef, totalPay: '270.00', idtx: 'tx_004' },
    'CURRENCY_MISMATCH'
  );

  // 5. Incorrect booking reference
  await testScenario(
    'Incorrect booking reference',
    { data: [] },
    { reference: 'DUBGAN-NONEXISTENT', totalPay: '270.00', idtx: 'tx_005' },
    'BOOKING_NOT_FOUND'
  );

  // 6. Duplicate transaction (Already paid)
  {
    totalCount++;
    global.fetch = async () => new Response(JSON.stringify({
      data: [{ reference: testRef, status: '1', totalPay: '270.00', currency: 'USD', idTx: 'tx_001' }]
    }), { status: 200 });
    const res = await processVerifiedTransaction({ reference: testRef, totalPay: '270.00', idtx: 'tx_001' }, 'sandbox');
    const passed = res.code === 'ALREADY_PROCESSED';
    if (passed) {
      passedCount++;
      console.log(`[PASS] Duplicate transaction (Code: ${res.code})`);
    } else {
      console.log(`[FAIL] Duplicate transaction -> Expected ALREADY_PROCESSED, got ${res.code}`);
    }
  }

  // 7. Multiple matching transactions (Ambiguous)
  {
    totalCount++;
    const ambiguousRef = `DUBGAN-AMB-${Date.now()}`;
    await store.setJSON(ambiguousRef, { ...testBooking, reference: ambiguousRef });

    global.fetch = async () => new Response(JSON.stringify({
      data: [
        { reference: ambiguousRef, status: '1', totalPay: '270.00', currency: 'USD', idTx: 'tx_101' },
        { reference: ambiguousRef, status: '1', totalPay: '270.00', currency: 'USD', idTx: 'tx_102' }
      ]
    }), { status: 200 });

    const res = await processVerifiedTransaction({ reference: ambiguousRef, totalPay: '270.00' }, 'sandbox');
    const passed = res.code === 'AMBIGUOUS_TRANSACTION_MATCH';
    if (passed) {
      passedCount++;
      console.log(`[PASS] Multiple matching transactions rejected (Code: ${res.code})`);
    } else {
      console.log(`[FAIL] Multiple matching transactions -> Expected AMBIGUOUS_TRANSACTION_MATCH, got ${res.code}`);
    }
  }

  // 8. Missing API fields
  await testScenario(
    'Missing API fields',
    { data: [{ reference: testRef }] },
    { reference: testRef, totalPay: '270.00' },
    'API_VERIFICATION_FAILED'
  );

  // 9. API timeout or failure (HTTP 500)
  {
    totalCount++;
    global.fetch = async () => new Response(null, { status: 500 });
    const res = await processVerifiedTransaction({ reference: testRef, totalPay: '270.00' }, 'sandbox');
    const passed = res.code === 'API_HTTP_ERROR' || res.code === 'API_VERIFICATION_FAILED';
    if (passed) {
      passedCount++;
      console.log(`[PASS] API timeout or failure handled safely (Code: ${res.code})`);
    } else {
      console.log(`[FAIL] API timeout or failure -> Expected API_HTTP_ERROR/API_VERIFICATION_FAILED, got ${res.code}`);
    }
  }

  // 10. Forged webhook notification
  await testScenario(
    'Forged webhook notification',
    { data: [] },
    { reference: testRef, totalPay: '270.00', idtx: 'forged_tx' },
    'API_VERIFICATION_FAILED'
  );

  global.fetch = originalFetch;

  console.log('========================================');
  console.log(`TEST RESULTS: ${passedCount} / ${totalCount} PASSED`);
  console.log('========================================');
  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
