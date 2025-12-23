import type { GridItemContent, GridItemKind, GridItemModel } from "./types";

const hues = [200, 210, 220, 260, 280, 330, 160];

export const generateColor = (): string => {
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsla(${hue}, 70%, 85%, 1)`;
};

export const generateId = (): string => Math.random().toString(36).slice(2, 11);

const defaultContentByKind = (kind: GridItemKind): GridItemContent => {
  switch (kind) {
    case "text":
      return { kind: "text", text: "Texto" };
    case "number":
      return { kind: "number", value: 42, label: "Valor" };
    case "appicon":
      return { kind: "appicon", name: "App", src: "/tauri.svg" };
    case "image":
      return { kind: "image", src: "/vite.svg", alt: "Imagem", fit: "cover" };
  }
};

const defaultSizeByKind = (
  kind: GridItemKind
): Pick<GridItemModel, "colSpan" | "rowSpan"> => {
  switch (kind) {
    case "text":
      return { colSpan: 2, rowSpan: 1 };
    case "number":
      return { colSpan: 1, rowSpan: 1 };
    case "appicon":
      return { colSpan: 1, rowSpan: 1 };
    case "image":
      return { colSpan: 2, rowSpan: 2 };
  }
};

export const createGridItem = (kind: GridItemKind = "text"): GridItemModel => {
  const size = defaultSizeByKind(kind);
  return {
    id: generateId(),
    color: generateColor(),
    ...size,
    content: defaultContentByKind(kind),
  };
};
