const BASE_URL = process.env.API_URL!;

async function handler(req: Request, method: string, path: string[]) {
  const base = BASE_URL.replace(/\/$/, '');
  const endpoint = path.join('/');
  const query = new URL(req.url).search;
  const url = `${base}/${endpoint}${query}`;

  console.log(`[API Proxy] ${method} → ${url}`);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Forward Authorization header if exists
  const auth = req.headers.get('authorization');
  if (auth) {
    headers['Authorization'] = auth;
    console.log(`[API Proxy] Forwarding Authorization: ${auth}`);
  }

  // Forward cookies (so backend can see token)
  const cookie = req.headers.get('cookie');
  if (cookie) {
    headers['Cookie'] = cookie;
    console.log(`[API Proxy] Forwarding Cookies: ${cookie}`);
  }

  // If no Authorization header present but a token cookie exists, set Authorization: Bearer <token>
  if (!auth && cookie) {
    try {
      const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
      if (match) {
        const token = decodeURIComponent(match[1]);
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[API Proxy] Added Authorization header from token cookie');
        // Try to decode the JWT payload to log expiry/claim info for debugging
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
            ) as Record<string, unknown>;
            const now = Math.floor(Date.now() / 1000);
            const exp = typeof payload.exp === 'number' ? payload.exp : null;
            const iat = typeof payload.iat === 'number' ? payload.iat : null;
            console.log('[API Proxy] Token claims:', {
              sub: payload.sub ?? null,
              exp,
              iat,
              expIn: exp ? exp - now : null,
            });
          }
        } catch {
          // ignore decoding errors
        }
      }
    } catch {
      // ignore cookie parse errors
    }
  }

  const body = method !== 'GET' && method !== 'DELETE' ? await req.text() : undefined;
  if (body) console.log(`[API Proxy] Body: ${body}`);

  try {
    const res = await fetch(url, { method, headers, body });

    console.log(`[API Proxy] Response status: ${res.status}`);
    const data = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'application/json';
    console.log(`[API Proxy] Response content-type: ${contentType}`);

    // If JSON, also try to print string content
    if (contentType.includes('application/json')) {
      const text = new TextDecoder().decode(data);
      console.log(`[API Proxy] Response body: ${text}`);
    }

    // Copy upstream headers and allow special handling for logout
    let responseHeaders: Record<string, string> = {};
    try {
      responseHeaders = Object.fromEntries(res.headers.entries());
    } catch {
      responseHeaders = { 'Content-Type': contentType };
    }

    // If this was a logout request, ensure the token cookie is cleared by the proxy
    // (Some upstreams may not clear the HttpOnly cookie; proactively expire it here.)
    try {
      if (method === 'POST' && endpoint === 'auth/logout') {
        responseHeaders['Set-Cookie'] = `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
        console.log('[API Proxy] Clearing token cookie on logout');
      }
    } catch {
      // ignore
    }

    return new Response(data, { status: res.status, headers: responseHeaders });
  } catch (err) {
    console.error('[API Proxy] Error:', err);
    return new Response(JSON.stringify({ error: 'Proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handler(req, 'GET', path);
}

export async function POST(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handler(req, 'POST', path);
}

export async function PUT(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handler(req, 'PUT', path);
}

export async function DELETE(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handler(req, 'DELETE', path);
}
