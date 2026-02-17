import React from "react";
import { ComponentNode, RenderContext } from "./types";
import { COMPONENT_REGISTRY } from "./registry";

interface PageRendererProps {
  layout: ComponentNode[];
  context: RenderContext;
}

const renderNode = (node: ComponentNode, context: RenderContext): React.ReactNode => {
  const Component = COMPONENT_REGISTRY[node.type];

  if (!Component) {
    console.warn(`Component type "${node.type}" not found in registry.`);
    return null;
  }

  // Resolve props (simple string replacement for now, could be more complex)
  const resolvedProps = resolveProps(node.props || {}, context);

  return (
    <Component key={node.id} {...resolvedProps} context={context}>
      {node.children?.map((child) => renderNode(child, context))}
    </Component>
  );
};

const resolveProps = (props: Record<string, any>, context: RenderContext) => {
  const newProps = { ...props };
  // Basic interpolation logic if needed, but registry components handle context directly mostly.
  // Example: content: "{{post.title}}"
  Object.keys(newProps).forEach((key) => {
    if (typeof newProps[key] === "string" && newProps[key].startsWith("{{") && newProps[key].endsWith("}}")) {
       const path = newProps[key].slice(2, -2).trim(); // e.g., "post.title"
       const value = getNestedValue(context, path);
       if (value !== undefined) newProps[key] = value;
    }
  });
  return newProps;
};

const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : undefined, obj);
}

export default function PageRenderer({ layout, context }: PageRendererProps) {
  if (!layout || !Array.isArray(layout)) return null;

  return <>{layout.map((node) => renderNode(node, context))}</>;
}
