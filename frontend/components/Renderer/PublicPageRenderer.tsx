import React from 'react';
import { BindingResolver } from './BindingResolver';
import { BlockRegistry } from './BlockRegistry';
import { LayoutBlock } from './blocks/types';

interface Layout {
  blocks: LayoutBlock[];
}

interface PageRendererProps {
  layout: Layout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | any[]; // single post or array of posts
  isLoop?: boolean; // whether the data is an array intended for a loop
}

export function PublicPageRenderer({ layout, data, isLoop = false }: PageRendererProps) {
  if (!layout || !layout.blocks) return null;

  return (
    <div className="public-rendered-page">
      {layout.blocks.map((block, index) => {
        // Resolve bindings for single data
        const singleData = isLoop && Array.isArray(data) ? {} : data;
        const resolvedContent = BindingResolver(block.content || '', singleData);

        // Find the appropriate component from the registry, fallback to 'html'
        const BlockComponent = BlockRegistry[block.type] || BlockRegistry['html'];

        return (
          <BlockComponent 
            key={index}
            block={block}
            resolvedContent={resolvedContent}
            data={data}
            isLoop={isLoop}
          />
        );
      })}
    </div>
  );
}
