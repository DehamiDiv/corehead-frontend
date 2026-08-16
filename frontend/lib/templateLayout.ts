import {
  normalizeLayoutDocumentV1,
  validateLayoutDocumentV1,
  type LayoutBlockV1,
  type LayoutDocumentV1,
  type LayoutKind,
  type LayoutOrigin,
} from "@/lib/layoutContract";

export function templateTypeToKind(type?: string): LayoutKind {
  const normalized = String(type || "").trim().toLowerCase();
  const normalizedWords = normalized.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (
    normalizedWords === "home" ||
    normalizedWords.includes("home page") ||
    normalizedWords.includes("homepage")
  ) {
    return "home-page";
  }
  if (
    normalized.includes("archive") ||
    normalized.includes("loop") ||
    normalized.includes("collection") ||
    normalized === "list"
  ) {
    return "blog-archive";
  }
  return "single-post";
}

export function kindToTemplateType(kind: LayoutKind): "Single Post" | "Blog Archive" | "Home Page" {
  if (kind === "home-page") return "Home Page";
  return kind === "blog-archive" ? "Blog Archive" : "Single Post";
}

export function defaultLayoutDocument(
  type: string = "Single Post",
  name: string = "New Layout",
): LayoutDocumentV1 {
  const kind = templateTypeToKind(type);
  if (kind === "blog-archive") {
    return {
      schemaVersion: "1.0",
      kind,
      name,
      metadata: { origin: "manual" },
      blocks: [
        { id: "archive-heading", type: "Heading", content: "Latest Posts", level: 1 },
        {
          id: "archive-posts",
          type: "Collection List",
          content: { limit: 12, category: "" },
        },
      ],
    };
  }
  if (kind === "home-page") {
    return {
      schemaVersion: "1.0",
      kind,
      name,
      metadata: { origin: "manual" },
      blocks: [
        {
          id: "home-title",
          type: "Heading",
          content: "Site name",
          level: 1,
          bindings: { content: "site.name" },
        },
        {
          id: "home-tagline",
          type: "Paragraph",
          content: "Stories, ideas, and updates from our team.",
          bindings: { content: "site.tagline" },
        },
        {
          id: "home-posts-heading",
          type: "Heading",
          content: "Latest stories",
          level: 2,
        },
        {
          id: "home-posts",
          type: "Collection List",
          content: { limit: 6, category: "" },
        },
      ],
    };
  }
  return {
    schemaVersion: "1.0",
    kind,
    name,
    metadata: { origin: "manual" },
    blocks: [
      {
        id: "post-cover",
        type: "Image",
        content: "",
        bindings: { content: "post.coverImage" },
      },
      {
        id: "post-title",
        type: "Heading",
        content: "",
        level: 1,
        bindings: { content: "post.title" },
      },
      {
        id: "post-body",
        type: "Paragraph",
        content: "",
        bindings: { content: "post.contentHtml" },
      },
    ],
  };
}

export function prepareLayoutForSave(
  input: unknown,
  options: {
    name: string;
    type: string;
    status: string;
    origin?: LayoutOrigin;
  },
) {
  const normalized = normalizeLayoutDocumentV1(input, {
    name: options.name,
    kind: templateTypeToKind(options.type),
    origin: options.origin || "manual",
  });
  const document: LayoutDocumentV1 = {
    ...normalized.document,
    name: options.name.trim(),
    kind: templateTypeToKind(options.type),
    blocks: normalized.document.blocks as LayoutBlockV1[],
    metadata: {
      ...normalized.document.metadata,
      origin: normalized.document.metadata?.origin || options.origin || "manual",
    },
  };
  const validation = validateLayoutDocumentV1(document, {
    semantic: options.status.toLowerCase() === "published",
  });
  if (!validation.valid) {
    const error = new Error(
      validation.errors.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
    );
    error.name = "LayoutValidationError";
    throw error;
  }
  return {
    document,
    sourceFormat: normalized.sourceFormat,
    warnings: [...normalized.warnings, ...validation.warnings],
  };
}
