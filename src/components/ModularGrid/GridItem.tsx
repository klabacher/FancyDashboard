import React, { useRef, useState } from "react";
import {
  motion,
  useDragControls,
  type PanInfo,
  type DragHandlers,
} from "framer-motion";

import type {
  GridAction,
  GridItemModel,
  ResizeAxis,
  ResizeDirection,
} from "./types";
import { Icons } from "./icons";

type GridItemProps = {
  item: GridItemModel;
  index: number;
  dispatch: React.Dispatch<GridAction>;
  isMobile: boolean;
};

export const GridItem: React.FC<GridItemProps> = ({
  item,
  index,
  dispatch,
  isMobile,
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastSwapRef = useRef<number>(0);

  const MAX_COL = isMobile ? 2 : 4;
  const MAX_ROW = 4;

  const handleResize = (axis: ResizeAxis, direction: ResizeDirection): void => {
    let newCol = item.colSpan;
    let newRow = item.rowSpan;

    if (axis === "col") {
      newCol =
        direction === "inc"
          ? Math.min(newCol + 1, MAX_COL)
          : Math.max(newCol - 1, 1);
    } else {
      newRow =
        direction === "inc"
          ? Math.min(newRow + 1, MAX_ROW)
          : Math.max(newRow - 1, 1);
    }

    dispatch({
      type: "RESIZE",
      payload: { id: item.id, colSpan: newCol, rowSpan: newRow },
    });
  };

  const handleDragOver = (info: PanInfo): void => {
    const point = info?.point;
    if (!point) return;

    const { x, y } = point;

    // Throttle for performance
    const now = Date.now();
    if (now - lastSwapRef.current < 200) return;

    if (typeof document.elementsFromPoint !== "function") return;

    const elements = document.elementsFromPoint(x, y);

    const targetElement = elements.find((el) => {
      const container = el.closest("[data-grid-id]");
      return container && container.getAttribute("data-grid-id") !== item.id;
    });

    if (targetElement) {
      const container = targetElement.closest("[data-grid-id]");
      const targetId = container?.getAttribute("data-grid-id");

      if (targetId) {
        dispatch({
          type: "SWAP",
          payload: { fromId: item.id, toId: targetId },
        });
        lastSwapRef.current = now;
      }
    }
  };

  const onDrag: DragHandlers["onDrag"] = (_, info) => handleDragOver(info);

  return (
    <motion.div
      layout
      data-grid-id={item.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 100 : 1,
        boxShadow: isDragging
          ? "0px 20px 40px rgba(0,0,0,0.2)"
          : "0px 1px 3px rgba(0,0,0,0.05)",
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        layout: { duration: 0.2 },
      }}
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.05}
      dragSnapToOrigin={true}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onDrag={onDrag}
      className="relative rounded-2xl overflow-hidden flex flex-col border border-white/60 bg-white/40 backdrop-blur-md select-none group"
      style={{
        backgroundColor: item.color,
        gridColumn: `span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan}`,
        minHeight: `${item.rowSpan * 140}px`,
      }}
    >
      <div
        className="flex items-center justify-between p-3 cursor-grab active:cursor-grabbing border-b border-black/5 hover:bg-black/5 transition-colors"
        onPointerDown={(e) => controls.start(e.nativeEvent)}
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center gap-2 text-slate-700/70 font-bold text-xs pointer-events-none uppercase tracking-wider">
          <Icons.Grip />
          <span>Módulo {index + 1}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "REMOVE", payload: item.id });
          }}
          className="p-1.5 rounded-full hover:bg-red-500 hover:text-white text-slate-400 transition-all"
        >
          <Icons.X />
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-center items-center text-slate-700 pointer-events-none">
        <span className="text-4xl font-black opacity-20 mb-2">{index + 1}</span>
        <h3 className="text-lg font-bold opacity-60">
          {item.colSpan}x{item.rowSpan}
        </h3>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-between items-center border-t border-black/5">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <span className="text-[9px] font-bold uppercase text-slate-400 px-1">
            L
          </span>
          <button
            onClick={() => handleResize("col", "dec")}
            disabled={item.colSpan <= 1}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Minimize />
          </button>
          <button
            onClick={() => handleResize("col", "inc")}
            disabled={item.colSpan >= MAX_COL}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Maximize />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <span className="text-[9px] font-bold uppercase text-slate-400 px-1">
            A
          </span>
          <button
            onClick={() => handleResize("row", "dec")}
            disabled={item.rowSpan <= 1}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Minimize />
          </button>
          <button
            onClick={() => handleResize("row", "inc")}
            disabled={item.rowSpan >= MAX_ROW}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Maximize />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
