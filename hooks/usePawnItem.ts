'use client';

import { useMutation } from '@tanstack/react-query';
import { createPawnItemService } from '@/services/pawnItemService';

export const useCreatePawnItem = () => {
  return useMutation({
    mutationFn: createPawnItemService,
  });
};
