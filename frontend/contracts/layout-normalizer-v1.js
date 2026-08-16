export function normalizeLayoutDocumentV1(input, options = {}) {
  let parsedInput = input;
  if (typeof input === "string") {
    try {
      parsedInput = JSON.parse(input);
    } catch (e) {
      console.error("Normalizer failed to parse input string", e);
      parsedInput = {};
    }
  }

  const blocks = Array.isArray(parsedInput)
    ? parsedInput
    : Array.isArray(parsedInput?.blocks)
    ? parsedInput.blocks
    : [];

  const document = {
    schemaVersion: "1.0",
    kind: options.kind || parsedInput?.kind || "single-post",
    name: options.name || parsedInput?.name || "Untitled Layout",
    blocks,
    metadata: {
      origin: options.origin || parsedInput?.metadata?.origin || "manual",
    },
  };

  return { document, warnings: [], sourceFormat: "JSON" };
}

export default {
  normalizeLayoutDocumentV1,
};
