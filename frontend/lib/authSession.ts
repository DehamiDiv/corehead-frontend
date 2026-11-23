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

export function clearBuilderDraft() {
  if (!isBrowser()) return;
  localStorage.removeItem("corehead_builder_layout");
  localStorage.removeItem("corehead_builder_meta");
  localStorage.removeItem("corehead_builder_save_meta");
  localStorage.removeItem("ai_generated_layout");
  localStorage.removeItem("ai_options");
  localStorage.removeItem("ai_prompt");
  localStorage.removeItem("selected_template");
  try {
    sessionStorage.removeItem("corehead_builder_save_meta");
  } catch {
    /* ignore */
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
  user?: { role?: string; id?: string | number; [key: string]: unknown };
}) {
  if (!isBrowser()) return;

  // If a new or different user is logging in, always reset old builder canvas drafts
  try {
    const prevRaw = localStorage.getItem("user");
    const prevUser = prevRaw ? JSON.parse(prevRaw) : null;
    const prevId = prevUser?.id || prevUser?._id;
    const nextId = (data.user as any)?.id || (data.user as any)?._id;
    if (!prevId || !nextId || String(prevId) !== String(nextId)) {
      clearBuilderDraft();
    }
  } catch {
    clearBuilderDraft();
  }

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

/** Merge updated profile fields into the active browser session and notify admin chrome. */
export function updateStoredUser(userUpdates: Record<string, unknown>) {
  if (!isBrowser()) return userUpdates;

  let storedUser: Record<string, unknown> = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    /* Replace malformed legacy session data with the canonical update. */
  }

  const updatedUser = { ...storedUser, ...userUpdates };
  localStorage.setItem("user", JSON.stringify(updatedUser));
  window.dispatchEvent(new Event("local-storage-update"));
  return updatedUser;
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // legacy key
  clearCurrentSite();
  clearAuthCookies();
  clearBuilderDraft();
}
