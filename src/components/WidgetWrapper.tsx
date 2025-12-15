import React, { ReactNode, forwardRef } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import styles from "./WidgetWrapper.module.css";

export type WidgetSize = "1x1" | "2x1" | "2x2";

export type WidgetWrapperProps = {
  size?: WidgetSize;
  title?: string;
  rightSlot?: ReactNode;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onTouchEnd?: React.TouchEventHandler;
  [key: string]: unknown;
};

export const WidgetWrapper = forwardRef<HTMLDivElement, WidgetWrapperProps>(
  (
    {
      size: _size = "1x1",
      title,
      rightSlot,
      className,
      children,
      style,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={clsx(
          "pointer-events-auto relative flex flex-col overflow-hidden rounded-3xl p-5 glass-panel edge-glow shadow-2xl transition-colors duration-300 hover:bg-white/2",
          styles.surface,
          className
        )}
        {...props}
      >
        {(title || rightSlot) && (
          <div className="mb-4 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400/80">
            <span className="truncate">{title}</span>
            {rightSlot}
          </div>
        )}
        <div className="relative z-10 flex-1">{children}</div>
      </motion.div>
    );
  }
);

export default WidgetWrapper;
