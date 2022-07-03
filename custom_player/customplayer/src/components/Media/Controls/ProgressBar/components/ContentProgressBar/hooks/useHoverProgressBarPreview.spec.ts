import { act, renderHook } from "@testing-library/react-hooks";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import { useHoverProgressBarPreview } from "./useHoverProgressBarPreview";

jest.mock("src/events/Mouse/hooks/useMouseEvent");

describe("Testing useHoverProgressBarPreview", () => {
  beforeAll(() => {
    jest.mocked(useMouseEvent).mockImplementation(() => ({
      position: {
        x: 500,
        y: 0,
      },
      isMouseDown: true,
    }));
  });

  it("should be return position when containerRef found", () => {
    const { result } = renderHook(() =>
      useHoverProgressBarPreview({
        containerRef: {
          current: {
            getBoundingClientRect: () =>
              ({
                x: 100,
                width: 200,
              } as DOMRect),
          } as HTMLDivElement,
        },
      })
    );

    const { onHoverProgressBarPreview } = result.current;
    act(() => {
      onHoverProgressBarPreview();
    });

    expect(result.current.hoverPlayerPreviewPositionX).toEqual(2);
  });

  it("should be return positions equal zero when containerRef not found", () => {
    const { result } = renderHook(() =>
      useHoverProgressBarPreview({ containerRef: {} } as any)
    );

    const { onHoverProgressBarPreview } = result.current;
    act(() => {
      onHoverProgressBarPreview();
    });

    expect(result.current.hoverPlayerPreviewPositionX).toEqual(0);
  });
});
