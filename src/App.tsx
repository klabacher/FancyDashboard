import { useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { LayoutGroup, motion } from "framer-motion";
import { BentoGrid } from "./components/BentoGrid";
import WidgetWrapper from "./components/WidgetWrapper";
import {
  Specs,
  TelemetryPayload,
  useDashboardStore,
} from "./state/dashboardStore";

const formatBytes = (value?: number) => {
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let idx = 0;
  let current = value;
  while (current >= 1024 && idx < units.length - 1) {
    current /= 1024;
    idx += 1;
  }
  return `${current.toFixed(1)} ${units[idx]}`;
};

const toPercent = (value?: number, total?: number) => {
  if (!value || !total) return 0;
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
};

function App() {
  const { viewMode, setViewMode, metrics, setMetrics, specs, setSpecs } =
    useDashboardStore();

  useEffect(() => {
    const unlistenPromise = listen<TelemetryPayload>(
      "telemetry://metrics",
      (event) => setMetrics(event.payload),
    );

    invoke<Specs>("get_specs")
      .then((data) => setSpecs(data))
      .catch((err) => console.error("get_specs failed", err));

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [setMetrics, setSpecs]);

  const memoryPercent = useMemo(
    () => toPercent(metrics?.memory_used, metrics?.memory_total),
    [metrics],
  );

  const cpuUsage = useMemo(
    () => Number(metrics?.cpu_usage?.toFixed(1) ?? 0),
    [metrics?.cpu_usage],
  );

  const hottestProbe = useMemo(() => {
    if (!metrics?.temperatures?.length) return undefined;
    return metrics.temperatures.reduce((hottest, probe) =>
      probe.temperature > hottest.temperature ? probe : hottest,
    );
  }, [metrics?.temperatures]);

  const columns = viewMode === "wide" ? 4 : 2;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 pointer-events-none">
      <header className="flex items-center justify-between px-6 pb-2 pt-6">
        <div className="flex flex-col gap-2">
          <span className="accent-pill">System overlay</span>
          <div className="text-xs text-slate-400">Live metrics pushed via Tauri</div>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-slate-600/60 bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 shadow-sm hover:border-slate-300/40"
            onClick={() =>
              setViewMode(viewMode === "wide" ? "compact" : "wide")
            }
          >
            {viewMode === "wide" ? "Compact" : "Wide"} layout
          </motion.button>
          <div className="text-xs text-slate-500">grid {columns} cols</div>
        </div>
      </header>

      <LayoutGroup>
        <BentoGrid columns={columns} className="px-6 pb-10">
          <WidgetWrapper
            size="2x1"
            title="CPU Load"
            rightSlot={<span className="text-[10px] text-slate-400">1s push</span>}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-semibold text-white">
                  {cpuUsage.toFixed(1)}%
                </div>
                <p className="text-xs text-slate-400">global usage</p>
              </div>
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-700/70 bg-slate-900/50">
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-400/70 via-sky-400/60 to-transparent"
                  style={{ height: `${Math.min(cpuUsage, 100)}%` }}
                />
                <div className="absolute inset-3 rounded-full border border-white/10" />
              </div>
            </div>
          </WidgetWrapper>

          <WidgetWrapper
            size="2x1"
            title="Memory"
            rightSlot={
              <div className="text-[10px] text-slate-300">
                {formatBytes(metrics?.memory_used)} / {formatBytes(metrics?.memory_total)}
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white">
                  {memoryPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">utilized</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-slate-900/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300"
                  style={{ width: `${memoryPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Dense fill ensures no gaps even when widgets resize.
              </p>
            </div>
          </WidgetWrapper>

          <WidgetWrapper size="1x1" title="Temperature">
            {hottestProbe ? (
              <div className="flex h-full flex-col justify-between">
                <div className="text-lg font-semibold text-white">
                  {hottestProbe.temperature.toFixed(1)}°C
                </div>
                <div className="text-xs text-slate-400">{hottestProbe.label}</div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Awaiting sensors...</p>
            )}
          </WidgetWrapper>

          <WidgetWrapper size="1x1" title="Mode">
            <div className="flex h-full flex-col justify-between text-sm text-slate-300">
              <span className="text-lg font-semibold text-white">{viewMode}</span>
              <p className="text-xs text-slate-500">Grid auto-dense, 2 or 4 columns.</p>
            </div>
          </WidgetWrapper>

          <WidgetWrapper size="2x2" title="System Specs">
            {specs ? (
              <div className="flex flex-col gap-3 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Host</span>
                  <span className="font-semibold text-white">{specs.host}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OS</span>
                  <span className="font-semibold text-white">{specs.os_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CPU</span>
                  <span className="font-semibold text-white">{specs.cpu_brand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cores</span>
                  <span className="font-semibold text-white">{specs.physical_cores ?? "?"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Memory</span>
                  <span className="font-semibold text-white">{formatBytes(specs.total_memory)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Loading host specs...</p>
            )}
          </WidgetWrapper>
        </BentoGrid>
      </LayoutGroup>
    </div>
  );
}

export default App;
