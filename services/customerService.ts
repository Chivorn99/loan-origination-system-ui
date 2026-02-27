import {
  CreateCustomerPayload,
  CreateCustomerSchema,
  CustomerResponseSchema,
  CreateCustomerResponseSchema,
} from '@/validations/customer';
export const customerService = {
  async getAll(page = 0, size = 10, status?: string) {
    let url = `/api/customers?page=${page}&size=${size}`;

    if (status) {
      url += `&status=${status}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch customers');
    }

    const json = await res.json();
    return CustomerResponseSchema.parse(json);
  },
};

export const createCustomerService = async (payload: CreateCustomerPayload) => {
  const parsed = CreateCustomerSchema.parse(payload);

  const res = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsed),
  });

  if (!res.ok) {
    throw new Error('Failed to create customer');
  }

  const json = await res.json();
  const parsedResponse = CreateCustomerResponseSchema.parse(json);
  return parsedResponse.data;
};
