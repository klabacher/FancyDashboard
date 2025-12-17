import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  theme: "light" | "dark" | "emerald";
}

const initialState: AppState = {
  theme: "emerald",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setThemeReducer: (state, action: PayloadAction<AppState["theme"]>) => {
      state.theme = action.payload;
    },
  },
});

export const { setThemeReducer } = appSlice.actions;

// Em vez de importar RootState da Store, defina o seletor assim:
export const selectTheme = (state: { app: AppState }) => state.app.theme;

export default appSlice.reducer;
