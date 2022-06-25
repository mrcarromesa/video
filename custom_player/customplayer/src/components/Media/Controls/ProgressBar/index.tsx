import { useCallback, useEffect, useRef, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import * as MediaData from "../../dtos/MediaDataDTO";
import { ContainerProgressBar } from "./components/ContainerProgressBar";
import SliderButton from "./components/SliderButton";
import TooltipProgressTime from "./components/TooltipProgressTime";
import AppProgressBarProvider from "./hooks";
import styles from "./styles.module.scss";
import { secondsFormatTime } from "./utils/secondsFormatTime";

interface ProgressBarProps {
  mediaData: MediaData.MediaDataProps;
  bufferedChunks: MediaData.BufferedChunk[];
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  mediaData,
  bufferedChunks,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarDotRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const { position } = useMouseEvent();

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  const [hoverPlayerTimeTooltip, setHoverPlayerTimeTooltip] = useState({
    positionX: 0,
    time: "0",
  });

  const onHoverProgressBarTooltip = useCallback(() => {
    if (containerRef.current) {
      const { x, width } = containerRef.current.getBoundingClientRect();
      const positionXCalc = position.x - x;
      let positionX = positionXCalc;

      if (positionX < 0) {
        positionX = 0;
      }

      if (positionX > width) {
        positionX = width;
      }

      const mediaTimePos = (mediaData.duration * positionX) / width;
      setHoverPlayerTimeTooltip({
        positionX,
        time: secondsFormatTime(mediaTimePos),
      });
    }
  }, [position, mediaData]);

  return (
    <AppProgressBarProvider
      containerRef={containerRef}
      progressBarDotRef={progressBarDotRef}
      mediaData={mediaData}
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
        onMouseMove={onHoverProgressBarTooltip}
        onContextMenu={(e) => e.preventDefault()}
      >
        <TooltipProgressTime
          data={hoverPlayerTimeTooltip}
          className={styles.tooltip}
        />
        <ContainerProgressBar />
        <SliderButton
          ref={progressBarDotRef}
          className={styles.progressBarDot}
        />
      </div>
    </AppProgressBarProvider>
  );
};

export default ProgressBar;
