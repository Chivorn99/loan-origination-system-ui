import {
  AuthResponse,
  AuthResponseSchema,
  LoginPayload,
  LoginSchema,
  RegisterPayload,
  RegisterSchema,
} from '@/validations/auth';
import { authHeaders } from '@/lib/api';

const API = '/api/auth';

export const loginService = async (payload: LoginPayload): Promise<AuthResponse> => {
  const parsed = LoginSchema.parse(payload);

  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  });

  if (!res.ok) throw new Error('Invalid username or password');

  const json = await res.json();
  return AuthResponseSchema.parse(json);
};

export const registerService = async (payload: RegisterPayload) => {
  const parsed = RegisterSchema.parse(payload);

  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(parsed),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Register failed');
  }

  return res.json();
};

export const logoutService = async () => {
  const res = await fetch(`${API}/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Logout failed');

  document.cookie = 'token=; path=/; max-age=0';

  return res.text();
};
