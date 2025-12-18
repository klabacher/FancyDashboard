// src\components\types\BentoGrid.ts type definitions for BentoGrid component
import type * as RGLType from "react-grid-layout";
import { LayoutItem } from "react-grid-layout";

interface GridConfigState {
  cols: number;
  maxRows: number;
  margin: [number, number];
  containerPadding: [number, number];
}

interface DragConfig {
  /** Whether items can be dragged (default: true) */
  enabled: boolean;
  /** Whether items are bounded to the container (default: false) */
  bounded: boolean;
  /** CSS selector for drag handle (e.g., '.drag-handle') */
  handle?: string;
  /** CSS selector for elements that should not trigger drag */
  cancel?: string;
  /**
   * Minimum pixels to move before drag starts.
   * Helps distinguish click from drag (fixes #1341, #1401).
   * @default 3
   */
  threshold: number;
}

type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

interface AppState {
  gridConfig: GridConfigState;
  elements: LayoutItem[]; // Layout persistido
  resizeConfig: {
    handles: ResizeHandleAxis[];
    enabled: boolean;
  };
  dragConfig: DragConfig;
  isInitialized: boolean; // Flag para saber se já geramos o layout inicial
}

interface BentoGridProps {
  width: number;
  height: number;
}

export type { BentoGridProps, RGLType, AppState, DragConfig, GridConfigState };
