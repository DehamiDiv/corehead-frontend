"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/lib/api";
import PaywallModal from "@/components/admin/PaywallModal";

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
  activeSidebar: "chat" | "blocks" | "settings" | "cms";
  setActiveSidebar: (tab: "chat" | "blocks" | "settings" | "cms") => void;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  generateLayout: (prompt: string, options?: any) => Promise<string | undefined>;
  // Compare Mode
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  aiBlocks: BuilderBlock[];
  acceptAiLayout: () => void;
  discardAiLayout: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Template Database Metadata (Stored in real PostgreSQL via backend API)
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("New Layout");
  const [templateType, setTemplateType] = useState<"Single Post" | "Blog Archive">("Single Post");

  const [activeSidebar, setActiveSidebar] = useState<"chat" | "blocks" | "settings" | "cms">("chat");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compare Mode state
  const [compareMode, setCompareMode] = useState(false);
  const [aiBlocks, setAiBlocks] = useState<BuilderBlock[]>([]);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallCooldown, setPaywallCooldown] = useState(0);

  const acceptAiLayout = () => {
    if (aiBlocks.length > 0) {
      setBlocks(aiBlocks);
      localStorage.setItem("corehead_builder_layout", JSON.stringify(aiBlocks));
      setAiBlocks([]);
      setCompareMode(false);
    }
  };

  const discardAiLayout = () => {
    setAiBlocks([]);
    setCompareMode(false);
  };

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
        const selectedTemplateStr = localStorage.getItem("selected_template");
        if (selectedTemplateStr) {
          try {
            const temp = JSON.parse(selectedTemplateStr);
            const initialBlocks = getTemplateInitialBlocks(temp.id);
            setBlocks(initialBlocks);
            setTemplateName(temp.name);
            const tType = temp.id === "card-grid" ? "Blog Archive" : "Single Post";
            setTemplateType(tType);
            persistMeta(temp.name, tType, null);
            localStorage.setItem("corehead_builder_layout", JSON.stringify(initialBlocks));
            localStorage.removeItem("selected_template");
            setIsLoaded(true);
            return;
          } catch (e) {
            console.error("Failed to parse selected template", e);
          }
        }

        const aiPrompt = localStorage.getItem("ai_prompt");
        const aiOptionsStr = localStorage.getItem("ai_options");
        if (aiPrompt) {
          try {
            localStorage.removeItem("ai_prompt");
            let optionsObj = undefined;
            if (aiOptionsStr) {
              try {
                optionsObj = JSON.parse(aiOptionsStr);
                localStorage.removeItem("ai_options");
              } catch (e) {
                console.error("Failed to parse AI options", e);
              }
            }
            setIsLoaded(true);
            generateLayout(aiPrompt, optionsObj);
            return;
          } catch (e) {
            console.error("Failed to run initial AI prompt", e);
          }
        }

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
      // Safety guard against React batching/hydration overwriting localStorage with empty array on initial mount
      const localLayout = localStorage.getItem("corehead_builder_layout");
      if (blocks.length === 0 && localLayout && localLayout !== '[]' && localLayout !== 'null') {
        return;
      }
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
  const generateLayout = async (
    prompt: string,
    options?: {
      layoutType?: string;
      designStyle?: string;
      features?: Record<string, boolean>;
    }
  ): Promise<string | undefined> => {
    if (!prompt.trim() || isAnalyzing) return undefined;

    setIsAnalyzing(true);
    try {
      const type = options?.layoutType || (templateType === "Blog Archive" ? "blog-archive" : "single-post");
      const style = options?.designStyle || "modern";

      const data = await api.generateLayout({
        prompt,
        layoutType: type,
        designStyle: style,
        features: options?.features || {},
      });

      if (data.blocks) {
        setAiBlocks(data.blocks);
        setCompareMode(true);
      }

      // Return provider info so chat can show it
      return (data.provider as string) || "ai";
    } catch (error: any) {
      console.error("AI Generation error:", error);
      if (error.message?.includes("LIMIT_EXCEEDED") || error.data?.error?.includes("LIMIT_EXCEEDED") || error.status === 402 || error.status === 429 || error.status === 403) {
        setPaywallCooldown(error.data?.cooldown_remaining || error.data?.cooldownRemaining || 0);
        setIsPaywallOpen(true);
      } else {
        alert("AI Generation failed: " + error.message);
      }
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
        compareMode,
        setCompareMode,
        aiBlocks,
        acceptAiLayout,
        discardAiLayout,
      }}
    >
      {children}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        cooldownRemaining={paywallCooldown}
      />
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
      return { title: "Subscribe to our newsletter", buttonText: "Subscribe", placeholder: "your@email.com" };
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

