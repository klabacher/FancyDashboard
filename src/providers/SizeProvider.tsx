import React, { useState, useEffect, useRef } from "react";
import type { BentoGridProps } from "@/components/BentoGrid";

// Hook to get parent size using ResizeObserver
function useParentSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const childRef = useRef(null);

  useEffect(() => {
    if (!childRef.current) return;

    const parentElement = childRef.current.parentElement;
    if (!parentElement) return;

    // Função para atualizar o estado com as dimensões do pai
    const updateSize = () => {
      setSize({
        width: parentElement.offsetWidth,
        height: parentElement.offsetHeight,
      });
    };

    // Cria uma instância do ResizeObserver
    const observer = new ResizeObserver(updateSize);

    // Observa o elemento pai
    observer.observe(parentElement);

    // Chama updateSize inicial para definir o tamanho na montagem
    updateSize();

    // Limpeza: desconecta o observer quando o componente desmonta
    return () => {
      observer.disconnect();
    };
  }, []); // Dependências vazias garantem que isso rode uma vez

  return { size, childRef };
}

export default function SizeProvider({
  BentoGrid,
}: {
  BentoGrid: React.ComponentType<BentoGridProps>;
}) {
  //TODO arrumar proporção foda

  // Get size from parent and make the necessary calculations here and pass to bentogrid
  const { size, childRef } = useParentSize();
  const { width, height } = size;

  // Rows X Columns calculation
  // Assuming a 16:9 aspect ratio for the grid
  const aspectRatio = 1 / 1;
  const gridRows = 16;
  const gridCols = 9;

  let calculatedWidth = width;
  let calculatedHeight = height;

  if (width / height > aspectRatio) {
    calculatedWidth = height * aspectRatio;
  } else {
    calculatedHeight = width / aspectRatio;
  }

  console.log("Calculated Size:", { calculatedWidth, calculatedHeight });

  //Final GridConfig
  const GridConfig: BentoGridProps["GridConfig"] = {
    cols: gridCols,
    rowHeight: calculatedHeight / gridRows,
    containerPadding: [0, 0],
    margin: [10, 10],
    maxRows: gridRows,
  };

  return (
    <div ref={childRef} className="w-full h-full">
      {calculatedWidth > 0 && calculatedHeight > 0 && (
        <BentoGrid
          className="w-full h-full"
          items={20}
          rowHeight={100}
          GridConfig={GridConfig}
        />
      )}
    </div>
  );
}
