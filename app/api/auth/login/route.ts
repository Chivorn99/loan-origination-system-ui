export async function POST(req: Request) {
  try {
    // Parse incoming request body defensively
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      // If client didn't send JSON, treat as empty body
      body = null;
    }

    // Log which user is attempting to authenticate (mask sensitive data)
    try {
      if (body && typeof body === 'object' && 'username' in (body as Record<string, unknown>)) {
        console.info('[Auth proxy] Login attempt for username:', String((body as Record<string, unknown>)['username']));
      }
    } catch {
      // ignore logging errors
    }

    if (!process.env.API_URL) {
      console.error('[Auth proxy] Missing API_URL environment variable');
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

      // Normalize API_URL to avoid duplicate '/api' segments (e.g. API_URL may already include '/api')
      const rawApiUrl = process.env.API_URL.replace(/\/+$|\s+/g, '');
    const baseApi = rawApiUrl.replace(/\/api$|\/api\/$/, '').replace(/\/$/, '');
    // Upstream auth endpoint is expected at /api/auth/login — normalize to avoid double '/api'
    const upstreamUrl = `${baseApi}/api/auth/login`;
    console.info('[Auth proxy] Forwarding login to upstream:', upstreamUrl);

    const res = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body ?? {}),
    });

  // Parse upstream response defensively — it may be empty or non-JSON
    let data: Record<string, unknown> | null = null;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { text } as unknown as Record<string, unknown>;
        }
      }
    }

    // Some upstream APIs return HTTP 200 even when login failed and include { success: false, message }
    // Normalize that here: if JSON body contains success === false, treat as an error.
    const isLogicalError = data && 'success' in data && data['success'] === false;

    if (!res.ok || isLogicalError) {
      const message = data?.message ?? data?.error ?? res.statusText ?? 'Authentication failed';
      // Collect response headers for debugging
      let upstreamHeaders: Record<string, string> = {};
      try {
        upstreamHeaders = Object.fromEntries(res.headers.entries());
      } catch {
        upstreamHeaders = {};
      }

      // Log upstream error for debugging (safe to log status and non-sensitive body snippets)
      console.warn('[Auth proxy] Upstream login failed', { status: res.status, headers: upstreamHeaders, body: data });
      // If upstream returned success:false but HTTP 200, convert to 401 so client treats it as an auth failure
      const statusToReturn = !res.ok ? res.status : 401;
      return new Response(JSON.stringify({ error: message }), { status: statusToReturn, headers: { 'Content-Type': 'application/json' } });
    }

    let token: string | null = null;
    if (data && 'token' in data && typeof data['token'] === 'string') {
      token = data['token'] as string;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Set-Cookie'] = `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`;
    }

    // Include token in response body when available so client code can read it.
    const respBody: Record<string, unknown> = { success: true };
    if (token) respBody.token = token;

    return new Response(JSON.stringify(respBody), {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    // Log unexpected server-side errors and return JSON response rather than raw stack
    console.error('Error in /api/auth/login proxy:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}