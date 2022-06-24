export interface BufferedChunk {
  start: number;
  end: number;
  range: number;
}

export interface VideoDataProps {
  duration: number;
  currentTime: number;
}
