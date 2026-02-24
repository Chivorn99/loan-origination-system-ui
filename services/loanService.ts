import { PawnLoanResponseSchema } from '@/validations/loan';

export const pawnLoanService = {
  async getAll(page = 0, size = 10) {
    const res = await fetch(`/api/pawn-loans?page=${page}&size=${size}`);

    if (!res.ok) {
      throw new Error('Failed to fetch pawn loans');
    }

    const json = await res.json();
    return PawnLoanResponseSchema.parse(json);
  },
};
