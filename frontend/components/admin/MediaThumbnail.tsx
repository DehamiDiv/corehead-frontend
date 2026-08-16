"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function MediaThumbnail({ src, alt, className }: MediaThumbnailProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 px-3 text-center text-slate-400",
          className,
        )}
        role="img"
        aria-label={`${alt} is unavailable`}
      >
        <ImageOff className="h-7 w-7" aria-hidden="true" />
        <span className="text-[11px] font-semibold">Image unavailable</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
