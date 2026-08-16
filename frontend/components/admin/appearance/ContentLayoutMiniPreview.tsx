import { cn } from "@/lib/utils";

type PreviewBlock = {
  id?: string;
  type?: string;
  parentId?: string;
  bindings?: { content?: string };
};

function blockShape(block: PreviewBlock) {
  const type = String(block.type || "").toLowerCase();
  const binding = String(block.bindings?.content || "");

  if (type.includes("image") || binding.includes("coverImage") || binding.includes("featured_image")) {
    return <div className="h-14 w-full rounded-lg bg-gradient-to-br from-slate-300 to-slate-400" />;
  }
  if (type.includes("heading") || binding === "post.title") {
    return (
      <div className="space-y-1.5">
        <div className="h-3 w-4/5 rounded-full bg-slate-800" />
        <div className="h-3 w-3/5 rounded-full bg-slate-800" />
      </div>
    );
  }
  if (binding.includes("category")) {
    return <div className="h-2 w-16 rounded-full bg-blue-500" />;
  }
  if (binding.includes("excerpt")) {
    return <div className="h-2 w-11/12 rounded-full bg-slate-400" />;
  }
  if (binding.includes("content") || type === "paragraph" || type === "markdown" || type === "html") {
    return (
      <div className="space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-slate-300" />
        <div className="h-1.5 w-11/12 rounded-full bg-slate-300" />
        <div className="h-1.5 w-4/5 rounded-full bg-slate-300" />
      </div>
    );
  }
  if (type.includes("quote")) {
    return <div className="h-8 rounded-r-lg border-l-4 border-blue-500 bg-blue-50" />;
  }
  if (type.includes("divider")) {
    return <div className="h-px w-full bg-slate-200" />;
  }
  if (type.includes("button")) {
    return <div className="h-5 w-20 rounded-full bg-slate-800" />;
  }
  return <div className="h-4 w-full rounded-md border border-dashed border-slate-300 bg-white/60" />;
}

export default function ContentLayoutMiniPreview({
  blocks,
  selected = false,
}: {
  blocks?: unknown[];
  selected?: boolean;
}) {
  const previewBlocks = (Array.isArray(blocks) ? blocks : [])
    .filter((block): block is PreviewBlock => Boolean(block && typeof block === "object"))
    .filter((block) => !block.parentId)
    .slice(0, 7);

  return (
    <div
      className={cn(
        "relative mt-4 h-44 overflow-hidden rounded-xl border bg-slate-100 p-3",
        selected ? "border-blue-200" : "border-slate-200",
      )}
      aria-label="Layout structure preview"
    >
      <div className="mx-auto h-full max-w-[13rem] overflow-hidden rounded-lg border border-white bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-1 border-b border-slate-100 pb-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="h-1.5 w-12 rounded-full bg-slate-200" />
          <span className="ml-auto h-1.5 w-8 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-2.5">
          {previewBlocks.length > 0 ? (
            previewBlocks.map((block, index) => (
              <div key={block.id || `${block.type}-${index}`}>{blockShape(block)}</div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
              No preview blocks
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-100 to-transparent" />
    </div>
  );
}
