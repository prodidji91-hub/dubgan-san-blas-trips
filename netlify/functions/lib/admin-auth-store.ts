import { getStore } from '@netlify/blobs';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export interface AdminSession {
  sessionId: string;
  createdAt: string;
  expiresAt: number; // Timestamp in ms
  ip?: string;
}

export interface RateLimitEntry {
  attempts: number;
  blockedUntil?: number;
  lastAttempt: number;
}

/**
 * Netlify Blobs store instance for admin session tokens.
 */
function getSessionStore() {
  return getStore({
    name: 'dubgan-admin-sessions',
    consistency: 'strong',
  });
}

function getRateLimitStore() {
  return getStore({
    name: 'dubgan-admin-ratelimit',
    consistency: 'strong',
  });
}

/**
 * Hashes string using SHA-256 for rate-limit store key lookups.
 */
export function hashKey(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const derived = scryptSync(data, 'dubgan_key_salt', 16, { N: 1024, r: 8, p: 1 });
  return derived.toString('hex');
}

/**
 * Verifies password against configured environment variable ADMIN_PASSWORD_HASH using salted scrypt.
 * Documented format: scrypt$16384$8$1$salt_hex$hash_hex or salt_hex:hash_hex
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envPasswordHash || !envPasswordHash.trim()) {
    return false; // Deny access if ADMIN_PASSWORD_HASH is not configured
  }

  const trimmed = envPasswordHash.trim();

  try {
    let N = 16384;
    let r = 8;
    let p = 1;
    let saltHex = '';
    let targetHashHex = '';

    if (trimmed.startsWith('scrypt$')) {
      const parts = trimmed.split('$');
      if (parts.length >= 6) {
        N = parseInt(parts[1], 10) || 16384;
        r = parseInt(parts[2], 10) || 8;
        p = parseInt(parts[3], 10) || 1;
        saltHex = parts[4];
        targetHashHex = parts[5];
      }
    } else if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      saltHex = parts[0];
      targetHashHex = parts[1];
    } else if (trimmed.includes('$')) {
      const parts = trimmed.split('$');
      saltHex = parts[0];
      targetHashHex = parts[1];
    }

    if (!saltHex || !targetHashHex) {
      return false;
    }

    const saltBuffer = Buffer.from(saltHex, 'hex');
    const targetHashBuffer = Buffer.from(targetHashHex, 'hex');

    const derivedBuffer = scryptSync(password, saltBuffer, targetHashBuffer.length, {
      N,
      r,
      p,
      maxmem: 64 * 1024 * 1024,
    });

    if (derivedBuffer.length !== targetHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(derivedBuffer, targetHashBuffer);
  } catch (err) {
    console.error('[Admin Auth] Error verifying scrypt password:', err);
    return false;
  }
}

/**
 * Checks if ADMIN_PASSWORD_HASH is set in server environment variables.
 */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_HASH.trim());
}

/**
 * Checks rate limiting for an IP address. Returns true if allowed, false if blocked.
 */
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; waitSeconds?: number }> {
  try {
    const store = getRateLimitStore();
    const key = `rl_${hashKey(ip)}`;
    const now = Date.now();

    const entry = (await store.get(key, { type: 'json' })) as RateLimitEntry | null;

    if (entry && entry.blockedUntil && entry.blockedUntil > now) {
      const waitSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    return { allowed: true };
  } catch {
    return { allowed: true }; // Fallback to allowed on storage issue
  }
}

/**
 * Records a failed login attempt for an IP address.
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  try {
    const store = getRateLimitStore();
    const key = `rl_${hashKey(ip)}`;
    const now = Date.now();

    const entry = (await store.get(key, { type: 'json' })) as RateLimitEntry | null;
    const attempts = (entry?.attempts || 0) + 1;

    let blockedUntil: number | undefined;
    if (attempts >= 5) {
      blockedUntil = now + 15 * 60 * 1000; // Block for 15 minutes
    }

    const updated: RateLimitEntry = {
      attempts,
      blockedUntil,
      lastAttempt: now,
    };

    await store.setJSON(key, updated);
  } catch (err) {
    console.error('[Admin Auth] Error recording failed attempt:', err);
  }
}

/**
 * Resets rate limit entries upon successful login.
 */
export async function resetRateLimit(ip: string): Promise<void> {
  try {
    const store = getRateLimitStore();
    const key = `rl_${hashKey(ip)}`;
    await store.delete(key);
  } catch (err) {
    console.error('[Admin Auth] Error resetting rate limit:', err);
  }
}

/**
 * Creates an admin session with an 8-hour expiration.
 */
export async function createAdminSession(ip?: string): Promise<AdminSession> {
  const store = getSessionStore();
  const randomBytesBuffer = randomBytes(24);
  const sessionId = randomBytesBuffer.toString('hex');

  const now = Date.now();
  const expiresAt = now + 8 * 3600 * 1000; // 8 hours duration

  const session: AdminSession = {
    sessionId,
    createdAt: new Date().toISOString(),
    expiresAt,
    ip,
  };

  await store.setJSON(`session_${sessionId}`, session);
  return session;
}

/**
 * Verifies session token extracted exclusively from HttpOnly cookie.
 */
export async function verifyRequestSession(req: Request): Promise<{
  authenticated: boolean;
  reason?: string;
  session?: AdminSession;
}> {
  if (!isAdminConfigured()) {
    return {
      authenticated: false,
      reason: 'ADMIN_NOT_CONFIGURED: ADMIN_PASSWORD_HASH is not set in Netlify environment variables.',
    };
  }

  const cookieHeader = req.headers.get('Cookie');
  let sessionId: string | null = null;

  if (cookieHeader) {
    const match = cookieHeader.match(/dubgan_admin_session=([^;]+)/);
    if (match) {
      sessionId = match[1].trim();
    }
  }

  if (!sessionId) {
    return { authenticated: false, reason: 'MISSING_SESSION_TOKEN' };
  }

  try {
    const store = getSessionStore();
    const session = (await store.get(`session_${sessionId}`, { type: 'json' })) as AdminSession | null;

    if (!session) {
      return { authenticated: false, reason: 'INVALID_SESSION_TOKEN' };
    }

    if (session.expiresAt < Date.now()) {
      await store.delete(`session_${sessionId}`);
      return { authenticated: false, reason: 'EXPIRED_SESSION_TOKEN' };
    }

    return { authenticated: true, session };
  } catch (err: any) {
    console.error('[Admin Auth] Error verifying session:', err);
    return { authenticated: false, reason: 'STORAGE_VERIFICATION_ERROR' };
  }
}

/**
 * Revokes/deletes an active admin session.
 */
export async function revokeAdminSession(sessionId: string): Promise<void> {
  try {
    const store = getSessionStore();
    await store.delete(`session_${sessionId}`);
  } catch (err) {
    console.error('[Admin Auth] Error revoking session:', err);
  }
}

/**
 * Verifies same-origin request headers (Origin / Referer) for state-changing admin actions (CSRF protection).
 */
export function verifySameOrigin(req: Request): boolean {
  const origin = req.headers.get('Origin');
  const referer = req.headers.get('Referer');
  const host = req.headers.get('Host');

  if (!host) {
    return true; // Local execution fallback
  }

  const allowedDomain = host.toLowerCase();

  if (origin) {
    try {
      const parsedOrigin = new URL(origin);
      if (parsedOrigin.host.toLowerCase() !== allowedDomain) {
        return false;
      }
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const parsedReferer = new URL(referer);
      if (parsedReferer.host.toLowerCase() !== allowedDomain) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}
