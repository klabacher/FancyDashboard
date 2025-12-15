import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutItem } from "react-grid-layout";

export interface LayoutState {
  layouts: {
    lg: LayoutItem[];
    md: LayoutItem[];
    sm: LayoutItem[];
  };
  viewMode: "wide" | "compact";
}

const defaultLayouts = {
  lg: [
    { i: "clock", x: 0, y: 0, w: 1, h: 1 },
    { i: "cpu", x: 1, y: 0, w: 2, h: 1 },
    { i: "temp", x: 3, y: 0, w: 1, h: 1 },
    { i: "memory", x: 0, y: 1, w: 2, h: 1 },
    { i: "specs", x: 2, y: 1, w: 2, h: 2 },
  ],
  md: [
    { i: "clock", x: 0, y: 0, w: 1, h: 1 },
    { i: "temp", x: 1, y: 0, w: 1, h: 1 },
    { i: "cpu", x: 0, y: 1, w: 2, h: 1 },
    { i: "memory", x: 0, y: 2, w: 2, h: 1 },
    { i: "specs", x: 0, y: 3, w: 2, h: 2 },
  ],
  sm: [
    { i: "clock", x: 0, y: 0, w: 1, h: 1 },
    { i: "temp", x: 1, y: 0, w: 1, h: 1 },
    { i: "cpu", x: 0, y: 1, w: 2, h: 1 },
    { i: "memory", x: 0, y: 2, w: 2, h: 1 },
    { i: "specs", x: 0, y: 3, w: 2, h: 2 },
  ],
};

const initialState: LayoutState = {
  layouts: defaultLayouts,
  viewMode: "wide",
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    updateLayout: (
      state,
      action: PayloadAction<{ layout: LayoutItem[]; breakpoint: string }>
    ) => {
      const { layout, breakpoint } = action.payload;
      // @ts-expect-error - dynamic key access
      state.layouts[breakpoint] = layout;
    },
    setViewMode: (state, action: PayloadAction<"wide" | "compact">) => {
      state.viewMode = action.payload;
    },
    resetLayout: (state) => {
      state.layouts = defaultLayouts as LayoutState["layouts"];
    },
  },
});

export const { updateLayout, setViewMode, resetLayout } = layoutSlice.actions;
export default layoutSlice.reducer;
