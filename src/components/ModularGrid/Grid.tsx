import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { GridAction, GridItemModel } from "./types";
import { GridItem } from "./GridItem";
import { Icons } from "./icons";

type GridProps = {
  items: GridItemModel[];
  dispatch: React.Dispatch<GridAction>;
  gridCols: number;
  maxRows: number;
};

export const Grid: React.FC<GridProps> = ({
  items,
  dispatch,
  gridCols,
  maxRows,
}) => {
  return (
    <main className="max-w-7xl mx-auto pb-24">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min grid-flow-dense">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, index) => (
            <GridItem
              key={item.id}
              item={item}
              index={index}
              dispatch={dispatch}
              gridCols={gridCols}
              maxRows={maxRows}
            />
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
        >
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-slate-300">
            <Icons.Plus />
          </div>
          <p className="text-slate-400 font-medium">Sua grid está vazia.</p>
        </motion.div>
      )}
    </main>
  );
};
