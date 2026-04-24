import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import { BlockProps } from './types';

export const MarkdownBlock: React.FC<BlockProps> = ({ block, resolvedContent }) => {
  return (
    <div className={`rendered-block type-${block.type} prose max-w-none`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          img: ({node, ...props}) => {
            return (
              <div className="relative w-full h-64 my-4">
                <Image 
                  src={(props.src as string) || ''} 
                  alt={props.alt || ''}
                  fill
                  className="object-contain rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({node, ...props}) => {
            const isInternal = props.href?.startsWith('/');
            if (isInternal) {
              return <Link href={props.href as string}>{props.children}</Link>;
            }
            return <a target="_blank" rel="noopener noreferrer" {...props} />;
          }
        }}
      >
        {resolvedContent}
      </ReactMarkdown>
    </div>
  );
};
