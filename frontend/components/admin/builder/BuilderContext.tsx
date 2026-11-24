"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { api } from "@/lib/api";
import { normalizeLayoutDocumentV1 } from "@/lib/layoutContract";
import {
  kindToTemplateType,
  prepareLayoutForSave,
  templateTypeToKind,
} from "@/lib/templateLayout";
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
  | "Code Block"
  | "Contact Form"
  | "Table of Contents";

export interface SavedSectionItem {
  id: number | string;
  name: string;
  category: string;
  blocks: BuilderBlock[];
  createdAt?: string;
}

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content: any; // Text content, image URL, etc.
  level?: 1 | 2 | 3; // Canonical Heading block level
  styles?: Record<string, string>;
  bindings?: Record<string, string>; // e.g. { content: "post.title" }
  parentId?: string;
}

export type BuilderTemplateType = "Single Post" | "Blog Archive" | "Home Page";

interface BuilderContextType {
  blocks: BuilderBlock[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType, parentId?: string, targetIndex?: number) => void;
  updateBlock: (
    id: string,
    content: any,
    styles?: Record<string, string>,
    bindings?: Record<string, string>,
  ) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  moveBlockTo: (
    sourceBlockId: string,
    targetParentId?: string,
    targetIndex?: number,
  ) => void;
  serializeLayout: () => string;
  loadLayout: (json: string) => void;
  saveToBackend: (
    status: string,
    overrides?: { name?: string; type?: BuilderTemplateType },
  ) => Promise<any>;
  // FR-07: The system shall allow selecting template type
  templateName: string;
  setTemplateName: (name: string) => void;
  templateType: BuilderTemplateType;
  setTemplateType: (type: BuilderTemplateType) => void;
  templateId: string | null;
  setTemplateId: (id: string | null) => void;
  aiHistoryId: string | null;
  setAiHistoryId: (id: string | null) => void;
  activeSidebar: "chat" | "blocks" | "settings" | "cms";
  setActiveSidebar: (tab: "chat" | "blocks" | "settings" | "cms") => void;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  generateLayout: (
    prompt: string,
    options?: any,
  ) => Promise<string | undefined>;
  // Compare Mode
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  aiBlocks: BuilderBlock[];
  acceptAiLayout: () => void;
  discardAiLayout: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  modifyLayout: (instruction: string) => Promise<boolean>;
  // Clipboard & Keyboard Actions
  copiedBlocks: BuilderBlock[] | null;
  copyBlock: (id: string) => void;
  pasteBlock: (parentId?: string, targetIndex?: number) => void;
  // Reusable Saved Sections
  savedSections: SavedSectionItem[];
  refreshSavedSections: () => Promise<void>;
  saveBlockAsSection: (
    blockId: string,
    name: string,
    category?: string,
  ) => Promise<boolean>;
  insertSavedSection: (
    sectionBlocks: BuilderBlock[],
    parentId?: string,
    targetIndex?: number,
  ) => void;
  deleteSavedSection: (id: number | string) => Promise<void>;
  lastActionNotice: string | null;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const MOCK_PATTERNS = [
  "photo-1501504905252",
  "photo-1499750310107",
  "photo-1497366811353",
  "photo-1455390582262",
  "picsum.photos",
];

export function sanitizeBlock(block: BuilderBlock): BuilderBlock {
  let content = block.content;
  if (block.type === "Image") {
    if (typeof content === "string") {
      if (MOCK_PATTERNS.some((pat) => content.includes(pat))) {
        content = "";
      }
    } else if (content && typeof content === "object") {
      if (
        typeof content.url === "string" &&
        MOCK_PATTERNS.some((pat) => content.url.includes(pat))
      ) {
        content = { ...content, url: "" };
      }
    }
  }
  return {
    ...block,
    content,
  };
}

export function sanitizeBlocks(blocks: BuilderBlock[]): BuilderBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map(sanitizeBlock);
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Template Database Metadata (Stored in real PostgreSQL via backend API)
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [aiHistoryId, setAiHistoryId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("New Layout");
  const [templateType, setTemplateType] =
    useState<BuilderTemplateType>("Single Post");

  const [activeSidebar, setActiveSidebar] = useState<
    "chat" | "blocks" | "settings" | "cms"
  >("blocks");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compare Mode state
  const [compareMode, setCompareMode] = useState(false);
  const [aiBlocks, setAiBlocks] = useState<BuilderBlock[]>([]);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallCooldown, setPaywallCooldown] = useState(0);

