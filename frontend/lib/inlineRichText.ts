/**
 * Helpers for inline rich-text formatting in Paragraph, Heading, and Quote blocks.
 * Preserves line breaks, emojis, and safe inline formatting tags while stripping
 * scripts and unsafe attributes.
 */

const INLINE_HTML_TAG_REGEX = /<(b|strong|i|em|u|s|strike|a|span|mark|code|br|div|p)(\s|>|\/)/i;

export function hasInlineHtml(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return INLINE_HTML_TAG_REGEX.test(value);
}

/**
 * Sanitizes inline rich-text HTML produced by contentEditable / execCommand.
 * Keeps safe formatting tags and safe color/background-color/href attributes.
 */
export function sanitizeInlineRichHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  const ALLOWED_TAGS = new Set([
    "B", "STRONG", "I", "EM", "U", "S", "STRIKE",
    "A", "SPAN", "MARK", "CODE", "BR", "DIV", "P", "FONT",
  ]);

  function cleanNode(node: Node): void {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toUpperCase();

        if (!ALLOWED_TAGS.has(tag)) {
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME") {
            el.remove();
            continue;
          }
          // Unwrap disallowed tags but keep text/safe children
          cleanNode(el);
          const frag = doc.createDocumentFragment();
          while (el.firstChild) frag.appendChild(el.firstChild);
          el.replaceWith(frag);
          continue;
        }

        // Convert <font color="..."> to <span style="color:...">
        if (tag === "FONT") {
          const color = el.getAttribute("color");
          const span = doc.createElement("span");
          if (color && /^#[0-9a-fA-F]{3,8}$|^rgb\(|^[a-zA-Z]+$/.test(color.trim())) {
            span.style.color = color.trim();
          }
          while (el.firstChild) span.appendChild(el.firstChild);
          el.replaceWith(span);
          cleanNode(span);
          continue;
        }

        // Strip all attributes except safe ones
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          if (tag === "A" && name === "href") {
            const val = attr.value.trim();
            if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(val)) {
              el.removeAttribute("href");
            } else {
              el.setAttribute("target", "_blank");
              el.setAttribute("rel", "noopener noreferrer");
            }
          } else if (tag === "A" && (name === "target" || name === "rel")) {
            // handled above
          } else if (name === "style") {
            const safeColor = el.style.color;
            const safeBg = el.style.backgroundColor;
            const safeDec = el.style.textDecoration;
            const safeWeight = el.style.fontWeight;
            const safeStyle = el.style.fontStyle;
            el.removeAttribute("style");
            if (safeColor) el.style.color = safeColor;
            if (safeBg) el.style.backgroundColor = safeBg;
            if (safeDec) el.style.textDecoration = safeDec;
            if (safeWeight) el.style.fontWeight = safeWeight;
            if (safeStyle) el.style.fontStyle = safeStyle;
          } else {
            el.removeAttribute(attr.name);
          }
        }

        cleanNode(el);
      }
    }
  }

  cleanNode(root);
  return root.innerHTML;
}
