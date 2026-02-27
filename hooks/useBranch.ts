import { branchService } from '@/services/branchService';
import { useQuery } from '@tanstack/react-query';

export function useBranches(page = 0, size = 10, status?: string) {
  return useQuery({
    queryKey: ['branches', page, size, status],
    queryFn: () => branchService.getAll(page, size, status),
  });
}

export function useBranch(id: number) {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: () => branchService.getById(id),
    enabled: !!id,
  });
}
