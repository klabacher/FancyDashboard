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
  gridCols: number;
  maxRows: number;
};

export const GridItem: React.FC<GridItemProps> = ({
  item,
  index,
  dispatch,
  gridCols,
  maxRows,
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastSwapRef = useRef<number>(0);

  const isMobile = gridCols <= 2;

  const minColSpan = item.resize?.minColSpan ?? 1;
  const minRowSpan = item.resize?.minRowSpan ?? 1;

  const maxColSpan = Math.max(
    1,
    Math.min(gridCols, item.resize?.maxColSpan ?? gridCols)
  );
  const maxRowSpan = Math.max(
    1,
    Math.min(maxRows, item.resize?.maxRowSpan ?? maxRows)
  );

  const lockCol = item.resize?.lockCol ?? false;
  const lockRow = item.resize?.lockRow ?? false;

  const handleResize = (axis: ResizeAxis, direction: ResizeDirection): void => {
    let newCol = item.colSpan;
    let newRow = item.rowSpan;

    if (axis === "col") {
      if (lockCol) return;
      newCol =
        direction === "inc"
          ? Math.min(newCol + 1, maxColSpan)
          : Math.max(newCol - 1, minColSpan);
    } else {
      if (lockRow) return;
      newRow =
        direction === "inc"
          ? Math.min(newRow + 1, maxRowSpan)
          : Math.max(newRow - 1, minRowSpan);
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

  const renderContent = () => {
    switch (item.content.kind) {
      case "text":
        return (
          <div className="text-center">
            <div className="text-sm font-semibold opacity-80">
              {item.content.text}
            </div>
          </div>
        );
      case "number":
        return (
          <div className="text-center">
            {item.content.label && (
              <div className="text-xs font-bold uppercase tracking-wider opacity-50">
                {item.content.label}
              </div>
            )}
            <div className="text-5xl font-black opacity-40 leading-none mt-1">
              {item.content.value}
            </div>
          </div>
        );
      case "appicon":
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white/60 border border-white/70 flex items-center justify-center overflow-hidden">
              {item.content.src ? (
                <img
                  src={item.content.src}
                  alt={item.content.name}
                  className="w-8 h-8 object-contain"
                  draggable={false}
                />
              ) : (
                <Icons.Move />
              )}
            </div>
            <div className="text-xs font-bold opacity-70">
              {item.content.name}
            </div>
          </div>
        );
      case "image":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={item.content.src}
              alt={item.content.alt ?? ""}
              className="w-full h-full"
              style={{ objectFit: item.content.fit ?? "cover" }}
              draggable={false}
            />
          </div>
        );
    }
  };

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
        {renderContent()}
        <h3 className="text-sm font-bold opacity-50 mt-2">
          {item.colSpan}x{item.rowSpan}
        </h3>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur transition-transform duration-200 flex justify-between items-center border-t border-black/5 ${
          isMobile
            ? "translate-y-0"
            : "translate-y-full group-hover:translate-y-0"
        }`}
      >
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <span className="text-[9px] font-bold uppercase text-slate-400 px-1">
            L
          </span>
          <button
            onClick={() => handleResize("col", "dec")}
            disabled={lockCol || item.colSpan <= minColSpan}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Minimize />
          </button>
          <button
            onClick={() => handleResize("col", "inc")}
            disabled={lockCol || item.colSpan >= maxColSpan}
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
            disabled={lockRow || item.rowSpan <= minRowSpan}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Minimize />
          </button>
          <button
            onClick={() => handleResize("row", "inc")}
            disabled={lockRow || item.rowSpan >= maxRowSpan}
            className="p-1 bg-white rounded shadow-sm hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all text-slate-600"
          >
            <Icons.Maximize />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
