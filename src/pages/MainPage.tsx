import { useEffect, useReducer, useState } from "react";

import {
  Icons,
  Grid,
  Header,
  gridReducer,
  initialState,
} from "@components/ModularGrid";

export default function ModularGridApp() {
  const [items, dispatch] = useReducer(gridReducer, initialState);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Evita renderizar antes de montar no cliente (prevenção de tela branca/hidratação)
  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 selection:bg-indigo-100">
      <Header
        onAdd={() => dispatch({ type: "ADD" })}
        onReset={() => dispatch({ type: "RESET" })}
      />

      <Grid items={items} dispatch={dispatch} isMobile={isMobile} />

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
