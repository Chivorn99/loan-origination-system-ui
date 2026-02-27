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

export type Customer = z.infer<typeof CustomerSchema>;

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

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;

export const CreateCustomerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: CustomerSchema,
});

export type CreateCustomerResponse = z.infer<typeof CreateCustomerResponseSchema>;

export const CreateCustomerSchema = z.object({
  fullName: z.string().min(1),
  idNumber: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export type CreateCustomerPayload = z.infer<typeof CreateCustomerSchema>;
