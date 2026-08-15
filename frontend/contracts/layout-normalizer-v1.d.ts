export function normalizeLayoutDocumentV1(input: any, options?: any): {
  document: {
    schemaVersion: "1.0";
    kind: any;
    name: any;
    blocks: any[];
    metadata: { origin: any };
  };
  warnings: any[];
  issues: any[];
};

const _default: {
  normalizeLayoutDocumentV1: typeof normalizeLayoutDocumentV1;
};
export default _default;
