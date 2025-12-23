import React from "react";

import { Icons } from "./icons";

type HeaderProps = {
  onAdd: () => void;
  onReset: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onAdd, onReset }) => {
  return (
    <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Grid <span className="text-indigo-600">Modular</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Sistema de layout fluido sem dependências.
        </p>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <button
          onClick={onAdd}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <Icons.Plus />
          Adicionar
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 px-4 py-3 rounded-xl transition-all active:scale-95 shadow-sm"
          title="Resetar"
        >
          <Icons.Trash />
        </button>
      </div>
    </header>
  );
};
