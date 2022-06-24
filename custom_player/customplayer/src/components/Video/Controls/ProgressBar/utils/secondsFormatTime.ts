export const secondsFormatTime = (seconds: number): string => {
  if (seconds > 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 16);
  }
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};
