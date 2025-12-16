import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// types
import { validateWidgetProps } from "@/Types/widgetSchemas";

//helpers
import { cn } from "@Utils/Helpers";

// components
import GraphComponent from "@Components/BentoComponents/GraphComponent";
import ImageComponent from "@Components/BentoComponents/ImageComponent";
import TextAreaComponent from "@Components/BentoComponents/TextAreaComponent";
import TextComponent from "@Components/BentoComponents/TextComponent";
import IconAppComponent from "@Components/BentoComponents/IconAppComponent";


// Helper robusto para classes (se já tiver no projeto, use o seu)
interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        // Grid System:
        // - Mobile: 1 coluna
        // - Tablet: 2 colunas
        // - Desktop: 4 colunas (padrão Bento moderno)
        // - auto-rows: Define a altura base de cada 'bloco' (ex: 140px)
        // - dense: A MAGIA. Faz itens pequenos subirem para preencher buracos.
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto",
        "auto-rows-[160px]", // Altura fixa da "célula". Ajuste conforme seu design.
        "grid-flow-row-dense",
        className
      )}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
};

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  // Span responsivo: [mobile, desktop] ou valor fixo
  colSpan?: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number };
  rowSpan?: 1 | 2 | 3 | 4;
  id?: string | number; // Necessário para animação correta do Framer Motion
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
  // Lógica para classes de span responsivas
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
    // Objeto customizado (ex: full mobile, half desktop)
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
      layoutId={id ? String(id) : undefined} // Chave mágica para animação de troca de posição
      layout // Ativa animação automática de layout (resize/move)
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onClick={onClick}
      className={cn(
        // Base Card Styling
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "bg-transparent border border-zinc-200 dark:border-zinc-800",
        "shadow-sm hover:shadow-md transition-shadow duration-300",
        // Classes de Grid
        getColSpanClass(),
        getRowSpanClass(),
        // Cursor se for clicável
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {/* Background Hover Effect (DevUX: Feedback visual sofisticado) */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:from-blue-900/20 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};

// -------------------- Factory & Registry --------------------

export type ComponentType = "text" | "textarea" | "image" | "graph" | string;

export type WidgetDescriptor<T = any> = {
  id: string | number;
  type: ComponentType;
  props?: T;
  colSpan?: 1 | 2 | 3 | 4 | { mobile?: number; desktop?: number };
  rowSpan?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  className?: string;
};

// Registry to allow plugins to register custom widgets
const widgetRegistry = new Map<string, React.ComponentType<any>>();

export function registerWidget(type: string, component: React.ComponentType<any>) {
  widgetRegistry.set(type, component);
}

export function getRegisteredWidget(type: string) {
  return widgetRegistry.get(type);
}

// Register built-in widgets
registerWidget("text", TextComponent);
registerWidget("textarea", TextAreaComponent);
registerWidget("image", ImageComponent);
registerWidget("graph", GraphComponent);
registerWidget("icon-app", IconAppComponent);

// Placeholder when widget type not found
const MissingWidget: React.FC<{ type: string }> = ({ type }) => (
  <div className="w-full h-full flex items-center justify-center p-4 text-sm text-zinc-500">
    Widget não encontrado: {type}
  </div>
);

// Error Widget for validation failures
const ErrorWidget: React.FC<{ type: string; error: string }> = ({ type, error }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <svg
      className="w-8 h-8 text-red-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Erro no Widget: {type}</p>
    <p className="text-xs text-red-600 dark:text-red-500 text-center max-w-full wrap-break-word">{error}</p>
  </div>
);

interface ComponentFactoryProps {
  items: WidgetDescriptor[];
  gridClassName?: string;
  validateProps?: boolean; // Enable/disable validation (default: true in dev)
}

/**
 * ComponentFactory: renderiza uma lista (pseudo-DOM) de widgets usando o registry.
 * Plugins podem chamar `registerWidget(type, Component)` em tempo de execução.
 * Valida props automaticamente usando schemas Zod registrados.
 */
export default function ComponentFactory({ 
  items, 
  gridClassName, 
  validateProps = process.env.NODE_ENV === "development" 
}: ComponentFactoryProps) {
  return (
    <BentoGrid className={gridClassName}>
      {items.map((it) => {
        const Comp = getRegisteredWidget(String(it.type));
        
        // Widget not found
        if (!Comp) {
          return (
            <BentoItem
              key={it.id}
              id={it.id}
              colSpan={it.colSpan}
              rowSpan={it.rowSpan}
              className={it.className}
            >
              <MissingWidget type={String(it.type)} />
            </BentoItem>
          );
        }

        // Validate props if enabled
        let validatedProps = it.props || {};
        if (validateProps) {
          const validation = validateWidgetProps(String(it.type), it.props);
          if (!validation.success) {
            return (
              <BentoItem
                key={it.id}
                id={it.id}
                colSpan={it.colSpan}
                rowSpan={it.rowSpan}
                className={it.className}
              >
                <ErrorWidget 
                  type={String(it.type)} 
                  error={JSON.stringify(validation.error?.flatten().fieldErrors || "Validation failed")} 
                />
              </BentoItem>
            );
          }
          validatedProps = validation.data;
        }

        return (
          <BentoItem
            key={it.id}
            id={it.id}
            colSpan={it.colSpan}
            rowSpan={it.rowSpan}
            onClick={it.onClick}
            className={it.className}
          >
            <Comp {...validatedProps} />
          </BentoItem>
        );
      })}
    </BentoGrid>
  );
}

export { widgetRegistry };