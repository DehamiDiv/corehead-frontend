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
} from "lucide-react";
import {
  useBuilder,
  BlockType,
  BuilderBlock,
} from "@/components/admin/builder/BuilderContext";

export default function Canvas() {
  const { blocks, addBlock, selectBlock, selectedBlockId, deviceMode, isAnalyzing, reorderBlocks } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const isSidebarDrag = e.dataTransfer.types.includes("application/react-dnd");
    const isInternalDrag = e.dataTransfer.types.includes("sourceblockid");
    
    if (isSidebarDrag || isInternalDrag) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = isSidebarDrag ? "copy" : "move";
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if we are leaving the main canvas area
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDropRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;
    if (type) {
      addBlock(type);
    }
  };

  const handleDropNested = (e: React.DragEvent, parentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;
    if (type) {
      addBlock(type, parentId);
    }
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("sourceBlockId", blockId);
    e.dataTransfer.effectAllowed = "move";
    // We can't set state here easily because it's a different component sometimes, 
    // but since it's in the same Canvas, it's fine.
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleReorderDrop = (e: React.DragEvent, targetIndex: number, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const sourceId = e.dataTransfer.getData("sourceBlockId");
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;

    if (sourceId) {
      const currentLevelBlocks = blocks.filter(b => b.parentId === parentId || (!b.parentId && !parentId));
      const sourceIndex = blocks.findIndex(b => b.id === sourceId);
      const targetBlock = currentLevelBlocks[targetIndex];
      let globalTargetIndex = targetBlock ? blocks.findIndex(b => b.id === targetBlock.id) : blocks.length;
      
      if (sourceIndex !== -1) {
        reorderBlocks(sourceIndex, globalTargetIndex);
      }
    } else if (type) {
      addBlock(type, parentId);
    }
  };

  const renderBlockTree = (parentId?: string) => {
    const levelBlocks = blocks.filter(
      (b) => b.parentId === parentId || (!b.parentId && !parentId),
    );

    return (
      <div className="flex flex-col">
        {levelBlocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <div key={block.id} className="group/block">
              {/* Drop Zone Above */}
              <div 
                className={`h-4 transition-all flex items-center justify-center relative z-20 ${isDragging ? "bg-blue-50/50 border-y border-dashed border-blue-200 my-1" : "opacity-0 -my-2"}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleReorderDrop(e, index, parentId)}
              >
                {isDragging && <div className="w-12 h-1 bg-blue-400 rounded-full animate-pulse"></div>}
              </div>

              <div
                draggable
                onDragStart={(e) => handleBlockDragStart(e, block.id)}
                onDragEnd={() => setIsDragging(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  selectBlock(block.id);
                }}
                className={`relative transition-all cursor-move ${
                  isSelected
                    ? "ring-2 ring-blue-500 bg-blue-50/10 shadow-lg z-10"
                    : "hover:ring-1 hover:ring-blue-200"
                } ${block.type === "Container" || block.type === "Columns" ? "p-4 border-2 border-dashed border-slate-200 rounded-xl min-h-[120px]" : "p-6 rounded-xl border-2 border-transparent hover:bg-slate-50"}`}
              >
                {/* Drag Handle Indicator */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity p-2 text-slate-300 hover:text-blue-500">
                  <MoveVertical size={20} />
                </div>

                {renderBlockContent(block, isSelected)}

                {(block.type === "Container" || block.type === "Columns") && (
                  <div
                    className={`mt-6 p-6 min-h-[80px] bg-slate-50/50 rounded-xl gap-6 border-2 border-dashed border-slate-100 ${block.type === "Columns" ? "grid" : "flex flex-col"}`}
                    style={block.type === "Columns" ? { 
                      gridTemplateColumns: `repeat(${block.content || 2}, minmax(0, 1fr))` 
                    } : {}}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropNested(e, block.id)}
                  >
                    {renderBlockTree(block.id)}
                    {blocks.filter((b) => b.parentId === block.id).length === 0 && (
                      <div className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2">
                        <LayoutGrid size={16} />
                        Drag content here
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Drop Zone Below (only for last item) */}
              {index === levelBlocks.length - 1 && (
                <div 
                  className={`h-4 transition-all flex items-center justify-center relative z-20 ${isDragging ? "bg-blue-50/50 border-y border-dashed border-blue-200 my-1" : "opacity-0 -my-2"}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleReorderDrop(e, index + 1, parentId)}
                >
                  {isDragging && <div className="w-12 h-1 bg-blue-400 rounded-full animate-pulse"></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Determine width based on deviceMode
  const maxWidthClass = 
    deviceMode === "mobile" ? "max-w-[375px]" :
    deviceMode === "tablet" ? "max-w-[768px]" :
    "max-w-6xl";

  return (
    <div
      className="flex-1 bg-[#f8fafc] flex justify-center items-start overflow-y-auto relative scroll-smooth pb-40 selection:bg-blue-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropRoot}
      style={{
        backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}
    >
      <div className={`w-full ${maxWidthClass} bg-white min-h-[800px] h-fit transition-all duration-300 relative shadow-[0_0_80px_-15px_rgba(0,0,0,0.08)] my-8 rounded-3xl overflow-hidden border border-slate-100`}>
        
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
            
            <h2 className="text-3xl font-bold text-white mb-3">Crafting your layout...</h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">Our AI is analyzing your request to generate the most optimal design structure. This usually takes 2-3 minutes.</p>

            <div className="flex gap-2">
              <div className="w-8 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        )}

        {/* Builder Content */}
        <div className="p-12 md:p-20">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <LayoutGrid className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-slate-800 font-bold text-xl mb-2">Your Canvas is Ready</h3>
               <p className="text-slate-500 text-center max-w-xs">Start by dragging components from the sidebar or use the AI chat to build your page.</p>
            </div>
          ) : (
            <div className="space-y-2">{renderBlockTree()}</div>
          )}
        </div>
      </div>
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
    case "Image":
      const hasBinding = !!block.bindings?.content;
      const imageSrc = typeof block.content === "string" && block.content.trim() !== "" 
        ? block.content 
        : null;

      return (
        <div style={styleString} className="bg-slate-100 rounded-lg overflow-hidden min-h-[120px] flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Block"
              className="w-full h-auto rounded-lg"
            />
          ) : hasBinding ? (
            <div className="flex flex-col items-center justify-center text-blue-600 py-6 text-center">
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-xs font-medium">Bound image</span>
              <span className="text-[10px] text-blue-500/70 mt-0.5">{`{${block.bindings?.content}}`}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 py-8">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-xs">No image URL</span>
            </div>
          )}
        </div>
      );
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
        <div style={styleString} className="border-2 border-blue-100 bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
             <LayoutGrid className="w-6 h-6" />
          </div>
          <h4 className="text-blue-900 font-bold">Collection List (Blog Loop)</h4>
          <p className="text-blue-600/70 text-sm max-w-xs mt-1">
            Displaying up to <span className="font-bold">{block.content?.limit || 6}</span> posts from {block.content?.category || "all categories"}.
          </p>
          <div className="mt-4 flex gap-2">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-24 h-2 bg-blue-200 rounded-full opacity-50"></div>
             ))}
          </div>
        </div>
      );
    case "Featured Carousel":
      return (
        <div style={styleString} className="border border-slate-200 bg-slate-800 rounded-3xl p-8 h-64 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative z-10 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
             <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="relative z-10 text-white font-bold text-xl">Featured Carousel Hero</h4>
          <p className="relative z-10 text-white/70 text-sm max-w-sm mt-1">
            Displays top {block.content?.limit || 3} posts in a large premium carousel.
          </p>
        </div>
      );
    case "Video":
      return (
        <div style={styleString} className="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
           <Video className="w-10 h-10 text-slate-400 mb-2" />
           <span className="text-sm text-slate-500">Video Player: {block.content}</span>
        </div>
      );
    case "Newsletter":
      return (
        <div style={styleString} className="bg-blue-600 rounded-2xl p-8 text-center text-white">
           <Mail className="w-8 h-8 mx-auto mb-4 opacity-80" />
           <h4 className="text-xl font-bold mb-2">{block.content?.title || "Subscribe"}</h4>
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
           {["facebook", "twitter", "instagram", "linkedin"].map(social => (
             <div key={social} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Share2 size={18} />
             </div>
           ))}
        </div>
      );
    case "Spacer":
      return (
        <div style={{ ...styleString, height: block.content || "40px" }} className="w-full flex items-center justify-center border-y border-dashed border-slate-100">
           <MoveVertical size={14} className="text-slate-300" />
        </div>
      );
    case "Code Block":
      return (
        <div style={styleString} className="bg-slate-900 rounded-xl p-6 font-mono text-sm text-blue-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 uppercase tracking-widest">{block.content?.language || "javascript"}</div>
           <pre>{block.content?.code || "print('hello world')"}</pre>
        </div>
      );
    default:
      return <div className="text-red-500">Unknown block type</div>;
  }
}