function getTemplateInitialBlocks(templateId: string): BuilderBlock[] {
  const containerId = crypto.randomUUID();
  const headingId = crypto.randomUUID();
  const paragraphId = crypto.randomUUID();
  const quoteId = crypto.randomUUID();
  const imageId = crypto.randomUUID();

  switch (templateId) {
    case "minimal-single":
      return [
        {
          id: containerId,
          type: "Container",
          content: "",
          styles: { padding: "40px", backgroundColor: "#ffffff" },
        },
        {
          id: headingId,
          type: "Heading",
          content: "Minimal Single Post Layout",
          styles: { fontSize: "32px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" },
          bindings: { content: "post.title" },
          parentId: containerId,
        },
        {
          id: imageId,
          type: "Image",
          content: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop",
          styles: { width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px", marginBottom: "30px" },
          bindings: { src: "post.coverImage" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content: "This is a clean, centered typography layout designed for readability. The main elements of your post like the title, featured image, and content body are placed sequentially without complex columns.",
          styles: { fontSize: "18px", lineHeight: "1.8", color: "#334155", maxWidth: "700px", margin: "0 auto 20px auto" },
          bindings: { content: "post.content" },
          parentId: containerId,
        },
      ];
    case "magazine":
      const columnsId = crypto.randomUUID();
      const colLeftId = crypto.randomUUID();
      const colRightId = crypto.randomUUID();
      const listId = crypto.randomUUID();
      const newsId = crypto.randomUUID();
      return [
        {
          id: containerId,
          type: "Container",
          content: "",
          styles: { padding: "30px", backgroundColor: "#f8fafc" },
        },
        {
          id: headingId,
          type: "Heading",
          content: "Magazine Layout (Featured Title)",
          styles: { fontSize: "36px", fontWeight: "800", marginBottom: "30px" },
          bindings: { content: "post.title" },
          parentId: containerId,
        },
        {
          id: columnsId,
          type: "Columns",
          content: 2,
          styles: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" },
          parentId: containerId,
        },
        {
          id: colLeftId,
          type: "Container",
          content: "",
          styles: { padding: "0" },
          parentId: columnsId,
        },
        {
          id: imageId,
          type: "Image",
          content: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop",
          styles: { width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px", marginBottom: "20px" },
          bindings: { src: "post.coverImage" },
          parentId: colLeftId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content: "Magazine layouts combine rich editorial content on the left with widgets and discovery blocks on the right. This classic structure is standard for high-volume publishing sites.",
          styles: { fontSize: "16px", lineHeight: "1.6", color: "#0f172a" },
          bindings: { content: "post.content" },
          parentId: colLeftId,
        },
        {
          id: colRightId,
          type: "Container",
          content: "",
          styles: { padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
          parentId: columnsId,
        },
        {
          id: listId,
          type: "Collection List",
          content: { limit: 3, category: "" },
          styles: { marginBottom: "25px" },
          parentId: colRightId,
        },
        {
          id: newsId,
          type: "Newsletter",
          content: { title: "Subscribe to our magazine feed", buttonText: "Keep Updated", placeholder: "your@email.com" },
          styles: {},
          parentId: colRightId,
        },
      ];
    case "card-grid":
      const listGridId = crypto.randomUUID();
      return [
        {
          id: containerId,
          type: "Container",
          content: "",
          styles: { padding: "40px", backgroundColor: "#ffffff" },
        },
        {
          id: headingId,
          type: "Heading",
          content: "Card Grid Archive",
          styles: { fontSize: "30px", fontWeight: "bold", textAlign: "center", marginBottom: "10px" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content: "Browse our latest stories and articles in a modern grid view.",
          styles: { fontSize: "16px", color: "#64748b", textAlign: "center", marginBottom: "40px" },
          parentId: containerId,
        },
        {
          id: listGridId,
          type: "Collection List",
          content: { limit: 6, category: "" },
          styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
          parentId: containerId,
        },
      ];
    case "long-form":
      const quoteBlockId = crypto.randomUUID();
      const bodyParaId = crypto.randomUUID();
      return [
        {
          id: containerId,
          type: "Container",
          content: "",
          styles: { padding: "50px 20px", backgroundColor: "#fcfbf7" },
        },
        {
          id: headingId,
          type: "Heading",
          content: "Reading-Optimized Long-form Layout",
          styles: { fontFamily: "Georgia, serif", fontSize: "40px", textAlign: "center", marginBottom: "15px", color: "#1c1917" },
          bindings: { content: "post.title" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content: "A layout built specifically for longer essays and research. Features high contrast, beautiful serif typography, and generous vertical margins.",
          styles: { fontFamily: "Georgia, serif", fontSize: "20px", fontStyle: "italic", textAlign: "center", color: "#44403c", maxWidth: "800px", margin: "0 auto 40px auto" },
          parentId: containerId,
        },
        {
          id: quoteBlockId,
          type: "Quote",
          content: "This elegant pull-quote serves to break up long runs of text and showcase crucial takeaways from your writing.",
          styles: { paddingLeft: "20px", borderLeft: "4px solid #b91c1c", fontSize: "22px", fontFamily: "Georgia, serif", fontStyle: "italic", margin: "40px auto", maxWidth: "650px", color: "#78716c" },
          parentId: containerId,
        },
        {
          id: bodyParaId,
          type: "Paragraph",
          content: "Continue your long-form publication content here. Use multiple paragraphs, subtitles, and headings to keep the reader engaged as they scroll down the single-column content area.",
          styles: { fontFamily: "Georgia, serif", fontSize: "18px", lineHeight: "1.8", color: "#1c1917", maxWidth: "700px", margin: "0 auto" },
          bindings: { content: "post.content" },
          parentId: containerId,
        },
      ];
    case "portfolio":
      const imageGridId = crypto.randomUUID();
      const p1 = crypto.randomUUID();
      const p2 = crypto.randomUUID();
      return [
        {
          id: containerId,
          type: "Container",
          content: "",
          styles: { padding: "40px", backgroundColor: "#09090b" },
        },
        {
          id: headingId,
          type: "Heading",
          content: "Portfolio Showcase",
          styles: { fontSize: "36px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content: "A modern design focused on high-quality visual presentation & media case studies.",
          styles: { fontSize: "16px", color: "#a1a1aa", marginBottom: "30px" },
          parentId: containerId,
        },
        {
          id: imageGridId,
          type: "Columns",
          content: 2,
          styles: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" },
          parentId: containerId,
        },
        {
          id: p1,
          type: "Image",
          content: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop",
          styles: { width: "100%", height: "350px", objectFit: "cover", borderRadius: "8px" },
          parentId: imageGridId,
        },
        {
          id: p2,
          type: "Image",
          content: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
          styles: { width: "100%", height: "350px", objectFit: "cover", borderRadius: "8px" },
          parentId: imageGridId,
        },
      ];
    default:
      return [];
  }
}
