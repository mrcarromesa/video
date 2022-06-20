import { ReactNode, useEffect } from "react";
import { MouseProvider } from "./useMouseEvent";

interface MouseAppProviderProps {
  children: ReactNode;
}

const MouseAppProvider: React.FC<MouseAppProviderProps> = ({ children  }) => {

  useEffect(() => {
    // https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
    // https://gist.github.com/Alex1990/d462cb9f90ed2b1a9390
    const touchHandler = (event: TouchEvent) => {
      const touch = event.changedTouches[0];

      const eventParse = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }[event.type as string];

      const simulatedEvent = new MouseEvent(String(eventParse), {
        bubbles: true, cancelable: true, view: window, detail: 1,
        screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
      });

      touch.target.dispatchEvent(simulatedEvent);
    }

    const init = () => {
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);
    }

    init();
  }, []);

  return (<MouseProvider>
    {children}
  </MouseProvider>);
}

export default MouseAppProvider;