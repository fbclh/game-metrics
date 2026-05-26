const SESSION_COOKIE = 'mm_session_id';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${ONE_YEAR_SECONDS}; path=/; SameSite=Lax`;
}

export function getSessionId(): string {
  const existing = readCookie(SESSION_COOKIE);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  writeCookie(SESSION_COOKIE, sessionId);
  return sessionId;
}
