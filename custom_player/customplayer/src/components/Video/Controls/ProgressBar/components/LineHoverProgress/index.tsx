import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

interface LineHoverProgressProps {
  className: string;
  positionX: number;
}

export const LineHoverProgress: React.FC<LineHoverProgressProps> = ({
  className,
  positionX,
}) => {
  const { isMobile } = useWindowResize();
  return (
    <div
      className={`${className}`}
      style={{
        visibility: !isMobile ? "visible" : "hidden",
        transform: `scaleX(${positionX})`,
      }}
    />
  );
};
