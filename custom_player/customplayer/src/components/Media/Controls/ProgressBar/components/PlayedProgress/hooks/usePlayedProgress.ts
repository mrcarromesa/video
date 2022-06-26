import { useEffect, useMemo, useState } from "react";

import { useSliderButton } from "../../../hooks/useSliderButton";
import { addGapToResult } from "../../../utils/calcGapBetweenSliderButtonAndProgressBar";

interface UsePlayedProgressResult {
  positionProgressPlayed: number;
}

export const usePlayedProgress = (): UsePlayedProgressResult => {
  const {
    gapSliderButton,
    maxPositionProgressSliderButton,
    positionProgressSliderButton,
  } = useSliderButton();
  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);

  useEffect(() => {
    setPositionProgressPlayed(
      addGapToResult({
        gap: gapSliderButton,
        maxPosition: maxPositionProgressSliderButton,
        percentResult: positionProgressSliderButton,
      }) || 0
    );
  }, [
    gapSliderButton,
    maxPositionProgressSliderButton,
    positionProgressSliderButton,
  ]);

  const result = useMemo(
    () => ({ positionProgressPlayed }),
    [positionProgressPlayed]
  );

  return result;
};
