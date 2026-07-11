/**
 * R5-1 — Keep middleware cookies in sync with localStorage tokens.
 */
import { clearCurrentSite } from "@/lib/siteStorage";

const DAY = 60 * 60 * 24;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Set cookie readable by Next middleware (not HttpOnly — matches existing app). */
export function setAuthCookies(accessToken: string, role?: string | null) {
  if (!isBrowser()) return;
  // Access tokens are short-lived; cookie max-age still allows middleware checks
  // until refresh fails. 7d matches refresh window loosely.
  document.cookie = `auth_token=${encodeURIComponent(accessToken)}; path=/; max-age=${DAY * 7}; SameSite=Lax`;
  if (role != null && role !== "") {
    document.cookie = `user_role=${encodeURIComponent(String(role))}; path=/; max-age=${DAY * 7}; SameSite=Lax`;
  }
}

export function clearAuthCookies() {
  if (!isBrowser()) return;
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax";
}

export function persistSession(data: {
  accessToken: string;
  refreshToken?: string;
  user?: { role?: string; [key: string]: unknown };
}) {
  if (!isBrowser()) return;
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  const role =
    data.user?.role ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}")?.role;
      } catch {
        return undefined;
      }
    })();
  setAuthCookies(data.accessToken, role);
}

/** Update access token after refresh — always sync cookie. */
export function persistAccessToken(accessToken: string) {
  if (!isBrowser()) return;
  localStorage.setItem("accessToken", accessToken);
  let role: string | undefined;
  try {
    role = JSON.parse(localStorage.getItem("user") || "{}")?.role;
  } catch {
    /* ignore */
  }
  setAuthCookies(accessToken, role);
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // legacy key
  clearCurrentSite();
  clearAuthCookies();
}
