export type PartKey = string;

export type Group = {
  title: string;
  subtitle?: string;
  items: { key: PartKey; label: string; hint?: string }[];
};
