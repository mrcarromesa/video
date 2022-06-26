interface CalcMediaPositionPercentProps {
  currentTime: number;
  duration: number;
}

export const calcMediaPositionPercent = ({
  currentTime,
  duration,
}: CalcMediaPositionPercentProps): number => {
  let percentResult = (currentTime * 100) / duration;

  if (percentResult < 0) {
    percentResult = 0;
  }

  if (percentResult >= 100) {
    percentResult = 100;
  }

  return percentResult;
};
