import { useCallback, useRef, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import { useProgressBar } from "../../hooks/useProgressBar";
import { LineHoverProgress } from "../LineHoverProgress";
import { PlayedProgress } from "../PlayedProgress";
import { ProgressBarLoaded } from "../ProgressBarLoaded";
import styles from "./styles.module.scss";

export const ContainerProgressBar: React.FC = () => {
  const {
    isHoldingSliderButton,
    handleHoldSliderButton,
    positionProgressPlayed,
    handleGoToPositionInProgressBar,
  } = useProgressBar();

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
      onClick={handleGoToPositionInProgressBar}
      onMouseMove={() => {
        onHoverProgressBarPreview();
      }}
      onMouseDown={handleHoldSliderButton}
    >
      <ProgressBarLoaded className={styles.progressBarLoaded} />
      <LineHoverProgress
        className={styles.progressBarPreview}
        positionX={hoverPlayerPreview}
      />
      <PlayedProgress
        className={`
            ${styles.progressBarPlayed}
            ${!isHoldingSliderButton ? styles.isNotGrabbing : ""}
          `}
        seekPositionX={positionProgressPlayed}
      />
    </div>
  );
};
