import { currencyService } from '@/services/currencyService';
import { useQuery } from '@tanstack/react-query';

export function useCurrencies(page = 0, size = 10, status?: string) {
  return useQuery({
    queryKey: ['currencies', page, size, status],
    queryFn: () => currencyService.getAll(page, size, status),
  });
}

export function useCurrency(id: number) {
  return useQuery({
    queryKey: ['currencies', id],
    queryFn: () => currencyService.getById(id),
    enabled: !!id,
  });
}
