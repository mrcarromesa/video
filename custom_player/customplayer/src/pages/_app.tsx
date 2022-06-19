import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

// https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
// https://gist.github.com/Alex1990/d462cb9f90ed2b1a9390

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    function touchHandler(event: any) {
      const touch = event.changedTouches[0];

      // console.log('a1',event.type);

      const eventParse = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }[event.type as string];

      // const a = {
      //   touchstart: "mousedown",
      //   touchmove: "mousemove",
      //   touchend: "mouseup"
      // }[event.type];

      // console.log('aaa => ',a);

      const simulatedEvent = new MouseEvent(String(eventParse), {
        bubbles: true, cancelable: true, view: window, detail: 1,
        screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
      });
      touch.target.dispatchEvent(simulatedEvent);
    }
    function init() {
            // I suggest you be far more specific than "document"
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);
    }

    init();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
