import { useEffect, useRef, useState } from "react";

import * as VideoDataProps from "../../dtos/VideoDataPropsDTO";
import { ContainerProgressBar } from "./components/ContainerProgressBar";
import GrabButton from "./components/GrabButton";
import AppProgressBarProvider from "./hooks";
import styles from "./styles.module.scss";

interface ProgressBarProps {
  videoData: VideoDataProps.VideoDataProps;
  bufferedChunks: VideoDataProps.BufferedChunk[];
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  videoData,
  bufferedChunks,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarDotRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  return (
    <AppProgressBarProvider
      containerRef={containerRef}
      progressBarDotRef={progressBarDotRef}
      videoData={videoData}
      bufferedChunks={bufferedChunks}
      onSeek={onSeek}
      onSeekStart={onSeekStart}
      onSeekEnd={onSeekEnd}
    >
      <div
        ref={containerRef}
        className={styles.container}
        style={{
          visibility: isReady ? "visible" : "hidden",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ContainerProgressBar />
        <GrabButton ref={progressBarDotRef} className={styles.progressBarDot} />
      </div>
    </AppProgressBarProvider>
  );
};

export default ProgressBar;
