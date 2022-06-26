import { usePlayedProgress } from "./hooks/usePlayedProgress";

interface PlayedProgressProps {
  className: string;
}

export const PlayedProgress: React.FC<PlayedProgressProps> = ({
  className,
}) => {
  const { positionProgressPlayed } = usePlayedProgress();
  return (
    <div
      className={`${className}`}
      style={{
        width: `${positionProgressPlayed}%`,
      }}
    />
  );
};
