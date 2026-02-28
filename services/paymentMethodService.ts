import { authHeaders } from '@/lib/api';
import {
  PaymentMethodSchema,
  PaymentMethodPageSchema,
  PaymentMethodRequestSchema,
  PaymentMethodPatchSchema,
  type PaymentMethodRequest,
  type PaymentMethodPatch,
  type PaymentMethodPage,
} from '@/validations/paymentMethod';

export interface PaymentMethodParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  status?: string;
}

async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const json = await res.json();
    throw new Error(json?.message ?? json?.error ?? fallback);
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(fallback);
  }
}

export const paymentMethodService = {
  async getAll(params: PaymentMethodParams = {}): Promise<PaymentMethodPage> {
    const { page = 0, size = 10, sortBy = 'name', direction = 'asc', status } = params;

    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      direction,
      ...(status ? { status } : {}),
    });

    const res = await fetch(`/api/payment-methods?${query}`, { headers: authHeaders() });
    if (!res.ok) await extractError(res, 'Failed to fetch payment methods');

    const json = await res.json();
    return PaymentMethodPageSchema.parse(json).data;
  },

  async getById(id: number) {
    const res = await fetch(`/api/payment-methods/${id}`, { headers: authHeaders() });
    if (!res.ok) await extractError(res, 'Failed to fetch payment method');

    const json = await res.json();
    return PaymentMethodSchema.parse(json.data);
  },

  async create(payload: PaymentMethodRequest) {
    const res = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(PaymentMethodRequestSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to create payment method');

    return PaymentMethodSchema.parse(json.data);
  },

  async update(id: number, payload: PaymentMethodRequest) {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(PaymentMethodRequestSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to update payment method');

    return PaymentMethodSchema.parse(json.data);
  },

  async patch(id: number, payload: PaymentMethodPatch) {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(PaymentMethodPatchSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to patch payment method');

    return PaymentMethodSchema.parse(json.data);
  },

  async delete(id: number) {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) await extractError(res, 'Failed to delete payment method');
  },
};
