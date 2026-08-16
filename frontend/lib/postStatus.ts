/** Canonical post statuses used across admin + public (T11). */
export type PostStatus = "Published" | "Draft" | "Unpublished";

export function normalizePostStatus(raw?: string | null): PostStatus {
  const s = String(raw || "Draft").trim().toLowerCase();
  if (s === "published" || s === "publish" || s === "live") return "Published";
  if (s === "unpublished" || s === "unpublish" || s === "private") return "Unpublished";
  return "Draft";
}

export function isPostLive(post: { status?: string; isPublished?: boolean }) {
  if (post.isPublished === true) return true;
  return normalizePostStatus(post.status) === "Published";
}

export function postStatusBadgeClass(status?: string | null) {
  const s = normalizePostStatus(status);
  if (s === "Published") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  }
  if (s === "Unpublished") {
    return "bg-slate-100 text-slate-600 border border-slate-200";
  }
  return "bg-amber-50 text-amber-600 border border-amber-100";
}
