import { LoginPayload, LoginSchema, AuthResponseSchema } from '@/validations/auth';

export const loginService = async (payload: LoginPayload) => {
  const parsed = LoginSchema.parse(payload);

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsed),
  });

  if (!res.ok) {
    throw new Error('Invalid username or password');
  }

  const json = await res.json();
  const parsedResponse = AuthResponseSchema.parse(json);

  return parsedResponse;
};
