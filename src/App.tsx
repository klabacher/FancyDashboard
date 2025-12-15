import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
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
  const [time, setTime] = useState(new Date());
  const [clickThroughActive, setClickThroughActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const toggleClickThrough = async () => {
    if (clickThroughActive) return;
    
    setClickThroughActive(true);
    await invoke("set_click_through", { passthrough: true });
    
    // Auto-revert after 5 seconds to prevent lock-out
    setTimeout(async () => {
      await invoke("set_click_through", { passthrough: false });
      setClickThroughActive(false);
    }, 5000);
  };

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
    <div className="min-h-screen bg-transparent text-slate-100 pointer-events-none p-6 select-none">
      <header className="flex items-center justify-between mb-8 pointer-events-auto">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="accent-pill shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              FancyDashboard
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              v0.1.0-beta
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/5 shadow-xl">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors"
            onClick={() => setViewMode(viewMode === "wide" ? "compact" : "wide")}
          >
            {viewMode === "wide" ? "Compact" : "Wide"}
          </motion.button>
          
          <div className="w-px h-4 bg-white/10" />
          
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              clickThroughActive ? "text-emerald-400 bg-emerald-400/10" : "text-slate-300"
            }`}
            onClick={toggleClickThrough}
          >
            {clickThroughActive ? "Passthrough ON (5s)" : "Test Click-Through"}
          </motion.button>
        </div>
      </header>

      <LayoutGroup>
        <BentoGrid columns={columns}>
          <AnimatePresence mode="popLayout">
            <WidgetWrapper
              key="clock"
              size="1x1"
              title="Local Time"
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
            >
              <div className="flex h-full flex-col justify-center items-center">
                <div className="text-3xl font-bold text-white tracking-tight">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </WidgetWrapper>

            <WidgetWrapper
              key="cpu"
              size="2x1"
              title="CPU Load"
              rightSlot={<span className="text-[10px] text-emerald-400 animate-pulse">● Live</span>}
            >
              <div className="flex items-end justify-between gap-6 h-full">
                <div className="flex flex-col justify-end pb-1">
                  <div className="text-5xl font-bold text-white tracking-tighter">
                    {cpuUsage.toFixed(0)}<span className="text-2xl text-slate-500 ml-1">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Total Usage</p>
                </div>
                <div className="relative h-20 w-32 overflow-hidden rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="absolute inset-0 flex items-end gap-1 p-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-indigo-500/40 rounded-sm"
                        animate={{ 
                          height: `${Math.max(10, Math.random() * cpuUsage)}%`,
                          opacity: 0.5 + (i / 24)
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </WidgetWrapper>

            <WidgetWrapper
              key="memory"
              size="2x1"
              title="Memory"
              rightSlot={
                <div className="text-[10px] font-mono text-slate-400">
                  {formatBytes(metrics?.memory_used)} / {formatBytes(metrics?.memory_total)}
                </div>
              }
            >
              <div className="flex flex-col justify-center h-full gap-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-white">
                    {memoryPercent.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">RAM Utilized</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${memoryPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
            </WidgetWrapper>

            <WidgetWrapper key="temp" size="1x1" title="Thermals">
              {hottestProbe ? (
                <div className="flex h-full flex-col justify-center items-center relative">
                  <div className="absolute inset-0 bg-orange-500/5 blur-2xl rounded-full" />
                  <div className={`text-3xl font-bold ${hottestProbe.temperature > 80 ? 'text-red-400' : 'text-orange-300'}`}>
                    {hottestProbe.temperature.toFixed(0)}°
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 max-w-full truncate px-2">
                    {hottestProbe.label}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  No sensors
                </div>
              )}
            </WidgetWrapper>

            <WidgetWrapper key="specs" size="2x2" title="System Specs">
              {specs ? (
                <div className="flex flex-col gap-3 text-xs text-slate-300 h-full justify-center">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Host</div>
                    <div className="font-semibold text-white truncate">{specs.host}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU</div>
                      <div className="font-semibold text-white truncate" title={specs.cpu_brand}>
                        {specs.cpu_brand.split(' ')[0]}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Cores</div>
                      <div className="font-semibold text-white">{specs.physical_cores ?? "?"}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">OS</div>
                    <div className="font-semibold text-white truncate">{specs.os_version}</div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500 animate-pulse">
                  Scanning hardware...
                </div>
              )}
            </WidgetWrapper>
          </AnimatePresence>
        </BentoGrid>
      </LayoutGroup>
    </div>
  );
}

export default App;
