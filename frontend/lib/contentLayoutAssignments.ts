import classification from "../../../contracts/template-classification-v1.js";

const { isPublishedTemplate, layoutKindFromTemplate } = classification;

export type ContentLayoutKind = "single-post" | "blog-archive";

export type ContentLayoutOption = {
  id: number;
  name: string;
  type: string;
  status: string;
  category?: string | null;
  layoutJson?: {
    kind?: ContentLayoutKind | string;
    blocks?: unknown[];
    metadata?: { origin?: string };
  };
};

export type CategoryContentLayoutOption = ContentLayoutOption & {
  category: string;
};

export function normalizeTemplateList(raw: unknown): ContentLayoutOption[] {
  if (Array.isArray(raw)) return raw as ContentLayoutOption[];
  if (raw && typeof raw === "object") {
    const templates = (raw as { templates?: unknown }).templates;
    if (Array.isArray(templates)) return templates as ContentLayoutOption[];
  }
  return [];
}

export function publishedContentLayouts(raw: unknown): ContentLayoutOption[] {
  return normalizeTemplateList(raw).filter((layout) => isPublishedTemplate(layout));
}

export function groupContentLayouts(layouts: ContentLayoutOption[]) {
  return {
    "single-post": layouts.filter(
      (layout) => layoutKindFromTemplate(layout) === "single-post",
    ),
    "blog-archive": layouts.filter(
      (layout) => layoutKindFromTemplate(layout) === "blog-archive",
    ),
  } satisfies Record<ContentLayoutKind, ContentLayoutOption[]>;
}

export function globalLayoutFor(
  layouts: ContentLayoutOption[],
  kind: ContentLayoutKind,
): ContentLayoutOption | null {
  return (
    layouts.find(
      (layout) =>
        layoutKindFromTemplate(layout) === kind &&
        layout.category === "global_default",
    ) || null
  );
}

export function categoryLayoutOverrides(
  layouts: ContentLayoutOption[],
): CategoryContentLayoutOption[] {
  return layouts.filter(
    (layout): layout is CategoryContentLayoutOption =>
      isPublishedTemplate(layout) &&
      typeof layout.category === "string" &&
      layout.category.length > 0 &&
      layout.category !== "global_default",
  );
}
