import { useState, useEffect } from "react";
import ComponentFactory from "@Components/BentoGrid";
import { WidgetDescriptor } from "@Types/widgetSchemas";
import { initializeBentoPlugins } from "@/Providers/BentoPlugins";
import Header from "@Components/BentoGridHeader";

const INITIAL_WIDGETS: WidgetDescriptor[] = [
  {
    id: "text-1",
    type: "text",
    size: "2x1",
    position: { x: 0, y: 0 },
    props: {
      text: "Dashboard de Demonstração",
      title: "Boas-vindas",
      variant: "heading",
      align: "center",
    },
  },
  {
    id: "text-2",
    type: "text",
    size: "1x1",
    position: { x: 2, y: 0 },
    props: {
      text: "Sistema online e operacional",
      variant: "subtitle",
      align: "left",
      color: "#10b981",
    },
  },
  {
    id: "text-3",
    type: "text",
    size: "1x1",
    position: { x: 3, y: 0 },
    props: {
      text: "Última atualização: 15/12/2025",
      variant: "caption",
      align: "right",
      color: "#6b7280",
    },
  },

  // Graph Widgets - Diferentes tipos
  {
    id: "graph-1",
    type: "graph",
    size: "2x2",
    position: { x: 0, y: 1 },
    props: {
      title: "Vendas Mensais",
      type: "bar",
      data: [
        { label: "Jan", value: 4500, color: "#3b82f6" },
        { label: "Fev", value: 5200, color: "#3b82f6" },
        { label: "Mar", value: 4800, color: "#3b82f6" },
        { label: "Abr", value: 6100, color: "#3b82f6" },
        { label: "Mai", value: 5900, color: "#3b82f6" },
        { label: "Jun", value: 7200, color: "#10b981" },
      ],
      showGrid: true,
      showLegend: true,
      animate: true,
    },
  },
  {
    id: "graph-2",
    type: "graph",
    size: "2x2",
    position: { x: 2, y: 1 },
    props: {
      title: "Performance Semanal",
      type: "line",
      data: [
        { label: "Seg", value: 65 },
        { label: "Ter", value: 78 },
        { label: "Qua", value: 82 },
        { label: "Qui", value: 75 },
        { label: "Sex", value: 90 },
        { label: "Sáb", value: 85 },
        { label: "Dom", value: 70 },
      ],
      showGrid: true,
      showLegend: true,
      animate: true,
    },
  },
  {
    id: "graph-3",
    type: "graph",
    size: "1x2",
    position: { x: 0, y: 3 },
    props: {
      title: "Distribuição",
      type: "pie",
      data: [
        { label: "Produto A", value: 35, color: "#3b82f6" },
        { label: "Produto B", value: 25, color: "#10b981" },
        { label: "Produto C", value: 20, color: "#f59e0b" },
        { label: "Outros", value: 20, color: "#6b7280" },
      ],
      showLegend: true,
      animate: true,
    },
  },
  {
    id: "graph-4",
    type: "graph",
    size: "1x2",
    position: { x: 1, y: 3 },
    props: {
      title: "Crescimento",
      type: "area",
      data: [
        { label: "Q1", value: 1200 },
        { label: "Q2", value: 1800 },
        { label: "Q3", value: 2400 },
        { label: "Q4", value: 3200 },
      ],
      showGrid: true,
      animate: true,
    },
  },

  // Image Widget
  {
    id: "image-1",
    type: "image",
    size: "2x2",
    position: { x: 2, y: 3 },
    props: {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      alt: "Analytics Dashboard",
      title: "Análise Visual",
      objectFit: "cover",
      overlay: true,
      caption: "Visualização de dados em tempo real",
    },
  },

  // TextArea Widgets
  {
    id: "textarea-1",
    type: "textarea",
    size: "2x2",
    position: { x: 0, y: 5 },
    props: {
      content:
        "Esta é uma demonstração completa do sistema de widgets.\n\nRecursos:\n• Validação automática de props com Zod\n• Animações suaves com Framer Motion\n• Sistema de plugins extensível\n• Layout responsivo e adaptativo\n• Dark mode integrado\n\nTodos os componentes são totalmente tipados e validados em runtime.",
      title: "Notas do Sistema",
      editable: false,
    },
  },
  {
    id: "textarea-2",
    type: "textarea",
    size: "2x2",
    position: { x: 2, y: 5 },
    props: {
      content: "Digite suas observações aqui...",
      title: "Editor de Texto",
      editable: true,
      placeholder: "Comece a escrever...",
      maxLines: 8,
    },
  },

  // More Text Widgets
  {
    id: "text-4",
    type: "text",
    size: "1x1",
    position: { x: 0, y: 7 },
    props: {
      text: "R$ 124.500",
      title: "Receita Total",
      variant: "heading",
      align: "center",
      color: "#10b981",
    },
  },
  {
    id: "text-5",
    type: "text",
    size: "1x1",
    position: { x: 1, y: 7 },
    props: {
      text: "+2.4k usuários",
      title: "Crescimento",
      variant: "subtitle",
      align: "center",
      color: "#3b82f6",
    },
  },

  // Plugin Customizado: Counter Widget
  {
    id: "counter-1",
    type: "counter",
    size: "1x2",
    position: { x: 2, y: 7 },
    props: {
      title: "Contador Interativo",
      initialValue: 42,
      min: 0,
      max: 100,
      step: 1,
      color: "purple",
    },
  },
  {
    id: "counter-2",
    type: "counter",
    size: "1x2",
    position: { x: 3, y: 7 },
    props: {
      title: "Progresso",
      initialValue: 75,
      min: 0,
      max: 100,
      step: 5,
      color: "green",
    },
  },
];

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetDescriptor[]>(INITIAL_WIDGETS);

  // Inicializa plugins ao montar o componente
  useEffect(() => {
    initializeBentoPlugins();
  }, []);

  // Shuffle widgets para demonstrar animações
  const shuffleWidgets = () => {
    setWidgets((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen w-full bg-black/40">
      <Header shuffleWidgets={shuffleWidgets} />

      <main className="min-h-screen w-full bg-black/40 p-1">
        {/* TODO: Add settings to add or not backgound and etc */}
        <ComponentFactory items={widgets} validateProps={true} />
      </main>
    </div>
  );
}
