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

import { useQuery, useMutation } from '@tanstack/react-query';

export const usePawnLoans = (page = 0, size = 10, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['pawn-loans', page, size, status, search],

    queryFn: async () => {
      if (search && search.trim() !== '') {
        const loan = await getLoanByCodeService(search);

        return {
          success: true,
          message: '',
          data: {
            content: [loan],
            totalElements: 1,
            totalPages: 1,
            size: 1,
            number: 0,
          },
        };
      }

      if (status) {
        return getLoansByStatusService(status, page, size);
      }
      return getAllLoansService(page, size);
    },
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

export const useCreateFullLoan = () => {
  return useMutation({
    mutationFn: createFullLoanService,
  });
};

export const useRedeemLoan = () => {
  return useMutation({
    mutationFn: redeemLoanService,
  });
};

export const useDefaultLoan = () => {
  return useMutation({
    mutationFn: defaultLoanService,
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
