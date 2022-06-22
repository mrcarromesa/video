interface ProgressBarLoadedProps {
  className: string;
  loadedPercent: number;
}

export const ProgressBarLoaded: React.FC<ProgressBarLoadedProps> = ({
  className,
  loadedPercent,
}) => (
  <div
    className={className}
    style={{
      width: `${loadedPercent}%`,
    }}
  />
);
