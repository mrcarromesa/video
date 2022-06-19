import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

interface WindowResizeResultProps {
  dimensions: {
    width: number;
    height: number;
  };
  isMobile: boolean;
}

export const useWindowResize = (): WindowResizeResultProps => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    const handleResize = () => {
      console.log('ontouchstart' in window);
      setIsMobile('ontouchstart' in window);
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    const debouncedHandleResize = debounce(handleResize, 50);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  return {
    dimensions,
    isMobile,
  };
}