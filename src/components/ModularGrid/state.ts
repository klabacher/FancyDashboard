import type { Reducer } from "react";

import type { GridAction, GridItemModel } from "./types";
import { createGridItem, generateColor } from "./utils";

export const initialState: GridItemModel[] = [
  {
    id: "1",
    colSpan: 2,
    rowSpan: 1,
    color: generateColor(),
    content: { kind: "text", text: "Bem-vindo" },
  },
  {
    id: "2",
    colSpan: 1,
    rowSpan: 2,
    color: generateColor(),
    content: { kind: "number", value: 128, label: "KPI" },
  },
  {
    id: "3",
    colSpan: 1,
    rowSpan: 1,
    color: generateColor(),
    content: { kind: "appicon", name: "Tauri", src: "/tauri.svg" },
  },
  {
    id: "4",
    colSpan: 2,
    rowSpan: 2,
    color: generateColor(),
    content: { kind: "image", src: "/vite.svg", alt: "Vite", fit: "cover" },
  },
];

export const gridReducer: Reducer<GridItemModel[], GridAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD":
      return [...state, createGridItem(action.payload ?? "text")];
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload);
    case "RESIZE":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
    case "SWAP": {
      const { fromId, toId } = action.payload;
      const fromIndex = state.findIndex((i) => i.id === fromId);
      const toIndex = state.findIndex((i) => i.id === toId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return state;
      const newState = [...state];
      [newState[fromIndex], newState[toIndex]] = [
        newState[toIndex],
        newState[fromIndex],
      ];
      return newState;
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
};
