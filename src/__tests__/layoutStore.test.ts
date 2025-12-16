import { describe, it, expect, beforeEach } from "vitest";
import { useDashboardStore } from "../State/dashboardStore";

const baseGrid = {
  columns: 4,
  rows: 8,
  gap: 24,
  cellWidth: 200,
  cellHeight: 200,
};

const emptyLayout = {
  activeWidgetId: null,
  draggedWidgetId: null,
  resizingWidgetId: null,
  hoveredWidgetId: null,
  widgets: [] as any[],
};

describe("dashboard layout store", () => {
  beforeEach(() => {
    useDashboardStore.setState({
      gridConfig: baseGrid,
      layout: { ...emptyLayout },
    });
  });

  it("detects collision when widgets overlap", () => {
    const { setWidgets, checkCollision } = useDashboardStore.getState();

    setWidgets([
      { id: "a", type: "text", size: "2x1", position: { x: 0, y: 0 }, props: {} },
      { id: "b", type: "text", size: "1x1", position: { x: 1, y: 0 }, props: {} },
    ]);

    const collides = checkCollision("a", { x: 1, y: 0 }, "2x1");
    const free = checkCollision("a", { x: 0, y: 1 }, "2x1");

    expect(collides).toBe(true);
    expect(free).toBe(false);
  });

  it("respects resize constraints for graph widgets", () => {
    const { setWidgets, canResize } = useDashboardStore.getState();

    setWidgets([
      { id: "g", type: "graph", size: "2x2", position: { x: 0, y: 0 }, props: {} },
    ]);

    // Graph requires at least 2x2
    expect(canResize("g", "1x1")).toBe(false);
    // 3x2 fits within grid and constraints
    expect(canResize("g", "3x2")).toBe(true);
  });
});
