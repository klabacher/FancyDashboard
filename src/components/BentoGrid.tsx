import { motion, AnimatePresence, useDragControls } from "framer-motion";
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  useContext,
  createContext,
  useState,
} from "react";
import { useDashboardStore } from "@State/dashboardStore";

// Types
import {
  validateWidgetProps,
  WidgetDescriptor,
  WidgetSize,
  WidgetPosition,
  parseSizeToDimensions,
  getDefaultConstraints,
} from "@/Types/widgetSchemas";

// Helpers
import { cn } from "@Utils/Helpers";

// Components
import GraphComponent from "@Components/BentoComponents/GraphComponent";
import ImageComponent from "@Components/BentoComponents/ImageComponent";
import TextAreaComponent from "@Components/BentoComponents/TextAreaComponent";
import TextComponent from "@Components/BentoComponents/TextComponent";
import IconAppComponent from "@Components/BentoComponents/IconAppComponent";

// Grid context to share ref with items
const GridContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

// -------------------- Types --------------------
interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: number;
  rows?: number;
  gap?: number;
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  widget: WidgetDescriptor;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onResize?: (newSize: WidgetSize) => void;
}

// -------------------- Animation Variants --------------------
const gridItemVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 16,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -12,
    filter: "blur(4px)",
  },
  dragging: {
    scale: 1.03,
    zIndex: 50,
    boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.5)",
  },
};

const dropIndicatorVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

// -------------------- Utility Functions --------------------
const getGridSpanClasses = (size: WidgetSize): string => {
  const sizeMap: Record<WidgetSize, string> = {
    "1x1": "col-span-1 row-span-1",
    "1x2": "col-span-1 row-span-2",
    "2x1": "col-span-2 row-span-1",
    "2x2": "col-span-2 row-span-2",
    "2x3": "col-span-2 row-span-3",
    "3x2": "col-span-3 row-span-2",
    "4x2": "col-span-4 row-span-2",
  };
  return sizeMap[size] || "col-span-1 row-span-1";
};

// Convert legacy colSpan/rowSpan to new size format
const legacyToSize = (
  colSpan?: number | { mobile?: number; desktop?: number },
  rowSpan?: number
): WidgetSize => {
  const col = typeof colSpan === "number" ? colSpan : colSpan?.desktop || 1;
  const row = rowSpan || 1;
  return `${col}x${row}` as WidgetSize;
};

