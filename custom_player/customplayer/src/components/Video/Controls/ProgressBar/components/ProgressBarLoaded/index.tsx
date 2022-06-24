import { useProgressBar } from "../../hooks/useProgressBar";

interface ProgressBarLoadedProps {
  className: string;
}

export const ProgressBarLoaded: React.FC<ProgressBarLoadedProps> = ({
  className,
}) => {
  const { bufferedChunks } = useProgressBar();

  return (
    <>
      {bufferedChunks.map((item, i) => (
        <div
          key={String(i)}
          className={className}
          style={{
            width: `${item.range || 0}%`,
            left: `${item.start || 0}%`,
          }}
        />
      ))}
    </>
  );
};
