import { PropsWithChildren } from "react";
import clsx from "clsx";

export type BentoGridProps = PropsWithChildren<{
  columns?: number;
  dense?: boolean;
  className?: string;
}>;

const columnClass = (columns?: number) => {
  if (!columns || columns >= 4) {
    return "grid-cols-2 md:grid-cols-4";
  }

  return "grid-cols-2";
};

export function BentoGrid({
  children,
  columns = 4,
  dense = true,
  className,
}: BentoGridProps) {
  return (
    <div
      className={clsx(
        "w-full grid gap-4 md:gap-6",
        dense && "grid-flow-dense",
        columnClass(columns),
        className
      )}
    >
      {children}
    </div>
  );
}

export default BentoGrid;
