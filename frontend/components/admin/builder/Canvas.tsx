import {
  FileText,
  Type,
  Image as ImageIcon,
  Quote,
  AlignLeft,
  Minus,
  Square,
  LayoutGrid,
} from "lucide-react";
import {
  useBuilder,
  BlockType,
  BuilderBlock,
} from "@/components/admin/builder/BuilderContext";

export default function Canvas() {
  const { blocks, addBlock, selectBlock, selectedBlockId } = useBuilder();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDropRoot = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;
    if (type) {
      addBlock(type);
    }
  };

  const handleDropNested = (e: React.DragEvent, parentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;
    if (type) {
      addBlock(type, parentId);
    }
  };

  const renderBlockTree = (parentId?: string) => {
    const levelBlocks = blocks.filter(
      (b) => b.parentId === parentId || (!b.parentId && !parentId),
    );

    return levelBlocks.map((block) => {
      const isSelected = selectedBlockId === block.id;

      return (
        <div
          key={block.id}
          onClick={(e) => {
            e.stopPropagation();
            selectBlock(block.id);
          }}
          className={`relative transition-all cursor-pointer ${
            isSelected
              ? "ring-2 ring-blue-500 bg-blue-50/10"
              : "hover:ring-1 hover:ring-blue-200"
          } ${block.type === "Container" || block.type === "Columns" ? "p-2 border-2 border-dashed border-slate-200 rounded-lg min-h-[100px]" : "p-4 rounded-lg border-2 border-transparent hover:bg-slate-50"}`}
        >
          {renderBlockContent(block, isSelected)}

          {(block.type === "Container" || block.type === "Columns") && (
            <div
              className="mt-4 p-4 min-h-[50px] bg-slate-50/50 rounded flex flex-col gap-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropNested(e, block.id)}
            >
              {renderBlockTree(block.id)}
              {blocks.filter((b) => b.parentId === block.id).length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded">
                  Drag{" "}
                  {block.type === "Container" ? "blocks" : "columns content"}{" "}
                  here
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="flex-1 bg-slate-100/50 p-8 flex justify-center overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDropRoot}
    >
      <div className="w-full max-w-3xl bg-white min-h-[800px] rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col relative">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity flex-1">
            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center mb-6 bg-slate-50">
              <FileText className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Start Building your blog post
            </h2>
            <p className="text-slate-500">
              Drag components from the left panel
            </p>
          </div>
        ) : (
          <div className="space-y-4">{renderBlockTree()}</div>
        )}
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
      return (
        <div style={styleString}>
          <img
            src={block.content}
            alt="Block"
            className="w-full h-auto rounded-lg"
          />
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
          className={`flex items-center gap-2 mb-2 text-slate-500 font-medium text-sm grid-cols-${block.content || 2}`}
        >
          <LayoutGrid className="w-4 h-4" /> {block.content || 2} Columns
        </div>
      );
    default:
      return <div className="text-red-500">Unknown block type</div>;
  }
}
