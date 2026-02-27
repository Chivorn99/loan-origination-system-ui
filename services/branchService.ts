import {
  BranchSchema,
  BranchPageSchema,
  BranchRequestSchema,
  BranchPatchSchema,
  type BranchRequest,
  type BranchPatch,
} from '@/validations/branch';

async function extractError(res: Response, fallback: string): Promise<never> {
  try {
    const json = await res.json();
    throw new Error(json?.message ?? json?.error ?? fallback);
  } catch {
    throw new Error(fallback);
  }
}

export const branchService = {
  async getAll(page = 0, size = 10, status?: string) {
    let url = `/api/branches?page=${page}&size=${size}&sortBy=name&direction=asc`;

    if (status) {
      url += `&status=${status}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      await extractError(res, 'Failed to fetch branches');
    }

    const json = await res.json();
    return BranchPageSchema.parse(json).data;
  },

  async getById(id: number) {
    const res = await fetch(`/api/branches/${id}`);

    if (!res.ok) {
      await extractError(res, 'Failed to fetch branch');
    }

    const json = await res.json();
    return BranchSchema.parse(json.data);
  },

  async create(payload: BranchRequest) {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(BranchRequestSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message ?? json?.error ?? 'Failed to create branch');
    }
    return BranchSchema.parse(json.data);
  },

  async update(id: number, payload: BranchRequest) {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(BranchRequestSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message ?? json?.error ?? 'Failed to update branch');
    }
    return BranchSchema.parse(json.data);
  },

  async patch(id: number, payload: BranchPatch) {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(BranchPatchSchema.parse(payload)),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message ?? json?.error ?? 'Failed to patch branch');
    }
    return BranchSchema.parse(json.data);
  },

  async delete(id: number) {
    const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      await extractError(res, 'Failed to delete branch');
    }
  },
};
