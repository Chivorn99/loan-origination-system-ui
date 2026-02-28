import { NextResponse } from 'next/server';

const BASE_URL = process.env.API_URL!;

async function handler(req: Request, method: string, path: string[]) {
  const base = BASE_URL.replace(/\/$/, '');
  const endpoint = path.join('/');
  const query = new URL(req.url).search;

  const url = `${base}/${endpoint}${query}`;

  console.log('Proxy Request URL:', url);
  console.log('Proxy Method:', method);

  try {
    const body = method !== 'GET' && method !== 'DELETE' ? await req.text() : undefined;

    if (body) {
      console.log('Proxy Request Body:', body);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const auth = req.headers.get('authorization');
    if (auth) {
      headers.Authorization = auth;
    }

    const cookie = req.headers.get('cookie');
    if (cookie) {
      headers.Cookie = cookie;
    }

    const res = await fetch(url, {
      method,
      headers,
      body,
    });

    const contentType = res.headers.get('content-type') ?? 'application/json';
    const data = await res.arrayBuffer();

    const text = new TextDecoder().decode(data);

    console.log('Proxy Response Status:', res.status);
    console.log('Proxy Response Data:', text);

    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
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
