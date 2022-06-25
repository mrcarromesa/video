export interface BufferedChunk {
  start: number;
  end: number;
  range: number;
}

export interface MediaDataProps {
  duration: number;
  currentTime: number;
}
