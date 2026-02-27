import { createCustomerService, customerService } from '@/services/customerService';
import { useQuery, useMutation } from '@tanstack/react-query';

export function useCustomers(page = 0, size = 10, status?: string) {
  return useQuery({
    queryKey: ['customers', page, size, status],
    queryFn: () => customerService.getAll(page, size, status),
  });
}

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: createCustomerService,
  });
};
