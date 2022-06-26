import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import { useProgressBar } from "../../../hooks/useProgressBar";
import { formatSeconds } from "../../../utils/formatSeconds";

interface UseHoverProgressBarTooltipProps {
  containerRef: RefObject<HTMLDivElement>;
  tooltipProgressTimeRef: RefObject<HTMLDivElement>;
}

interface UseHoverProgressBarTooltipResult {
  hoverPlayerTimeTooltip: {
    positionX: number;
    time: string;
  };
  onHoverProgressBarTooltip: () => void;
}

export const useHoverProgressBarTooltip = ({
  containerRef,
  tooltipProgressTimeRef,
}: UseHoverProgressBarTooltipProps): UseHoverProgressBarTooltipResult => {
  const { position } = useMouseEvent();
  const { mediaData, progressBarSliderButton, isHoldingSliderButton } =
    useProgressBar();

  const [hoverPlayerTimeTooltip, setHoverPlayerTimeTooltip] = useState({
    positionX: 0,
    time: "0",
  });

  const onHoverProgressBarTooltip = useCallback(() => {
    if (
      containerRef.current &&
      tooltipProgressTimeRef.current &&
      progressBarSliderButton
    ) {
      const { x: containerPositionX, width: containerWidth } =
        containerRef.current.getBoundingClientRect();

      const { width: tooltipProgressWidth } =
        tooltipProgressTimeRef.current.getBoundingClientRect();

      const positionXCalc = position.x - containerPositionX;
      let positionX = positionXCalc;

      if (positionX < 0) {
        positionX = 0;
      }

      if (positionX + 1 > containerWidth) {
        positionX = containerWidth;
      }

      const mediaTimePos =
        (mediaData.duration * positionX) /
        (containerWidth -
          progressBarSliderButton.getBoundingClientRect().width / 2);

      let positionMargin = positionX - tooltipProgressWidth / 2;

      if (positionMargin < 0) {
        positionMargin = 0;
      }

      if (positionMargin + tooltipProgressWidth > containerWidth) {
        positionMargin = containerWidth - tooltipProgressWidth;
      }

      setHoverPlayerTimeTooltip({
        positionX: positionMargin,
        time: formatSeconds(mediaTimePos),
      });
    }
  }, [
    containerRef,
    tooltipProgressTimeRef,
    position.x,
    mediaData.duration,
    progressBarSliderButton,
  ]);

  useEffect(() => {
    if (isHoldingSliderButton) {
      onHoverProgressBarTooltip();
    }
  }, [isHoldingSliderButton, onHoverProgressBarTooltip]);

  const result = useMemo(
    () => ({
      hoverPlayerTimeTooltip,
      onHoverProgressBarTooltip,
    }),
    [hoverPlayerTimeTooltip, onHoverProgressBarTooltip]
  );

  return result;
};
