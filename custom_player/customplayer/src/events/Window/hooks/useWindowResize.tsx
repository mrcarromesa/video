import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

export interface WindowResult {
  dimensions: {
    width: number;
    height: number;
  };
  isMobile: boolean;
}

export const useWindowResize = (): WindowResult => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const results = useMemo(
    () => ({ dimensions, isMobile }),
    [dimensions, isMobile]
  );

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setIsMobile("ontouchstart" in window);
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const debouncedHandleResize = debounce(handleResize, 50);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  return results;
};
