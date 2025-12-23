import { z } from "zod";

import type { GridItemModel } from "./types";

const storageKey = "fancydashboard.modularGrid.items.v1";

const resizeConstraintsSchema = z
  .object({
    lockCol: z.boolean().optional(),
    lockRow: z.boolean().optional(),
    minColSpan: z.number().int().min(1).optional(),
    maxColSpan: z.number().int().min(1).optional(),
    minRowSpan: z.number().int().min(1).optional(),
    maxRowSpan: z.number().int().min(1).optional(),
  })
  .optional();

const contentSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text: z.string() }),
  z.object({
    kind: z.literal("number"),
    value: z.number(),
    label: z.string().optional(),
  }),
  z.object({
    kind: z.literal("appicon"),
    name: z.string(),
    src: z.string().optional(),
  }),
  z.object({
    kind: z.literal("image"),
    src: z.string(),
    alt: z.string().optional(),
    fit: z.enum(["cover", "contain"]).optional(),
  }),
]);

const itemSchema = z.object({
  id: z.string().min(1),
  colSpan: z.number().int().min(1),
  rowSpan: z.number().int().min(1),
  color: z.string().min(1),
  content: contentSchema,
  resize: resizeConstraintsSchema,
});

const itemsSchema = z.array(itemSchema);

export const loadPersistedItems = (): GridItemModel[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = itemsSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;

    return parsed.data as GridItemModel[];
  } catch {
    return null;
  }
};

export const persistItems = (items: GridItemModel[]): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // ignore quota / serialization errors
  }
};
