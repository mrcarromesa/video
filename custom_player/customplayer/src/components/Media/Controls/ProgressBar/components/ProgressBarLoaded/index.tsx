import { useSliderButton } from "../../hooks/useSliderButton";

interface ProgressBarLoadedProps {
  className: string;
}

export const ProgressBarLoaded: React.FC<ProgressBarLoadedProps> = ({
  className,
}) => {
  const { bufferedChunks } = useSliderButton();

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
