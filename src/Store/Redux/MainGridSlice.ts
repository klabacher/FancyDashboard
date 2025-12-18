import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type * as RGLType from "react-grid-layout";

interface AppState {
  //MainGrid Settings
  marginSize: number;
  PaddingSize: number;
  GridCols: number;
  GridRows: number;
  GridMaxRows: number;
  GridRowHeight: number;
  GridrowWidth: number;

  // Dynamic Elements States
  ElementsCount?: number | 0;
  Elements: RGLType.LayoutItem[] | null;
}

const initialState: AppState = {
  marginSize: 10,
  PaddingSize: 10,
  GridCols: 12,
  GridRows: 12,
  GridMaxRows: 12,
  GridRowHeight: 30,
  GridrowWidth: 30,
  ElementsCount: 0,
  Elements: null,
};

export const appSlice = createSlice({
  name: "MainGrid",
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<AppState["Elements"]>) => {
      state.Elements = action.payload;
    },
  },
});

export const { setElements } = appSlice.actions;

// Em vez de importar RootState da Store, defina o seletor assim:
export const selectElements = (state: { app: AppState }) => state.app.Elements;

export default appSlice.reducer;
