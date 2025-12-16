import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

// Em vez de importar RootState da Store, defina o seletor assim:
export const selectTheme = (state: { app: AppState }) => state.app.theme;

export default appSlice.reducer;
