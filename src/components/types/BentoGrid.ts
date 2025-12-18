// src\components\GridStuff\Bento.Grid.d.ts type definitions for BentoGrid component
import type * as RGLType from "react-grid-layout";

type BentoGridProps = {
  className?: string;
  items?: number;
  rowHeight?: number;
  onLayoutChange?: (layout: RGLType.Layout) => void;
  GridConfig: RGLType.GridLayoutProps["gridConfig"];
};

export type { BentoGridProps, RGLType };
