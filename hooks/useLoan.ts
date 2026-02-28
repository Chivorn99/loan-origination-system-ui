import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  pawnLoanService,
  getLoanDetailService,
  getLoanByCodeService,
  createFullLoanService,
  redeemLoanService,
  defaultLoanService,
  loanPaymentScheduleService,
  loanOverdueService,
} from '@/services/loanService';
import type { PawnLoanDetail, PawnLoanPageResponse, CreateFullLoanPayload } from '@/validations/loan';

export function usePawnLoans(page = 0, size = 10, status?: string, customerId?: number) {
  return useQuery<PawnLoanPageResponse>({
    queryKey: ['pawn-loans', page, size, status, customerId],
    queryFn: () => {
      if (customerId) return pawnLoanService.getByCustomer(customerId, page, size);
      if (status) return pawnLoanService.getByStatus(status, page, size);
      return pawnLoanService.getAll(page, size);
    },
  });
}

export function usePawnLoanDetail(id: string) {
  return useQuery<PawnLoanDetail>({
    queryKey: ['pawn-loans', id],
    queryFn: () => getLoanDetailService(id),
    enabled: !!id,
  });
}

export function useLoanByCode(code: string) {
  return useQuery<PawnLoanDetail>({
    queryKey: ['pawn-loans', 'code', code],
    queryFn: () => getLoanByCodeService(code),
    enabled: !!code,
  });
}

export const useCreateFullLoan = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<PawnLoanDetail, Error, CreateFullLoanPayload>({
    mutationFn: createFullLoanService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      onSuccess?.();
    },
  });
};

export const useRedeemLoan = () => {
  const queryClient = useQueryClient();

  return useMutation<PawnLoanDetail, Error, string>({
    mutationFn: redeemLoanService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      queryClient.invalidateQueries({ queryKey: ['pawn-loans', id] });
    },
  });
};

export const useDefaultLoan = () => {
  const queryClient = useQueryClient();

  return useMutation<PawnLoanDetail, Error, string>({
    mutationFn: defaultLoanService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      queryClient.invalidateQueries({ queryKey: ['pawn-loans', id] });
    },
  });
};

export function useLoanPaymentSchedule(id: string) {
  return useQuery({
    queryKey: ['pawn-loans', id, 'schedule'],
    queryFn: () => loanPaymentScheduleService(id),
    enabled: !!id,
  });
}

export function useLoanOverdue(id: string) {
  return useQuery<boolean>({
    queryKey: ['pawn-loans', id, 'overdue'],
    queryFn: () => loanOverdueService(id),
    enabled: !!id,
  });
}
