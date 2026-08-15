import { attachQuillImageControls } from "./quillImageControls";

/**
 * Attach user-friendly tooltips (descriptions) to ReactQuill toolbar buttons in English
 * and activate image resize & alignment controls.
 */
export function attachQuillTooltips() {
  if (typeof window === "undefined") return;

  // Initialize interactive image controls (click image for size & float options)
  attachQuillImageControls();

  const tooltips: Record<string, string> = {
    ".ql-undo": "Undo (Ctrl+Z)",
    ".ql-redo": "Redo (Ctrl+Y)",
    ".ql-header": "Header Style",
    ".ql-font": "Font Family",
    ".ql-size": "Font Size",
    ".ql-bold": "Bold (Ctrl+B)",
    ".ql-italic": "Italic (Ctrl+I)",
    ".ql-underline": "Underline (Ctrl+U)",
    ".ql-strike": "Strikethrough",
    '.ql-script[value="sub"]': "Subscript (x₂)",
    '.ql-script[value="super"]': "Superscript (x²)",
    ".ql-color": "Text Color",
    ".ql-background": "Background Highlight Color",
    '.ql-list[value="ordered"]': "Numbered List (1, 2, 3)",
    '.ql-list[value="bullet"]': "Bullet List (•)",
    '.ql-indent[value="-1"]': "Decrease Indent",
    '.ql-indent[value="+1"]': "Increase Indent",
    ".ql-align": "Text Alignment (Left / Center / Right)",
    ".ql-blockquote": "Blockquote",
    ".ql-code-block": "Code Block",
    ".ql-link": "Insert Link (Ctrl+K)",
    ".ql-image": "Insert Image (Click inserted image for Size & Alignment toolbar)",
    ".ql-video": "Insert Video",
    ".ql-table": "Insert Table",
    ".ql-clean": "Clear Formatting",
  };

  setTimeout(() => {
    for (const [selector, title] of Object.entries(tooltips)) {
      const elements = document.querySelectorAll(`.ql-toolbar ${selector}`);
      elements.forEach((el) => {
        if (el) {
          el.setAttribute("title", title);
        }
      });
    }
  }, 300);
}
