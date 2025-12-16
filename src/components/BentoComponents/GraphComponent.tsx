import { useMemo } from "react";
import { GraphWidgetProps } from "@/Types/widgetSchemas";
import { motion } from "framer-motion";

//helpers
import { cn } from "@Utils/Helpers";

export default function GraphComponent({
  title,
  type = "line",
  data,
  showGrid = true,
  showLegend = true,
  animate = true,
}: GraphWidgetProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d: { value: number }) => d.value)), [data]);
  const minValue = useMemo(() => Math.min(...data.map((d: { value: number }) => d.value)), [data]);

  const normalizeValue = (value: number) => {
    if (maxValue === minValue) return 50;
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const renderBar = () => (
    <div className="flex items-end justify-around h-full gap-2 px-2">
      {data.map((item, index) => {
        const height = normalizeValue(item.value);
        return (
          <motion.div
            key={item.label}
            initial={animate ? { height: 0, opacity: 0 } : undefined}
            animate={{ height: `${height}%`, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col items-center gap-1 group"
          >
            <div className="relative w-full">
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-300",
                  "group-hover:brightness-110"
                )}
                style={{ backgroundColor: item.color || "#3b82f6" }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-2 py-1 rounded shadow-md">
                  {item.value}
                </span>
              </div>
            </div>
            {showLegend && (
              <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-full">
                {item.label}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderLine = () => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - normalizeValue(item.value);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="relative h-full w-full p-2">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-zinc-400"
                />
              ))}
            </g>
          )}
          <motion.polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - normalizeValue(item.value);
            return (
              <motion.circle
                key={item.label}
                cx={x}
                cy={y}
                r="2"
                fill={item.color || "#3b82f6"}
                initial={animate ? { scale: 0, opacity: 0 } : undefined}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="hover:r-3 transition-all"
              />
            );
          })}
        </svg>
        {showLegend && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            {data.map((item) => (
              <span key={item.label} className="truncate">
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderArea = () => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - normalizeValue(item.value);
        return `${x},${y}`;
      })
      .join(" ");

    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <div className="relative h-full w-full p-2">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-zinc-400"
                />
              ))}
            </g>
          )}
          <motion.polygon
            points={areaPoints}
            fill="url(#gradient)"
            initial={animate ? { opacity: 0 } : undefined}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
          <motion.polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0 } : undefined}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const renderPie = () => {
    const total = data.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
    let currentAngle = -90;

    return (
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <svg className="w-full h-full max-w-50 max-h-50" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <motion.path
                key={item.label}
                d={path}
                fill={item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`}
                initial={animate ? { scale: 0, opacity: 0 } : undefined}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="20" fill="white" className="dark:fill-zinc-900" />
        </svg>
        {showLegend && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 justify-center">
            {data.map((item, index) => (
              <div key={item.label} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`,
                  }}
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGraph = () => {
    switch (type) {
      case "bar":
        return renderBar();
      case "line":
        return renderLine();
      case "area":
        return renderArea();
      case "pie":
        return renderPie();
      default:
        return renderLine();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 overflow-hidden">{renderGraph()}</div>
    </div>
  );
}