import { useRef } from "react";

import { useSliderButton } from "../../hooks/useSliderButton";
import { LineHoverProgress } from "../LineHoverProgress";
import { PlayedProgress } from "../PlayedProgress";
import { ProgressBarLoaded } from "../ProgressBarLoaded";
import { useHoverProgressBarPreview } from "./hooks/useHoverProgressBarPreview";
import styles from "./styles.module.scss";

export const ContentProgressBar: React.FC = () => {
  const {
    isHoldingSliderButton,
    handleHoldSliderButton,
    handleGoToPositionInProgressBar,
  } = useSliderButton();

  const containerRef = useRef<HTMLDivElement>(null);
  const { hoverPlayerPreviewPositionX, onHoverProgressBarPreview } =
    useHoverProgressBarPreview({
      containerRef,
    });

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
        positionX={hoverPlayerPreviewPositionX}
      />
      <PlayedProgress
        className={`
            ${styles.progressBarPlayed}
            ${!isHoldingSliderButton ? styles.isNotGrabbing : ""}
          `}
      />
    </div>
  );
};
