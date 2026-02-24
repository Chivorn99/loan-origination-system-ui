import { z } from 'zod';

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.string(),
});

export const CurrencySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimalPlace: z.number(),
  status: z.string(),
});

export const CustomerSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  idNumber: z.string(),
  phone: z.string(),
  address: z.string(),
  status: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const PawnItemSchema = z.object({
  id: z.number(),
  description: z.string(),
  estimatedValue: z.number(),
  itemType: z.string(),
  photoUrl: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const PawnLoanSchema = z.object({
  id: z.number(),
  loanCode: z.string(),
  loanAmount: z.number(),
  interestRate: z.number(),

  dueDate: z.string().nullable(),
  loanDate: z.string(),

  status: z.string(),
  totalPayableAmount: z.number(),

  redeemedAt: z.string().nullable(),
  defaultedAt: z.string().nullable(),

  createdAt: z.string(),
  updatedAt: z.string().nullable(),

  branch: BranchSchema,
  currency: CurrencySchema,
  customer: CustomerSchema,
  pawnItem: PawnItemSchema,
});

export const PawnLoanPaginationSchema = z.object({
  content: z.array(PawnLoanSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
});

export const PawnLoanResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: PawnLoanPaginationSchema,
});

export type PawnLoan = z.infer<typeof PawnLoanSchema>;
export type PawnLoanResponse = z.infer<typeof PawnLoanResponseSchema>;
