import type { Context } from '@netlify/functions';
import {
  verifyAdminPassword,
  isAdminConfigured,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createAdminSession,
  verifyRequestSession,
  revokeAdminSession,
  verifySameOrigin,
} from './lib/admin-auth-store.js';

export default async (req: Request, _context: Context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        errorEs: 'Método no permitido. Utiliza POST.',
        errorEn: 'Method not allowed. Use POST.',
      }),
      { status: 405, headers }
    );
  }

  // 1. CSRF Same-Origin Verification
  if (!verifySameOrigin(req)) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'CSRF_REJECTED',
        errorEs: 'Solicitud rechazada por política de seguridad CSRF (origen no válido).',
        errorEn: 'Request rejected by CSRF security policy (untrusted origin).',
      }),
      { status: 403, headers }
    );
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('client-ip') || '127.0.0.1';
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body empty
    }

    const { action = 'check', password } = body;

    // ACTION 1: Check Session Status
    if (action === 'check') {
      const isConfigured = isAdminConfigured();
      if (!isConfigured) {
        return new Response(
          JSON.stringify({
            authenticated: false,
            isConfigured: false,
            messageEs: 'Configuración de autenticación de administración pendiente. Configura ADMIN_PASSWORD_HASH en Netlify.',
            messageEn: 'Admin password configuration pending. Configure ADMIN_PASSWORD_HASH in Netlify environment variables.',
          }),
          { status: 200, headers }
        );
      }

      const authResult = await verifyRequestSession(req);
      return new Response(
        JSON.stringify({
          authenticated: authResult.authenticated,
          isConfigured: true,
          reason: authResult.reason,
        }),
        { status: 200, headers }
      );
    }

    // ACTION 2: Logout
    if (action === 'logout') {
      const authResult = await verifyRequestSession(req);
      if (authResult.session) {
        await revokeAdminSession(authResult.session.sessionId);
      }

      const responseHeaders = new Headers(headers);
      responseHeaders.append(
        'Set-Cookie',
        'dubgan_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      );

      return new Response(
        JSON.stringify({ success: true, message: 'Logged out successfully.' }),
        { status: 200, headers: responseHeaders }
      );
    }

    // ACTION 3: Login
    if (action === 'login') {
      const isConfigured = isAdminConfigured();
      if (!isConfigured) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'ADMIN_NOT_CONFIGURED',
            errorEs: 'La autenticación de administración no está configurada. Configura ADMIN_PASSWORD_HASH en Netlify.',
            errorEn: 'Admin authentication is not configured. Configure ADMIN_PASSWORD_HASH in Netlify environment variables.',
          }),
          { status: 401, headers }
        );
      }

      // Check Rate Limiting
      const rateLimit = await checkRateLimit(clientIp);
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'TOO_MANY_ATTEMPTS',
            errorEs: `Demasiados intentos fallidos. Por favor espera ${rateLimit.waitSeconds} segundos antes de reintentar.`,
            errorEn: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before retrying.`,
          }),
          { status: 429, headers }
        );
      }

      if (!password || typeof password !== 'string') {
        await recordFailedAttempt(clientIp);
        return new Response(
          JSON.stringify({
            success: false,
            code: 'MISSING_PASSWORD',
            errorEs: 'Por favor ingresa la contraseña de administración.',
            errorEn: 'Please enter the admin password.',
          }),
          { status: 400, headers }
        );
      }

      const isValid = await verifyAdminPassword(password.trim());
      if (!isValid) {
        await recordFailedAttempt(clientIp);
        return new Response(
          JSON.stringify({
            success: false,
            code: 'INVALID_CREDENTIALS',
            errorEs: 'Contraseña de administración incorrecta.',
            errorEn: 'Incorrect admin password.',
          }),
          { status: 401, headers }
        );
      }

      // Reset rate limit and create session
      await resetRateLimit(clientIp);
      const session = await createAdminSession(clientIp);

      const responseHeaders = new Headers(headers);
      responseHeaders.append(
        'Set-Cookie',
        `dubgan_admin_session=${session.sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
      );

      // Return JSON response without exposing the session token
      return new Response(
        JSON.stringify({
          success: true,
          expiresAt: session.expiresAt,
        }),
        { status: 200, headers: responseHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        code: 'INVALID_ACTION',
        errorEs: 'Acción de autenticación no válida.',
        errorEn: 'Invalid authentication action.',
      }),
      { status: 400, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        errorEs: 'Ocurrió un error inesperado al procesar la autenticación.',
        errorEn: 'An unexpected internal error occurred during authentication.',
        message: err?.message || String(err),
      }),
      { status: 500, headers }
    );
  }
};
