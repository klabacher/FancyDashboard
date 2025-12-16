import { ReactNode, forwardRef, useState, useCallback } from "react";
import clsx from "clsx";
import { motion, type HTMLMotionProps } from "framer-motion";

// -------------------- Types --------------------
export type WidgetSize = "1x1" | "1x2" | "2x1" | "2x2" | "2x3" | "3x2" | "4x2";

export interface WidgetConstraints {
  resizable: boolean;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  lockedAspect?: boolean;
}

export type WidgetWrapperProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "className"
> & {
  size?: WidgetSize;
  title?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  children: ReactNode;
  constraints?: WidgetConstraints;
  isActive?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: (newSize: WidgetSize) => void;
};

// -------------------- Size Mapping --------------------
const sizeToSpan: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1",
  "1x2": "col-span-1 row-span-2",
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
  "2x3": "col-span-2 row-span-3",
  "3x2": "col-span-3 row-span-2",
  "4x2": "col-span-4 row-span-2",
};

// -------------------- Animation Variants --------------------
const widgetVariants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 12,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
  },
  hover: {
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.995,
  },
};

// -------------------- Resize Handle Component --------------------
interface ResizeHandleProps {
  position: "se" | "sw" | "ne" | "nw";
  onMouseDown: (e: React.MouseEvent) => void;
  visible: boolean;
}

const ResizeHandle = ({
  position,
  onMouseDown,
  visible,
}: ResizeHandleProps) => {
  const positionStyles: Record<string, string> = {
    se: "bottom-0 right-0 cursor-se-resize",
    sw: "bottom-0 left-0 cursor-sw-resize",
    ne: "top-0 right-0 cursor-ne-resize",
    nw: "top-0 left-0 cursor-nw-resize",
  };

  if (!visible) return null;

  return (
    <div
      onMouseDown={onMouseDown}
      className={clsx(
        "absolute z-50 w-4 h-4 group/handle",
        positionStyles[position],
        "opacity-0 hover:opacity-100 transition-opacity duration-200"
      )}
    >
      {/* Handle visual indicator */}
      <div
        className={clsx(
          "absolute w-2 h-2 rounded-full",
          "bg-white/30 backdrop-blur-sm",
          "border border-white/40",
          "shadow-[0_0_8px_rgba(255,255,255,0.3)]",
          "group-hover/handle:bg-white/50",
          "group-hover/handle:scale-125",
          "transition-all duration-200",
          position === "se" && "bottom-1 right-1",
          position === "sw" && "bottom-1 left-1",
          position === "ne" && "top-1 right-1",
          position === "nw" && "top-1 left-1"
        )}
      />
    </div>
  );
};

// -------------------- Main Component --------------------
export const WidgetWrapper = forwardRef<HTMLDivElement, WidgetWrapperProps>(
  function WidgetWrapper(
    {
      size = "1x1",
      title,
      rightSlot,
      className,
      children,
      constraints = { resizable: false },
      isActive = false,
      onResizeStart,
      onResizeEnd,
      ...props
    },
    ref
  ) {
    const [isHovered, setIsHovered] = useState(false);

    const handleResizeStart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onResizeStart?.();
      },
      [onResizeStart]
    );

    const showResizeHandles = constraints.resizable && isHovered;

    return (
      <motion.div
        ref={ref}
        layout
        layoutId={props.layoutId}
        variants={widgetVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.25 },
          scale: { type: "spring", stiffness: 400, damping: 25 },
        }}
        className={clsx(
          // Base Layout
          "relative flex flex-col overflow-hidden",
          sizeToSpan[size],

          // ═══════════════════════════════════════════════════════════════
          // SPATIAL GLASS AESTHETIC - Deep Frost Design
          // ═══════════════════════════════════════════════════════════════

          // Glass Surface - Ultra subtle background with frost effect
          "bg-zinc-900/25",
          "dark:bg-black/20",

          // Deep Frosted Glass Blur
          "backdrop-blur-3xl backdrop-saturate-150",

          // Rounded corners - soft, modern feel
          "rounded-4xl",

          // Glass Borders - Light refraction simulation
          "border border-white/8",
          "ring-1 ring-white/4",
          "ring-inset",

          // Deep shadows for floating effect
          "shadow-glass-lg",
          "shadow-black/40",

          // Inner light edge (top shine)
          "before:absolute before:inset-0 before:rounded-4xl",
          "before:bg-linear-to-b before:from-white/8 before:to-transparent",
          "before:pointer-events-none before:z-0",

          // Hover state - increased presence
          "hover:bg-zinc-900/35",
          "hover:border-white/12",
          "hover:ring-white/8",
          "hover:shadow-glass-xl",

          // Active/Selected state
          isActive && [
            "border-white/20",
            "ring-2 ring-white/10",
            "shadow-[0_0_60px_rgba(255,255,255,0.08)]",
          ],

          // Smooth transitions
          "transition-all duration-300 ease-glass",

          className
        )}
        {...props}
      >
        {/* Top edge shine - simulates glass thickness */}
        <div
          className={clsx(
            "absolute top-0 left-4 right-4 h-px",
            "bg-linear-to-r from-transparent via-white/20 to-transparent",
            "opacity-60"
          )}
        />

        {/* Left edge subtle highlight */}
        <div
          className={clsx(
            "absolute top-4 bottom-4 left-0 w-px",
            "bg-linear-to-b from-transparent via-white/10 to-transparent",
            "opacity-40"
          )}
        />

        {/* Header section with title */}
        {(title || rightSlot) && (
          <div className="relative z-10 px-6 pt-5 pb-2 flex items-center justify-between gap-2">
            {title && (
              <span
                className={clsx(
                  "text-[11px] font-semibold uppercase tracking-[0.2em]",
                  "text-white/50", // Muted title for hierarchy
                  "transition-colors duration-200",
                  "group-hover:text-white/60"
                )}
              >
                {title}
              </span>
            )}
            {rightSlot}
          </div>
        )}

        {/* Content area */}
        <div className="relative z-10 flex-1 p-6 pt-2">{children}</div>

        {/* Resize Handles - Only visible when resizable and hovered */}
        <ResizeHandle
          position="se"
          onMouseDown={handleResizeStart}
          visible={showResizeHandles}
        />

        {/* Bottom ambient glow on hover */}
        <div
          className={clsx(
            "absolute -bottom-8 left-1/4 right-1/4 h-16",
            "bg-white/5 blur-2xl rounded-full",
            "opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
        />
      </motion.div>
    );
  }
);

(WidgetWrapper as unknown as { displayName?: string }).displayName =
  "WidgetWrapper";

export default WidgetWrapper;
