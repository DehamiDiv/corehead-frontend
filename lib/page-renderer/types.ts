export type ComponentType = 
  | "container"
  | "heading"
  | "text"
  | "image"
  | "button"
  | "row"
  | "column"
  // Blog Specific
  | "post_title"
  | "post_content"
  | "post_image"
  | "post_meta"
  | "blog_loop"
  | "navbar"
  | "footer"
  | "pagination";

export interface ComponentNode {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  children?: ComponentNode[];
}

export interface RenderContext {
  post?: any;
  posts?: any[];
  [key: string]: any;
}
