import { create } from "zustand";
import { DashboardState } from "@Types/stateZustand";

export const useDashboardStore = create<DashboardState>((set) => ({
  viewMode: "wide",
  setViewMode: (_mode) => set({ viewMode: _mode }),
  setMetrics: (_payload) => set({ metrics: _payload }),
  setSpecs: (_payload) => set({ specs: _payload }),
}));
