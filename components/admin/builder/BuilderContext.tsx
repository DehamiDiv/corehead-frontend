"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type BlockType =
  | "Heading"
  | "Paragraph"
  | "Image"
  | "Quote"
  | "Divider"
  | "Button"
  | "Collection List";

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content: any; // Text content, image URL, etc.
  styles?: Record<string, string>;
}

interface BuilderContextType {
  blocks: BuilderBlock[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType) => void;
  updateBlock: (
    id: string,
    content: any,
    styles?: Record<string, string>,
  ) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: BuilderBlock = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      styles: {},
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id); // Auto-select new block
  };

  const updateBlock = (
    id: string,
    content: any,
    styles?: Record<string, string>,
  ) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? { ...block, content, styles: { ...block.styles, ...styles } }
          : block,
      ),
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const selectBlock = (id: string | null) => {
    setSelectedBlockId(id);
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    setBlocks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <BuilderContext.Provider
      value={{
        blocks,
        selectedBlockId,
        addBlock,
        updateBlock,
        removeBlock,
        selectBlock,
        reorderBlocks,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}

function getDefaultContent(type: BlockType): any {
  switch (type) {
    case "Heading":
      return "New Heading";
    case "Paragraph":
      return "Start typing your paragraph here...";
    case "Image":
      return "https://via.placeholder.com/800x400"; // Placeholder
    case "Quote":
      return "Insert your quote here.";
    case "Button":
      return { text: "Click Me", url: "#" };
    case "Divider":
      return "";
    default:
      return "";
  }
}
