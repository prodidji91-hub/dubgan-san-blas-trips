import { getStore } from '@netlify/blobs';

export type BookingCategory = 'day_trip' | 'cabin_package';
export type BookingStatus =
  | 'awaiting_payment'
  | 'checkout_failed'
  | 'pending_availability'
  | 'confirmed'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface CustomerDetails {
  fullName: string;
  email: string;
  whatsappNumber: string;
  pickupHotel: string;
  message?: string;
}

export interface PricingDetails {
  basePrice: number;
  priceType: 'flat' | 'per_person';
  fullAmountUSD: number;
  currency: 'USD';
}

export interface CheckoutDetails {
  checkoutUrl?: string;
  providerMessage?: string;
  generatedAt?: string;
  failedAt?: string;
  errorReason?: string;
  checkoutState?: 'idle' | 'generating' | 'completed' | 'failed';
}

export interface PaymentTransactionDetails {
  providerTxId?: string;
  status?: string;
  amountPaidUSD?: number;
  paymentDate?: string;
  providerCode?: string | number;
  environment?: 'sandbox' | 'production';
  verifiedAt?: string;
  verificationMethod?: 'provider_signature' | 'authenticated_api_query' | 'manual_review_required';
  reversalFlagged?: boolean;
  reversalReason?: string;
}

export interface SanitizedWebhookEvent {
  eventId: string;
  idtx?: string;
  status?: string | boolean;
  operationType?: string;
  totalPayCents?: number;
  requestPayAmountCents?: number;
  codOper?: string | number;
  reference?: string;
  receivedAt: string;
  environment: 'sandbox' | 'production';
  verificationStatus: 'unverified_pending_provider_spec';
}

export interface EmailLogEntry {
  type:
    | 'billy_notification'
    | 'customer_acknowledgement'
    | 'customer_payment_link'
    | 'customer_payment_confirmation'
    | 'billy_payment_confirmation';
  recipient: string;
  status: 'sent' | 'failed' | 'disabled' | 'pending';
  sentAt?: string;
  errorReason?: string;
}

export interface EmailNotificationStatus {
  billyNotificationStatus?: 'sent' | 'failed' | 'disabled' | 'pending';
  customerAcknowledgementStatus?: 'sent' | 'failed' | 'disabled' | 'pending';
  customerPaymentLinkStatus?: 'sent' | 'failed' | 'disabled' | 'pending';
  customerPaymentConfirmationStatus?: 'sent' | 'failed' | 'disabled' | 'pending';
  billyPaymentConfirmationStatus?: 'sent' | 'failed' | 'disabled' | 'pending';
  logs?: EmailLogEntry[];
}

export interface BookingRecord {
  reference: string;
  category: BookingCategory;
  tourId: string;
  tourTitleEs: string;
  tourTitleEn: string;
  date: string;
  departureDate?: string;
  nights?: number;
  guests: number;
  customer: CustomerDetails;
  language: 'es' | 'en';
  pricing: PricingDetails;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  checkoutDetails?: CheckoutDetails;
  paymentDetails?: PaymentTransactionDetails;
  emailNotifications?: EmailNotificationStatus;
  verificationPending?: boolean;
  unverifiedNotificationReceived?: boolean;
  environment: 'sandbox' | 'production';
  createdAt: string;
  updatedAt: string;
}

const inMemoryStores = new Map<string, Map<string, { value: any; etag: string; metadata?: any }>>();

