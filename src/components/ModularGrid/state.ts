import type React from "react";

import type { GridAction, GridItemModel } from "./types";
import { generateColor, generateId } from "./utils";

export const initialState: GridItemModel[] = [
  { id: "1", colSpan: 2, rowSpan: 1, color: generateColor() },
  { id: "2", colSpan: 1, rowSpan: 2, color: generateColor() },
  { id: "3", colSpan: 1, rowSpan: 1, color: generateColor() },
  { id: "4", colSpan: 2, rowSpan: 2, color: generateColor() },
];

export const gridReducer: React.Reducer<GridItemModel[], GridAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: generateId(), colSpan: 1, rowSpan: 1, color: generateColor() },
      ];
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