// -------------------- BentoGrid Component --------------------
export const BentoGrid = memo(function BentoGrid({
  children,
  className,
  columns = 4,
  rows = 4,
  gap = 6,
}: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { setGridConfig } = useDashboardStore();

  // Update grid config in store when dimensions change
  useEffect(() => {
    if (!gridRef.current) return;

    const updateGridConfig = () => {
      const rect = gridRef.current?.getBoundingClientRect();
      if (rect) {
        const gapPx = gap * 4; // Convert Tailwind gap to pixels
        const cellWidth = (rect.width - gapPx * (columns - 1)) / columns;
        const cellHeight = (rect.height - gapPx * (rows - 1)) / rows;
        setGridConfig({ columns, rows, gap: gapPx, cellWidth, cellHeight });
      }
    };

    updateGridConfig();
    window.addEventListener("resize", updateGridConfig);
    return () => window.removeEventListener("resize", updateGridConfig);
  }, [columns, rows, gap, setGridConfig]);

  return (
    <GridContext.Provider value={gridRef}>
      <div
        ref={gridRef}
        className={cn(
          // Dynamic grid layout
          "grid",
          `grid-cols-${columns}`,
          `grid-rows-${rows}`,
          `gap-${gap}`,
          // Fallback explicit grid
          "grid-cols-4 grid-rows-4",
          // Full container
          "w-full h-full",
          // Auto-fit rows
          "grid-rows-[repeat(auto-fit,minmax(0,1fr))]",
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap * 4}px`,
        }}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </div>
    </GridContext.Provider>
  );
});

// -------------------- BentoItem Component --------------------
export const BentoItem = memo(function BentoItem({
  children,
  className,
  widget,
  onDragStart,
  onDragEnd,
  onResize,
}: BentoItemProps) {
  const dragControls = useDragControls();
  const {
    layout,
    setDraggedWidget,
    setActiveWidget,
    setHoveredWidget,
    updateWidgetPosition,
    checkCollision,
    canResize,
    updateWidgetSize,
    gridConfig,
    setResizingWidget,
  } = useDashboardStore();
  const gridRef = useContext(GridContext);
  const [isDraggingInternal, setIsDraggingInternal] = useState(false);

  const size = widget.size || legacyToSize(widget.colSpan, widget.rowSpan);
  const constraints =
    widget.constraints || getDefaultConstraints(String(widget.type));
  const isActive = layout.activeWidgetId === widget.id;
  const isDragging = layout.draggedWidgetId === widget.id;
  const isHovered = layout.hoveredWidgetId === widget.id;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const computeGridPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!gridRef?.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      const { columns, rows, gap, cellWidth, cellHeight } = gridConfig;
      const totalCellW = cellWidth + gap;
      const totalCellH = cellHeight + gap;
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      const { w, h } = parseSizeToDimensions(size);
      const col = clamp(Math.floor(relX / totalCellW), 0, columns - w);
      const row = clamp(Math.floor(relY / totalCellH), 0, rows - h);

      return { x: col, y: row } as WidgetPosition;
    },
    [gridRef, gridConfig, size]
  );

  const handleDragStart = useCallback(() => {
    setDraggedWidget(widget.id);
    setActiveWidget(widget.id);
    onDragStart?.();
    setIsDraggingInternal(true);
  }, [widget.id, setDraggedWidget, setActiveWidget, onDragStart]);

  const handleDragEnd = useCallback(() => {
    setDraggedWidget(null);
    onDragEnd?.();
    setIsDraggingInternal(false);
  }, [setDraggedWidget, onDragEnd]);

  const handleDrag = useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { point: { x: number; y: number } }
    ) => {
      const targetPos = computeGridPosition(info.point.x, info.point.y);
      if (!targetPos) return;

      const currentPos = widget.position || { x: 0, y: 0 };
      if (targetPos.x === currentPos.x && targetPos.y === currentPos.y) return;

      const collides = checkCollision(widget.id, targetPos, size);
      if (!collides) {
        updateWidgetPosition(widget.id, targetPos);
      }
    },
    [
      computeGridPosition,
      widget.position,
      widget.id,
      checkCollision,
      size,
      updateWidgetPosition,
    ]
  );

  const handleClick = useCallback(() => {
    setActiveWidget(widget.id);
    widget.onClick?.();
  }, [widget, setActiveWidget]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (constraints.resizable === false) return;
      e.stopPropagation();
      e.preventDefault();

      setResizingWidget(widget.id);
      const startSize = parseSizeToDimensions(size);
      const startPos = widget.position || { x: 0, y: 0 };

      const onMove = (ev: MouseEvent) => {
        if (!gridRef?.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const { cellWidth, cellHeight, gap, columns, rows } = gridConfig;
        const totalCellW = cellWidth + gap;
        const totalCellH = cellHeight + gap;

        const relX = ev.clientX - rect.left;
        const relY = ev.clientY - rect.top;

        const newW = clamp(
          Math.ceil(relX / totalCellW) - startPos.x,
          1,
          columns - startPos.x
        );
        const newH = clamp(
          Math.ceil(relY / totalCellH) - startPos.y,
          1,
          rows - startPos.y
        );

        const candidateSize = `${newW}x${newH}` as WidgetSize;

        if (
          candidateSize !== `${startSize.w}x${startSize.h}` &&
          canResize(widget.id, candidateSize)
        ) {
          updateWidgetSize(widget.id, candidateSize);
          onResize?.(candidateSize);
        }
      };

      const onUp = () => {
        setResizingWidget(null);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [
      constraints.resizable,
      setResizingWidget,
      widget.id,
      size,
      widget.position,
      gridConfig,
      gridRef,
      canResize,
      updateWidgetSize,
      onResize,
    ]
  );

  return (
    <motion.div
      layoutId={String(widget.id)}
      layout="position"
      variants={gridItemVariants}
      initial="initial"
      animate={isDragging ? "dragging" : "animate"}
      exit="exit"
      drag={constraints.resizable !== false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      onClick={handleClick}
      onHoverStart={() => setHoveredWidget(widget.id)}
      onHoverEnd={() => setHoveredWidget(null)}
      transition={{
        layout: {
          type: "spring",
          stiffness: 350,
          damping: 30,
          mass: 0.8,
        },
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 400, damping: 25 },
        filter: { duration: 0.3 },
      }}
      className={cn(
        // Grid positioning
        getGridSpanClasses(size),
        // Attach grid cell start positions when provided
        "relative",
        // Cursor states
        constraints.resizable !== false ? "cursor-grab" : "cursor-pointer",
        isDragging && "cursor-grabbing z-50",
        // Selection ring
        isActive &&
          "ring-2 ring-white/20 ring-offset-2 ring-offset-transparent",
        className
      )}
      style={{
        gridColumnStart: (widget.position?.x || 0) + 1,
        gridColumnEnd: "span " + parseSizeToDimensions(size).w,
        gridRowStart: (widget.position?.y || 0) + 1,
        gridRowEnd: "span " + parseSizeToDimensions(size).h,
      }}
    >
      <div className="h-full w-full">{children}</div>

      {constraints.resizable !== false && (
        <div
          className={cn(
            "absolute bottom-2 right-2 w-4 h-4",
            "rounded-md border border-white/30 bg-white/10 backdrop-blur-sm",
            "cursor-se-resize",
            "transition-all duration-150",
            (isHovered || isActive || isDraggingInternal) && "opacity-100",
            !isHovered && !isActive && !isDraggingInternal && "opacity-0"
          )}
          onMouseDown={handleResizeMouseDown}
        />
      )}

      {/* Drop indicator overlay when dragging */}
      {isDragging && (
        <motion.div
          variants={dropIndicatorVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "absolute inset-0 rounded-4xl pointer-events-none",
            "border-2 border-dashed border-white/30",
            "bg-white/5"
          )}
        />
      )}
    </motion.div>
  );
});

// -------------------- Widget Registry --------------------
const widgetRegistry = new Map<string, React.ComponentType<any>>();

export function registerWidget(
  type: string,
  component: React.ComponentType<any>
) {
  widgetRegistry.set(type, component);
}

export function getRegisteredWidget(type: string) {
  return widgetRegistry.get(type);
}

// Register default widgets
registerWidget("text", TextComponent);
registerWidget("textarea", TextAreaComponent);
registerWidget("image", ImageComponent);
registerWidget("graph", GraphComponent);
registerWidget("icon-app", IconAppComponent);

// -------------------- Error/Missing Widget Components --------------------
const MissingWidget: React.FC<{ type: string }> = memo(({ type }) => (
  <div
    className={cn(
      "w-full h-full flex items-center justify-center p-4",
      "text-sm text-white/40",
      "bg-zinc-900/20 backdrop-blur-xl",
      "rounded-4xl border border-dashed border-white/10"
    )}
  >
    <span className="font-mono text-xs">Widget: {type}</span>
  </div>
));
MissingWidget.displayName = "MissingWidget";

const ErrorWidget: React.FC<{ type: string; error: string }> = memo(
  ({ type, error }) => (
    <div
      className={cn(
        "w-full h-full flex flex-col items-center justify-center p-4 gap-2",
        "bg-red-500/10 backdrop-blur-xl",
        "border border-red-500/20 rounded-4xl"
      )}
    >
      <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
        Erro: {type}
      </span>
      <p className="text-[10px] text-red-300/70 text-center font-mono">
        {error}
      </p>
    </div>
  )
);
ErrorWidget.displayName = "ErrorWidget";

// -------------------- Component Factory --------------------
interface ComponentFactoryProps {
  items: WidgetDescriptor[];
  gridClassName?: string;
  validateProps?: boolean;
}

export default function ComponentFactory({
  items,
  gridClassName,
  validateProps = process.env.NODE_ENV === "development",
}: ComponentFactoryProps) {
  const { currentPage, setTotalPages, setWidgets } = useDashboardStore();

  // Sync widgets to store
  useEffect(() => {
    setWidgets(items);
  }, [items, setWidgets]);

  // Calculate total pages
  useEffect(() => {
    const maxPage = items.reduce(
      (max, item) => Math.max(max, item.page || 0),
      0
    );
    setTotalPages(maxPage + 1);
  }, [items, setTotalPages]);

  // Filter items for current page
  const visibleItems = useMemo(() => {
    return items.filter((item) => (item.page || 0) === currentPage);
  }, [items, currentPage]);

  return (
    <div
      className={cn(
        // Container - Full viewport with padding for header
        "w-full h-screen pt-20 pb-6 px-6",
        // Transparent background - see-through to desktop
        "bg-transparent",
        // Layout
        "overflow-hidden flex flex-col"
      )}
    >
      <BentoGrid className={gridClassName}>
        {visibleItems.map((widget) => {
          const Comp = getRegisteredWidget(String(widget.type));
          const size =
            widget.size || legacyToSize(widget.colSpan, widget.rowSpan);

          if (!Comp) {
            return (
              <BentoItem
                key={`${widget.id}-${size}`}
                widget={{ ...widget, size }}
              >
                <MissingWidget type={String(widget.type)} />
              </BentoItem>
            );
          }

          let validatedProps = widget.props || {};
          if (validateProps) {
            const validation = validateWidgetProps(
              String(widget.type),
              widget.props
            );
            if (!validation.success) {
              return (
                <BentoItem
                  key={`${widget.id}-${size}`}
                  widget={{ ...widget, size }}
                >
                  <ErrorWidget
                    type={String(widget.type)}
                    error={JSON.stringify(
                      validation.error?.flatten().fieldErrors
                    )}
                  />
                </BentoItem>
              );
            }
            validatedProps = validation.data;
          }

          return (
            <BentoItem
              key={`${widget.id}-${size}`}
              widget={{ ...widget, size }}
              className={widget.className}
              onResize={(newSize) => widget.onResize?.(newSize)}
            >
              <Comp {...validatedProps} />
            </BentoItem>
          );
        })}
      </BentoGrid>
    </div>
  );
}

export { widgetRegistry };
