import { useState } from "react";
import { BentoGrid, BentoItem } from "../Components/BentoGrid";
import { motion } from "framer-motion";

// Mock de dados (Tipagem forte é seu amigo)
type Widget = {
  id: string;
  title: string;
  type: "stat" | "graph" | "list" | "action";
  colSpan: 1 | 2 | 4; // Simplificado para exemplo
  rowSpan: 1 | 2;
  content: string;
  color: string;
};

const INITIAL_WIDGETS: Widget[] = [
  {
    id: "1",
    title: "Receita Total",
    type: "stat",
    colSpan: 2,
    rowSpan: 2,
    content: "R$ 124.500",
    color: "bg-emerald-500",
  },
  {
    id: "2",
    title: "Usuários",
    type: "stat",
    colSpan: 1,
    rowSpan: 1,
    content: "+2.4k",
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Servidores",
    type: "list",
    colSpan: 1,
    rowSpan: 2,
    content: "Online",
    color: "bg-orange-500",
  },
  {
    id: "4",
    title: "Notificações",
    type: "action",
    colSpan: 1,
    rowSpan: 1,
    content: "3 Novas",
    color: "bg-purple-500",
  },
  {
    id: "5",
    title: "Performance",
    type: "graph",
    colSpan: 2,
    rowSpan: 1,
    content: "Graph Placeholder",
    color: "bg-zinc-800",
  },
];

export default function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);

  // Exemplo: Função para Expandir/Contrair um widget ao clicar
  const toggleSize = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          // Lógica simples: Se for pequeno (1x1), vira grande (2x2), senão volta.
          const isSmall = w.colSpan === 1 && w.rowSpan === 1;
          return {
            ...w,
            colSpan: isSmall ? 2 : 1,
            rowSpan: isSmall ? 2 : 1,
          } as Widget;
        }
        return w;
      })
    );
  };

  // Exemplo: Função "Shuffle" para demonstrar a reordenação automática
  const shuffleWidgets = () => {
    setWidgets((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 text-zinc-900 dark:text-zinc-100">
      {/* Header com Controles */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Interativo
        </h1>
        <button
          onClick={shuffleWidgets}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition active:scale-95"
        >
          🔀 Embaralhar Grid
        </button>
      </div>

      <BentoGrid>
        {widgets.map((widget) => (
          <BentoItem
            key={widget.id} // CRUCIAL: A key DEVE ser o ID estável do widget, não o index
            id={widget.id}
            colSpan={widget.colSpan}
            rowSpan={widget.rowSpan}
            onClick={() => toggleSize(widget.id)}
            className={widget.type === "stat" ? "bg-white" : ""}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-500 uppercase">
                  {widget.type}
                </span>
                {/* Indicador visual de interação */}
                <motion.div
                  className={`w-2 h-2 rounded-full ${widget.color}`}
                  layout
                />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <motion.span
                  className="text-2xl font-bold"
                  layout // Anima o tamanho da fonte se o container mudar
                >
                  {widget.content}
                </motion.span>
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="font-semibold">{widget.title}</h3>
                <p className="text-xs text-zinc-400">Clique para expandir</p>
              </div>
            </div>
          </BentoItem>
        ))}
      </BentoGrid>
    </div>
  );
}
