import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repaymentService } from '@/services/repaymentService';

export function useCreateRepayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repaymentService.create,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pawnLoanDetail', String(variables.pawnLoanId)],
      });

      queryClient.invalidateQueries({
        queryKey: ['repayments', variables.pawnLoanId],
      });
    },
  });
}
