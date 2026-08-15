export function isPublishedTemplate(template) {
  if (!template) return false;
  const status = String(template.status || "").toLowerCase();
  return status === "published";
}

export function layoutKindFromTemplate(template) {
  if (!template) return "single-post";
  if (template.layoutJson?.kind) return template.layoutJson.kind;
  const type = String(template.type || "").toLowerCase();
  if (type.includes("archive") || type.includes("loop")) return "blog-archive";
  return "single-post";
}

export function templateOrigin(template) {
  return template?.layoutJson?.metadata?.origin || template?.origin || "manual";
}

export default {
  isPublishedTemplate,
  layoutKindFromTemplate,
  templateOrigin,
};
