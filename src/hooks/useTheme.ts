// src/hooks/useTheme.ts
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@store/Redux/Store";
import { setThemeReducer } from "@store/Redux/Slice";

export function useTheme() {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(persistedTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Set theme on RootState
    dispatch(setThemeReducer(theme));
  }, [theme, dispatch]);

  return { theme, setTheme };
}
