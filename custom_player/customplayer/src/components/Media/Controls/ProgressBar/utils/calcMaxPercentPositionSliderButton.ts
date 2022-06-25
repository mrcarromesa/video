interface CalcMaxPercentPositionSliderButtonProps {
  buttonWidth: number;
  containerWidth: number;
}

export const calcMaxPercentPositionSliderButton = ({
  buttonWidth,
  containerWidth,
}: CalcMaxPercentPositionSliderButtonProps): number => {
  const buttonPercentWidth = buttonWidth * 100;
  const maxPercentage = 100 - buttonPercentWidth / containerWidth;
  return Math.abs(maxPercentage);
};
