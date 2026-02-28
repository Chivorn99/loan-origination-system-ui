import { z } from 'zod';

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.string(),
});

export type Branch = z.infer<typeof BranchSchema>;

export const BranchRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
});

export type BranchRequest = z.infer<typeof BranchRequestSchema>;