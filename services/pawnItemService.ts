import { authHeaders } from '@/lib/api';
import { CreatePawnItemPayload, CreatePawnItemSchema, CreatePawnItemResponseSchema } from '@/validations/pawnItem';

export const createPawnItemService = async (payload: CreatePawnItemPayload) => {
  const parsed = CreatePawnItemSchema.parse(payload);

  const res = await fetch('/api/pawn-items', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(parsed),
  });

  if (!res.ok) throw new Error('Failed to create pawn item');

  const json = await res.json();
  return CreatePawnItemResponseSchema.parse(json).data;
};