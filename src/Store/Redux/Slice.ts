import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@Store/Redux/Store";

interface AppState {
  theme: "light" | "dark";
}

const initialState: AppState = {
  theme: "light",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = appSlice.actions;
export const selectTheme = (state: RootState) => state.app.theme;
export default appSlice.reducer;
