/**
 * Resolve media/logo URLs for public site shell (T14).
 */
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }
  return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}
