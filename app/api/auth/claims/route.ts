export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') ?? '';
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'No token cookie' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = decodeURIComponent(match[1]);
    const parts = token.split('.');
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ error: 'Invalid token format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const payloadRaw = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadRaw, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      return new Response(JSON.stringify({ claims: payload }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('Failed to decode token payload', err);
      return new Response(JSON.stringify({ error: 'Failed to decode token' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('Error in /api/auth/claims', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
