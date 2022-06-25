interface PlayedProgressProps {
  className: string;
  seekPositionX: number;
}

export const PlayedProgress: React.FC<PlayedProgressProps> = ({
  className,
  seekPositionX,
}) => (
  <div
    className={`${className}`}
    style={{
      width: `${seekPositionX}%`,
    }}
  />
);
