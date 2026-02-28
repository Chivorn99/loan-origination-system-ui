import {
  getAllLoansService,
  getLoanDetailService,
  getLoanByCodeService,
  createFullLoanService,
  redeemLoanService,
  defaultLoanService,
  loanPaymentScheduleService,
  loanOverdueService,
  getLoansByStatusService,
} from '@/services/loanService';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePawnLoans = (page = 0, size = 10, status?: string) => {
  return useQuery({
    queryKey: ['pawn-loans', page, size, status ?? ''],
    queryFn: () => {
      if (status && status !== '') {
        return getLoansByStatusService(status, page, size);
      }

      return getAllLoansService(page, size);
    },
    placeholderData: previousData => previousData,
  });
};

export function usePawnLoanDetail(id: string) {
  return useQuery({
    queryKey: ['pawnLoanDetail', id],
    queryFn: () => getLoanDetailService(id),
    enabled: !!id,
  });
}

export function useLoanByCode(code: string) {
  return useQuery({
    queryKey: ['loanCode', code],
    queryFn: () => getLoanByCodeService(code),
    enabled: !!code,
  });
}

export const useCreateFullLoan = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFullLoanService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      onSuccess?.();
    },
  });
};

export const useRedeemLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: redeemLoanService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      queryClient.invalidateQueries({ queryKey: ['pawnLoanDetail', id] });
    },
  });
};

export const useDefaultLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: defaultLoanService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });
      queryClient.invalidateQueries({ queryKey: ['pawnLoanDetail', id] });
    },
  });
};

export function useLoanPaymentSchedule(id: string) {
  return useQuery({
    queryKey: ['loanSchedule', id],
    queryFn: () => loanPaymentScheduleService(id),
    enabled: !!id,
  });
}

export function useLoanOverdue(id: string) {
  return useQuery({
    queryKey: ['loanOverdue', id],
    queryFn: () => loanOverdueService(id),
    enabled: !!id,
  });
}