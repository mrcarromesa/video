interface GapToAddToResultProps {
  percentResult: number;
  gapSliderButton: number;
  maxPositionProgressSliderButton: number;
}

interface GapToRemoveFromResultProps {
  percentResult: number;
  gapSliderButton: number;
}

export const addGapToResult = ({
  percentResult,
  gapSliderButton,
  maxPositionProgressSliderButton,
}: GapToAddToResultProps): number => {
  const fixGap =
    (percentResult * gapSliderButton) / maxPositionProgressSliderButton;
  return percentResult + fixGap;
};

export const removeGapFromResult = ({
  percentResult,
  gapSliderButton,
}: GapToRemoveFromResultProps): number => {
  const fixGap = (percentResult * gapSliderButton) / 100;
  return percentResult - fixGap;
};
