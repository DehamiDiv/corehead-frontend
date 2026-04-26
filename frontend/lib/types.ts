export type BlockType =
  | "Heading"
  | "Paragraph"
  | "Image"
  | "Quote"
  | "Divider"
  | "Button"
  | "Container"
  | "Columns"
  | "Collection List"
  | "RichText";

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content?: any; // Text content, image URL, etc.
  styles?: Record<string, string>;
  bindings?: Record<string, string>; // e.g. { content: "post.title" }
  parentId?: string;
}
