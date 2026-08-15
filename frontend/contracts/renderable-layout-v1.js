export function prepareRenderableLayout(input, options = {}) {
  const blocks = Array.isArray(input)
    ? input
    : Array.isArray(input?.blocks)
    ? input.blocks
    : [];

  return {
    blocks: blocks.map((b, i) => ({
      id: b.id || `block-${i}`,
      type: b.type || "Paragraph",
      content: b.content ?? "",
      styles: b.styles || {},
      bindings: b.bindings || {},
    })),
    issues: [],
    valid: true,
  };
}

export default {
  prepareRenderableLayout,
};
