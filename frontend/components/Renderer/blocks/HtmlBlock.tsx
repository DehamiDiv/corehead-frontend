import React from 'react';
import { BlockProps } from './types';

export const HtmlBlock: React.FC<BlockProps> = ({ block, resolvedContent }) => {
  return (
    <div 
      className={`rendered-block type-${block.type}`}
      dangerouslySetInnerHTML={{ __html: resolvedContent }} 
    />
  );
};
