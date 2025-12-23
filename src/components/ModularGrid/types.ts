export type GridItemKind = "text" | "number" | "appicon" | "image";

export type GridItemContent =
  | { kind: "text"; text: string }
  | { kind: "number"; value: number; label?: string }
  | { kind: "appicon"; name: string; src?: string }
  | { kind: "image"; src: string; alt?: string; fit?: "cover" | "contain" };

export type ResizeConstraints = {
  lockCol?: boolean;
  lockRow?: boolean;
  minColSpan?: number;
  maxColSpan?: number;
  minRowSpan?: number;
  maxRowSpan?: number;
};

export type GridItemModel = {
  id: string;
  colSpan: number;
  rowSpan: number;
  color: string;
  content: GridItemContent;
  resize?: ResizeConstraints;
};

export type GridAction =
  | { type: "ADD"; payload?: GridItemKind }
  | { type: "REMOVE"; payload: string }
  | {
      type: "RESIZE";
      payload: Pick<GridItemModel, "id" | "colSpan" | "rowSpan">;
    }
  | { type: "SWAP"; payload: { fromId: string; toId: string } }
  | { type: "RESET" };

export type ResizeAxis = "col" | "row";
export type ResizeDirection = "inc" | "dec";
