import {
  FileText,
  Type,
  Image as ImageIcon,
  Quote,
  AlignLeft,
  Minus,
  Square,
} from "lucide-react"; // Import icons
import {
  useBuilder,
  BlockType,
} from "@/components/admin/builder/BuilderContext";

export default function Canvas() {
  const { blocks, addBlock, selectBlock, selectedBlockId } = useBuilder();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/react-dnd") as BlockType;
    if (type) {
      addBlock(type);
    }
  };

  return (
    <div
      className="flex-1 bg-slate-100/50 p-8 flex justify-center overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
          <div className="space-y-4">
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectBlock(block.id);
                }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer relative group ${selectedBlockId === block.id ? "border-blue-500 bg-blue-50/10" : "border-transparent hover:border-blue-200 hover:bg-slate-50"}`}
              >
                {renderBlockContent(block)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderBlockContent(block: any) {
  switch (block.type) {
    case "Heading":
      return (
        <h2 className="text-3xl font-bold text-slate-800">{block.content}</h2>
      );
    case "Paragraph":
      return (
        <p className="text-slate-600 leading-relaxed text-lg">
          {block.content}
        </p>
      );
    case "Image":
      return (
        <img
          src={block.content}
          alt="Block"
          className="w-full h-auto rounded-lg"
        />
      );
    case "Quote":
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-700 text-xl">
          {block.content}
        </blockquote>
      );
    case "Divider":
      return <hr className="border-t border-slate-200 my-4" />;
    case "Button":
      return (
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
          {block.content?.text || "Click Me"}
        </button>
      );
    default:
      return <div className="text-red-500">Unknown block type</div>;
  }
}
