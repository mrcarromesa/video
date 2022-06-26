import { RefObject, useCallback, useMemo, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

interface UseHoverProgressBarPreviewProps {
  containerRef: RefObject<HTMLDivElement>;
}

interface UseHoverProgressBarPreviewResult {
  hoverPlayerPreviewPositionX: number;
  onHoverProgressBarPreview: () => void;
}

export const useHoverProgressBarPreview = ({
  containerRef,
}: UseHoverProgressBarPreviewProps): UseHoverProgressBarPreviewResult => {
  const { position } = useMouseEvent();

  const [hoverPlayerPreviewPositionX, setHoverPlayerPreviewPositionX] =
    useState(0);

  const onHoverProgressBarPreview = useCallback(() => {
    if (containerRef.current) {
      const { x, width } = containerRef.current.getBoundingClientRect();
      const positionX = position.x - x;
      const percentResult = positionX / width;
      setHoverPlayerPreviewPositionX(percentResult);
    }
  }, [containerRef, position]);

  const result = useMemo(
    () => ({
      hoverPlayerPreviewPositionX,
      onHoverProgressBarPreview,
    }),
    [hoverPlayerPreviewPositionX, onHoverProgressBarPreview]
  );

  return result;
};
