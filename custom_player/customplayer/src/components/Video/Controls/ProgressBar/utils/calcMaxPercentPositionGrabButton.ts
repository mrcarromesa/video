interface CalcMaxPercentPositionGrabButtonProps {
  buttonWidth: number;
  containerWidth: number;
}

export const calcMaxPercentPositionGrabButton = ({
  buttonWidth,
  containerWidth,
}: CalcMaxPercentPositionGrabButtonProps): number => {
  const buttonPercentWidth = buttonWidth * 100;
  const maxPercentage = 100 - buttonPercentWidth / containerWidth;
  return Math.abs(maxPercentage);
};
