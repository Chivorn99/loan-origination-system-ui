import { authHeaders } from '@/lib/api';
import {
  CurrencySchema,
  CurrencyPageSchema,
  CurrencyRequestSchema,
  CurrencyPatchSchema,
  type CurrencyRequest,
  type CurrencyPatch,
} from '@/validations/currency';

async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const json = await res.json();
    throw new Error(json?.message ?? json?.error ?? fallback);
  } catch {
    throw new Error(fallback);
  }
}

export const currencyService = {
  async getAll(page = 0, size = 10, status?: string) {
    let url = `/api/currencies?page=${page}&size=${size}&sortBy=code&direction=asc`;
    if (status) url += `&status=${status}`;

    const res = await fetch(url, { headers: authHeaders() });

    if (!res.ok) await extractError(res, 'Failed to fetch currencies');

    const json = await res.json();
    return CurrencyPageSchema.parse(json).data;
  },

  async getById(id: number) {
    const res = await fetch(`/api/currencies/${id}`, { headers: authHeaders() });

    if (!res.ok) await extractError(res, 'Failed to fetch currency');

    const json = await res.json();
    return CurrencySchema.parse(json.data);
  },

  async create(payload: CurrencyRequest) {
    const res = await fetch('/api/currencies', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(CurrencyRequestSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to create currency');

    return CurrencySchema.parse(json.data);
  },

  async update(id: number, payload: CurrencyRequest) {
    const res = await fetch(`/api/currencies/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(CurrencyRequestSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to update currency');

    return CurrencySchema.parse(json.data);
  },

  async patch(id: number, payload: CurrencyPatch) {
    const res = await fetch(`/api/currencies/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(CurrencyPatchSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to patch currency');

    return CurrencySchema.parse(json.data);
  },

  async delete(id: number) {
    const res = await fetch(`/api/currencies/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) await extractError(res, 'Failed to delete currency');
  },
};
