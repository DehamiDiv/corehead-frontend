import React from 'react';
import { BindingResolver } from '../BindingResolver';
import { BlockProps } from './types';

export const LoopBlock: React.FC<BlockProps> = ({ block, data, isLoop }) => {
  if (!isLoop || !Array.isArray(data)) {
    return null;
  }

  return (
    <div className="rendered-loop">
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
};
