export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match) return decodeURIComponent(match[1]);
  // No client-side fallback: prefer HttpOnly cookie managed by the server for security.
  return null;
};

export const authHeaders = (): HeadersInit => {
  const token = getTokenFromCookie();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};
