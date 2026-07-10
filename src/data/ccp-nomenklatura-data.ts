import type { HierarchyNode } from "@/data/ccp-nomenklatura-trees";
import { HIERARCHY_NODES } from "@/data/ccp-nomenklatura-trees";

export const NODE_WIDTH = 148;
export const NODE_HEIGHT = 52;

/** Full-size hierarchy layout (viewBox 0 0 720 320) */
export const NODE_LAYOUT: Record<string, { x: number; y: number }> = {
  nc: { x: 286, y: 8 },
  cc: { x: 286, y: 68 },
  pb: { x: 286, y: 128 },
  psc: { x: 286, y: 188 },
  sec: { x: 24, y: 262 },
  cmc: { x: 148, y: 262 },
  ccdi: { x: 272, y: 262 },
  npc: { x: 396, y: 262 },
  sc: { x: 520, y: 262 },
  cppcc: { x: 644, y: 262 },
};

export const HIERARCHY_VIEWBOX = "0 0 872 320";

export const LAYER_COLORS: Record<HierarchyNode["layer"], string> = {
  congress: "#6366f1",
  committee: "#8b5cf6",
  politburo: "#a855f7",
  psc: "#dc2626",
  organ: "#0891b2",
};

export function nodeById(id: string): HierarchyNode | undefined {
  return HIERARCHY_NODES.find((n) => n.id === id);
}
