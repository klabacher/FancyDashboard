import { create } from "zustand";
import { DashboardState } from "@Types/stateZustand";
import { 
  WidgetDescriptor, 
  WidgetSize, 
  WidgetPosition, 
  WidgetConstraints,
  parseSizeToDimensions,
  getDefaultConstraints 
} from "@/Types/widgetSchemas";

// -------------------- Grid Configuration --------------------
export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  cellWidth: number;
  cellHeight: number;
}

// -------------------- Widget Layout State --------------------
export interface WidgetLayoutState {
  activeWidgetId: string | number | null;
  draggedWidgetId: string | number | null;
  resizingWidgetId: string | number | null;
  hoveredWidgetId: string | number | null;
  widgets: WidgetDescriptor[];
}

// -------------------- Extended Dashboard State --------------------
interface ExtendedDashboardState extends DashboardState {
  // Pagination
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Grid Configuration
  gridConfig: GridConfig;
  setGridConfig: (config: Partial<GridConfig>) => void;

  // Widget Layout State
  layout: WidgetLayoutState;
  
  // Widget Actions
  setActiveWidget: (id: string | number | null) => void;
  setDraggedWidget: (id: string | number | null) => void;
  setResizingWidget: (id: string | number | null) => void;
  setHoveredWidget: (id: string | number | null) => void;
  
  // Widget CRUD
  setWidgets: (widgets: WidgetDescriptor[]) => void;
  updateWidgetPosition: (id: string | number, position: WidgetPosition) => void;
  updateWidgetSize: (id: string | number, size: WidgetSize) => void;
  updateWidgetConstraints: (id: string | number, constraints: Partial<WidgetConstraints>) => void;
  swapWidgetPositions: (id1: string | number, id2: string | number) => void;
  
  // Collision Detection
  checkCollision: (id: string | number, newPosition: WidgetPosition, newSize?: WidgetSize) => boolean;
  findAvailablePosition: (size: WidgetSize, startFrom?: WidgetPosition) => WidgetPosition | null;
  
  // Resize Validation
  canResize: (id: string | number, newSize: WidgetSize) => boolean;
}

// -------------------- Default Grid Config --------------------
const defaultGridConfig: GridConfig = {
  columns: 4,
  rows: 4,
  gap: 24,
  cellWidth: 200,
  cellHeight: 200,
};

