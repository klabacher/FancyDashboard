import { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import RGL from "react-grid-layout";
import { WidthProvider } from "react-grid-layout/legacy"; // Using legacy to avoid issues with types - to check later FUCK HEELLLL
import type { BentoGridProps, RGLType } from "@components/types/BentoGrid";
import { persistor, RootState } from "@store/Redux/Store";
import { setElements } from "@store/Redux/MainGridSlice";

import BentoItem from "@components/GridStuff/BentoItem";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDispatch, useSelector } from "react-redux";

const ReactGridLayout = WidthProvider(RGL);

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
  // Redux integration
  const dispatch = useDispatch();

  // Set MainGrid Reducer function
  const setMainGridElements = (layout: RGLType.LayoutItem[]) => {
    dispatch(setElements(layout));
  };

  // Set Selector to get current MainGrid state
  const MainGridState = useSelector((state: RootState) => state.MainGrid);

  const generateLayout = useCallback((): RGLType.Layout => {
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

    // calculate new elements and math fuckery
    const newElements = Array.from({ length: items }, (_v, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % GridConfig.cols!,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: 2,
        i: i.toString(),
        resizeHandles: availableHandles,
      } as RGLType.LayoutItem;
    });

    // if elements null, create new layout and Populate Redux Store
    if (!MainGridState.Elements) {
      // Populate Redux Store
      setMainGridElements(newElements);
      // Returns New PopulatedLayout
      return newElements as RGLType.LayoutItem[];
    }

    setMainGridElements(newElements);
    // Returns New PopulatedLayout
    return newElements as RGLType.Layout;
  }, [items, GridConfig.cols, MainGridState.Elements, setMainGridElements]);

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
