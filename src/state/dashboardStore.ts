import { create } from "zustand";

export type TemperatureProbe = {
  label: string;
  temperature: number;
};

export type TelemetryPayload = {
  cpu_usage: number;
  memory_used: number;
  memory_total: number;
  temperatures: TemperatureProbe[];
};

export type Specs = {
  host: string;
  os_version: string;
  cpu_brand: string;
  physical_cores?: number;
  total_memory: number;
};

type ViewMode = "wide" | "compact";

type DashboardState = {
  viewMode: ViewMode;
  metrics?: TelemetryPayload;
  specs?: Specs;
  setViewMode: (_mode: ViewMode) => void;
  setMetrics: (_payload: TelemetryPayload) => void;
  setSpecs: (_payload: Specs) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  viewMode: "wide",
  setViewMode: (_mode) => set({ viewMode: _mode }),
  setMetrics: (_payload) => set({ metrics: _payload }),
  setSpecs: (_payload) => set({ specs: _payload }),
}));
