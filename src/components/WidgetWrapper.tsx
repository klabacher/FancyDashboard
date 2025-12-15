import { ReactNode } from "react";
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
};

const sizeToSpan: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
};

export function WidgetWrapper({
  size = "1x1",
  title,
  rightSlot,
  className,
  children,
}: WidgetWrapperProps) {
  return (
    <motion.div
      layout
      layoutRoot
      className={clsx(
        "pointer-events-auto rounded-2xl p-4 md:p-5 glass-panel edge-glow shadow-lg hover:scale-[1.02] transition-transform duration-300",
        sizeToSpan[size],
        styles.surface,
        className,
      )}
    >
      {(title || rightSlot) && (
        <div className="mb-4 flex items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-slate-300/70">
          <span className="truncate">{title}</span>
          {rightSlot}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export default WidgetWrapper;
