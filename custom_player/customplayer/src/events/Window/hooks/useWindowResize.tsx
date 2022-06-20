import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import debounce from 'lodash/debounce';

export interface WindowContextData {
  dimensions: {
    width: number;
    height: number;
  };
  isMobile: boolean;
}

interface WindowProviderProps {
  children: ReactNode;
}

const WindowContext = createContext<WindowContextData>({} as WindowContextData);

export const WindowProvider: React.FC<WindowProviderProps> = ({
  children,
}) => {
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


  return (
    <WindowContext.Provider
      value={{
        dimensions,
        isMobile,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowResize = (): WindowContextData => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindowResize must be used within a WindowProvider");
  }
  return context;
};