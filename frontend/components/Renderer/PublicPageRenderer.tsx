import { BindingResolver } from './BindingResolver';

interface LayoutBlock {
  type: string;
  content?: string;
  cardTemplate?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

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
        if (block.type === 'loop' && isLoop && Array.isArray(data)) {
          // Render loop template multiple times
          return (
            <div key={index} className="rendered-loop">
              {data.map((item, itemIndex) => {
                const resolvedHtml = BindingResolver(block.cardTemplate || '', item);
                return (
                  <div 
                    key={itemIndex} 
                    dangerouslySetInnerHTML={{ __html: resolvedHtml }} 
                  />
                );
              })}
            </div>
          );
        }

        // Default rendering for static or single dynamic blocks (hero, html, heading)
        // If it's a loop flag but data is not array, it might be an error or fallback
        const singleData = isLoop && Array.isArray(data) ? {} : data;
        const resolvedHtml = BindingResolver(block.content || '', singleData);

        return (
          <div 
            key={index} 
            className={`rendered-block type-${block.type}`}
            dangerouslySetInnerHTML={{ __html: resolvedHtml }} 
          />
        );
      })}
    </div>
  );
}
