import {
  PawnLoanPageResponseSchema,
  PawnLoanDetailResponseSchema,
  CreateFullLoanPayload,
  CreateFullLoanSchema,
} from '@/validations/loan';
import { authHeaders } from '@/lib/api';

const API = '/api/pawn-loans';

export const pawnLoanService = {
  async getAll(page = 0, size = 10) {
    const res = await fetch(`${API}?page=${page}&size=${size}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch loans');
    return PawnLoanPageResponseSchema.parse(await res.json());
  },

  async getByStatus(status: string, page = 0, size = 10) {
    const res = await fetch(`${API}/status/${status}?page=${page}&size=${size}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch loans by status');
    return PawnLoanPageResponseSchema.parse(await res.json());
  },

  async getByCustomer(customerId: number, page = 0, size = 10) {
    const res = await fetch(`${API}/customer/${customerId}/page?page=${page}&size=${size}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch loans by customer');
    return PawnLoanPageResponseSchema.parse(await res.json());
  },
};

export const getLoanDetailService = async (id: string) => {
  const res = await fetch(`${API}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch loan detail');
  return PawnLoanDetailResponseSchema.parse(await res.json()).data;
};

export const getLoanByCodeService = async (code: string) => {
  const res = await fetch(`${API}/code/${code}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Loan not found');
  return PawnLoanDetailResponseSchema.parse(await res.json()).data;
};

export const createFullLoanService = async (payload: CreateFullLoanPayload) => {
  const parsed = CreateFullLoanSchema.parse(payload);
  const res = await fetch(`${API}/create-full`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(parsed),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed to create loan');
  return PawnLoanDetailResponseSchema.parse(json).data;
};

export const redeemLoanService = async (id: string) => {
  const res = await fetch(`${API}/${id}/redeem`, { method: 'POST', headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed to redeem loan');
  return PawnLoanDetailResponseSchema.parse(json).data;
};

export const defaultLoanService = async (id: string) => {
  const res = await fetch(`${API}/${id}/default`, { method: 'POST', headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed to mark loan defaulted');
  return PawnLoanDetailResponseSchema.parse(json).data;
};

export const loanPaymentScheduleService = async (id: string) => {
  const res = await fetch(`${API}/${id}/payment-schedule`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch payment schedule');
  const json = await res.json();
  return json.data;
};

export const loanOverdueService = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API}/${id}/overdue`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to check overdue status');
  const json = await res.json();
  return json.data as boolean;
};