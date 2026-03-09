import { UserSchema } from '@/validations/user';

export const getCurrentUserService = async () => {
  // We store the auth token as an HttpOnly cookie on login for security.
  // Client-side JS cannot read HttpOnly cookies, but the browser will send them
  // automatically on same-origin requests. So request `/api/users/me` without
  // adding an Authorization header — the proxy will forward cookies to the upstream API.
  const res = await fetch('/api/users/me', {
    headers: { 'Content-Type': 'application/json' },
    // Ensure cookies are included (same-origin requests include cookies by default,
    // but being explicit helps when running in different environments).
    credentials: 'include',
  });

  if (res.ok) {
    const json = await res.json();
    // upstream may return the user directly or wrapped in { data: user }
    const payload = json.data ?? json;
    return UserSchema.parse(payload);
  }

  // If the upstream /api/users/me failed (403), try to decode token claims server-side.
  // This endpoint reads the HttpOnly cookie and returns decoded claims.
  try {
    const claimsRes = await fetch('/api/auth/claims', { credentials: 'include' });
    if (claimsRes.ok) {
      const body = await claimsRes.json();
      const claims = body.claims as Record<string, unknown> | undefined;
      const sub = typeof claims?.sub === 'string' ? claims.sub : null;
      // If token subject is 'superadmin', synthesize a user object with SUPERADMIN role
      if (sub === 'superadmin') {
        const synthetic = {
          id: 0,
          username: sub,
          email: '',
          role: { id: 0, code: 'SUPERADMIN', name: 'Super Admin' },
        };
        return UserSchema.parse(synthetic);
      }
    }
  } catch {
    // ignore claim fetch errors and fall through to throw
  }

  throw new Error('Unauthorized');
};
