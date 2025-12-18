import React, { useState, useEffect, useRef } from "react";
import type { BentoGridProps } from "@components/types/BentoGrid";

export default function SizeProvider({
  BentoGrid,
  mainDivRef,
}: {
  BentoGrid: React.ComponentType<BentoGridProps>;
  mainDivRef: React.RefObject<HTMLDivElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        // Ignora medições inválidas ou muito pequenas (ex: colapso inicial)
        if (width > 0 && height > 0) {
          requestAnimationFrame(() => {
            setDimensions({ width, height });
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [mainDivRef]);

  // Use um valor mínimo para isReady
  const isReady = dimensions.width > 0 && dimensions.height > 50;

  console.log("SizeProvider dimensions:", dimensions, isReady);

  if (!mainDivRef.current) {
    return (
      <div ref={containerRef} className="w-full h-full overflow-hidden">
        <div className="size-full bg-red-600 text-white text-5xl">
          Error: mainDivRef is null
        </div>
      </div>
    );
  } else {
    console.log("SizeProvider mainDivRef:", mainDivRef.current);
    console.log("SizeProvider mainDivRef dimensions:", {
      width: mainDivRef.current.offsetWidth,
      height: mainDivRef.current.offsetHeight,
    });
  }

  return (
    // h-full aqui funcionará agora porque o pai (main) tem flex-1 e altura definida
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      {isReady ? (
        <BentoGrid width={dimensions.width} height={dimensions.height} />
      ) : (
        // Um loading state que ocupa espaço previne pulos de layout
        <div className="w-full h-full flex items-center justify-center text-white/20 animate-pulse">
          Inicializando Grid...
        </div>
      )}
    </div>
  );
}
