import { z } from 'zod';

export const CreateRepaymentSchema = z.object({
  pawnLoanId: z.number(),
  currencyId: z.number(),
  paymentMethodId: z.number(),
  paymentTypeId: z.number(),

  paidAmount: z.number().positive(),
  principalPaid: z.number().positive(),
  interestPaid: z.number().positive(),
  penaltyPaid: z.number().positive(),
  remainingPrincipal: z.number().positive(),

  receivedBy: z.number(),
  paymentDate: z.string(),
});

export type CreateRepaymentPayload = z.infer<typeof CreateRepaymentSchema>;
