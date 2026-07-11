/**
 * Helpers so post body HTML previews/renders as real markup,
 * not as visible &lt;p&gt; tags.
 */

export function looksLikeHtml(value: unknown): boolean {
  return typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value);
}

/** True when markup was stored as entities: &lt;p&gt;... */
export function looksLikeEntityEncodedHtml(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const hasEntities = /&lt;\/?[a-z]/i.test(value);
  const hasRealTags = /<\/?[a-z][\s\S]*>/i.test(value);
  return hasEntities && !hasRealTags;
}

export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  // Prefer browser decoder when available
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      const t = document.createElement("textarea");
      t.innerHTML = str;
      return t.value;
    } catch {
      /* fall through */
    }
  }
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * Prepare stored post content for dangerouslySetInnerHTML.
 * - Decodes double-escaped HTML once
 * - Leaves real HTML as-is
 * - Wraps plain text in <p> blocks
 */
export function preparePostHtml(raw: unknown): string {
  let s = String(raw ?? "").trim();
  if (!s) {
    return `<p class="text-slate-400">No content yet.</p>`;
  }

  // Decode entity-encoded HTML (paste into Quill / plain save)
  if (looksLikeEntityEncodedHtml(s)) {
    s = decodeHtmlEntities(s).trim();
  }

  // Second pass if still double-encoded
  if (looksLikeEntityEncodedHtml(s)) {
    s = decodeHtmlEntities(s).trim();
  }

  if (looksLikeHtml(s)) {
    return s;
  }

  // Plain text → simple paragraphs
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}
