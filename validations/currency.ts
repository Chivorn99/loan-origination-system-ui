import { z } from 'zod';

export const CurrencyStatus = z.enum(['ACTIVE', 'INACTIVE', 'DELETED']);

export const CurrencySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimalPlace: z.number(),
  status: CurrencyStatus,
});

export const CurrencyRequestSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters').toUpperCase(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol must be at most 10 characters'),
  decimalPlace: z
    .number({ message: 'Decimal places must be a number' })
    .int()
    .min(0, 'Decimal places must be at least 0')
    .max(8, 'Decimal places must be at most 8')
    .default(2),
  status: CurrencyStatus.default('ACTIVE'),
});

export const CurrencyPatchSchema = CurrencyRequestSchema.partial();

export const CurrencyPageSchema = z.object({
  data: z.object({
    content: z.array(CurrencySchema),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
    size: z.number(),
  }),
});

export type Currency = z.infer<typeof CurrencySchema>;
export type CurrencyRequest = z.infer<typeof CurrencyRequestSchema>;
export type CurrencyPatch = z.infer<typeof CurrencyPatchSchema>;
