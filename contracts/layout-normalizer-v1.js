export function normalizeLayoutDocumentV1(input, options = {}) {
  const blocks = Array.isArray(input)
    ? input
    : Array.isArray(input?.blocks)
    ? input.blocks
    : [];

  const document = {
    schemaVersion: "1.0",
    kind: options.kind || input?.kind || "single-post",
    name: options.name || input?.name || "Untitled Layout",
    blocks,
    metadata: {
      origin: options.origin || input?.metadata?.origin || "manual",
    },
  };

  return { document };
}

export default {
  normalizeLayoutDocumentV1,
};
