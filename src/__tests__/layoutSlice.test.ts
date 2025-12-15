import { describe, it, expect } from "vitest";
import layoutReducer, { updateLayout, setViewMode } from "../store/layoutSlice";

describe("layoutSlice", () => {
  const initialState = {
    layouts: {
      lg: [],
      md: [],
      sm: [],
    },
    viewMode: "wide" as const,
  };

  it("should handle initial state", () => {
    expect(layoutReducer(undefined, { type: "unknown" })).toEqual({
      layouts: expect.any(Object),
      viewMode: "wide",
    });
  });

  it("should handle setViewMode", () => {
    const actual = layoutReducer(initialState, setViewMode("compact"));
    expect(actual.viewMode).toEqual("compact");
  });

  it("should handle updateLayout", () => {
    const newLayout = [{ i: "test", x: 0, y: 0, w: 1, h: 1 }];
    // dynamic layout typing for test
    const actual = layoutReducer(
      initialState,
      updateLayout({ layout: newLayout, breakpoint: "lg" })
    );
    expect(actual.layouts.lg).toEqual(newLayout);
  });
});
