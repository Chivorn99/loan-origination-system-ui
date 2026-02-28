import { authHeaders } from '@/lib/api';
import { UserSchema } from '@/validations/user';

export const getCurrentUserService = async () => {
  const res = await fetch('/api/users/me', {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch user');

  const json = await res.json();

  return UserSchema.parse(json.data);
};
