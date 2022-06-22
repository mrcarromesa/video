import { useCallback, useRef, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import { LineHoverProgress } from "../LineHoverProgress";
import { PlayedProgress } from "../PlayedProgress";
import { ProgressBarLoaded } from "../ProgressBarLoaded";
import styles from "./styles.module.scss";

interface ContainerProgressBarProps {
  // to hook
  videoData: {
    bufferPercent: number;
  };
  isPressed: boolean;
  positionProgressPlayed: number;
  // /to hook

  onMouseDown: () => void;
  onClick: () => void;
}

export const ContainerProgressBar: React.FC<ContainerProgressBarProps> = ({
  videoData,
  isPressed,
  positionProgressPlayed,
  onMouseDown,
  onClick,
}) => {
  const { position } = useMouseEvent();

  const containerRef = useRef<HTMLDivElement>(null);

  const [hoverPlayerPreview, setHoverPlayerPreview] = useState(0);

  const onHoverProgressBarPreview = useCallback(() => {
    if (containerRef.current) {
      const { x, width } = containerRef.current.getBoundingClientRect();
      const positionX = position.x - x;
      const percentResult = positionX / width;
      setHoverPlayerPreview(percentResult);
    }
  }, [position]);

  return (
    <div
      ref={containerRef}
      className={styles.progressBar}
      onClick={onClick}
      onMouseMove={() => {
        onHoverProgressBarPreview();
      }}
      onMouseDown={onMouseDown}
    >
      <ProgressBarLoaded
        className={styles.progressBarLoaded}
        loadedPercent={videoData.bufferPercent}
      />
      <LineHoverProgress
        className={styles.progressBarPreview}
        positionX={hoverPlayerPreview}
      />
      <PlayedProgress
        className={`
            ${styles.progressBarPlayed}
            ${!isPressed ? styles.isNotGrabbing : ""}
          `}
        seekPositionX={positionProgressPlayed}
      />
    </div>
  );
};
