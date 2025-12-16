import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useMemo } from "react";
import { useDashboardStore } from "@State/dashboardStore";

// types
import { validateWidgetProps, WidgetDescriptor } from "@/Types/widgetSchemas";

//helpers
import { cn } from "@Utils/Helpers";

// components
import GraphComponent from "@Components/BentoComponents/GraphComponent";
import ImageComponent from "@Components/BentoComponents/ImageComponent";
import TextAreaComponent from "@Components/BentoComponents/TextAreaComponent";
import TextComponent from "@Components/BentoComponents/TextComponent";
import IconAppComponent from "@Components/BentoComponents/IconAppComponent";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

// Wrapper interno para o Grid Layout
export const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
        "w-full h-full", // Ocupa todo o espaço do container pai
        "grid-rows-[repeat(auto-fit,minmax(0,1fr))]", // Tenta distribuir as linhas igualmente sem estourar
        className
      )}
    >
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
};

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number };
  rowSpan?: 1 | 2 | 3 | 4;
  id?: string | number;
  onClick?: () => void;
}

export const BentoItem = ({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  id,
  onClick,
}: BentoItemProps) => {
  const getColSpanClass = () => {
    if (typeof colSpan === "number") {
      const spans = {
        1: "lg:col-span-1",
        2: "lg:col-span-2",
        3: "lg:col-span-3",
        4: "lg:col-span-4",
      };
      return spans[colSpan] || "lg:col-span-1";
    }
    return `col-span-${colSpan.mobile || 1} lg:col-span-${colSpan.desktop || 1}`;
  };

  const getRowSpanClass = () => {
    const spans = {
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
      4: "row-span-4",
    };
    return spans[rowSpan] || "row-span-1";
  };

  return (
    <motion.div
      layoutId={id ? String(id) : undefined}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      onClick={onClick}
      className={cn(
        getColSpanClass(),
        getRowSpanClass(),
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="h-full w-full">{children}</div>
    </motion.div>
  );
};

// -------------------- Factory & Registry --------------------

const widgetRegistry = new Map<string, React.ComponentType<any>>();

export function registerWidget(type: string, component: React.ComponentType<any>) {
  widgetRegistry.set(type, component);
}

export function getRegisteredWidget(type: string) {
  return widgetRegistry.get(type);
}

registerWidget("text", TextComponent);
registerWidget("textarea", TextAreaComponent);
registerWidget("image", ImageComponent);
registerWidget("graph", GraphComponent);
registerWidget("icon-app", IconAppComponent);

const MissingWidget: React.FC<{ type: string }> = ({ type }) => (
  <div className="w-full h-full flex items-center justify-center p-4 text-sm text-zinc-500 bg-zinc-100/10 rounded-3xl border border-dashed border-zinc-500/30">
    Widget desconhecido: {type}
  </div>
);

const ErrorWidget: React.FC<{ type: string; error: string }> = ({ type, error }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2 bg-red-500/10 border border-red-500/30 rounded-3xl backdrop-blur-sm">
    <span className="text-red-400 font-bold text-xs uppercase tracking-wider">Erro: {type}</span>
    <p className="text-[10px] text-red-300 text-center">{error}</p>
  </div>
);

interface ComponentFactoryProps {
  items: WidgetDescriptor[];
  gridClassName?: string;
  validateProps?: boolean;
}

export default function ComponentFactory({ 
  items, 
  gridClassName, 
  validateProps = process.env.NODE_ENV === "development" 
}: ComponentFactoryProps) {
  const { currentPage, setTotalPages } = useDashboardStore();

  // Calcular total de páginas e atualizar store
  useEffect(() => {
    const maxPage = items.reduce((max, item) => Math.max(max, item.page || 0), 0);
    setTotalPages(maxPage + 1);
  }, [items, setTotalPages]);

  // Filtrar itens da página atual
  const visibleItems = useMemo(() => {
    return items.filter(item => (item.page || 0) === currentPage);
  }, [items, currentPage]);

  return (
    // Container Principal que define a área útil (100vh - Header)
    <div className="w-full h-screen pt-20 pb-6 px-6 overflow-hidden flex flex-col">
      <BentoGrid className={gridClassName}>
        {visibleItems.map((it) => {
          const Comp = getRegisteredWidget(String(it.type));
          
          if (!Comp) {
            return (
              <BentoItem key={it.id} id={it.id} colSpan={it.colSpan} rowSpan={it.rowSpan} className={it.className}>
                <MissingWidget type={String(it.type)} />
              </BentoItem>
            );
          }

          let validatedProps = it.props || {};
          if (validateProps) {
            const validation = validateWidgetProps(String(it.type), it.props);
            if (!validation.success) {
              return (
                <BentoItem key={it.id} id={it.id} colSpan={it.colSpan} rowSpan={it.rowSpan} className={it.className}>
                  <ErrorWidget type={String(it.type)} error={JSON.stringify(validation.error?.flatten().fieldErrors)} />
                </BentoItem>
              );
            }
            validatedProps = validation.data;
          }

          return (
            <BentoItem key={it.id} id={it.id} colSpan={it.colSpan} rowSpan={it.rowSpan} onClick={it.onClick} className={it.className}>
              <Comp {...validatedProps} />
            </BentoItem>
          );
        })}
      </BentoGrid>
    </div>
  );
}

export { widgetRegistry };