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

export type DashboardState = {
  viewMode: ViewMode;
  metrics?: TelemetryPayload;
  specs?: Specs;
  setViewMode: (_mode: ViewMode) => void;
  setMetrics: (_payload: TelemetryPayload) => void;
  setSpecs: (_payload: Specs) => void;
};