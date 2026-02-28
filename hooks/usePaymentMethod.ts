import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodService, PaymentMethodParams } from '@/services/paymentMethodService';
import { PaymentMethodRequest, PaymentMethodPatch } from '@/validations/paymentMethod';

const QUERY_KEY = 'payment-methods';

export function usePaymentMethods(params: PaymentMethodParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => paymentMethodService.getAll(params),
  });
}

export function usePaymentMethod(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => paymentMethodService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentMethodRequest) => paymentMethodService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentMethodRequest }) =>
      paymentMethodService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function usePatchPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentMethodPatch }) =>
      paymentMethodService.patch(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentMethodService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
