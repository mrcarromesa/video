export const formatSeconds = (seconds: number): string => {
  const parseSeconds = Math.floor(seconds || 0);
  if (parseSeconds > 3600) {
    return new Date(parseSeconds * 1000).toISOString().substring(11, 16);
  }
  return new Date(parseSeconds * 1000).toISOString().substring(14, 19);
};
