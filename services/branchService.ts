import { z } from 'zod';
import { authHeaders } from '@/lib/api';
import { BranchSchema, BranchRequestSchema, type Branch, type BranchRequest } from '@/validations/branch';

export const BranchPatchSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
});

export const BranchPageSchema = z.object({
  data: z.object({
    content: z.array(BranchSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
  }),
});

export type BranchPatch = z.infer<typeof BranchPatchSchema>;
export type BranchPage = z.infer<typeof BranchPageSchema>['data'];

async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const json = await res.json();
    throw new Error(json?.message ?? json?.error ?? fallback);
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(fallback);
  }
}

export const branchService = {
  async getAll(page = 0, size = 10, status?: string): Promise<BranchPage> {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...(status ? { status } : {}),
    });

    const res = await fetch(`/api/branches?${query}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message ?? json?.error ?? 'Failed to fetch branches');
    }

    const json = await res.json();
    return BranchPageSchema.parse(json).data;
  },

  async getById(id: number): Promise<Branch> {
    const res = await fetch(`/api/branches/${id}`, { headers: authHeaders() });
    if (!res.ok) await extractError(res, 'Failed to fetch branch');

    const json = await res.json();
    return BranchSchema.parse(json.data);
  },

  async create(payload: BranchRequest): Promise<Branch> {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(BranchRequestSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to create branch');

    return BranchSchema.parse(json.data);
  },

  async update(id: number, payload: BranchRequest): Promise<Branch> {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(BranchRequestSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to update branch');

    return BranchSchema.parse(json.data);
  },

  async patch(id: number, payload: BranchPatch): Promise<Branch> {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(BranchPatchSchema.parse(payload)),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? json?.error ?? 'Failed to patch branch');

    return BranchSchema.parse(json.data);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) await extractError(res, 'Failed to delete branch');
  },
};
