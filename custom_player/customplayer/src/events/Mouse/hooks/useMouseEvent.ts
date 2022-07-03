import { useEffect, useMemo, useState } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export interface MouseEventResult {
  position: MousePosition;
  isMouseDown: boolean;
}

export const useMouseEvent = (): MouseEventResult => {
  const [position, setPosition] = useState<MousePosition>({} as MousePosition);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
    // https://gist.github.com/Alex1990/d462cb9f90ed2b1a9390
    const touchHandler = (event: TouchEvent) => {
      const touch = event.changedTouches[0];

      const eventParse = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup",
      }[event.type as string];

      const simulatedEvent = new MouseEvent(String(eventParse), {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        screenX: touch.screenX,
        screenY: touch.screenY,
        clientX: touch.clientX,
        clientY: touch.clientY,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
      });

      touch.target.dispatchEvent(simulatedEvent);
    };

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

    return () => {
      document.removeEventListener("touchstart", touchHandler, true);
      document.removeEventListener("touchmove", touchHandler, true);
      document.removeEventListener("touchend", touchHandler, true);
      document.removeEventListener("touchcancel", touchHandler, true);
    };
  }, []);

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.pageX, y: e.clientY });
    };

    window.addEventListener("mousemove", setFromEvent);
    window.addEventListener("mousedown", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
      window.removeEventListener("mousedown", setFromEvent);
    };
  }, []);

  useEffect(() => {
    const setMouseUp = () => {
      setIsMouseDown(false);
    };

    const setMouseDown = () => {
      setIsMouseDown(true);
    };

    window.addEventListener("mouseup", setMouseUp);
    window.addEventListener("mousedown", setMouseDown);

    return () => {
      window.removeEventListener("mouseup", setMouseUp);
      window.addEventListener("mousedown", setMouseDown);
    };
  }, []);

  const result = useMemo(
    () => ({
      position,
      isMouseDown,
    }),
    [position, isMouseDown]
  );

  return result;
};
