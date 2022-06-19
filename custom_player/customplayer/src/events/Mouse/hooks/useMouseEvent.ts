import { useEffect, useState, useCallback } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export const useMouseEvent = () => {
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

  return {
    position,
    isMouseDown
  };

}