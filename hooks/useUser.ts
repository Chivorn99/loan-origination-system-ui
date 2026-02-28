import { useQuery } from '@tanstack/react-query';
import { getCurrentUserService } from '@/services/userService';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUserService,
  });
};
