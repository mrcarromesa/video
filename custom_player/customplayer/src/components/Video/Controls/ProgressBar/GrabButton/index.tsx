import { forwardRef, useMemo, RefObject } from 'react';
interface GrabButtonProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  positionX: number;
  className: string;
  containerRef: RefObject<HTMLDivElement>;
}

const GrabButton = forwardRef<HTMLDivElement, GrabButtonProps>(({
  positionX,
  onMouseDown,
  containerRef,
  className
}, ref) => {


  const fixedPositionProgressBarDot = useMemo(() => {
    const progressBarDotRef = ref as RefObject<HTMLDivElement>;
    const buttonPxWidth = progressBarDotRef.current?.clientWidth || 1;
    const screenWidth = containerRef.current?.clientWidth || 1;
    const buttonPercentWidth = buttonPxWidth * 100;
    const maxPercentage = 100 - buttonPercentWidth / screenWidth;
    return Math.min(maxPercentage, positionX);
  }, [containerRef, positionX, ref]);

  return (
    <div 
        ref={ref} 
        className={`${className}`}
        onMouseDown={onMouseDown}
        style={{
          marginLeft: `${fixedPositionProgressBarDot}%`
        }}
      ></div>
  );
});

GrabButton.displayName = 'GrabButton';

export default GrabButton;