// -------------------- Store Implementation --------------------
export const useDashboardStore = create<ExtendedDashboardState>((set, get) => ({
  // Base Dashboard State
  viewMode: "wide",
  currentPage: 0,
  totalPages: 1,

  // Grid Configuration
  gridConfig: defaultGridConfig,

  // Widget Layout State
  layout: {
    activeWidgetId: null,
    draggedWidgetId: null,
    resizingWidgetId: null,
    hoveredWidgetId: null,
    widgets: [],
  },

  // Base Setters
  setViewMode: (_mode) => set({ viewMode: _mode }),
  setMetrics: (_payload) => set({ metrics: _payload }),
  setSpecs: (_payload) => set({ specs: _payload }),

  // Pagination Actions
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),

  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages - 1) {
      set({ currentPage: currentPage + 1 });
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 0) {
      set({ currentPage: currentPage - 1 });
    }
  },

  // Grid Config
  setGridConfig: (config) =>
    set((state) => ({
      gridConfig: { ...state.gridConfig, ...config },
    })),

  // Widget State Setters
  setActiveWidget: (id) =>
    set((state) => ({
      layout: { ...state.layout, activeWidgetId: id },
    })),

  setDraggedWidget: (id) =>
    set((state) => ({
      layout: { ...state.layout, draggedWidgetId: id },
    })),

  setResizingWidget: (id) =>
    set((state) => ({
      layout: { ...state.layout, resizingWidgetId: id },
    })),

  setHoveredWidget: (id) =>
    set((state) => ({
      layout: { ...state.layout, hoveredWidgetId: id },
    })),

  // Widget CRUD
  setWidgets: (widgets) =>
    set((state) => ({
      layout: { ...state.layout, widgets },
    })),

  updateWidgetPosition: (id, position) =>
    set((state) => ({
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((w) =>
          w.id === id ? { ...w, position } : w
        ),
      },
    })),

  updateWidgetSize: (id, size) =>
    set((state) => ({
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((w) =>
          w.id === id ? { ...w, size } : w
        ),
      },
    })),

  updateWidgetConstraints: (id, constraints) =>
    set((state) => ({
      layout: {
        ...state.layout,
        widgets: state.layout.widgets.map((w): WidgetDescriptor =>
          w.id === id
            ? { 
                ...w, 
                constraints: { 
                  resizable: w.constraints?.resizable ?? false,
                  ...w.constraints, 
                  ...constraints 
                } as WidgetConstraints
              }
            : w
        ),
      },
    })),

  swapWidgetPositions: (id1, id2) =>
    set((state) => {
      const widget1 = state.layout.widgets.find((w) => w.id === id1);
      const widget2 = state.layout.widgets.find((w) => w.id === id2);

      if (!widget1 || !widget2) return state;

      return {
        layout: {
          ...state.layout,
          widgets: state.layout.widgets.map((w) => {
            if (w.id === id1) {
              return { ...w, position: widget2.position };
            }
            if (w.id === id2) {
              return { ...w, position: widget1.position };
            }
            return w;
          }),
        },
      };
    }),

  // Collision Detection
  checkCollision: (id, newPosition, newSize) => {
    const { layout, gridConfig } = get();
    const widget = layout.widgets.find((w) => w.id === id);
    if (!widget) return true;

    const size = newSize || widget.size || "1x1";
    const { w, h } = parseSizeToDimensions(size);

    // Check grid boundaries
    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x + w > gridConfig.columns ||
      newPosition.y + h > gridConfig.rows
    ) {
      return true;
    }

    // Check collision with other widgets
    for (const other of layout.widgets) {
      if (other.id === id) continue;
      if (!other.position || !other.size) continue;

      const otherPos = other.position;
      const otherDim = parseSizeToDimensions(other.size);

      // AABB collision detection
      const collides =
        newPosition.x < otherPos.x + otherDim.w &&
        newPosition.x + w > otherPos.x &&
        newPosition.y < otherPos.y + otherDim.h &&
        newPosition.y + h > otherPos.y;

      if (collides) return true;
    }

    return false;
  },

  // Find available position for a new widget
  findAvailablePosition: (size, startFrom = { x: 0, y: 0 }) => {
    const { gridConfig, layout } = get();
    const { w, h } = parseSizeToDimensions(size);

    for (let y = startFrom.y; y <= gridConfig.rows - h; y++) {
      for (let x = startFrom.x; x <= gridConfig.columns - w; x++) {
        const position = { x, y };
        let hasCollision = false;

        // Check against all existing widgets
        for (const widget of layout.widgets) {
          if (!widget.position || !widget.size) continue;

          const widgetDim = parseSizeToDimensions(widget.size);
          const widgetPos = widget.position;

          const collides =
            position.x < widgetPos.x + widgetDim.w &&
            position.x + w > widgetPos.x &&
            position.y < widgetPos.y + widgetDim.h &&
            position.y + h > widgetPos.y;

          if (collides) {
            hasCollision = true;
            break;
          }
        }

        if (!hasCollision) {
          return position;
        }
      }
    }

    return null; // No space available
  },

  // Resize Validation
  canResize: (id, newSize) => {
    const { layout, checkCollision } = get();
    const widget = layout.widgets.find((w) => w.id === id);
    if (!widget || !widget.position) return false;

    // Check constraints
    const constraints = widget.constraints || getDefaultConstraints(String(widget.type));
    const { w, h } = parseSizeToDimensions(newSize);

    if (constraints.minW && w < constraints.minW) return false;
    if (constraints.maxW && w > constraints.maxW) return false;
    if (constraints.minH && h < constraints.minH) return false;
    if (constraints.maxH && h > constraints.maxH) return false;

    // Check locked aspect ratio
    if (constraints.lockedAspect) {
      const currentDim = parseSizeToDimensions(widget.size || "1x1");
      const currentAspect = currentDim.w / currentDim.h;
      const newAspect = w / h;
      if (Math.abs(currentAspect - newAspect) > 0.01) return false;
    }

    // Check collision at current position with new size
    return !checkCollision(id, widget.position, newSize);
  },
}));
