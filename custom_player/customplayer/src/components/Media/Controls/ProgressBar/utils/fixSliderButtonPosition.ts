interface FixGapFromSliderButtonProps {
  percentResult: number;
  gapSliderButton: number;
  maxPositionProgressSliderButton: number;
}

interface FixGapToSliderButtonProps {
  percentResult: number;
  gapSliderButton: number;
}

export const fixGapFromSliderButton = ({
  percentResult,
  gapSliderButton,
  maxPositionProgressSliderButton,
}: FixGapFromSliderButtonProps): number => {
  const fixGap =
    (percentResult * gapSliderButton) / maxPositionProgressSliderButton;
  return percentResult + fixGap;
};

export const fixGapToSliderButton = ({
  percentResult,
  gapSliderButton,
}: FixGapToSliderButtonProps): number => {
  const fixGap = (percentResult * gapSliderButton) / 100;
  return percentResult - fixGap;
};
