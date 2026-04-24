import React from 'react';
import { BindingResolver } from './BindingResolver';
import { BlockRegistry } from './BlockRegistry';
import { LayoutBlock } from './blocks/types';

interface Layout {
  blocks: LayoutBlock[];
}

interface Bindings {
  mode: string;
  selected: Record<string, boolean>;
}

interface PageRendererProps {
  layout: Layout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | any[]; // single post or array of posts
  isLoop?: boolean; // whether the data is an array intended for a loop
  bindings?: Bindings;
}

export function PublicPageRenderer({ layout, data, isLoop = false, bindings }: PageRendererProps) {
  if (!layout || !layout.blocks) return null;

  // Filter entire blocks if necessary (e.g. authorbox)
  let finalBlocks = layout.blocks;
  if (bindings?.selected) {
    finalBlocks = finalBlocks.filter(block => {
      if (block.type === 'authorbox' && bindings.selected['author.info'] === false) return false;
      if (block.type === 'comments' && bindings.selected['post.comments'] === false) return false;
      return true;
    });
  }

  return (
    <div className="public-rendered-page">
      {finalBlocks.map((block, index) => {
        // Resolve bindings for single data
        const singleData = isLoop && Array.isArray(data) ? {} : data;
        let content = block.content || '';

        // Dynamically strip elements based on user's bindings configuration
        if (bindings?.selected) {
           if (bindings.selected['post.coverImage'] === false) {
              content = content.replace(/<img[^>]*>/ig, ''); // Strip images
           }
           if (bindings.selected['post.title'] === false) {
              content = content.replace(/<h1[^>]*>.*?<\/h1>/ig, ''); // Strip h1 titles
           }
           if (bindings.selected['post.excerpt'] === false) {
              // Usually mapped to paragraph right after h1 in our mock
              content = content.replace(/<p[^>]*>.*?<\/p>/i, ''); // Strip first paragraph (mock excerpt)
           }
        }

        const resolvedContent = BindingResolver(content, singleData);

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
