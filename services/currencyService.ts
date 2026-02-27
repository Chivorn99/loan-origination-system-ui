import {
  CurrencySchema,
  CurrencyPageSchema,
  CurrencyRequestSchema,
  CurrencyPatchSchema,
  type CurrencyRequest,
  type CurrencyPatch,
} from '@/validations/currency';

export const currencyService = {
  async getAll(page = 0, size = 10, status?: string) {
    let url = `/api/currencies?page=${page}&size=${size}&sortBy=code&direction=asc`;

    if (status) {
      url += `&status=${status}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch currencies');
    }

    const json = await res.json();
    return CurrencyPageSchema.parse(json).data;
  },

  async getById(id: number) {
    const res = await fetch(`/api/currencies/${id}`);

    if (!res.ok) {
      throw new Error('Failed to fetch currency');
    }

    const json = await res.json();
    return CurrencySchema.parse(json.data);
  },

  async create(payload: CurrencyRequest) {
    const res = await fetch('/api/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(CurrencyRequestSchema.parse(payload)),
    });

    if (!res.ok) {
      throw new Error('Failed to create currency');
    }

    const json = await res.json();
    return CurrencySchema.parse(json.data);
  },

  async update(id: number, payload: CurrencyRequest) {
    const res = await fetch(`/api/currencies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(CurrencyRequestSchema.parse(payload)),
    });

    if (!res.ok) {
      throw new Error('Failed to update currency');
    }

    const json = await res.json();
    return CurrencySchema.parse(json.data);
  },

  async patch(id: number, payload: CurrencyPatch) {
    const res = await fetch(`/api/currencies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(CurrencyPatchSchema.parse(payload)),
    });

    if (!res.ok) {
      throw new Error('Failed to patch currency');
    }

    const json = await res.json();
    return CurrencySchema.parse(json.data);
  },

  async delete(id: number) {
    const res = await fetch(`/api/currencies/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      throw new Error('Failed to delete currency');
    }
  },
};