  // History State
  const [history, setHistory] = useState<BuilderBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedBlocks, setCopiedBlocks] = useState<BuilderBlock[] | null>(null);
  const [savedSections, setSavedSections] = useState<SavedSectionItem[]>([]);
  const [lastActionNotice, setLastActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setLastActionNotice(msg);
    setTimeout(() => {
      setLastActionNotice((curr) => (curr === msg ? null : curr));
    }, 2200);
  };

  const refreshSavedSections = async () => {
    try {
      const res = await api.getSavedSections();
      if (Array.isArray(res?.sections)) {
        setSavedSections(res.sections);
        return;
      }
    } catch {
      // Fallback to localStorage if offline/unauthenticated
    }
    try {
      const raw = localStorage.getItem("corehead_saved_sections");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedSections(parsed);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    refreshSavedSections();
  }, []);

  const acceptAiLayout = () => {
    if (aiBlocks.length > 0) {
      const prepared = prepareLayoutForSave(aiBlocks, {
        name: templateName,
        type: templateType,
        status: "draft",
        origin: "ai",
      });
      setBlocks(prepared.document.blocks as BuilderBlock[]);
      localStorage.setItem(
        "corehead_builder_layout",
        JSON.stringify(prepared.document),
      );
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
    historyId?: string | null,
  ) => {
    try {
      let userId: string | number | null = null;
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        userId = u?.id || u?._id || null;
      } catch {
        /* ignore */
      }
      localStorage.setItem(
        "corehead_builder_meta",
        JSON.stringify({
          name,
          type,
          id,
          userId,
          ai_history_id: historyId ?? aiHistoryId,
        }),
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

      let currentUserId: string | number | null = null;
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        currentUserId = u?.id || u?._id || null;
      } catch {
        /* ignore */
      }

      if (id) {
        // Check if localStorage already has this template (returning from preview/deploy)
        let restoredFromLocal = false;
        try {
          const rawMeta = localStorage.getItem("corehead_builder_meta");
          if (rawMeta) {
            const localMeta = JSON.parse(rawMeta);
            const userMatches =
              !localMeta.userId ||
              !currentUserId ||
              String(localMeta.userId) === String(currentUserId);
            if (String(localMeta.id) === String(id) && userMatches) {
              // Same template ID and same user → return to existing session
              // Prefer localStorage layout over re-fetching from API
              const savedLayout = localStorage.getItem(
                "corehead_builder_layout",
              );
              if (savedLayout) {
                const parsed = JSON.parse(savedLayout);
                const normalized = normalizeLayoutDocumentV1(parsed, {
                  name: localMeta.name || parsed?.name || "Builder Layout",
                  kind: localMeta.type || parsed?.kind,
                  origin: parsed?.metadata?.origin || "manual",
                });
                const doc = normalized.document as any;
                setBlocks(sanitizeBlocks(doc.blocks as BuilderBlock[]));
                setTemplateId(String(id));
                if (localMeta.name) setTemplateName(localMeta.name);
                if (
                  localMeta.type === "Single Post" ||
                  localMeta.type === "Blog Archive" ||
                  localMeta.type === "Home Page"
                ) {
                  setTemplateType(localMeta.type);
                }
                if (localMeta.ai_history_id)
                  setAiHistoryId(String(localMeta.ai_history_id));
                restoredFromLocal = true;
              }
            }
          }
        } catch {
          /* localStorage parse error — fall through to API fetch */
        }

        if (!restoredFromLocal) {
          try {
            const template = await api.getTemplateById(id);
            if (template && template.layoutJson) {
              const normalized = normalizeLayoutDocumentV1(
                template.layoutJson,
                {
                  name: template.name,
                  kind: template.type,
                  origin: template.layoutJson?.metadata?.origin || "migrated",
                },
              );
              const doc = normalized.document as any;
              setBlocks(sanitizeBlocks(doc.blocks as BuilderBlock[]));
              setTemplateId(String(template.id));
              setTemplateName(template.name);
              const tType: BuilderTemplateType =
                template.type === "Blog Archive"
                  ? "Blog Archive"
                  : template.type === "Home Page"
                    ? "Home Page"
                    : "Single Post";
              setTemplateType(tType);
              persistMeta(template.name, tType, String(template.id));
            }
          } catch (error) {
            console.error("Failed to fetch template by ID", error);
          }
        }
      } else {
        const selectedTemplateStr = localStorage.getItem("selected_template");
        if (selectedTemplateStr) {
          try {
            const temp = JSON.parse(selectedTemplateStr);
            const initialBlocks = getTemplateInitialBlocks(temp.id);
            setBlocks(sanitizeBlocks(initialBlocks));
            setTemplateName(temp.name);
            const tType =
              temp.id === "card-grid" ? "Blog Archive" : "Single Post";
            setTemplateType(tType);
            persistMeta(temp.name, tType, null);
            localStorage.setItem(
              "corehead_builder_layout",
              JSON.stringify(initialBlocks),
            );
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

        // Check for ai_generated_layout key (set by ai-history page)
        const aiGeneratedLayout = localStorage.getItem("ai_generated_layout");
        if (aiGeneratedLayout) {
          try {
            const parsed = JSON.parse(aiGeneratedLayout);
            // handle { cards: [...] } shape
            const rawBlocks = parsed.cards || parsed.blocks || parsed;
            const normalized = normalizeLayoutDocumentV1(rawBlocks, {
              name: "AI History Layout",
              kind: "single-post",
            });
            const doc = normalized.document as any;
            setBlocks(doc.blocks as BuilderBlock[]);
            localStorage.removeItem("ai_generated_layout");
            setIsLoaded(true);
            return;
          } catch (e) {
            console.error("Failed to load ai_generated_layout", e);
            localStorage.removeItem("ai_generated_layout");
          }
        }

        const rawMeta = localStorage.getItem("corehead_builder_meta");
        let userMatches = true;
        if (rawMeta) {
          try {
            const m = JSON.parse(rawMeta);
            if (
              m.userId &&
              currentUserId &&
              String(m.userId) !== String(currentUserId)
            ) {
              userMatches = false;
            }
          } catch {
            /* ignore */
          }
        }

        // If from another user or an unrecognized account, clear old drafts and keep canvas blank!
        if (!userMatches) {
          localStorage.removeItem("corehead_builder_layout");
          localStorage.removeItem("corehead_builder_meta");
          setBlocks([]);
        } else {
          const saved = localStorage.getItem("corehead_builder_layout");
          if (saved) {
            try {
              const normalized = normalizeLayoutDocumentV1(JSON.parse(saved), {
                name: templateName,
                kind: templateType,
              });
              const doc = normalized.document as any;
              setBlocks(sanitizeBlocks(doc.blocks as BuilderBlock[]));
            } catch (e) {
              console.error("Failed to parse saved layout", e);
            }
          }
          if (rawMeta) {
            try {
              const m = JSON.parse(rawMeta);
              if (m.name) setTemplateName(m.name);
              if (
                m.type === "Single Post" ||
                m.type === "Blog Archive" ||
                m.type === "Home Page"
              ) {
                setTemplateType(m.type);
              }
              if (m.id) setTemplateId(String(m.id));
              if (m.ai_history_id) setAiHistoryId(String(m.ai_history_id));
            } catch {
              /* ignore */
            }
          }
        }
      }
      setIsLoaded(true);
    };

    fetchInitialLayout();
  }, []);

  // History refs to read state in effects without trigger loops
  const historyRef = useRef<BuilderBlock[][]>([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  // Initialize history once blocks are loaded (only once)
  useEffect(() => {
    if (isLoaded && historyIndex === -1) {
      setHistory([blocks]);
      setHistoryIndex(0);
    }
  }, [isLoaded]);

  // Debounced history push when blocks change
  useEffect(() => {
    if (!isLoaded || historyIndexRef.current === -1) return;

    // Check if the new state is actually different from the current history pointer
    const currentRecorded = historyRef.current[historyIndexRef.current];
    if (
      currentRecorded &&
      JSON.stringify(currentRecorded) === JSON.stringify(blocks)
    ) {
      return;
    }

    // Debounce the push to prevent filling history with every keystroke
    const timer = setTimeout(() => {
      const nextHistory = historyRef.current.slice(
        0,
        historyIndexRef.current + 1,
      );
      if (
        nextHistory.length > 0 &&
        JSON.stringify(nextHistory[nextHistory.length - 1]) ===
          JSON.stringify(blocks)
      ) {
        return;
      }
      const updated = [...nextHistory, blocks];
      setHistory(updated);
      setHistoryIndex(updated.length - 1);
    }, 500); // 500ms debounce for typing/editing

    return () => clearTimeout(timer);
  }, [blocks, isLoaded]);

  // Global keydown listeners for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "z" || e.key === "Z") {
          if (!isInput) {
            e.preventDefault();
            undo();
          }
        } else if (e.key === "y" || e.key === "Y") {
          if (!isInput) {
            e.preventDefault();
            redo();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  // Auto-save layout + meta after initial load (preview reads these keys)
  useEffect(() => {
    if (isLoaded) {
      // Do not replace a restored layout with an empty initial React render.
      const localLayout = localStorage.getItem("corehead_builder_layout");
      if (
        blocks.length === 0 &&
        localLayout &&
        localLayout !== "[]" &&
        localLayout !== "null"
      ) {
        return;
      }
      const normalized = normalizeLayoutDocumentV1(blocks, {
        name: templateName,
        kind: templateType,
        origin: "manual",
      });
      localStorage.setItem(
        "corehead_builder_layout",
        JSON.stringify(normalized.document),
      );
      persistMeta(templateName, templateType, templateId);
    }
  }, [blocks, isLoaded, templateName, templateType, templateId]);

  const addBlock = (
    type: BlockType,
    parentId?: string,
    targetIndex?: number,
  ) => {
    const newBlock: BuilderBlock = {
      id: crypto.randomUUID(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      parentId: parentId,
    };
    setBlocks((prev) => {
      if (targetIndex === undefined) {
        return [...prev, newBlock];
      }
      const levelBlocks = prev.filter(
        (b) => b.parentId === parentId || (!b.parentId && !parentId),
      );
      const targetBlock = levelBlocks[targetIndex];
      const globalIndex = targetBlock
        ? prev.findIndex((b) => b.id === targetBlock.id)
        : prev.length;

      const result = Array.from(prev);
      result.splice(globalIndex, 0, newBlock);
      return result;
    });
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

  const collectSubtree = (
    allBlocks: BuilderBlock[],
    rootId: string,
  ): BuilderBlock[] => {
    const ids = new Set<string>([rootId]);
    let prevSize = 0;
    while (ids.size > prevSize) {
      prevSize = ids.size;
      allBlocks.forEach((b) => {
        if (b.parentId && ids.has(b.parentId)) ids.add(b.id);
      });
    }
    return allBlocks.filter((b) => ids.has(b.id));
  };

  const cloneSubtreeWithFreshIds = (
    subtree: BuilderBlock[],
    targetParentId?: string,
  ): BuilderBlock[] => {
    const idMap = new Map<string, string>();
    subtree.forEach((b) => idMap.set(b.id, crypto.randomUUID()));
    const rootOriginalId = subtree[0]?.id;
    return subtree.map((b) => ({
      ...b,
      id: idMap.get(b.id)!,
      parentId:
        b.id === rootOriginalId
          ? targetParentId
          : b.parentId && idMap.has(b.parentId)
            ? idMap.get(b.parentId)
            : targetParentId,
      content: JSON.parse(JSON.stringify(b.content)),
      styles: b.styles ? { ...b.styles } : undefined,
      bindings: b.bindings ? { ...b.bindings } : undefined,
    }));
  };

  const copyBlock = (id: string) => {
    const subtree = collectSubtree(blocks, id);
    if (subtree.length === 0) return;
    setCopiedBlocks(JSON.parse(JSON.stringify(subtree)));
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(JSON.stringify({ __coreheadBlocks: subtree }))
        .catch(() => {});
    }
    showNotice(`Copied ${subtree[0].type}`);
  };

  const insertClonedSubtree = (
    subtree: BuilderBlock[],
    parentId?: string,
    targetIndex?: number,
  ) => {
    if (!subtree || subtree.length === 0) return;
    const cloned = cloneSubtreeWithFreshIds(subtree, parentId);
    setBlocks((prev) => {
      if (targetIndex === undefined) {
        return [...prev, ...cloned];
      }
      const levelBlocks = prev.filter(
        (b) => b.parentId === parentId || (!b.parentId && !parentId),
      );
      const targetBlock = levelBlocks[targetIndex];
      const globalIndex = targetBlock
        ? prev.findIndex((b) => b.id === targetBlock.id)
        : prev.length;
      const result = Array.from(prev);
      result.splice(globalIndex, 0, ...cloned);
      return result;
    });
    setSelectedBlockId(cloned[0].id);
  };

  const pasteBlock = (parentId?: string, targetIndex?: number) => {
    if (!copiedBlocks || copiedBlocks.length === 0) return;
    if (
      parentId === undefined &&
      targetIndex === undefined &&
      selectedBlockId
    ) {
      const selected = blocks.find((b) => b.id === selectedBlockId);
      if (selected) {
        const levelBlocks = blocks.filter(
          (b) =>
            b.parentId === selected.parentId ||
            (!b.parentId && !selected.parentId),
        );
        const idx = levelBlocks.findIndex((b) => b.id === selected.id) + 1;
        insertClonedSubtree(copiedBlocks, selected.parentId, idx);
        showNotice(`Pasted ${copiedBlocks[0].type}`);
        return;
      }
    }
    insertClonedSubtree(copiedBlocks, parentId, targetIndex);
    showNotice(`Pasted ${copiedBlocks[0].type}`);
  };

  const duplicateBlock = (id: string) => {
    const subtree = collectSubtree(blocks, id);
    if (subtree.length === 0) return;
    const root = subtree[0];
    const levelBlocks = blocks.filter(
      (b) => b.parentId === root.parentId || (!b.parentId && !root.parentId),
    );
    const idx = levelBlocks.findIndex((b) => b.id === root.id) + 1;
    insertClonedSubtree(subtree, root.parentId, idx);
    showNotice(`Duplicated ${root.type}`);
  };

  const saveBlockAsSection = async (
    blockId: string,
    name: string,
    category = "Custom",
  ): Promise<boolean> => {
    const subtree = collectSubtree(blocks, blockId);
    if (subtree.length === 0 || !name.trim()) return false;
    // Normalize root parentId to undefined so the saved section is portable
    const portable = subtree.map((b, i) =>
      i === 0 ? { ...b, parentId: undefined } : b,
    );
    try {
      const res = await api.createSavedSection({
        name: name.trim(),
        category,
        blocks: portable,
      });
      if (res?.section) {
        setSavedSections((prev) => [res.section, ...prev]);
        showNotice(`Saved "${name.trim()}" section`);
        return true;
      }
    } catch {
      const localSection: SavedSectionItem = {
        id: `local-${Date.now()}`,
        name: name.trim(),
        category,
        blocks: portable,
        createdAt: new Date().toISOString(),
      };
      setSavedSections((prev) => {
        const next = [localSection, ...prev];
        try {
          localStorage.setItem("corehead_saved_sections", JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      showNotice(`Saved "${name.trim()}" locally`);
      return true;
    }
    return false;
  };

  const insertSavedSection = (
    sectionBlocks: BuilderBlock[],
    parentId?: string,
    targetIndex?: number,
  ) => {
    if (!Array.isArray(sectionBlocks) || sectionBlocks.length === 0) return;
    insertClonedSubtree(sectionBlocks, parentId, targetIndex);
    showNotice("Inserted saved section");
  };

  const deleteSavedSection = async (id: number | string) => {
    try {
      if (typeof id === "number" || !String(id).startsWith("local-")) {
        await api.deleteSavedSection(id);
      }
    } catch {
      /* ignore */
    }
    setSavedSections((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem("corehead_saved_sections", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    showNotice("Removed saved section");
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (!block) return prev;
      const parentId = block.parentId;
      const siblingBlocks = prev.filter(
        (b) => b.parentId === parentId || (!b.parentId && !parentId),
      );
      const siblingIndex = siblingBlocks.findIndex((b) => b.id === id);
      if (siblingIndex === -1) return prev;

      if (direction === "up" && siblingIndex === 0) return prev;
      if (direction === "down" && siblingIndex === siblingBlocks.length - 1)
        return prev;

      const targetSibling =
        siblingBlocks[direction === "up" ? siblingIndex - 1 : siblingIndex + 1];
      const currentIndex = prev.findIndex((b) => b.id === id);
      const targetIndex = prev.findIndex((b) => b.id === targetSibling.id);

      const result = Array.from(prev);
      const [moved] = result.splice(currentIndex, 1);
      result.splice(targetIndex, 0, moved);
      return result;
    });
  };

  const moveBlockTo = (
    sourceBlockId: string,
    targetParentId?: string,
    targetIndex?: number,
  ) => {
    setBlocks((prev) => {
      const sourceIndex = prev.findIndex((b) => b.id === sourceBlockId);
      if (sourceIndex === -1) return prev;

      // Prevent dragging a container into itself
      if (targetParentId === sourceBlockId) return prev;

      const result = Array.from(prev);
      const [sourceBlock] = result.splice(sourceIndex, 1);

      const updatedBlock: BuilderBlock = {
        ...sourceBlock,
        parentId: targetParentId,
      };

      if (targetIndex === undefined) {
        result.push(updatedBlock);
      } else {
        const levelBlocks = result.filter(
          (b) =>
            b.parentId === targetParentId || (!b.parentId && !targetParentId),
        );
        const targetBlock = levelBlocks[targetIndex];
        const globalTargetIndex = targetBlock
          ? result.findIndex((b) => b.id === targetBlock.id)
          : result.length;

        result.splice(globalTargetIndex, 0, updatedBlock);
      }

      return result;
    });
    setSelectedBlockId(sourceBlockId);
  };

  const serializeLayout = () => {
    const normalized = normalizeLayoutDocumentV1(blocks, {
      name: templateName,
      kind: templateType,
      origin: "manual",
    });
    const json = JSON.stringify(normalized.document);
    localStorage.setItem("corehead_builder_layout", json);
    return json;
  };

  const loadLayout = (json: string) => {
    try {
      const normalized = normalizeLayoutDocumentV1(JSON.parse(json), {
        name: templateName,
        kind: templateType,
      });
      const doc = normalized.document as any;
      setBlocks(doc.blocks as BuilderBlock[]);
      localStorage.setItem(
        "corehead_builder_layout",
        JSON.stringify(normalized.document),
      );
    } catch (e) {
      console.error("Failed to parse layout string", e);
    }
  };

  // Saves layout to real PostgreSQL backend via the Node API (site-scoped via X-Site-Id).
  // Optional overrides avoid stale React state when the save modal sets a new name.
  const saveToBackend = async (
    status: string,
    overrides?: { name?: string; type?: BuilderTemplateType },
  ) => {
    const name = (overrides?.name ?? templateName).trim() || templateName;
    const type = overrides?.type ?? templateType;

    if (overrides?.name) setTemplateName(name);
    if (overrides?.type) setTemplateType(type);

    const prepared = prepareLayoutForSave(blocks, {
      name,
      type,
      status,
      origin: "manual",
    });
    const layoutData = {
      name,
      type,
      layoutJson: prepared.document,
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
    },
  ): Promise<string | undefined> => {
    if (!prompt.trim() || isAnalyzing) return undefined;

    setIsAnalyzing(true);
    try {
      const type = options?.layoutType || templateTypeToKind(templateType);
      const generatedTemplateType = kindToTemplateType(
        templateTypeToKind(type),
      );
      setTemplateType(generatedTemplateType);
      const style = options?.designStyle || "modern";

      const data = await api.generateLayout({
        prompt,
        layoutType: type,
        designStyle: style,
        features: options?.features || {},
      });

      if (data.blocks) {
        const prepared = prepareLayoutForSave(data.blocks, {
          name: templateName,
          type: generatedTemplateType,
          status: "draft",
          origin: "ai",
        });
        localStorage.setItem(
          "corehead_builder_layout",
          JSON.stringify(prepared.document),
        );
        setAiBlocks(prepared.document.blocks as BuilderBlock[]);
        setCompareMode(true);
      }

      // Return provider info so chat can show it
      return (data.provider as string) || "ai";
    } catch (error: any) {
      console.error("AI Generation error:", error);
      if (
        error.message?.includes("LIMIT_EXCEEDED") ||
        error.data?.error?.includes("LIMIT_EXCEEDED") ||
        error.status === 402 ||
        error.status === 429 ||
        error.status === 403
      ) {
        setPaywallCooldown(
          error.data?.cooldown_remaining || error.data?.cooldownRemaining || 0,
        );
        setIsPaywallOpen(true);
      } else {
        alert("AI Generation failed: " + error.message);
      }
      return;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const modifyLayout = async (instruction: string): Promise<boolean> => {
    if (!instruction.trim() || isAnalyzing) return false;

    setIsAnalyzing(true);
    try {
      const data = await api.modifyLayout({
        currentBlocks: blocks,
        instruction: instruction.trim(),
      });

      if (data.success && data.blocks) {
        setBlocks(data.blocks);
        setSelectedBlockId(null);
        return true;
      } else {
        throw new Error(data.error || "Failed to refine layout.");
      }
    } catch (error: any) {
      console.error("AI Modification error:", error);
      alert("AI Refinement failed: " + error.message);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setBlocks(history[prevIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBlocks(history[nextIndex]);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
        duplicateBlock,
        moveBlock,
        moveBlockTo,
        serializeLayout,
        loadLayout,
        saveToBackend,
        templateName,
        setTemplateName,
        templateType,
        setTemplateType: (type: BuilderTemplateType) =>
          setTemplateType(kindToTemplateType(templateTypeToKind(type))),
        templateId,
        setTemplateId,
        aiHistoryId,
        setAiHistoryId,
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
        undo,
        redo,
        canUndo,
        canRedo,
        modifyLayout,
        copiedBlocks,
        copyBlock,
        pasteBlock,
        savedSections,
        refreshSavedSections,
        saveBlockAsSection,
        insertSavedSection,
        deleteSavedSection,
        lastActionNotice,
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
      return "";
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
      return ""; // Cleaned default video URL (removed dummy Rickroll)
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
    case "Contact Form":
      return {
        title: "Get in Touch",
        description: "Send us a message and we will get back to you soon.",
        buttonText: "Send Message",
        successMessage: "Thank you! Your message has been sent.",
        showSubject: true,
      };
    case "Table of Contents":
      return {
        title: "Table of Contents",
        maxDepth: 3,
        style: "card",
      };
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
          styles: {
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          },
          bindings: { content: "post.title" },
          parentId: containerId,
        },
        {
          id: imageId,
          type: "Image",
          content: "",
          styles: {
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "30px",
          },
          bindings: { src: "post.coverImage" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content:
            "This is a clean, centered typography layout designed for readability. The main elements of your post like the title, featured image, and content body are placed sequentially without complex columns.",
          styles: {
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#334155",
            maxWidth: "700px",
            margin: "0 auto 20px auto",
          },
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
          styles: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
          },
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
          content: "",
          styles: {
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "20px",
          },
          bindings: { src: "post.coverImage" },
          parentId: colLeftId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content:
            "Magazine layouts combine rich editorial content on the left with widgets and discovery blocks on the right. This classic structure is standard for high-volume publishing sites.",
          styles: { fontSize: "16px", lineHeight: "1.6", color: "#0f172a" },
          bindings: { content: "post.content" },
          parentId: colLeftId,
        },
        {
          id: colRightId,
          type: "Container",
          content: "",
          styles: {
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          },
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
          content: {
            title: "Subscribe to our magazine feed",
            buttonText: "Keep Updated",
            placeholder: "your@email.com",
          },
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
          styles: {
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "10px",
          },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content:
            "Browse our latest stories and articles in a modern grid view.",
          styles: {
            fontSize: "16px",
            color: "#64748b",
            textAlign: "center",
            marginBottom: "40px",
          },
          parentId: containerId,
        },
        {
          id: listGridId,
          type: "Collection List",
          content: { limit: 6, category: "" },
          styles: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          },
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
          styles: {
            fontFamily: "Georgia, serif",
            fontSize: "40px",
            textAlign: "center",
            marginBottom: "15px",
            color: "#1c1917",
          },
          bindings: { content: "post.title" },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content:
            "A layout built specifically for longer essays and research. Features high contrast, beautiful serif typography, and generous vertical margins.",
          styles: {
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            fontStyle: "italic",
            textAlign: "center",
            color: "#44403c",
            maxWidth: "800px",
            margin: "0 auto 40px auto",
          },
          parentId: containerId,
        },
        {
          id: quoteBlockId,
          type: "Quote",
          content:
            "This elegant pull-quote serves to break up long runs of text and showcase crucial takeaways from your writing.",
          styles: {
            paddingLeft: "20px",
            borderLeft: "4px solid #b91c1c",
            fontSize: "22px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            margin: "40px auto",
            maxWidth: "650px",
            color: "#78716c",
          },
          parentId: containerId,
        },
        {
          id: bodyParaId,
          type: "Paragraph",
          content:
            "Continue your long-form publication content here. Use multiple paragraphs, subtitles, and headings to keep the reader engaged as they scroll down the single-column content area.",
          styles: {
            fontFamily: "Georgia, serif",
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#1c1917",
            maxWidth: "700px",
            margin: "0 auto",
          },
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
          styles: {
            fontSize: "36px",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "12px",
          },
          parentId: containerId,
        },
        {
          id: paragraphId,
          type: "Paragraph",
          content:
            "A modern design focused on high-quality visual presentation & media case studies.",
          styles: { fontSize: "16px", color: "#a1a1aa", marginBottom: "30px" },
          parentId: containerId,
        },
        {
          id: imageGridId,
          type: "Columns",
          content: 2,
          styles: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          },
          parentId: containerId,
        },
        {
          id: p1,
          type: "Image",
          content: "",
          styles: {
            width: "100%",
            height: "350px",
            objectFit: "cover",
            borderRadius: "8px",
          },
          parentId: imageGridId,
        },
        {
          id: p2,
          type: "Image",
          content: "",
          styles: {
            width: "100%",
            height: "350px",
            objectFit: "cover",
            borderRadius: "8px",
          },
          parentId: imageGridId,
        },
      ];
    default:
      return [];
  }
}
