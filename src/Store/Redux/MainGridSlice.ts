import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutItem } from "react-grid-layout";

interface GridConfigState {
  cols: number;
  maxRows: number;
  margin: [number, number];
  containerPadding: [number, number];
}

interface AppState {
  gridConfig: GridConfigState;
  elements: LayoutItem[]; // Layout persistido
  isInitialized: boolean; // Flag para saber se já geramos o layout inicial
}

const initialState: AppState = {
  gridConfig: {
    cols: 12,
    maxRows: 12, // Grid fixa 12x12
    margin: [10, 10],
    containerPadding: [10, 10],
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

export const { updateLayout, initializeGrid, updateGridConfig } =
  appSlice.actions;

export const selectMainGrid = (state: { MainGrid: AppState }) => state.MainGrid;

export default appSlice.reducer;
