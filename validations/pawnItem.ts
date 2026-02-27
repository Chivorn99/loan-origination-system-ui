import { z } from 'zod';

export const PawnItemSchema = z.object({
  id: z.number(),

  description: z.string(),
  estimatedValue: z.number(),
  itemType: z.string(),
  photoUrl: z.string().nullable().optional(),
  status: z.string(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
});

export type PawnItem = z.infer<typeof PawnItemSchema>;

export const CreatePawnItemSchema = z.object({
  customerId: z.number(),

  itemType: z.string().min(1),
  description: z.string().min(1),
  estimatedValue: z.number().min(0),
  photoUrl: z.string().nullable().optional(),
});

export type CreatePawnItemPayload = z.infer<typeof CreatePawnItemSchema>;

export const CreatePawnItemResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: PawnItemSchema,
});

export type CreatePawnItemResponse = z.infer<typeof CreatePawnItemResponseSchema>;
