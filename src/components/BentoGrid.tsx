import { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import RGL from "react-grid-layout";
import { WidthProvider } from "react-grid-layout/legacy";
import type * as RGLType from "react-grid-layout";

import BentoItem from "./BentoItem";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export type BentoGridProps = {
  className?: string;
  items?: number;
  rowHeight?: number;
  onLayoutChange?: (layout: RGLType.Layout) => void;
  GridConfig: RGLType.GridLayoutProps["gridConfig"];
};

// TODO: Criar default bento component and set max width and height to screen size math fuckery
export default function BentoGrid({
  className = "bg-white/10 w-screen h-screen max-w-screen max-h-screen",
  items = 20,
  onLayoutChange = () => {},
  GridConfig = {
    cols: 12,
    rowHeight: 100,
    containerPadding: [0, 0],
    margin: [10, 10],
    maxRows: 12,
  },
}: BentoGridProps) {
  const generateLayout = useCallback((): RGLType.Layout => {
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

    return Array.from({ length: items }, (_v, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % GridConfig.cols!,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: 2,
        i: i.toString(),
        resizeHandles: availableHandles,
      } as RGLType.LayoutItem;
    }) as RGLType.Layout;
  }, [items, GridConfig.cols]);

  const [layout, setLayout] = useState<RGLType.Layout>(() => generateLayout());

  useEffect(() => {
    setLayout(generateLayout());
  }, [generateLayout]);

  const handleLayoutChange = (nextLayout: RGLType.Layout) => {
    setLayout(nextLayout);
    if (onLayoutChange) onLayoutChange(nextLayout);
  };

  // Generate DOM based on the default BentoItem component
  const generateDOM = useCallback(() => {
    return _.map(_.range(items), function (i) {
      return (
        <div key={i}>
          <BentoItem index={i} />
        </div>
      );
    });
  }, [items]);

  return (
    <ReactGridLayout
      layout={layout}
      onLayoutChange={handleLayoutChange}
      className={className}
      gridConfig={GridConfig}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
}
