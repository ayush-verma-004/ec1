/* ─────────────────────────────────────────────────────────────────────────
   JWT / Auth Utilities
   ───────────────────────────────────────────────────────────────────────── */

const TOKEN_KEY = 'econe_auth_token';
const ROLE_KEY  = 'econe_user_role';
const EMAIL_KEY = 'econe_user_email';

/** Save JWT + role after login */
export const setSession = (token, role, email) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (email) localStorage.setItem(EMAIL_KEY, email);
};

/** Get stored JWT */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Get stored role */
export const getRole = () => localStorage.getItem(ROLE_KEY);

/** Clear all auth data (logout) */
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  sessionStorage.clear();
};

/** Check if user is currently "authenticated" (has a token) */
export const isAuthenticated = () => !!getToken();

/**
 * Decode the JWT payload WITHOUT verifying signature (client-side only).
 * Returns the claims object or null if token is malformed.
 */
export const decodeToken = (token = getToken()) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Returns true if the stored JWT has expired (exp claim is in the past).
 * Returns false if token is missing or has no exp claim (treat as valid).
 */
export const isTokenExpired = () => {
  const claims = decodeToken();
  if (!claims || !claims.exp) return false;
  return Date.now() / 1000 > claims.exp;
};

/**
 * Get the Authorization header value for Axios/fetch calls.
 * Returns null if no token is present.
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : null;
};
