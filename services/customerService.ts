import { CustomerResponseSchema } from '@/validations/customer';

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
