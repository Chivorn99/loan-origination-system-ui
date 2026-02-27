import {
  PawnLoanResponseSchema,
  PawnLoanSchema,
  CreateFullLoanPayload,
  CreateFullLoanSchema,
} from '@/validations/loan';

export const getAllLoansService = async (page = 0, size = 10) => {
  const res = await fetch(`/api/pawn-loans?page=${page}&size=${size}`);

  if (!res.ok) {
    throw new Error('Failed to fetch loans');
  }

  const json = await res.json();

  return PawnLoanResponseSchema.parse(json);
};

export const getLoansByStatusService = async (status: string, page = 0, size = 10) => {
  const res = await fetch(`/api/pawn-loans/status/${status}?page=${page}&size=${size}`);

  if (!res.ok) {
    throw new Error('Failed to fetch loans by status');
  }

  const json = await res.json();
  return PawnLoanResponseSchema.parse(json);
};

export const getLoanDetailService = async (id: string) => {
  const res = await fetch(`/api/pawn-loans/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch loan detail');
  }

  const json = await res.json();

  return PawnLoanSchema.parse(json.data);
};

export const getLoanByCodeService = async (code: string) => {
  const res = await fetch(`/api/pawn-loans/code/${code}`);

  if (!res.ok) {
    throw new Error('Loan not found');
  }

  const json = await res.json();

  return PawnLoanSchema.parse(json.data);
};

export const createFullLoanService = async (payload: CreateFullLoanPayload) => {
  const parsed = CreateFullLoanSchema.parse(payload);

  const res = await fetch('/api/pawn-loans/create-full', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsed),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || 'Failed to create loan');
  }

  return PawnLoanSchema.parse(json.data);
};

export const redeemLoanService = async (id: string) => {
  const res = await fetch(`/api/pawn-loans/${id}/redeem`, { method: 'POST' });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || 'Failed to redeem loan');
  }

  return PawnLoanSchema.parse(json.data);
};

export const defaultLoanService = async (id: string) => {
  const res = await fetch(`/api/pawn-loans/${id}/default`, { method: 'POST' });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || 'Failed to mark loan defaulted');
  }

  return PawnLoanSchema.parse(json.data);
};

export const loanPaymentScheduleService = async (id: string) => {
  const res = await fetch(`/api/pawn-loans/${id}/payment-schedule`);

  if (!res.ok) {
    throw new Error('Failed to fetch payment schedule');
  }

  const json = await res.json();

  return json.data;
};

export const loanOverdueService = async (id: string) => {
  const res = await fetch(`/api/pawn-loans/${id}/overdue`);

  if (!res.ok) {
    throw new Error('Failed to check overdue status');
  }

  const json = await res.json();

  return json.data as boolean;
};
