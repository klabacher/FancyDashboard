import { ReactNode, forwardRef } from "react";
import clsx from "clsx";
import { motion, type HTMLMotionProps } from "framer-motion";

export type WidgetSize = "1x1" | "2x1" | "2x2";

export type WidgetWrapperProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "className"
> & {
  size?: WidgetSize;
  title?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const WidgetWrapper = forwardRef<HTMLDivElement, WidgetWrapperProps>(
  function WidgetWrapper(
    { size = "1x1", title, rightSlot, className, children, ...props },
    ref
  ) {
    const sizeToSpan: Record<WidgetSize, string> = {
      "1x1": "col-span-1 row-span-1",
      "2x1": "col-span-2 row-span-1",
      "2x2": "col-span-2 row-span-2",
    };

    return (
      <motion.div
        ref={ref}
        className={clsx(
          "relative flex flex-col overflow-hidden",
          // Layout
          sizeToSpan[size],
          // Estética Minimalista / Glassmorphism Avançado
          "rounded-4xl", // Bordas mais arredondadas para look moderno
          "bg-linear-to-br from-white/40 to-white/20 dark:from-zinc-900/80 dark:to-zinc-900/40", // Fundo gradiente sutil
          "backdrop-blur-xl saturate-150", // Blur forte para destacar o conteúdo sobre o fundo
          "border border-white/70 dark:border-white/60", // Borda ultra-fina
          "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]", // Sombra difusa
          "transition-all duration-500 ease-out",
          "hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-white/30",
          className
        )}
        {...props}
      >
        {/* Shine effect no topo para dar volume sem pesar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent opacity-50" />

        {(title || rightSlot) && (
          <div className="px-6 pt-5 pb-2 flex items-center justify-between gap-2">
            {title && (
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {title}
              </span>
            )}
            {rightSlot}
          </div>
        )}

        <div className="relative z-10 flex-1 p-6 pt-2">{children}</div>
      </motion.div>
    );
  }
);

(WidgetWrapper as unknown as { displayName?: string }).displayName =
  "WidgetWrapper";

export default WidgetWrapper;
