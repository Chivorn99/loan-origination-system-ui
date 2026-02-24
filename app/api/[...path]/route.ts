import { NextResponse } from 'next/server';

const BASE_URL = process.env.API_URL!;

async function handler(req: Request, method: string, path: string[]) {
  const base = BASE_URL.replace(/\/$/, '');
  const endpoint = path.join('/');
  const query = new URL(req.url).search;

  const url = `${base}/${endpoint}${query}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && method !== 'DELETE' ? await req.text() : undefined,
    });

    const data = await res.arrayBuffer();

    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);

    return NextResponse.json({ error: 'Proxy failed', detail: String(error) }, { status: 502 });
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
