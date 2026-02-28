import { authHeaders } from '@/lib/api';
import {
  CreateCustomerPayload,
  CreateCustomerSchema,
  CustomerResponseSchema,
  CreateCustomerResponseSchema,
} from '@/validations/customer';

const API = '/api/customers';

export const customerService = {
  async getAll(page = 0, size = 10, status?: string) {
    let url = `${API}?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;

    const res = await fetch(url, { headers: authHeaders() });

    if (!res.ok) throw new Error('Failed to fetch customers');

    const json = await res.json();
    return CustomerResponseSchema.parse(json);
  },
};

export const createCustomerService = async (payload: CreateCustomerPayload) => {
  const parsed = CreateCustomerSchema.parse(payload);

  const res = await fetch(API, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(parsed),
  });

  if (!res.ok) throw new Error('Failed to create customer');

  const json = await res.json();
  return CreateCustomerResponseSchema.parse(json).data;
};
