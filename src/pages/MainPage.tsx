import { useEffect, useReducer, useState } from "react";

import {
  Icons,
  Grid,
  Header,
  gridReducer,
  initialState,
  loadPersistedItems,
  persistItems,
  useGridColumns,
} from "@components/ModularGrid";

export default function ModularGridApp() {
  const [items, dispatch] = useReducer(
    gridReducer,
    initialState,
    (defaultState) => loadPersistedItems() ?? defaultState
  );
  const [mounted, setMounted] = useState<boolean>(false);
  const gridCols = useGridColumns();
  const maxRows = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    persistItems(items);
  }, [items]);

  useEffect(() => {
    // Clamp spans when moving between breakpoints (e.g. desktop -> mobile)
    for (const item of items) {
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

      const nextCol = Math.min(maxColSpan, Math.max(minColSpan, item.colSpan));
      const nextRow = Math.min(maxRowSpan, Math.max(minRowSpan, item.rowSpan));

      if (nextCol !== item.colSpan || nextRow !== item.rowSpan) {
        dispatch({
          type: "RESIZE",
          payload: { id: item.id, colSpan: nextCol, rowSpan: nextRow },
        });
      }
    }
  }, [gridCols, maxRows, items]);

  // Evita renderizar antes de montar no cliente (prevenção de tela branca/hidratação)
  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 selection:bg-indigo-100">
      <Header
        onAdd={() => dispatch({ type: "ADD" })}
        onReset={() => dispatch({ type: "RESET" })}
      />

      <Grid
        items={items}
        dispatch={dispatch}
        gridCols={gridCols}
        maxRows={maxRows}
      />

      {/* Footer Fixo */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none z-50">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 text-xs font-bold pointer-events-auto border border-white/10">
          <span className="flex items-center gap-2">
            <Icons.Move />
            <span className="hidden sm:inline">ARRASTE PELO TOPO</span>
            <span className="sm:hidden">ARRASTE</span>
          </span>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="flex items-center gap-2">
            <Icons.Maximize />
            <span className="hidden sm:inline">HOVER PARA REDIMENSIONAR</span>
            <span className="sm:hidden">TAP PARA EDITAR</span>
          </span>
        </div>
      </div>
    </div>
  );
}
