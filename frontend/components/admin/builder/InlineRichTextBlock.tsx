"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Palette,
  Highlighter,
  RemoveFormatting,
  Check,
  X,
} from "lucide-react";
import { hasInlineHtml, sanitizeInlineRichHtml } from "@/lib/inlineRichText";

interface InlineRichTextBlockProps {
  blockId: string;
  tag: "h2" | "p" | "blockquote";
  value: string;
  className: string;
  style?: React.CSSProperties;
  isSelected: boolean;
  onChange: (nextHtml: string) => void;
}

const TEXT_COLORS = [
  "#0f172a",
  "#475569",
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#16a34a",
  "#ea580c",
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "None", value: "transparent" },
];

export default function InlineRichTextBlock({
  blockId,
  tag,
  value,
  className,
  style,
  isSelected,
  onChange,
}: InlineRichTextBlockProps) {
  const editorRef = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const savedRangeRef = useRef<Range | null>(null);
  const lastCommittedRef = useRef<string>(value);

  // Sync DOM content imperatively (never mix React {children} with contentEditable DOM mutations)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    // On initial mount, block switch, or external update (e.g. SettingsPanel / Undo), sync DOM
    if (!isEditing || value !== lastCommittedRef.current) {
      if (hasInlineHtml(value)) {
        const clean = sanitizeInlineRichHtml(value);
        if (el.innerHTML !== clean) {
          el.innerHTML = clean;
        }
      } else {
        if (el.textContent !== value) {
          el.textContent = value;
        }
      }
      lastCommittedRef.current = value;
    }
  }, [value, isEditing, blockId]);

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
      setShowToolbar(false);
      setShowColorMenu(false);
      setShowHighlightMenu(false);
      setShowLinkInput(false);
    }
  }, [isSelected]);

  const checkSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      if (!showLinkInput) setShowToolbar(false);
      return;
    }
    const range = sel.getRangeAt(0);
    if (
      editorRef.current &&
      editorRef.current.contains(range.commonAncestorContainer) &&
      !sel.isCollapsed
    ) {
      savedRangeRef.current = range.cloneRange();
      setShowToolbar(true);
    } else if (!showLinkInput) {
      setShowToolbar(false);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const commitHtml = () => {
    if (!editorRef.current) return;
    const rawHtml = editorRef.current.innerHTML;
    const clean = sanitizeInlineRichHtml(rawHtml);
    lastCommittedRef.current = clean;
    onChange(clean);
  };

  const execFormat = (command: string, val?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, val);
    commitHtml();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const applyLink = () => {
    const trimmed = linkUrl.trim();
    if (trimmed) {
      const safe = /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      execFormat("createLink", safe);
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const Tag = tag as any;

  return (
    <div className="relative">
      {/* Floating Inline Rich-Text Toolbar */}
      {isEditing && showToolbar && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-12 left-0 z-50 flex items-center gap-1 bg-slate-900 text-white px-2 py-1.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-1"
        >
          <button
            type="button"
            onClick={() => execFormat("bold")}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => execFormat("italic")}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => execFormat("underline")}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          {/* Link */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLinkInput((v) => !v);
                setShowColorMenu(false);
                setShowHighlightMenu(false);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
              title="Insert Link"
            >
              <Link2 size={14} />
            </button>
            {showLinkInput && (
              <div className="absolute top-9 left-0 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl flex items-center gap-1.5 w-64 z-50">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    } else if (e.key === "Escape") {
                      setShowLinkInput(false);
                    }
                  }}
                  placeholder="https://example.com"
                  className="flex-1 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 outline-none focus:border-blue-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={applyLink}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  title="Apply Link"
                >
                  <Check size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkInput(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
                  title="Cancel"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorMenu((v) => !v);
                setShowHighlightMenu(false);
                setShowLinkInput(false);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
              title="Text Color"
            >
              <Palette size={14} />
            </button>
            {showColorMenu && (
              <div className="absolute top-9 left-0 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl flex items-center gap-1.5 z-50">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      execFormat("foreColor", c);
                      setShowColorMenu(false);
                    }}
                    className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
                <input
                  type="color"
                  onChange={(e) => execFormat("foreColor", e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                  title="Custom Color"
                />
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightMenu((v) => !v);
                setShowColorMenu(false);
                setShowLinkInput(false);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
              title="Highlight"
            >
              <Highlighter size={14} />
            </button>
            {showHighlightMenu && (
              <div className="absolute top-9 left-0 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl flex items-center gap-1.5 z-50">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => {
                      execFormat("hiliteColor", h.value);
                      setShowHighlightMenu(false);
                    }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    style={{
                      backgroundColor:
                        h.value === "transparent" ? "#334155" : h.value,
                    }}
                    title={h.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Remove Formatting */}
          <button
            type="button"
            onClick={() => execFormat("removeFormat")}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Clear Formatting"
          >
            <RemoveFormatting size={14} />
          </button>
        </div>
      )}

      <Tag
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        draggable={false}
        onMouseDown={(e: React.MouseEvent) => {
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        onClick={(e: React.MouseEvent) => {
          if (isSelected && !isEditing) {
            e.stopPropagation();
            setIsEditing(true);
            setTimeout(() => editorRef.current?.focus(), 0);
          }
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsEditing(true);
          setTimeout(() => editorRef.current?.focus(), 0);
        }}
        onMouseUp={checkSelection}
        onKeyUp={checkSelection}
        onInput={commitHtml}
        onBlur={() => {
          commitHtml();
          setTimeout(() => {
            if (!showLinkInput) {
              setIsEditing(false);
              setShowToolbar(false);
            }
          }, 150);
        }}
        className={`${className} ${
          isEditing
            ? "outline-none ring-2 ring-blue-400/60 rounded-lg px-1.5 -mx-1.5 bg-blue-50/10 cursor-text select-text"
            : ""
        }`}
        style={style}
        title={
          isSelected && !isEditing
            ? "Click or double-click to edit & format text inline"
            : undefined
        }
      />
    </div>
  );
}
