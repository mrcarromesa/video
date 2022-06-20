import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";


interface MouseProviderProps {
  children: ReactNode;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface MouseEventContextData {
  position: MousePosition;
  isMouseDown: boolean;
}


const MouseContext = createContext<MouseEventContextData>({} as MouseEventContextData);

export const MouseProvider: React.FC<MouseProviderProps> = ({
  children,
}) => {
  const [position, setPosition] = useState<MousePosition>({} as MousePosition);
  const [isMouseDown, setIsMouseDown] = useState(false);

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

    const setMouseUp = (e: MouseEvent) => {
      setIsMouseDown(false);
    }
    
    const setMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
    }

    window.addEventListener("mouseup", setMouseUp);
    window.addEventListener("mousedown", setMouseDown);
    
    return () => {
      window.removeEventListener("mouseup", setMouseUp);
      window.addEventListener("mousedown", setMouseDown);
    };

  }, []);


  return (
    <MouseContext.Provider
      value={{
        position,
        isMouseDown,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};

export const useMouseEvent = (): MouseEventContextData => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMouseEvent must be used within a MouseProvider");
  }
  return context;
};