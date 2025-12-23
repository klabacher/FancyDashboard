export type GridItemModel = {
  id: string;
  colSpan: number;
  rowSpan: number;
  color: string;
};

export type GridAction =
  | { type: "ADD" }
  | { type: "REMOVE"; payload: string }
  | {
      type: "RESIZE";
      payload: Pick<GridItemModel, "id" | "colSpan" | "rowSpan">;
    }
  | { type: "SWAP"; payload: { fromId: string; toId: string } }
  | { type: "RESET" };

export type ResizeAxis = "col" | "row";
export type ResizeDirection = "inc" | "dec";
