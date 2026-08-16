export function prepareRenderableLayout(input: any, options?: any): {
  document: any;
  blocks: any[];
  issues: Array<{ code: string; path: string; message: string }>;
  valid: boolean;
};

const _default: {
  prepareRenderableLayout: typeof prepareRenderableLayout;
};
export default _default;
