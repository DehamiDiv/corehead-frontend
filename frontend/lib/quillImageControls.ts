/**
 * Interactive Image & Table Resizing, Alignment, and Row/Column Control Toolbar for ReactQuill.
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
      target &&
      (target.closest(".table-responsive") || target.closest("table") || target.tagName === "TD" || target.tagName === "TH") &&
      target.closest(".ql-editor")
    ) {
      const tableElem = (target.closest(".table-responsive") ||
        target.closest("table")) as HTMLElement;
      showTableToolbar(tableElem);
    } else if (
      !target.closest(`#${EXISTING_TOOLBAR_ID}`) &&
      !target.closest(".ql-editor img") &&
      !target.closest(".ql-editor table")
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

  // Clear visual outline highlights
  document.querySelectorAll(".ql-editor table, .ql-editor .table-responsive, .ql-editor img").forEach((el) => {
    (el as HTMLElement).style.outline = "none";
  });
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

  // Visual outline effect
  img.style.outline = "2px solid #2563eb";
  img.style.outlineOffset = "2px";

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

export function showTableToolbar(tableElem: HTMLElement) {
  hideImageToolbar();

  const wrapper = (tableElem.closest(".table-responsive") || tableElem.closest("table") || tableElem) as HTMLElement;
  const table = (wrapper.querySelector("table") || (wrapper.tagName === "TABLE" ? wrapper : null)) as HTMLTableElement;

  if (!table) return;

  const toolbar = document.createElement("div");
  toolbar.id = "quill-image-floating-toolbar";
  toolbar.className =
    "fixed z-[9999] bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl p-2.5 flex flex-wrap items-center gap-2 border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150 text-xs font-sans select-none max-w-2xl";

  const rect = wrapper.getBoundingClientRect();
  toolbar.style.top = `${Math.max(10, rect.top - 62)}px`;
  toolbar.style.left = `${Math.max(10, rect.left)}px`;

  // Read current width & float
  const currentWidth = wrapper.style.width || wrapper.style.maxWidth || "100%";
  const currentFloat = wrapper.style.float || "none";

  toolbar.innerHTML = `
    <div class="flex items-center gap-1 pr-2 border-r border-slate-700/80">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Align:</span>
      <button type="button" data-tbl-align="left" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentFloat === "left" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">⬅️ Left</button>
      <button type="button" data-tbl-align="center" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentFloat === "none" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">⏺️ Center</button>
      <button type="button" data-tbl-align="right" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentFloat === "right" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">➡️ Right</button>
    </div>

    <div class="flex items-center gap-1 pr-2 border-r border-slate-700/80">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Size:</span>
      <button type="button" data-tbl-size="50%" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentWidth === "50%" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">50%</button>
      <button type="button" data-tbl-size="75%" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentWidth === "75%" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">75%</button>
      <button type="button" data-tbl-size="100%" class="px-2 py-1 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-800 ${currentWidth === "100%" || currentWidth === "" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300"}">100%</button>
    </div>

    <div class="flex items-center gap-1 pr-2 border-r border-slate-700/80">
      <button type="button" id="btn-add-row" class="px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all" title="Add new row below">➕ Row</button>
      <button type="button" id="btn-del-row" class="px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all" title="Delete bottom row">➖ Row</button>
      <button type="button" id="btn-add-col" class="px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all" title="Add new column right">➕ Col</button>
      <button type="button" id="btn-del-col" class="px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all" title="Delete rightmost column">➖ Col</button>
    </div>

    <button
      type="button"
      id="btn-delete-table"
      class="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center gap-1"
      title="Delete Entire Table"
    >
      🗑️ Delete Table
    </button>
  `;

  document.body.appendChild(toolbar);

  // Visual outline effect
  wrapper.style.outline = "2px dashed #2563eb";
  wrapper.style.outlineOffset = "4px";

  // ALIGNMENT
  toolbar.querySelector('[data-tbl-align="left"]')?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    wrapper.style.float = "left";
    wrapper.style.margin = "0.5rem 1.5rem 1rem 0";
    wrapper.style.display = "inline-block";
    showTableToolbar(tableElem);
  });
  toolbar.querySelector('[data-tbl-align="center"]')?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    wrapper.style.float = "none";
    wrapper.style.margin = "1.5rem auto";
    wrapper.style.display = "block";
    showTableToolbar(tableElem);
  });
  toolbar.querySelector('[data-tbl-align="right"]')?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    wrapper.style.float = "right";
    wrapper.style.margin = "0.5rem 0 1rem 1.5rem";
    wrapper.style.display = "inline-block";
    showTableToolbar(tableElem);
  });

  // SIZE
  ["50%", "75%", "100%"].forEach((sz) => {
    toolbar.querySelector(`[data-tbl-size="${sz}"]`)?.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      wrapper.style.width = sz;
      wrapper.style.maxWidth = sz;
      table.style.width = "100%";
      if (sz !== "100%" && wrapper.style.float === "none") {
        wrapper.style.display = "block";
        wrapper.style.margin = "1.5rem auto";
      }
      showTableToolbar(tableElem);
    });
  });

  // ADD ROW (Adds a horizontal row at the bottom)
  toolbar.querySelector("#btn-add-row")?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const rows = Array.from(table.querySelectorAll("tr"));
    const colCount = rows.length > 0 ? rows[0].children.length : 2;
    const newRow = document.createElement("tr");
    const rowIndex = rows.length + 1;
    for (let c = 1; c <= colCount; c++) {
      const td = document.createElement("td");
      td.style.border = "1px solid #cbd5e1";
      td.style.padding = "10px 14px";
      td.innerHTML = `Cell ${rowIndex}.${c}`;
      newRow.appendChild(td);
    }
    const tbody = table.querySelector("tbody") || table;
    tbody.appendChild(newRow);
    showTableToolbar(tableElem);
  });

  // DELETE ROW (Removes bottom row)
  toolbar.querySelector("#btn-del-row")?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length > 1) {
      rows[rows.length - 1].remove();
    }
    showTableToolbar(tableElem);
  });

  // ADD COLUMN (Adds a vertical column to the right)
  toolbar.querySelector("#btn-add-col")?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((tr, rIdx) => {
      const isHeader = rIdx === 0 && tr.parentElement?.tagName === "THEAD";
      const cellTag = isHeader ? "th" : "td";
      const cell = document.createElement(cellTag);
      cell.style.border = "1px solid #cbd5e1";
      cell.style.padding = "10px 14px";
      if (isHeader) {
        cell.style.backgroundColor = "#f8fafc";
        cell.style.fontWeight = "bold";
        cell.innerHTML = `Header ${tr.children.length + 1}`;
      } else {
        if (rIdx === 0) cell.style.backgroundColor = "#f8fafc";
        cell.innerHTML = `Cell ${rIdx + 1}.${tr.children.length + 1}`;
      }
      tr.appendChild(cell);
    });
    showTableToolbar(tableElem);
  });

  // DELETE COLUMN (Removes rightmost column)
  toolbar.querySelector("#btn-del-col")?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((tr) => {
      if (tr.children.length > 1) {
        tr.children[tr.children.length - 1].remove();
      }
    });
    showTableToolbar(tableElem);
  });

  // DELETE ENTIRE TABLE
  toolbar.querySelector("#btn-delete-table")?.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    wrapper.remove();
    hideImageToolbar();
  });
}
