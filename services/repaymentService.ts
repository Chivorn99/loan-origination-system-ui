import {
  CreateRepaymentSchema,
  type CreateRepaymentPayload,
} from '@/validations/repayment';

export const repaymentService = {
  async create(payload: CreateRepaymentPayload) {
    const res = await fetch('/api/pawn-repayments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        CreateRepaymentSchema.parse(payload)
      ),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json?.message || 'Failed to record repayment'
      );
    }

    return json.data;
  },
};