function getInMemoryStore(storeName: string) {
  if (!inMemoryStores.has(storeName)) {
    inMemoryStores.set(storeName, new Map());
  }
  const map = inMemoryStores.get(storeName)!;

  return {
    get: async (key: string, options?: any) => {
      const entry = map.get(key);
      if (!entry) return null;
      if (options?.type === 'json') {
        return typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
      }
      return typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value);
    },
    getWithMetadata: async (key: string, options?: any) => {
      const entry = map.get(key);
      if (!entry) return null;
      const data = typeof entry.value === 'string' && options?.type === 'json'
        ? JSON.parse(entry.value)
        : entry.value;
      return { data, etag: entry.etag, metadata: entry.metadata };
    },
    set: async (key: string, value: any, options?: any) => {
      if (options?.onlyIfNew && map.has(key)) {
        return { modified: false };
      }
      if (options?.onlyIfMatch && map.has(key)) {
        const existing = map.get(key)!;
        if (existing.etag !== options.onlyIfMatch) {
          return { modified: false };
        }
      }
      const newEtag = `etag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      map.set(key, { value, etag: newEtag });
      return { modified: true, etag: newEtag };
    },
    setJSON: async (key: string, value: any, options?: any) => {
      if (options?.onlyIfNew && map.has(key)) {
        return { modified: false };
      }
      if (options?.onlyIfMatch && map.has(key)) {
        const existing = map.get(key)!;
        if (existing.etag !== options.onlyIfMatch) {
          return { modified: false };
        }
      }
      const newEtag = `etag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      map.set(key, { value, etag: newEtag });
      return { modified: true, etag: newEtag };
    },
    list: async () => {
      const blobs = Array.from(map.keys()).map((k) => ({ key: k, etag: map.get(k)!.etag }));
      return { blobs };
    },
  };
}

/**
 * Returns a site-wide Netlify Blobs store instance separated by environment (sandbox vs production).
 */
export function getBookingStore(envMode: 'sandbox' | 'production') {
  const storeName =
    envMode === 'production' ? 'dubgan-bookings-production' : 'dubgan-bookings-sandbox';

  if (process.env.NETLIFY_BLOBS_MOCK === 'true' || process.env.NODE_ENV === 'test') {
    return getInMemoryStore(storeName) as any;
  }

  return getStore({
    name: storeName,
    consistency: 'strong',
  });
}

/**
 * Generates an idempotency fingerprint key derived from email, tourId, date, and guest count.
 */
export function generateFingerprintKey(
  email: string,
  tourId: string,
  date: string,
  guests: number
): string {
  const normalized = `${email.trim().toLowerCase()}:${tourId}:${date}:${guests}`;
  return `idemp_${Buffer.from(normalized).toString('hex').slice(0, 48)}`;
}

/**
 * Creates a new booking record using documented `onlyIfNew: true`.
 * Also maps the idempotency lookup key to the reference.
 */
export async function createBookingRecord(
  record: BookingRecord
): Promise<{ success: boolean; created: boolean; record: BookingRecord }> {
  try {
    const store = getBookingStore(record.environment);
    const fingerprintKey = generateFingerprintKey(
      record.customer.email,
      record.tourId,
      record.date,
      record.guests
    );

    // 1. Write the main record using documented onlyIfNew: true
    const writeResult = (await store.setJSON(record.reference, record, {
      onlyIfNew: true,
    })) as { modified?: boolean } | null;

    if (writeResult && writeResult.modified === false) {
      // Record already exists and was NOT created
      return { success: false, created: false, record };
    }

    // 2. Write fingerprint lookup key -> reference mapping
    await store.set(fingerprintKey, record.reference, { onlyIfNew: true });

    return { success: true, created: true, record };
  } catch (err: any) {
    console.error('[Netlify Blobs] Error creating booking record:', err);
    throw new Error(`STORAGE_ERROR: ${err?.message || 'Failed to create record in Netlify Blobs.'}`);
  }
}

/**
 * Checks for an existing booking matching customer fingerprint (email + tourId + date + guests).
 * Uses getWithMetadata to retrieve existing record and ETag.
 */
