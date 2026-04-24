import type { ReactNode } from "react";

export type PartKey = string;

export type Group = {
  title: string;
  subtitle?: string;
  items: { key: PartKey; label: string; hint?: string; icon?: ReactNode | string }[];
};
