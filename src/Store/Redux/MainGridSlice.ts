import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutItem } from "react-grid-layout";
import type {
  AppState,
  GridConfigState,
  DragConfig,
} from "@components/types/BentoGrid";

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
    updateDragConfig: (state, action: PayloadAction<Partial<DragConfig>>) => {
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
