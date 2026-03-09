import { authHeaders } from '@/lib/api';
import {
  AuthResponse,
  AuthResponseSchema,
  LoginPayload,
  LoginSchema,
  RegisterPayload,
  RegisterSchema,
} from '@/validations/auth';

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

export const logoutService = async () => {
  await fetch(`${API}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  // The server-side /logout endpoint is responsible for clearing the HttpOnly cookie.
  // Avoid attempting to clear HttpOnly cookies from client-side code.
};

export const registerService = async (payload: RegisterPayload) => {
  const parsed = RegisterSchema.parse(payload);
  const res = await fetch(`${API}/register`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(parsed) });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
};
