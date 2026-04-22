import React from 'react';
import { HtmlBlock } from './blocks/HtmlBlock';
import { MarkdownBlock } from './blocks/MarkdownBlock';
import { LoopBlock } from './blocks/LoopBlock';
import { BlockProps } from './blocks/types';

export const BlockRegistry: Record<string, React.FC<BlockProps>> = {
  html: HtmlBlock,
  markdown: MarkdownBlock,
  loop: LoopBlock,
};
