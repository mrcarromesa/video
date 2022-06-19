import { RefObject, SetStateAction, useCallback } from 'react';
import { useMouseEvent } from 'src/events/Mouse/hooks/useMouseEvent';

interface ParentPositionsProps {
  offsetLeft: number;
  offsetWidth: number;
}

interface ProgressHoverResultProps {
  getPercentagePositionByElementRef: (parentPositions: ParentPositionsProps) => number;
  isMouseDown: boolean;
  position: {
    x: number;
    y: number;
  }
}

export const useProgressHover = ((): ProgressHoverResultProps => {
  const { position, isMouseDown } = useMouseEvent();

  const getPercentagePositionByElementRef = useCallback((parentPositions: ParentPositionsProps): number => {
    const { offsetLeft, offsetWidth } = parentPositions;    
    const left = (position.x - offsetLeft);
    const totalWidth = offsetWidth;
    return  left / totalWidth;
  }, [position.x]);

  return {
    isMouseDown,
    position,
    getPercentagePositionByElementRef
  };

});