import { act, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useWindowResize } from "./useWindowResize";

describe("Testing useWindowResize", () => {
  window.resizeTo = jest.fn();
  it("should return new size of window", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWindowResize());

    expect(result.current.dimensions.width).toBe(1024);
    expect(result.current.dimensions.height).toBe(768);

    act(() => {
      window.innerWidth = 500;
      window.innerHeight = 500;
      fireEvent(window, new Event("resize"));
    });

    await waitForNextUpdate();

    expect(result.current.dimensions.width).toBe(500);
    expect(result.current.dimensions.height).toBe(500);
  });
});
