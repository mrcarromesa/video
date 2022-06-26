import { useEffect, useRef, useState } from "react";

import * as MediaData from "../../dtos/MediaDataDTO";
import { Container } from "./components/Container";
import AppProgressBarProvider from "./hooks";

interface ProgressBarProps {
  mediaData: MediaData.MediaDataProps;
  bufferedChunks: MediaData.BufferedChunk[];
  onSeek: (time: number) => void;
  onSeekStart: (time: number) => void;
  onSeekEnd: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  mediaData,
  bufferedChunks,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) => {
  const containerProgressBarRef = useRef<HTMLDivElement>(null);
  const progressBarSliderButtonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (containerProgressBarRef.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <AppProgressBarProvider
      containerProgressBar={containerProgressBarRef.current}
      progressBarSliderButton={progressBarSliderButtonRef.current}
      mediaData={mediaData}
      bufferedChunks={bufferedChunks}
      onSeek={onSeek}
      onSeekStart={onSeekStart}
      onSeekEnd={onSeekEnd}
    >
      <Container
        ref={containerProgressBarRef}
        isReady={isReady}
        progressBarSliderButtonRef={progressBarSliderButtonRef}
      />
    </AppProgressBarProvider>
  );
};

export default ProgressBar;
