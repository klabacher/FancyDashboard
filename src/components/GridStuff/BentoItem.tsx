// src/components/GridStuff/BentoItem.tsx
// BentoItem: componente base de célula da grid
// - Suporta children (ou render-prop que recebe o tamanho atual)
// - Observa redimensionamentos via ResizeObserver e expõe onSizeChange
// - Mantém estrutura de estilo para ser facilmente estendida (texto, número, imagem, etc.)
import React, { useRef, useEffect, useState } from "react";

export type Size = { width: number; height: number };

export interface BentoItemProps {
  index: number;
  /** Conteúdo interno; pode ser ReactNode ou função (render-prop) que recebe o tamanho */
  children?: React.ReactNode | ((size: Size) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  /** Callback opcional ao mudar de tamanho */
  onSizeChange?: (size: Size) => void;
  // Informações vindas do layout (opcionais)
  gridW?: number; // largura em colunas
  gridH?: number; // altura em linhas
  rowHeight?: number; // altura de linha em px (vinda de BentoGrid)
}

export default function BentoItem({
  index,
  children,
  className,
  style,
  onSizeChange,
  ...rest
}: BentoItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const updateSize = (w: number, h: number) => {
      const next = { width: Math.round(w), height: Math.round(h) };
      setSize((prev) => {
        if (prev.width === next.width && prev.height === next.height) {
          return prev;
        }
        onSizeChange?.(next);
        return next;
      });
    };

    // Init
    const rect = node.getBoundingClientRect();
    updateSize(rect.width, rect.height);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const cr = entry.contentRect;
        updateSize(cr.width, cr.height);
      });

      ro.observe(node);
      return () => ro.disconnect();
    }

    // Simple fallback
    const onWinResize = () => {
      const r = node.getBoundingClientRect();
      updateSize(r.width, r.height);
    };

    window.addEventListener("resize", onWinResize);
    return () => window.removeEventListener("resize", onWinResize);
  }, [onSizeChange]);

  const renderContent = () => {
    if (typeof children === "function") return children(size);
    if (children) return children;
    return (
      <>
        {":)"} - {index}
      </>
    );
  };

  console.debug("Rendering BentoItem", index, size, rest);

  return (
    <div
      ref={ref}
      className={`flex bg-white/40 min-h-full min-w-full gap-6 relative overflow-hidden ${className ?? ""}`}
      style={style}
      data-bento-index={index}
    >
      <div className="font-serif w-full h-full text-black text-3xl p-4 flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
