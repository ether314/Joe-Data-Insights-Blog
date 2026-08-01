"use client";

import { Tooltip as RechartsTooltip } from "recharts";
import type { ComponentProps } from "react";

/** Sort multi-series tooltip rows highest → lowest by numeric value. */
export function sortTooltipDescending(
  a: { value?: unknown },
  b: { value?: unknown },
): number {
  return Number(b.value ?? 0) - Number(a.value ?? 0);
}

export function sortTooltipPayload<T extends { value?: unknown }>(
  payload: readonly T[] | undefined,
): T[] {
  if (!payload) return [];
  return [...payload].sort((a, b) => sortTooltipDescending(a, b));
}

type RechartsTooltipProps = ComponentProps<typeof RechartsTooltip>;

/** Recharts 3 itemSorter: return sort key (negate value for descending). */
export function tooltipItemSorter(item: { value?: unknown }) {
  return -Number(item.value ?? 0);
}

/** Drop-in Tooltip with descending itemSorter for ranked multi-value tooltips. */
export function Tooltip(props: RechartsTooltipProps) {
  return <RechartsTooltip itemSorter={tooltipItemSorter} {...props} />;
}
