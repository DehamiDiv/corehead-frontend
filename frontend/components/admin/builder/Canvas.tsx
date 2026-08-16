import React, { useState } from "react";
import {
  FileText,
  Type,
  Image as ImageIcon,
  Quote,
  AlignLeft,
  Minus,
  Square,
  LayoutGrid,
  Search,
  Video,
  Mail,
  Share2,
  MoveVertical,
  Code,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import {
  useBuilder,
  BlockType,
  BuilderBlock,
} from "@/components/admin/builder/BuilderContext";

const QUICK_BLOCKS: { type: BlockType; label: string; icon: any }[] = [
  { type: "Heading", label: "Heading", icon: Type },
  { type: "Paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "Image", label: "Image", icon: ImageIcon },
  { type: "Button", label: "Button", icon: Square },
  { type: "Quote", label: "Quote", icon: Quote },
  { type: "Divider", label: "Divider", icon: Minus },
  { type: "Container", label: "Container", icon: LayoutGrid },
  { type: "Columns", label: "Columns", icon: LayoutGrid },
  { type: "Collection List", label: "Collection List", icon: LayoutGrid },
  { type: "Featured Carousel", label: "Carousel", icon: ImageIcon },
  { type: "Video", label: "Video", icon: Video },
  { type: "Newsletter", label: "Newsletter", icon: Mail },
  { type: "Social Links", label: "Social Links", icon: Share2 },
  { type: "Spacer", label: "Spacer", icon: MoveVertical },
  { type: "Code Block", label: "Code Block", icon: Code },
];

interface DropTargetState {
  blockId: string;
  position: "before" | "after" | "inside";
  parentId?: string;
  targetIndex: number;
}

export default function Canvas() {
  const {
    blocks,
    addBlock,
    selectBlock,
    selectedBlockId,
    deviceMode,
    isAnalyzing,
    reorderBlocks,
    duplicateBlock,
    moveBlock,
    moveBlockTo,
    removeBlock,
    compareMode,
    aiBlocks,
    acceptAiLayout,
    discardAiLayout,
  } = useBuilder();

  const [isDragging, setIsDragging] = useState(false);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTargetState | null>(null);
  const [insertPickerTarget, setInsertPickerTarget] = useState<{
    parentId?: string;
    targetIndex: number;
  } | null>(null);

  const handleDragOverCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer || !e.dataTransfer.types) return;

    const typesArray = Array.from(e.dataTransfer.types);
    const isSidebarDrag = typesArray.some(
      (t) => t.toLowerCase() === "application/react-dnd"
    );
    const isInternalDrag = typesArray.some(
      (t) => t.toLowerCase() === "sourceblockid"
    );

    if (isSidebarDrag || isInternalDrag) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = isSidebarDrag ? "copy" : "move";
    }
  };

  const handleDragLeaveCanvas = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
      setDropTarget(null);
    }
  };

  const handleDropRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDropTarget(null);

    const sourceId = e.dataTransfer.getData("sourceBlockId");
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;

    if (sourceId) {
      moveBlockTo(sourceId, undefined, undefined);
    } else if (type) {
      addBlock(type);
    }
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("sourceBlockId", blockId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingBlockId(blockId);
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleBlockDragEnd = () => {
    setIsDragging(false);
    setDraggingBlockId(null);
    setDropTarget(null);
  };

  const handleBlockDragOver = (
    e: React.DragEvent,
    block: BuilderBlock,
    levelIndex: number,
    parentId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isTop = e.clientY < midY;

    setDropTarget({
      blockId: block.id,
      position: isTop ? "before" : "after",
      parentId: parentId,
      targetIndex: isTop ? levelIndex : levelIndex + 1,
    });
  };

  const handleExecuteDrop = (
    e: React.DragEvent,
    targetParentId?: string,
    targetIndex?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDropTarget(null);

    const sourceId = e.dataTransfer.getData("sourceBlockId");
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;

    if (sourceId) {
      moveBlockTo(sourceId, targetParentId, targetIndex);
    } else if (type) {
      addBlock(type, targetParentId, targetIndex);
    }
  };

  const handleQuickInsert = (
    type: BlockType,
    parentId?: string,
    targetIndex?: number
  ) => {
    addBlock(type, parentId, targetIndex);
    setInsertPickerTarget(null);
  };

  const renderBlockTree = (
    blocksList: BuilderBlock[],
    parentId?: string,
    isInteractive = true
  ) => {
    const levelBlocks = blocksList.filter(
      (b) => b.parentId === parentId || (!b.parentId && !parentId)
    );

    return (
      <div className="flex flex-col relative">
        {levelBlocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;
          const isCurrentlyDragging = draggingBlockId === block.id;
          const isDropTargetBefore =
            isDragging &&
            dropTarget?.blockId === block.id &&
            dropTarget.position === "before";
          const isDropTargetAfter =
            isDragging &&
            dropTarget?.blockId === block.id &&
            dropTarget.position === "after";

          return (
            <div key={block.id} className="group/block relative">
              {/* Active Drop Indicator Line: BEFORE */}
              {isInteractive && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropTarget({
                      blockId: block.id,
                      position: "before",
                      parentId,
                      targetIndex: index,
                    });
                  }}
                  onDrop={(e) => handleExecuteDrop(e, parentId, index)}
                  className={`transition-all duration-200 relative flex items-center justify-center ${isDropTargetBefore
                    ? "h-10 my-2 bg-blue-500/10 border-2 border-blue-500 rounded-xl"
                    : isDragging
                      ? "h-3 -my-1.5 opacity-0 hover:opacity-100 hover:bg-blue-200"
                      : "h-2 -my-1 opacity-0 group-hover/block:opacity-100"
                    }`}
                >
                  {isDropTargetBefore ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                      <Plus size={14} /> Insert Here
                    </div>
                  ) : !isDragging && isInteractive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsertPickerTarget({ parentId, targetIndex: index });
                      }}
                      className="opacity-0 group-hover/block:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[11px] font-semibold shadow-md transform hover:scale-105 z-30"
                      title="Insert component here"
                    >
                      <Plus size={12} /> Add Here
                    </button>
                  ) : null}
                </div>
              )}

              {/* Block Item */}
              <div
                draggable={isInteractive}
                onDragStart={(e) =>
                  isInteractive && handleBlockDragStart(e, block.id)
                }
                onDragEnd={handleBlockDragEnd}
                onDragOver={(e) =>
                  isInteractive && handleBlockDragOver(e, block, index, parentId)
                }
                onDrop={(e) => {
                  if (isInteractive && dropTarget) {
                    handleExecuteDrop(
                      e,
                      dropTarget.parentId,
                      dropTarget.targetIndex
                    );
                  }
                }}
                onClick={(e) => {
                  if (isInteractive) {
                    e.stopPropagation();
                    selectBlock(block.id);
                  }
                }}
                className={`relative transition-all duration-200 ${isInteractive ? "cursor-pointer" : ""
                  } ${isCurrentlyDragging
                    ? "opacity-25 scale-[0.98] border-2 border-dashed border-blue-500"
                    : ""
                  } ${isInteractive && isSelected && !isCurrentlyDragging
                    ? "ring-2 ring-blue-600 bg-blue-50/20 shadow-xl rounded-2xl z-20"
                    : isInteractive && !isCurrentlyDragging
                      ? "hover:ring-1 hover:ring-blue-300 rounded-2xl"
                      : ""
                  } ${block.type === "Container" || block.type === "Columns"
                    ? "p-5 border-2 border-dashed border-slate-200 rounded-2xl min-h-[140px] bg-slate-50/30"
                    : "p-6 rounded-2xl border-2 border-transparent hover:bg-slate-50/80"
                  }`}
              >
                {/* Floating Action Toolbar for Selected Block */}
                {isInteractive && isSelected && !isCurrentlyDragging && (
                  <div className="absolute -top-11 left-4 z-40 flex items-center gap-1 bg-slate-900 text-white px-2 py-1.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 text-xs">
                    <span className="font-bold text-[11px] px-2 text-blue-300 border-r border-slate-700">
                      {block.type}
                    </span>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, "up");
                      }}
                      className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 text-slate-300 hover:text-white transition"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === levelBlocks.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, "down");
                      }}
                      className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 text-slate-300 hover:text-white transition"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* Add Below */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsertPickerTarget({
                          parentId,
                          targetIndex: index + 1,
                        });
                      }}
                      className="p-1 hover:bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition"
                      title="Insert Block Below"
                    >
                      <Plus size={14} />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateBlock(block.id);
                      }}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
                      title="Duplicate Block"
                    >
                      <Copy size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="p-1 hover:bg-red-900/60 rounded text-red-400 hover:text-red-300 transition ml-1"
                      title="Delete Block"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Drag Grip Handle on Hover */}
                {isInteractive && (
                  <div
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm cursor-grab active:cursor-grabbing z-20"
                    title="Drag to move anywhere"
                  >
                    <GripVertical size={16} />
                  </div>
                )}

                {/* Block Content */}
                {renderBlockContent(block, isInteractive && isSelected)}

                {/* Nested Containers / Columns */}
                {(block.type === "Container" || block.type === "Columns") && (
                  <div
                    className={`mt-4 p-5 min-h-[90px] bg-white/80 rounded-xl gap-4 border-2 border-dashed border-slate-200 transition-all ${isDragging
                      ? "border-blue-400 bg-blue-50/20 ring-2 ring-blue-200"
                      : ""
                      } ${block.type === "Columns" ? "grid" : "flex flex-col"
                      }`}
                    style={
                      block.type === "Columns"
                        ? {
                          gridTemplateColumns: `repeat(${block.content || 2
                            }, minmax(0, 1fr))`,
                        }
                        : {}
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                      setDropTarget({
                        blockId: block.id,
                        position: "inside",
                        parentId: block.id,
                        targetIndex: blocksList.filter(
                          (b) => b.parentId === block.id
                        ).length,
                      });
                    }}
                    onDrop={(e) => {
                      const childCount = blocksList.filter(
                        (b) => b.parentId === block.id
                      ).length;
                      handleExecuteDrop(e, block.id, childCount);
                    }}
                  >
                    {renderBlockTree(blocksList, block.id, isInteractive)}

                    {blocksList.filter((b) => b.parentId === block.id)
                      .length === 0 && (
                        <div className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                          <LayoutGrid size={18} className="text-slate-300" />
                          <span className="font-medium text-xs">
                            Drop components inside this {block.type}
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Active Drop Indicator Line: AFTER (on last item of level) */}
              {isInteractive && index === levelBlocks.length - 1 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropTarget({
                      blockId: block.id,
                      position: "after",
                      parentId,
                      targetIndex: index + 1,
                    });
                  }}
                  onDrop={(e) => handleExecuteDrop(e, parentId, index + 1)}
                  className={`transition-all duration-200 relative flex items-center justify-center ${isDropTargetAfter
                    ? "h-10 my-2 bg-blue-500/10 border-2 border-blue-500 rounded-xl"
                    : isDragging
                      ? "h-3 -my-1.5 opacity-0 hover:opacity-100 hover:bg-blue-200"
                      : "h-2 -my-1 opacity-0 group-hover/block:opacity-100"
                    }`}
                >
                  {isDropTargetAfter ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                      <Plus size={14} /> Insert Here
                    </div>
                  ) : !isDragging && isInteractive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsertPickerTarget({
                          parentId,
                          targetIndex: index + 1,
                        });
                      }}
                      className="opacity-0 group-hover/block:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[11px] font-semibold shadow-md transform hover:scale-105 z-30"
                      title="Insert component at end"
                    >
                      <Plus size={12} /> Add Here
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const maxWidthClass =
    compareMode && aiBlocks.length > 0
      ? "max-w-[95%]"
      : deviceMode === "mobile"
        ? "max-w-[375px]"
        : deviceMode === "tablet"
          ? "max-w-[768px]"
          : "max-w-6xl";

  return (
    <div
      className="flex-1 bg-[#f8fafc] flex justify-center items-start overflow-y-auto relative scroll-smooth pb-40 selection:bg-blue-100"
      onDragOver={handleDragOverCanvas}
      onDragLeave={handleDragLeaveCanvas}
      onDrop={handleDropRoot}
      style={{
        backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className={`w-full ${maxWidthClass} bg-white min-h-[800px] h-fit transition-all duration-300 relative shadow-[0_0_80px_-15px_rgba(0,0,0,0.08)] my-8 rounded-3xl overflow-visible border border-slate-100`}
      >
        {/* Analyzing Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 flex flex-col items-center justify-center p-8 backdrop-blur-md">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden animate-bounce">
              <FileText size={40} className="text-slate-800" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 ml-4">
                <div className="bg-indigo-600 rounded-full p-1.5 border-4 border-white">
                  <Search size={18} className="text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Crafting your layout...
            </h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">
              Our AI is analyzing your request to generate the most optimal
              design structure. This usually takes 2-3 minutes.
            </p>

            <div className="flex gap-2">
              <div className="w-8 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-1.5 bg-indigo-500 rounded-full animate-pulse"
                style={{ animationDelay: "200ms" }}
              ></div>
              <div
                className="w-2 h-1.5 bg-indigo-500 rounded-full animate-pulse"
                style={{ animationDelay: "400ms" }}
              ></div>
            </div>
          </div>
        )}

        {/* Compare Mode Banner */}
        {compareMode && aiBlocks.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-30 bg-blue-50 border-b border-blue-150 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span className="text-sm font-bold text-blue-900">
                ⚡ Compare Mode — Current Layout vs AI Generation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={acceptAiLayout}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              >
                ✅ Use AI Layout
              </button>
              <button
                onClick={discardAiLayout}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                Discard AI
              </button>
            </div>
          </div>
        )}

        {/* Builder Content */}
        <div
          className={`p-12 md:p-20 ${compareMode && aiBlocks.length > 0 ? "pt-24" : ""
            }`}
        >
          {compareMode && aiBlocks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 divide-x divide-slate-100">
              <div className="pr-2">
                <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  📌 Current Layout
                </div>
                {blocks.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Empty layout</p>
                ) : (
                  <div className="space-y-2">
                    {renderBlockTree(blocks, undefined, true)}
                  </div>
                )}
              </div>
              <div className="pl-6 lg:pl-10">
                <div className="mb-4 text-xs font-bold text-blue-600 uppercase tracking-widest">
                  🤖 AI Generated Layout
                </div>
                {aiBlocks.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">
                    AI generation empty
                  </p>
                ) : (
                  <div className="space-y-2">
                    {renderBlockTree(aiBlocks, undefined, false)}
                  </div>
                )}
              </div>
            </div>
          ) : blocks.length === 0 ? (
            <div
              onDragOver={handleDragOverCanvas}
              onDrop={handleDropRoot}
              className="flex flex-col items-center justify-center min-h-[600px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/20 transition-all p-8 text-center cursor-pointer"
              onClick={() => setInsertPickerTarget({ targetIndex: 0 })}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-slate-800 font-bold text-xl mb-2">
                Your Canvas is Ready
              </h3>
              <p className="text-slate-500 max-w-xs mb-6 text-sm">
                Drag components from the sidebar or click below to start building your page.
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200 flex items-center gap-2"
              >
                <Plus size={16} /> Add First Component
              </button>
            </div>
          ) : (
            <div className="space-y-1">{renderBlockTree(blocks, undefined, true)}</div>
          )}
        </div>
      </div>

      {/* Quick Insert Component Modal/Picker */}
      {insertPickerTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInsertPickerTarget(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 max-w-xl w-full animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Insert Component
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Select a component to place at this location
                </p>
              </div>
              <button
                onClick={() => setInsertPickerTarget(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {QUICK_BLOCKS.map((tool) => (
                <button
                  key={tool.type}
                  type="button"
                  onClick={() =>
                    handleQuickInsert(
                      tool.type,
                      insertPickerTarget.parentId,
                      insertPickerTarget.targetIndex
                    )
                  }
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-300 rounded-2xl text-center transition-all group hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                    <tool.icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderBlockContent(block: BuilderBlock, isSelected: boolean) {
  const styleString = block.styles || {};
  // Use binding content if available
  const contentToRender = block.bindings?.content ? (
    <span className="text-blue-600 bg-blue-50 px-1 rounded">
      {`{${block.bindings.content}}`}
    </span>
  ) : (
    block.content
  );

  switch (block.type) {
    case "Heading":
      return (
        <h2 className="text-3xl font-bold text-slate-800" style={styleString}>
          {contentToRender}
        </h2>
      );
    case "Paragraph":
      return (
        <p
          className="text-slate-600 leading-relaxed text-lg"
          style={styleString}
        >
          {contentToRender}
        </p>
      );
    case "Image": {
      const hasBinding = !!block.bindings?.content;
      const imageSrc = typeof block.content === "string" && block.content.trim() !== ""
        ? block.content
        : null;
      const seed = Math.abs((block.id || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 42));
      const placeholderUrl = `https://picsum.photos/seed/ai-${seed}/800/400`;

      return (
        <div style={styleString} className="bg-slate-100 rounded-lg overflow-hidden min-h-[120px] flex items-center justify-center">
          {hasBinding ? (
            <div className="relative w-full">
              <img
                src={placeholderUrl}
                alt="Bound image preview"
                className="w-full h-auto rounded-lg opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-700 bg-blue-50/60 rounded-lg">
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">Bound to: {`{${block.bindings?.content}}`}</span>
              </div>
            </div>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Block"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = placeholderUrl;
              }}
            />
          ) : (
            <img
              src={placeholderUrl}
              alt="Image placeholder"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
              }}
            />
          )}
        </div>
      );
    }
    case "Quote":
      return (
        <blockquote
          className="border-l-4 border-blue-500 pl-4 italic text-slate-700 text-xl"
          style={styleString}
        >
          {contentToRender}
        </blockquote>
      );
    case "Divider":
      return (
        <hr className="border-t border-slate-200 my-4" style={styleString} />
      );
    case "Button":
      return (
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
          style={styleString}
        >
          {block.content?.text || "Click Me"}
        </button>
      );
    case "Container":
      return (
        <div
          style={styleString}
          className="flex items-center gap-2 mb-2 text-slate-500 font-medium text-sm"
        >
          <LayoutGrid className="w-4 h-4" /> Container
        </div>
      );
    case "Columns":
      return (
        <div
          style={styleString}
          className="flex items-center gap-2 mb-2 text-slate-500 font-medium text-sm"
        >
          <LayoutGrid className="w-4 h-4" /> {block.content || 2} Columns
        </div>
      );
    case "Collection List":
      return (
        <div
          style={styleString}
          className="border-2 border-blue-100 bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h4 className="text-blue-900 font-bold">
            Collection List (Blog Loop)
          </h4>
          <p className="text-blue-600/70 text-sm max-w-xs mt-1">
            Displaying up to{" "}
            <span className="font-bold">{block.content?.limit || 6}</span> posts
            from {block.content?.category || "all categories"}.
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-24 h-2 bg-blue-200 rounded-full opacity-50"
              ></div>
            ))}
          </div>
        </div>
      );
    case "Featured Carousel":
      return (
        <div
          style={styleString}
          className="border border-slate-200 bg-slate-800 rounded-3xl p-8 h-64 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative z-10 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="relative z-10 text-white font-bold text-xl">
            Featured Carousel Hero
          </h4>
          <p className="relative z-10 text-white/70 text-sm max-w-sm mt-1">
            Displays top {block.content?.limit || 3} posts in a large premium
            carousel.
          </p>
        </div>
      );
    case "Video":
      return (
        <div
          style={styleString}
          className="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200"
        >
          <Video className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm text-slate-500">
            Video Player: {block.content}
          </span>
        </div>
      );
    case "Newsletter":
      return (
        <div
          style={styleString}
          className="bg-blue-600 rounded-2xl p-8 text-center text-white"
        >
          <Mail className="w-8 h-8 mx-auto mb-4 opacity-80" />
          <h4 className="text-xl font-bold mb-2">
            {block.content?.title || "Subscribe"}
          </h4>
          <div className="flex gap-2 max-w-md mx-auto mt-6">
            <div className="flex-1 bg-white/10 rounded-lg h-10 border border-white/20"></div>
            <div className="w-24 bg-white text-blue-600 font-bold rounded-lg h-10 flex items-center justify-center text-sm">
              {block.content?.buttonText || "Join"}
            </div>
          </div>
        </div>
      );
    case "Social Links":
      return (
        <div style={styleString} className="flex justify-center gap-4 py-4">
          {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
            <div
              key={social}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
            >
              <Share2 size={18} />
            </div>
          ))}
        </div>
      );
    case "Spacer":
      return (
        <div
          style={{ ...styleString, height: block.content || "40px" }}
          className="w-full flex items-center justify-center border-y border-dashed border-slate-100"
        >
          <MoveVertical size={14} className="text-slate-300" />
        </div>
      );
    case "Code Block":
      return (
        <div
          style={styleString}
          className="bg-slate-900 rounded-xl p-6 font-mono text-sm text-blue-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 uppercase tracking-widest">
            {block.content?.language || "javascript"}
          </div>
          <pre>{block.content?.code || "print('hello world')"}</pre>
        </div>
      );
    default:
      return <div className="text-red-500">Unknown block type</div>;
  }
}
