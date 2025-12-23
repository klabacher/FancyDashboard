import type { LayoutItem } from "react-grid-layout";

export type GridConfigState = {
  cols: number;
  maxRows: number;
  margin: [number, number];
  containerPadding: [number, number];
};

export type ResizeConfig = {
  handles: string[];
  enabled: boolean;
};

export type DragConfig = {
  enabled: boolean;
  bounded: boolean;
  threshold: number;
};

export type AppState = {
  gridConfig: GridConfigState;
  resizeConfig: ResizeConfig;
  dragConfig: DragConfig;
  elements: LayoutItem[];
  isInitialized: boolean;
};
