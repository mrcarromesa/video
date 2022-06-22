import debounce from "lodash/debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { ContainerProgressBar } from "./components/ContainerProgressBar";
import GrabButton from "./components/GrabButton";
import styles from "./styles.module.scss";

interface VideoDataProps {
  duration: number;
  currentTime: number;
  bufferPercent: number;
}

interface ProgressBarProps {
  videoData: VideoDataProps;
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  videoData,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) => {
  const { isMouseDown, position } = useMouseEvent();
  const { isMobile, dimensions } = useWindowResize();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarDotRef = useRef<HTMLDivElement>(null);
  const maxPositionProgressGrabButton = useRef(0);
  const gapGrabButton = useRef(0);
  const isSeeking = useRef(false);
  const videoDataRef = useRef<VideoDataProps>(videoData);

  const [positionProgressGrabButton, setPositionProgressGrabButton] =
    useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);

  useEffect(() => {
    videoDataRef.current = videoData;
  }, [videoData]);

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const buttonPxWidth = progressBarDotRef.current?.clientWidth || 1;
    const containerWidth =
      containerRef.current?.getBoundingClientRect().width || 1;
    const buttonPercentWidth = buttonPxWidth * 100;
    const maxPercentage = 100 - buttonPercentWidth / containerWidth;
    maxPositionProgressGrabButton.current = Math.abs(maxPercentage);
    gapGrabButton.current = 100 - maxPositionProgressGrabButton.current;
  }, [dimensions]);

  useEffect(() => {
    if (!isMouseDown && isSeeking.current) {
      setIsPressed(false);
      onSeekEnd();
      debounce(() => {
        isSeeking.current = false;
      }, 5)();
    }
  }, [isMouseDown, onSeekEnd]);

  const fixGapFromGrabButton = useCallback((percentResult: number): number => {
    const fixGap =
      (percentResult * gapGrabButton.current) /
      maxPositionProgressGrabButton.current;
    return percentResult + fixGap;
  }, []);

  const fixGapToGrabButton = useCallback((percentResult: number): number => {
    const fixGap = (percentResult * gapGrabButton.current) / 100;
    return percentResult - fixGap;
  }, []);

  useEffect(() => {
    setPositionProgressPlayed(
      fixGapFromGrabButton(positionProgressGrabButton) || 0
    );
  }, [positionProgressGrabButton, fixGapFromGrabButton, dimensions]);

  const handleGoToPositionInProgressBar = useCallback(
    (elementWidth = 0) => {
      if (containerRef.current) {
        const { x, width } = containerRef.current.getBoundingClientRect();

        const positionX = position.x - x - elementWidth;

        let percentResult = (positionX / width) * 100;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= maxPositionProgressGrabButton.current) {
          percentResult = maxPositionProgressGrabButton.current;
        }

        const fixedPosition = fixGapFromGrabButton(percentResult);
        setPositionProgressGrabButton(percentResult);

        const videoNewPos =
          (videoDataRef.current.duration * fixedPosition) / 100;

        onSeek(videoNewPos);
      }
    },
    [position, onSeek, fixGapFromGrabButton]
  );

  useEffect(() => {
    if (!isSeeking.current && containerRef.current) {
      let percentResult = (videoData.currentTime * 100) / videoData.duration;

      if (percentResult < 0) {
        percentResult = 0;
      }

      if (percentResult >= 100) {
        percentResult = 100;
      }

      const realPosition = fixGapToGrabButton(percentResult);
      setPositionProgressGrabButton(realPosition);
    }
  }, [videoData, fixGapToGrabButton]);

  useEffect(() => {
    if (isPressed && progressBarDotRef.current) {
      onSeekStart();
      isSeeking.current = true;
      const { clientWidth: elementOffsetWidth } = progressBarDotRef.current;
      handleGoToPositionInProgressBar(elementOffsetWidth / 2);
    }
  }, [isPressed, handleGoToPositionInProgressBar, onSeekStart]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        visibility: isReady ? "visible" : "hidden",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ContainerProgressBar
        videoData={videoData}
        isPressed={isPressed}
        positionProgressPlayed={positionProgressPlayed}
        onClick={handleGoToPositionInProgressBar}
        onMouseDown={() => setIsPressed(true)}
      />
      <GrabButton
        ref={progressBarDotRef}
        className={`
          ${styles.progressBarDot} 
          ${isPressed ? styles.grabbing : ""}
          ${isMobile ? styles.isMobile : ""}
        `}
        onMouseDown={() => {
          setIsPressed(true);
        }}
        positionX={positionProgressGrabButton}
      />
    </div>
  );
};

export default ProgressBar;
