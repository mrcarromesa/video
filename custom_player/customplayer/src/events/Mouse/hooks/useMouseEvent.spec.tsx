import { act, fireEvent, render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useMouseEvent } from "./useMouseEvent";

describe("Testing useMouseEvent", () => {
  it("should be return positionProgressPlayed", () => {
    const { result } = renderHook(() => useMouseEvent());
    const { getByTestId } = render(
      <button type="button" data-testid="element">
        element
      </button>
    );

    act(() => {
      const el = getByTestId("element");
      const window = (el.ownerDocument || el).defaultView;
      fireEvent.mouseMove(window as Window, {
        pageX: 100,
        screenX: 100,
        clientX: 100,
      });
      fireEvent.mouseDown(el);
      fireEvent.touchStart(el, {
        touches: [{ screenX: 232, pageX: 232 }],
        changedTouches: [
          {
            touchstart: { screenX: 1 },
            target: {
              dispatchEvent: () => true,
            },
          },
        ],
      });
      fireEvent.mouseUp(el);
    });

    expect(result.current.isMouseDown).toBeFalsy();
  });
});