export async function findExistingIdempotentBooking(
  email: string,
  tourId: string,
  date: string,
  guests: number,
  fullAmountUSD: number,
  envMode: 'sandbox' | 'production'
): Promise<{
  found: boolean;
  parameterMatch: boolean;
  existingRecord?: BookingRecord;
  etag?: string;
}> {
  try {
    const store = getBookingStore(envMode);
    const fingerprintKey = generateFingerprintKey(email, tourId, date, guests);

    const existingRef = await store.get(fingerprintKey, { type: 'text' });
    if (!existingRef) {
      return { found: false, parameterMatch: false };
    }

    const meta = await store.getWithMetadata(existingRef, { type: 'json' });
    if (!meta || !meta.data) {
      return { found: false, parameterMatch: false };
    }

    const existingRecord = meta.data as BookingRecord;
    const etag = meta.etag;

    // Verify exact binding parameters
    const parameterMatch =
      existingRecord.tourId === tourId &&
      existingRecord.date === date &&
      existingRecord.guests === guests &&
      existingRecord.pricing.fullAmountUSD === fullAmountUSD;

    return {
      found: true,
      parameterMatch,
      existingRecord,
      etag,
    };
  } catch (err) {
    return { found: false, parameterMatch: false };
  }
}

/**
 * Updates an existing booking record using documented `onlyIfMatch` conditional write with ETag.
 */
export async function updateBookingWithETag(
  reference: string,
  envMode: 'sandbox' | 'production',
  currentETag: string | undefined,
  updater: (record: BookingRecord) => BookingRecord
): Promise<{ success: boolean; modified: boolean; record?: BookingRecord; newEtag?: string }> {
  try {
    const store = getBookingStore(envMode);

    const meta = await store.getWithMetadata(reference, { type: 'json' });
    if (!meta || !meta.data) {
      throw new Error(`BOOKING_NOT_FOUND: ${reference}`);
    }

    const existingRecord = meta.data as BookingRecord;
    const etagToUse = currentETag || meta.etag;

    const updatedRecord = updater(existingRecord);
    updatedRecord.updatedAt = new Date().toISOString();

    const writeOptions = etagToUse ? { onlyIfMatch: etagToUse } : {};
    const writeResult = (await store.setJSON(reference, updatedRecord, writeOptions)) as {
      etag?: string;
      modified?: boolean;
    } | null;

    if (writeResult && writeResult.modified === false) {
      // Conditional update failed because another thread modified the record
      return { success: false, modified: false };
    }

    return {
      success: true,
      modified: true,
      record: updatedRecord,
      newEtag: writeResult?.etag,
    };
  } catch (err: any) {
    console.error('[Netlify Blobs] Error updating booking with ETag:', err);
    throw err;
  }
}

/**
 * Fetches a single booking record by reference along with ETag.
 */
export async function getBookingByReferenceWithMeta(
  reference: string,
  envMode: 'sandbox' | 'production'
): Promise<{ record: BookingRecord; etag?: string } | null> {
  try {
    const store = getBookingStore(envMode);
    const meta = await store.getWithMetadata(reference, { type: 'json' });
    if (!meta || !meta.data) return null;
    return { record: meta.data as BookingRecord, etag: meta.etag };
  } catch (err: any) {
    console.error('[Netlify Blobs] Error fetching booking with metadata:', err);
    return null;
  }
}

/**
 * Saves a sanitized, non-sensitive unverified webhook event for audit review.
 */
export async function saveSanitizedWebhookEvent(
  event: SanitizedWebhookEvent
): Promise<boolean> {
  try {
    const storeName =
      event.environment === 'production'
        ? 'dubgan-webhook-events-production'
        : 'dubgan-webhook-events-sandbox';

    const store =
      process.env.NETLIFY_BLOBS_MOCK === 'true' || process.env.NODE_ENV === 'test'
        ? (getInMemoryStore(storeName) as any)
        : getStore({ name: storeName, consistency: 'strong' });

    await store.setJSON(event.eventId, event, { onlyIfNew: true });
    return true;
  } catch (err: any) {
    console.error('[Netlify Blobs] Error saving sanitized webhook event:', err);
    return false;
  }
}
