import { pawnLoanService } from '@/services/loanService';
import { useQuery } from '@tanstack/react-query';

export function usePawnLoans(page = 0, size = 10) {
  return useQuery({
    queryKey: ['pawn-loans', page, size],
    queryFn: () => pawnLoanService.getAll(page, size),
  });
}
