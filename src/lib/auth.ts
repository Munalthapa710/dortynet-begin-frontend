const TOKEN_KEY = "dorty_auth_token";
const EXPIRES_KEY = "dorty_auth_expires_at";

export function saveAuthSession(token: string, expiresAt: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, expiresAt);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
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

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
