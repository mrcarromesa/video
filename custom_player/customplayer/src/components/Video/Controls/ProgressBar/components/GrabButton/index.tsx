import { forwardRef } from "react";

interface GrabButtonProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  positionX: number;
  className: string;
}

const GrabButton = forwardRef<HTMLDivElement, GrabButtonProps>(
  ({ positionX, onMouseDown, className }, ref) => (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        marginLeft: `${positionX}%`,
      }}
      onMouseDown={onMouseDown}
    />
  )
);

GrabButton.displayName = "GrabButton";

export default GrabButton;
