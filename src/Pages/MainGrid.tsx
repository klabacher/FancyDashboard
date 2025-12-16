import { useCallback, useEffect, useMemo, useState } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Types
type GridDataItem = { i: string; title?: string; content?: React.ReactNode };
type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown;
};
type ResponsiveLayouts = Partial<
  Record<"lg" | "md" | "sm" | "xs" | "xxs", Layout>
>;

// Lightweight grid item component
const GridItemContainer = ({ item }: { item: GridDataItem }) => (
  <div className="grid-item">
    <div className="grid-item__title">{item.title ?? "Widget"}</div>
    <div className="grid-item__body">{item.content ?? "Grid Item"}</div>
  </div>
);

const BREAKPOINTS = { lg: 1280, md: 992, sm: 767, xs: 480, xxs: 0 } as const;
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } as const;
const STORAGE_KEY = "fancydashboard-main-grid-layouts-v1";

interface MainGridProps {
  data?: GridDataItem[];
  setBreakPoint?: (bp: string) => void;
  onBreakpointChange?: (bp: string) => void;
  onLayoutChange?: (layouts: ResponsiveLayouts) => void;
}

function MainGridContainer({
  data: propData,
  setBreakPoint,
  onBreakpointChange,
  onLayoutChange,
}: MainGridProps) {
  // Sample data if none is provided via props
  const data = useMemo<GridDataItem[]>(
    () =>
      propData ?? [
        { i: "1", title: "First" },
        { i: "2", title: "Second" },
        { i: "3", title: "Third" },
      ],
    [propData]
  );

  // Create a simple default layout (copies for every breakpoint)
  const defaultLg = useMemo<LayoutItem[]>(
    () =>
      data.map((d: GridDataItem, idx: number) => ({
        i: d.i,
        x: (idx * 4) % 12,
        y: Math.floor((idx * 4) / 12) * 3,
        w: 4,
        h: 3,
      })),
    [data]
  );

  const initialLayouts = useMemo<ResponsiveLayouts>(() => {
    return {
      lg: defaultLg as Layout,
      md: defaultLg.map((l) => ({ ...l })) as Layout,
      sm: defaultLg.map((l) => ({ ...l })) as Layout,
      xs: defaultLg.map((l) => ({ ...l })) as Layout,
      xxs: defaultLg.map((l) => ({ ...l })) as Layout,
    };
  }, [defaultLg]);

  // Measure container width (v2 API recommended)
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: false,
    initialWidth: 1280,
  });

  // Load layouts from localStorage or use defaults
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : initialLayouts;
    } catch {
      return initialLayouts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
    } catch {
      // ignore write errors
    }
  }, [layouts]);

  const [breakpoint, setBreakpoint] = useState<string>("lg");

  const handleBreakpointChange = useCallback(
    (newBp: string) => {
      setBreakpoint(newBp);
      // If a redux action or prop callback exists, call it
      if (typeof setBreakPoint === "function") setBreakPoint(newBp);
      if (typeof onBreakpointChange === "function") onBreakpointChange(newBp);
    },
    [setBreakPoint, onBreakpointChange]
  );

  const handleLayoutChange = useCallback(
    (_layout: readonly unknown[], allLayouts: ResponsiveLayouts) => {
      setLayouts(allLayouts);
      if (typeof onLayoutChange === "function") onLayoutChange(allLayouts);
    },
    [onLayoutChange]
  );

  const handleDragStop = useCallback(
    (layout: readonly unknown[]) => {
      setLayouts((prev) => ({
        ...prev,
        [breakpoint]: layout as readonly LayoutItem[],
      }));
    },
    [breakpoint]
  );

  const handleResizeStop = useCallback(
    (layout: readonly unknown[]) => {
      setLayouts((prev) => ({
        ...prev,
        [breakpoint]: layout as readonly LayoutItem[],
      }));
    },
    [breakpoint]
  );

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {mounted && (
        <Responsive
          className="layout"
          layouts={layouts}
          width={width}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          // Keep drag & resize enabled and use a title bar as handle
          dragConfig={{ enabled: true, handle: ".grid-item__title" }}
          resizeConfig={{ enabled: true, handles: ["se"] }}
          onBreakpointChange={handleBreakpointChange}
          onLayoutChange={handleLayoutChange}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
        >
          {data.map((item: GridDataItem) => (
            <GridItemContainer key={item.i} item={item} />
          ))}
        </Responsive>
      )}
    </div>
  );
}

export default MainGridContainer;
