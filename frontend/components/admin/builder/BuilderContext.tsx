"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/lib/api";

export type BlockType =
  | "Heading"
  | "Paragraph"
  | "Image"
  | "Quote"
  | "Divider"
  | "Button"
  | "Container"
  | "Columns"
  | "Collection List"
  | "Featured Carousel"
  | "Video"
  | "Newsletter"
  | "Social Links"
  | "Spacer"
  | "Code Block";

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
  saveToBackend: (
    status: string,
    overrides?: { name?: string; type?: "Single Post" | "Blog Archive" },
  ) => Promise<any>;
  // FR-07: The system shall allow selecting template type
  templateName: string;
  setTemplateName: (name: string) => void;
  templateType: "Single Post" | "Blog Archive";
  setTemplateType: (type: "Single Post" | "Blog Archive") => void;
  templateId: string | null;
  setTemplateId: (id: string | null) => void; 
  activeSidebar: "chat" | "blocks" | "settings";
  setActiveSidebar: (tab: "chat" | "blocks" | "settings") => void;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  generateLayout: (prompt: string) => Promise<string | void>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Template Database Metadata (Stored in real PostgreSQL via backend API)
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("New Layout");
  const [templateType, setTemplateType] = useState<"Single Post" | "Blog Archive">("Single Post");

  const [activeSidebar, setActiveSidebar] = useState<"chat" | "blocks" | "settings">("chat");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const persistMeta = (
    name: string,
    type: string,
    id: string | null,
  ) => {
    try {
      localStorage.setItem(
        "corehead_builder_meta",
        JSON.stringify({ name, type, id }),
      );
    } catch {
      /* ignore quota */
    }
  };

  // Load layout from backend if ID exists in URL, otherwise from local storage
  useEffect(() => {
    const fetchInitialLayout = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (id) {
        try {
          const template = await api.getTemplateById(id);
          if (template && template.layoutJson) {
            const layout = Array.isArray(template.layoutJson)
              ? template.layoutJson
              : template.layoutJson.blocks || [];
            setBlocks(layout);
            setTemplateId(String(template.id));
            setTemplateName(template.name);
            const tType =
              template.type === "Blog Archive" ? "Blog Archive" : "Single Post";
            setTemplateType(tType);
            persistMeta(template.name, tType, String(template.id));
          }
        } catch (error) {
          console.error("Failed to fetch template by ID", error);
        }
      } else {
        const saved = localStorage.getItem("corehead_builder_layout");
        if (saved) {
          try {
            setBlocks(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse saved layout", e);
          }
        }
        try {
          const rawMeta = localStorage.getItem("corehead_builder_meta");
          if (rawMeta) {
            const m = JSON.parse(rawMeta);
            if (m.name) setTemplateName(m.name);
            if (m.type === "Single Post" || m.type === "Blog Archive") {
              setTemplateType(m.type);
            }
            if (m.id) setTemplateId(String(m.id));
          }
        } catch {
          /* ignore */
        }
      }
      setIsLoaded(true);
    };

    fetchInitialLayout();
  }, []);

  // Auto-save layout + meta after initial load (preview reads these keys)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("corehead_builder_layout", JSON.stringify(blocks));
      persistMeta(templateName, templateType, templateId);
    }
  }, [blocks, isLoaded, templateName, templateType, templateId]);

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

  // Saves layout to real PostgreSQL backend via the Node API (site-scoped via X-Site-Id).
  // Optional overrides avoid stale React state when the save modal sets a new name.
  const saveToBackend = async (
    status: string,
    overrides?: { name?: string; type?: "Single Post" | "Blog Archive" },
  ) => {
    const name = (overrides?.name ?? templateName).trim() || templateName;
    const type = overrides?.type ?? templateType;

    if (overrides?.name) setTemplateName(name);
    if (overrides?.type) setTemplateType(type);

    const layoutData = {
      name,
      type,
      layoutJson: blocks,
      status,
    };

    let result;
    if (templateId) {
      result = await api.updateTemplate(templateId, layoutData);
    } else {
      result = await api.createTemplate(layoutData);
      if (result?.id) {
        setTemplateId(String(result.id));
        // Keep shareable editor URL in sync after first create
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("id", String(result.id));
          window.history.replaceState({}, "", url.toString());
        }
      }
    }
    const id = result?.id ?? templateId;
    persistMeta(name, type, id != null ? String(id) : null);
    return { ...result, id, name, type, status };
  };

  // AI Layout Generation logic moved to context for global access
  const generateLayout = async (prompt: string): Promise<string | void> => {
    if (!prompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const data = await api.generateLayout({
        prompt,
        layoutType: templateType === "Blog Archive" ? "blog-archive" : "single-post",
        designStyle: "modern",
      });

      if (data.blocks) {
        setBlocks(data.blocks);
        localStorage.setItem("corehead_builder_layout", JSON.stringify(data.blocks));
      }
      
      // Return provider info so chat can show it
      return (data.provider as string) || "ai";
    } catch (error: any) {
      console.error("AI Generation error:", error);
      alert("AI Generation failed: " + error.message);
      return;
    } finally {
      setIsAnalyzing(false);
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
        saveToBackend,
        templateName,
        setTemplateName,
        templateType,
        setTemplateType,
        templateId,
        setTemplateId,
        activeSidebar,
        setActiveSidebar,
        deviceMode,
        setDeviceMode,
        isAnalyzing,
        setIsAnalyzing,
        generateLayout,
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
    case "Collection List":
      return { limit: 6, category: "" };
    case "Featured Carousel":
      return { limit: 3 };
    case "Video":
      return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    case "Newsletter":
      return {
        title: "Subscribe to our newsletter",
        description: "Get the latest stories delivered to your inbox. No spam.",
        buttonText: "Subscribe",
        placeholder: "your@email.com",
      };
    case "Social Links":
      return ["facebook", "twitter", "instagram", "linkedin"];
    case "Spacer":
      return "40px";
    case "Code Block":
      return { code: "console.log('Hello World');", language: "javascript" };
    default:
      return "";
  }
}
