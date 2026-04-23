export interface LayoutBlock {
  type: string;
  content?: string;
  cardTemplate?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BlockProps {
  block: LayoutBlock;
  resolvedContent: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isLoop?: boolean;
}
