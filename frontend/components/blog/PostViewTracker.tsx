"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

export default function PostViewTracker({ postId }: { postId: number | string }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!postId || trackedRef.current) return;
    trackedRef.current = true;
    api.trackPostView(postId);
  }, [postId]);

  return null;
}
