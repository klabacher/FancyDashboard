import { create } from "zustand";
import { DashboardState } from "@Types/stateZustand";

// Extendendo a interface se necessário localmente ou assumindo que DashboardState será atualizado
interface ExtendedDashboardState extends DashboardState {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const useDashboardStore = create<ExtendedDashboardState>((set, get) => ({
  viewMode: "wide",
  currentPage: 0,
  totalPages: 1,

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
}));
