import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutItem, GridLayoutProps } from "react-grid-layout";

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

const initialState: AppState = {
  gridConfig: {
    cols: 6,
    maxRows: 6, // Grid fixa 6x6
    margin: [10, 10],
    containerPadding: [10, 10],
  },
  resizeConfig: {
    handles: ["se", "sw", "nw", "ne", "n", "s", "e", "w"],
    enabled: true,
  },
  dragConfig: {
    enabled: false,
    bounded: true,
    threshold: 3,
  },
  elements: [],
  isInitialized: false,
};

export const appSlice = createSlice({
  name: "MainGrid",
  initialState,
  reducers: {
    // Atualiza o layout quando o usuário move/redimensiona
    updateLayout: (state, action: PayloadAction<LayoutItem[]>) => {
      state.elements = action.payload;
    },
    // Update the resize configuration - TODO: add handles modification later
    updateResizeConfig: (state, action: PayloadAction<boolean>) => {
      state.resizeConfig = {
        ...state.resizeConfig,
        enabled: action.payload,
      };
    },
    updateDragConfig: (
      state,
      action: PayloadAction<GridLayoutProps["dragConfig"]>
    ) => {
      state.dragConfig = {
        ...state.dragConfig,
        ...action.payload,
      };
    },
    // Inicializa a grid apenas uma vez
    initializeGrid: (state, action: PayloadAction<LayoutItem[]>) => {
      state.elements = action.payload;
      state.isInitialized = true;
    },
    // Permite mudar configurações dinamicamente se necessário
    updateGridConfig: (
      state,
      action: PayloadAction<Partial<GridConfigState>>
    ) => {
      state.gridConfig = { ...state.gridConfig, ...action.payload };
    },
  },
});

export const {
  updateLayout,
  initializeGrid,
  updateGridConfig,
  updateResizeConfig,
  updateDragConfig,
} = appSlice.actions;

export const selectMainGrid = (state: { MainGrid: AppState }) => state.MainGrid;

export default appSlice.reducer;
