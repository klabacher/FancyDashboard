// src/components/BentoGrid.tsx
import { useMemo, useState } from "react";
import GridLayout, { Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type BentoItem = {
  id: string;
  title: string;
  content: string;
};

const INITIAL_ITEMS: BentoItem[] = [
  { id: "a", title: "Card 1", content: "1x1" },
  { id: "b", title: "Card 2", content: "2x3" },
  { id: "c", title: "Card 3", content: "3x2" },
];

const INITIAL_LAYOUT: Layout[] = [
  { i: "a", x: 0, y: 0, w: 1, h: 1 },
  { i: "b", x: 1, y: 0, w: 2, h: 3 },
  { i: "c", x: 3, y: 0, w: 3, h: 2 },
];

export function BentoGrid() {
  const [layout, setLayout] = useState<Layout[]>(INITIAL_LAYOUT);

  const cols = useMemo(() => {
    if (typeof window === "undefined") return 10;
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--bento-cols")
      .trim();
    return Number(val || 10);
  }, []);

  const rowHeight = useMemo(() => {
    if (typeof window === "undefined") return 80;
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--bento-row-height")
      .trim();
    return Number(val || 80);
  }, []);

  const handleLayoutChange = (newLayout: Layout[], _layouts: Layouts) => {
    setLayout(newLayout);
    // aqui você poderia persistir em localStorage / backend
  };

  return (
    <div className="w-screen p-3 max-w-screen mx-auto">
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={cols * rowHeight} // aproxima quadrado; pode usar containerWidth com resize observer
        draggableHandle=".drag-handle"
        onLayoutChange={handleLayoutChange}
      >
        {INITIAL_ITEMS.map((item) => (
          <div key={item.id} className="p-2">
            <div className="h-full w-full rounded-3xl bg-bg text-text shadow-md border border-secondary/20 overflow-hidden flex flex-col">
              <div className="drag-handle cursor-move px-3 py-2 text-xs uppercase tracking-wide text-secondary/80">
                {item.title}
              </div>
              <div className="flex-1 px-4 pb-4 flex items-center justify-center text-sm">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
