import { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import RGL from "react-grid-layout";
import { WidthProvider } from "react-grid-layout/legacy";
import type * as RGLType from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

// TODO: Criar default bento component and set max width and height to screen size math fuckery
export default function BentoGrid({
  className = "bg-white/10 w-screen h-screen max-w-screen max-h-screen",
  items = 20,
  rowHeight = 30,
  cols = 12,
  onLayoutChange = () => {},
}: {
  className?: string;
  items?: number;
  rowHeight?: number;
  rowSize?: number;
  cols?: number;
  onLayoutChange?: (layout: RGLType.Layout) => void;
}) {
  const generateLayout = useCallback((): RGLType.Layout => {
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

    return Array.from({ length: items }, (_v, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % cols,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
        resizeHandles: availableHandles,
      } as RGLType.LayoutItem;
    }) as RGLType.Layout;
  }, [items, cols]);

  const [layout, setLayout] = useState<RGLType.Layout>(() => generateLayout());

  useEffect(() => {
    setLayout(generateLayout());
  }, [generateLayout]);

  const handleLayoutChange = (nextLayout: RGLType.Layout) => {
    setLayout(nextLayout);
    if (onLayoutChange) onLayoutChange(nextLayout);
  };

  const generateDOM = useCallback(() => {
    return _.map(_.range(items), function (i) {
      return (
        <div className="b-2 bg-amber-50 m-2" key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }, [items]);

  return (
    <ReactGridLayout
      layout={layout}
      onLayoutChange={handleLayoutChange}
      className={className}
      gridConfig={{ cols, rowHeight }}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
}
