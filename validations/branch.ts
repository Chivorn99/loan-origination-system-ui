import { z } from 'zod';

export const BranchStatus = z.enum(['ACTIVE', 'INACTIVE', 'DELETED']);

export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  status: BranchStatus,
});

export const BranchRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  address: z.string().min(1, 'Address is required').max(255, 'Address must be at most 255 characters'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone must be at most 20 characters'),
  status: BranchStatus.default('ACTIVE'),
});

export const BranchPatchSchema = BranchRequestSchema.partial();

export const BranchPageSchema = z.object({
  data: z.object({
    content: z.array(BranchSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
    size: z.number(),
  }),
});

export type Branch = z.infer<typeof BranchSchema>;
export type BranchRequest = z.infer<typeof BranchRequestSchema>;
export type BranchPatch = z.infer<typeof BranchPatchSchema>;
