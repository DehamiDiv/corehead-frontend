/**
 * Interactive Image Resizing & Alignment Overlay Toolbar for ReactQuill.
 * Allows users to click on any image inside the editor to resize (25%, 50%, 75%, 100%)
 * and align/float (Left, Center, Right, Full Width).
 */
export function attachQuillImageControls() {
  if (typeof window === "undefined") return;

  const EXISTING_TOOLBAR_ID = "quill-image-floating-toolbar";

  // Global listener for click events inside Quill editor
  const handleEditorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if clicked element is an <img> inside Quill editor
    if (target && target.tagName === "IMG" && target.closest(".ql-editor")) {
      e.stopPropagation();
      showImageToolbar(target as HTMLImageElement);
    } else if (
      !target.closest(`#${EXISTING_TOOLBAR_ID}`) &&
      !target.closest(".ql-editor img")
    ) {
      hideImageToolbar();
    }
  };

  document.removeEventListener("click", handleEditorClick);
  document.addEventListener("click", handleEditorClick);
}

export function hideImageToolbar() {
  const toolbar = document.getElementById("quill-image-floating-toolbar");
  if (toolbar) {
    toolbar.remove();
  }
}

export function showImageToolbar(img: HTMLImageElement) {
  hideImageToolbar();

  const toolbar = document.createElement("div");
  toolbar.id = "quill-image-floating-toolbar";
  toolbar.className =
    "fixed z-[9999] bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl p-2.5 flex flex-wrap items-center gap-2 border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150 text-xs font-sans select-none";

  // Calculate position
  const rect = img.getBoundingClientRect();
  toolbar.style.top = `${Math.max(10, rect.top - 58)}px`;
  toolbar.style.left = `${Math.max(10, rect.left + rect.width / 2 - 190)}px`;

  // Alignment options
  const alignButtons = [
    { id: "left", label: "⬅️ Left", float: "left", margin: "0.5rem 1.5rem 1rem 0", display: "inline-block" },
    { id: "center", label: "⏺️ Center", float: "none", margin: "1.5rem auto", display: "block" },
    { id: "right", label: "➡️ Right", float: "right", margin: "0.5rem 0 1rem 1.5rem", display: "inline-block" },
    { id: "full", label: "↔️ Full", float: "none", margin: "1.5rem 0", display: "block" },
  ];

  // Size options
  const sizeButtons = [
    { id: "25%", label: "25%" },
    { id: "50%", label: "50%" },
    { id: "75%", label: "75%" },
    { id: "100%", label: "100%" },
  ];

  // Read current styles
  const currentWidth = img.style.width || "100%";
  const currentFloat = img.style.float || "none";
  const currentDisplay = img.style.display || "inline-block";

  // Create UI HTML
  toolbar.innerHTML = `
    <div class="flex items-center gap-1 pr-2 border-r border-slate-700/80">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Align:</span>
      ${alignButtons
        .map(
          (b) => `
        <button
          type="button"
          data-align="${b.id}"
          class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${
            (b.id === "center" && currentFloat === "none" && currentDisplay === "block") ||
            (b.id === "full" && currentWidth === "100%" && currentFloat === "none") ||
            (b.float === currentFloat && b.id !== "center" && b.id !== "full")
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-300"
          }"
        >
          ${b.label}
        </button>
      `
        )
        .join("")}
    </div>

    <div class="flex items-center gap-1 pr-2 border-r border-slate-700/80">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Size:</span>
      ${sizeButtons
        .map(
          (s) => `
        <button
          type="button"
          data-size="${s.id}"
          class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${
            currentWidth === s.id || (s.id === "100%" && (!img.style.width || img.style.width === "100%"))
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-300"
          }"
        >
          ${s.label}
        </button>
      `
        )
        .join("")}
    </div>

    <button
      type="button"
      id="btn-delete-img"
      class="px-2 py-1 rounded-lg text-[11px] font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center gap-1"
      title="Delete Image"
    >
      🗑️ Remove
    </button>
  `;

  document.body.appendChild(toolbar);

  // Attach button click events
  alignButtons.forEach((b) => {
    const btn = toolbar.querySelector(`[data-align="${b.id}"]`);
    btn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      img.style.float = b.float;
      img.style.display = b.display;
      img.style.margin = b.margin;

      if (b.id === "full") {
        img.style.width = "100%";
      }

      // Visual outline effect
      img.style.outline = "2px solid #2563eb";
      img.style.outlineOffset = "2px";
      setTimeout(() => (img.style.outline = "none"), 1000);

      showImageToolbar(img);
    });
  });

  sizeButtons.forEach((s) => {
    const btn = toolbar.querySelector(`[data-size="${s.id}"]`);
    btn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      img.style.width = s.id;
      img.style.height = "auto";

      img.style.outline = "2px solid #2563eb";
      img.style.outlineOffset = "2px";
      setTimeout(() => (img.style.outline = "none"), 1000);

      showImageToolbar(img);
    });
  });

  const deleteBtn = toolbar.querySelector("#btn-delete-img");
  deleteBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    img.remove();
    hideImageToolbar();
  });
}
