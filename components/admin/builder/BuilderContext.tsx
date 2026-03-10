"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type BlockType =
  | "Heading"
  | "Paragraph"
  | "Image"
  | "Quote"
  | "Divider"
  | "Button"
  | "Container"
  | "Columns"
  | "Collection List";

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content: any; // Text content, image URL, etc.
  styles?: Record<string, string>;
  bindings?: Record<string, string>; // e.g. { content: "post.title" }
  parentId?: string;
}

interface BuilderContextType {
  blocks: BuilderBlock[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType, parentId?: string) => void;
  updateBlock: (
    id: string,
    content: any,
    styles?: Record<string, string>,
    bindings?: Record<string, string>,
  ) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  serializeLayout: () => string;
  loadLayout: (json: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load layout from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("corehead_builder_layout");
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save layout on any change after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("corehead_builder_layout", JSON.stringify(blocks));
    }
  }, [blocks, isLoaded]);

  const addBlock = (type: BlockType, parentId?: string) => {
    const newBlock: BuilderBlock = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      parentId: parentId,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (
    id: string,
    content: any,
    styles?: Record<string, string>,
    bindings?: Record<string, string>,
  ) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              content,
              styles: { ...block.styles, ...styles },
              bindings: { ...block.bindings, ...bindings },
            }
          : block,
      ),
    );
  };

  const removeBlock = (id: string) => {
    // Also remove children
    setBlocks((prev) => {
      const idsToRemove = new Set<string>([id]);
      let currentSize = 0;

      // Keep finding children until no more are found
      while (idsToRemove.size > currentSize) {
        currentSize = idsToRemove.size;
        prev.forEach((b) => {
          if (b.parentId && idsToRemove.has(b.parentId)) {
            idsToRemove.add(b.id);
          }
        });
      }

      return prev.filter((block) => !idsToRemove.has(block.id));
    });

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

  const serializeLayout = () => {
    const json = JSON.stringify(blocks);
    localStorage.setItem("corehead_builder_layout", json);
    return json;
  };

  const loadLayout = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      setBlocks(parsed);
      localStorage.setItem("corehead_builder_layout", json);
    } catch (e) {
      console.error("Failed to parse layout string", e);
    }
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
        serializeLayout,
        loadLayout,
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

function getDefaultStyles(type: BlockType): Record<string, string> {
  switch (type) {
    case "Container":
      return { padding: "20px", backgroundColor: "#ffffff" };
    case "Columns":
      return { gap: "20px" };
    default:
      return {};
  }
}

function getDefaultContent(type: BlockType): any {
  switch (type) {
    case "Heading":
      return "New Heading";
    case "Paragraph":
      return "Start typing your paragraph here...";
    case "Image":
      return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2000&auto=format&fit=crop";
    case "Quote":
      return "Insert your quote here.";
    case "Button":
      return { text: "Click Me", url: "#" };
    case "Divider":
      return "";
    case "Container":
      return ""; // No specific content, acts as a wrapper
    case "Columns":
      return 2; // Default to 2 columns, content holds the number of columns
    default:
      return "";
  }
}
