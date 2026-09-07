const TOKEN_KEY = "dorty_auth_token";
const EXPIRES_KEY = "dorty_auth_expires_at";
const ROLE_KEY = "dorty_auth_role";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export type AuthRole = "Manager" | "Employee";

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): AuthRole | null {
  const payload = decodeJwtPayload(token);
  const role = payload?.[ROLE_CLAIM];

  return role === "Manager" || role === "Employee" ? role : null;
}

export function saveAuthSession(token: string, expiresAt: string) {
  const role = getRoleFromToken(token);

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, expiresAt);
  if (role) localStorage.setItem(ROLE_KEY, role);
  else localStorage.removeItem(ROLE_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getAuthToken() {
  if (typeof localStorage === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_KEY);

  if (!token || !expiresAt) return null;
  if (new Date(expiresAt).getTime() <= Date.now()) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function getAuthRole(): AuthRole | null {
  if (!getAuthToken()) return null;

  const role = localStorage.getItem(ROLE_KEY);
  return role === "Manager" || role === "Employee" ? role : null;
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
