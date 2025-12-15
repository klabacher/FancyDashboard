import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

// Helper robusto para classes (se já tiver no projeto, use o seu)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:from-blue-900/20 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};
