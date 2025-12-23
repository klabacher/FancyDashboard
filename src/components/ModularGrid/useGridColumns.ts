import { useEffect, useState } from "react";

const mdMinWidth = 768;
const lgMinWidth = 1024;

export const useGridColumns = (): number => {
  const [cols, setCols] = useState<number>(2);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mdQuery = window.matchMedia(`(min-width: ${mdMinWidth}px)`);
    const lgQuery = window.matchMedia(`(min-width: ${lgMinWidth}px)`);

    const computeCols = () => (lgQuery.matches ? 6 : mdQuery.matches ? 4 : 2);

    const onChange = () => setCols(computeCols());

    onChange();
    mdQuery.addEventListener("change", onChange);
    lgQuery.addEventListener("change", onChange);

    return () => {
      mdQuery.removeEventListener("change", onChange);
      lgQuery.removeEventListener("change", onChange);
    };
  }, []);

  return cols;
};
