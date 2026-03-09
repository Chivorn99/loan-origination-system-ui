import { useMutation } from '@tanstack/react-query';
import { loginService, logoutService, registerService } from '@/services/authService';

export const useLogin = () => useMutation({ mutationFn: loginService });
export const useLogout = () => useMutation({ mutationFn: logoutService });
export const useRegister = () => useMutation({ mutationFn: registerService });