import React, { useState, useEffect, useRef } from "react";
import type { BentoGridProps } from "@components/types/BentoGrid";
export default function SizeProvider({
  BentoGrid,
}: {
  BentoGrid: React.ComponentType<BentoGridProps>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // RequestAnimationFrame solves "ResizeObserver loop limit exceeded"
        requestAnimationFrame(() => {
          setDimensions({ width, height });
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Só renderiza a Grid se tivermos dimensões reais para evitar "flicker"
  const isReady = dimensions.width > 0 && dimensions.height > 0;
  console.log("SizeProvider dimensions:", dimensions, isReady);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      {isReady ? (
        <BentoGrid width={dimensions.width} height={dimensions.height} />
      ) : (
        <div className="size-full bg-black text-white text-5xl">Loading...</div>
      )}
    </div>
  );
}
