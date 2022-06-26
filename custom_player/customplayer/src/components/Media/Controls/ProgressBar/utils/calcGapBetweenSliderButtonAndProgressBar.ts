interface GapToAddToResultProps {
  percentResult: number;
  gap: number;
  maxPosition: number;
}

interface GapToRemoveFromResultProps {
  percentResult: number;
  gap: number;
}

export const addGapToResult = ({
  percentResult,
  gap,
  maxPosition,
}: GapToAddToResultProps): number => {
  const fixGap = (percentResult * gap) / maxPosition;
  return percentResult + fixGap;
};

export const removeGapFromResult = ({
  percentResult,
  gap,
}: GapToRemoveFromResultProps): number => {
  const fixGap = (percentResult * gap) / 100;
  return percentResult - fixGap;
};
