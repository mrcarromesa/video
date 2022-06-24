interface FixGapFromGrabButtonProps {
  percentResult: number;
  gapGrabButton: number;
  maxPositionProgressGrabButton: number;
}

interface FixGapToGrabButtonProps {
  percentResult: number;
  gapGrabButton: number;
}

export const fixGapFromGrabButton = ({
  percentResult,
  gapGrabButton,
  maxPositionProgressGrabButton,
}: FixGapFromGrabButtonProps): number => {
  const fixGap =
    (percentResult * gapGrabButton) / maxPositionProgressGrabButton;
  return percentResult + fixGap;
};

export const fixGapToGrabButton = ({
  percentResult,
  gapGrabButton,
}: FixGapToGrabButtonProps): number => {
  const fixGap = (percentResult * gapGrabButton) / 100;
  return percentResult - fixGap;
};
