import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
});

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Email should be valid').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
  roleId: z.number(),
  branchId: z.number().optional(),
});

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export type RegisterPayload = {
  username: string;
  email?: string;
  password: string;
  phoneNumber?: string;
  roleId: number;
  branchId?: number;
};

export type LogoutResponse = string;
