import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string(),
  idNumber: z.string(),
  address: z.string(),
  status: z.string(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  deletedAt: z.string().nullish(),
});

export const CustomerResponseSchema = z.object({
  data: z.object({
    content: z.array(CustomerSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
  }),
  success: z.boolean(),
  message: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;
