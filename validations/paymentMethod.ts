import { z } from 'zod';

export const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const PaymentMethodPageSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    content: z.array(PaymentMethodSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
  }),
});

export const PaymentMethodRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.string().optional(),
});

export const PaymentMethodPatchSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentMethodPage = z.infer<typeof PaymentMethodPageSchema>['data'];
export type PaymentMethodRequest = z.infer<typeof PaymentMethodRequestSchema>;
export type PaymentMethodPatch = z.infer<typeof PaymentMethodPatchSchema>;
