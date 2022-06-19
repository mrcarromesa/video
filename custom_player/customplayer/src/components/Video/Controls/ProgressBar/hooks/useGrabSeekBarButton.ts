import { SetStateAction, useCallback, useEffect, useRef } from 'react';
import { useMouseEvent } from 'src/events/Mouse/hooks/useMouseEvent';

interface ElementPositionsProps {
  offsetLeft: number;
  offsetWidth: number;
}

interface GrabSeekMoveProps {
  parent: ElementPositionsProps;
  element: ElementPositionsProps;
}

interface GoToTimeProps {
  parent: ElementPositionsProps;
  element: ElementPositionsProps;
  positionX: number; 
}

interface GrabSeekButtonProps {
  setElementIsPressed:  (value: SetStateAction<boolean>) => void;
  elementIsPressed: boolean;
  initialTime: number;
}

interface ProgressHoverResultProps {
  getMovedPositionFromSeekBar: (data: GrabSeekMoveProps) => number | undefined;
  goToTime: (data: GoToTimeProps) => number | undefined;
  isMouseDown: boolean;
  position: {
    x: number;
    y: number;
  };
}

export const useGrabSeekBarButton = (({
  elementIsPressed,
  setElementIsPressed,
  initialTime = 0,
}: GrabSeekButtonProps): ProgressHoverResultProps => {
  const { position, isMouseDown } = useMouseEvent();
  const currentPositionX = useRef(initialTime);

  useEffect(() => {
    currentPositionX.current = initialTime;
  }, [initialTime]);

  useEffect(() => {
    if(!isMouseDown) {
      setElementIsPressed(false);
    }
  }, [isMouseDown, setElementIsPressed]);

  const getMovedPositionFromSeekBar = useCallback(
    (data: GrabSeekMoveProps): number | undefined => {
      if (!elementIsPressed || position.x === undefined) {
        return currentPositionX.current;
      }

      if (data.parent && data.element) {
        const { offsetLeft, offsetWidth } = data.parent;
        const { offsetWidth: elementOffsetWidth } = data.element;

        const buttonPositionX = position.x - offsetLeft - elementOffsetWidth / 2;


        if (buttonPositionX < 0) {
          currentPositionX.current = 0;
          return 0;
        }
        
        if (buttonPositionX > offsetWidth) {
          currentPositionX.current = offsetWidth;
          return offsetWidth;
        }
        
        currentPositionX.current = buttonPositionX;
        return buttonPositionX;
      }
    },
    [elementIsPressed, position.x]
  );
  
  const goToTime = useCallback(
    (data: GoToTimeProps): number | undefined => {
      if (data.parent && data.positionX && data.element) {
        const { offsetLeft, offsetWidth } = data.parent;
        const { offsetWidth: elementOffsetWidth } = data.element;

        const buttonPositionX = data.positionX - offsetLeft - elementOffsetWidth / 2;

        

        if (buttonPositionX < 0) {
          currentPositionX.current = 0;
          return 0;
        }
        
        if (buttonPositionX > offsetWidth) {
          currentPositionX.current = offsetWidth;
          return offsetWidth;
        }
        
        currentPositionX.current = buttonPositionX;
        return buttonPositionX;
      }
    },
    []
  );

  return {
    isMouseDown,
    position,
    getMovedPositionFromSeekBar,
    goToTime,
  };

});