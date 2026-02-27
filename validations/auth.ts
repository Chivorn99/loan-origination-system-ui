import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
