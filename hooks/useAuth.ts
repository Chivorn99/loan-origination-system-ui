import { loginService, registerService, logoutService } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({ mutationFn: loginService });
};

export const useRegister = () => {
  return useMutation({ mutationFn: registerService });
};

export const useLogout = () => {
  return useMutation({ mutationFn: logoutService });
};
