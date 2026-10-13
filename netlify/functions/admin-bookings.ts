import type { Context } from '@netlify/functions';
import { verifyRequestSession } from './lib/admin-auth-store.js';
import { getBookingStore, BookingRecord } from './lib/booking-store.js';

export default async (req: Request, _context: Context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Session',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        errorEs: 'Método no permitido. Utiliza GET.',
        errorEn: 'Method not allowed. Use GET.',
      }),
      { status: 405, headers }
    );
  }

  // 1. VERIFY ADMIN AUTHENTICATION
  const auth = await verifyRequestSession(req);
  if (!auth.authenticated) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'UNAUTHORIZED',
        errorEs: 'Acceso no autorizado. Sesión de administración no válida o expirada.',
        errorEn: 'Unauthorized access. Admin session invalid or expired.',
        reason: auth.reason,
      }),
      { status: 401, headers }
    );
  }

  try {
    const envMode: 'sandbox' | 'production' =
      (process.env.PAGUELOFACIL_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
        ? 'production'
        : 'sandbox';

    const store = getBookingStore(envMode);

    // List keys in Netlify Blobs store
    const listResult = await store.list();
    const blobs = listResult?.blobs || [];

    const bookingRecords: BookingRecord[] = [];

    for (const item of blobs) {
      // Ignore internal lookup keys (starting with idemp_ or idx_)
      if (item.key.startsWith('idemp_') || item.key.startsWith('idx_')) {
        continue;
      }

      try {
        const record = (await store.get(item.key, { type: 'json' })) as BookingRecord | null;
        if (record && record.reference && record.category) {
          bookingRecords.push(record);
        }
      } catch {
        // Skip unreadable record
      }
    }

    // Sort descending by createdAt date
    bookingRecords.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return new Response(
      JSON.stringify({
        success: true,
        count: bookingRecords.length,
        environment: envMode,
        bookings: bookingRecords,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Error al recuperar los registros de reserva de Netlify Blobs.',
        errorEn: 'Failed to retrieve booking records from Netlify Blobs.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
