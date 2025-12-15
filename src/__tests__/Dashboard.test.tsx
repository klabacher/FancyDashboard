import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "../Store/layoutSlice";
import Dashboard from "../Pages/Dashboard";

// Mock Tauri APIs
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue({
    host: "Test Host",
    os_version: "Test OS",
    cpu_brand: "Test CPU",
    physical_cores: 4,
    total_memory: 16000,
  }),
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn().mockResolvedValue(() => {}),
}));

const renderWithStore = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      layout: layoutReducer,
    },
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe("Dashboard", () => {
  it("renders without crashing", () => {
    renderWithStore(<Dashboard />);
    const matches = screen.getAllByText(
      /Dashboard Interativo|Receita Total|Usuários/
    );
    expect(matches.length).toBeGreaterThan(0);
  });
});
