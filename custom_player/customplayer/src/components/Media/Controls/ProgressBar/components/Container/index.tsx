import { forwardRef, RefObject, useRef } from "react";

import { useSliderButton } from "../../hooks/useSliderButton";
import { ContentProgressBar } from "../ContentProgressBar";
import { SliderButton } from "../SliderButton";
import { TooltipProgressTime } from "../TooltipProgressTime";
import { useHoverProgressBarTooltip } from "./hooks/useHoverProgressBarTooltip";
import styles from "./styles.module.scss";

interface ContainerProps {
  isReady: boolean;
  progressBarSliderButtonRef: RefObject<HTMLDivElement>;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ isReady, progressBarSliderButtonRef }, ref) => {
    const tooltipProgressTimeRef = useRef<HTMLDivElement>(null);

    const { isHoldingSliderButton } = useSliderButton();
    const { hoverPlayerTimeTooltip, onHoverProgressBarTooltip } =
      useHoverProgressBarTooltip({
        containerRef: ref as RefObject<HTMLDivElement>,
        tooltipProgressTimeRef,
      });

    return (
      <div
        ref={ref}
        className={`${styles.container} ${
          isHoldingSliderButton ? styles.isHoldingSliderButton : ""
        }`}
        style={{
          visibility: isReady ? "visible" : "hidden",
        }}
        onMouseMove={onHoverProgressBarTooltip}
        onContextMenu={(e) => e.preventDefault()}
      >
        <TooltipProgressTime
          ref={tooltipProgressTimeRef}
          data={hoverPlayerTimeTooltip}
          className={styles.tooltip}
        />
        <ContentProgressBar />
        <SliderButton
          ref={progressBarSliderButtonRef}
          className={styles.sliderButton}
        />
      </div>
    );
  }
);

Container.displayName = "Container";
