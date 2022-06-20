import { useRef, useEffect, useState, useCallback } from "react";

import { useVideo, VideoDataProps } from "src/components/Video/hooks/useVideo";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";
import GrabButton from "./GrabButton";
import Played from "./Played";

import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";

import styles from "./styles.module.scss";

const ProgressBar: React.FC = () => {
  const {
    videoData,
    setVideoPosition,
    setIsChanging,
    buffered,
  } = useVideo();
  const { isMouseDown, position } = useMouseEvent();
  const { isMobile } = useWindowResize();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarDotRef = useRef<HTMLDivElement>(null);

  const videoDataRef = useRef<VideoDataProps>(videoData);

  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);
  const [maxPositionProgressBarDog, setMaxPositionProgressBarDog] = useState(0);
  const [hoverPlayerPreview, setHoverPlayerPreview] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isReady, setIsReady] = useState(false);

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
    const screenWidth = containerRef.current?.clientWidth || 1;
    const buttonPercentWidth = buttonPxWidth * 100;
    const maxPercentage = 100 - buttonPercentWidth / screenWidth;
    setMaxPositionProgressBarDog(maxPercentage);
  }, []);

  useEffect(() => {
    if (!isMouseDown) {
      setIsPressed(false);
      setIsChanging(false);
    }
  }, [isMouseDown, setIsChanging]);

  const handleGoToPositionInProgressBar = useCallback((elementWidth = 0) => {
    if (containerRef.current) {
      const { offsetLeft, offsetWidth } = containerRef.current;

      const buttonPositionX = position.x - offsetLeft - elementWidth;

      let percentResult = (buttonPositionX / offsetWidth) * 100;

      if (percentResult < 0) {
        percentResult = 0;
      }

      if (percentResult >= maxPositionProgressBarDog) {
        percentResult = 100;
      }

      setPositionProgressPlayed(percentResult);

      const videoNewPos = videoDataRef.current.duration * percentResult / 100;

      setVideoPosition(videoNewPos);
    }
  }, [maxPositionProgressBarDog, position, setVideoPosition]);

  useEffect(() => {
    if (containerRef.current) {

      let percentResult = (videoData.currentTime * 100) / videoData.duration;
      console.log('percentResult', videoData.currentTime, videoData.duration);

      if (percentResult < 0) {
        percentResult = 0;
      }

      if (percentResult >= maxPositionProgressBarDog) {
        percentResult = 100;
      }

      setPositionProgressPlayed(percentResult);
    }
  }, [maxPositionProgressBarDog, videoData]);

  useEffect(() => {
    if (isPressed && progressBarDotRef.current) {
      setIsChanging(true);
      const { clientWidth: elementOffsetWidth } = progressBarDotRef.current;
      handleGoToPositionInProgressBar(elementOffsetWidth / 2);
    }
  }, [isPressed, handleGoToPositionInProgressBar, setIsChanging]);

  const onHoverProgressBarPreview = useCallback(() => {
    if (containerRef.current) {
      const { offsetLeft, offsetWidth } = containerRef.current;
      const positionX = position.x - offsetLeft;
      const percentResult = (positionX / offsetWidth);
      setHoverPlayerPreview(percentResult);
    }
  }, [position]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        visibility: isReady ? "visible" : "hidden",
      }}
      onContextMenu={(e)=> e.preventDefault()}
      onMouseMove={() => {
        onHoverProgressBarPreview()
      }}
    >
      <div 
        className={styles.progressBar}
        onClick={() => handleGoToPositionInProgressBar()}
        onMouseDown={(e) => {
          setIsPressed(true);
        }}
      >
        <div className={styles.progressBarBackground}></div>
        <div
          className={styles.progressBarLoaded}
          style={{
            width: `${buffered}%`,
          }}
        ></div>
        <div
          className={styles.progressBarPreview}
          style={{ 
            visibility: !isMobile ? "visible" : "hidden",
            transform: `scaleX(${hoverPlayerPreview})` 
          }}
        ></div>
        <Played 
          className={`
            ${styles.progressBarPlayed}
            ${!isPressed ? styles.isNotGrabbing : ""}
          `}
          seekPositionX={positionProgressPlayed}
        />
      </div>
      <GrabButton 
        ref={progressBarDotRef}
        className={`
          ${styles.progressBarDot} 
          ${isPressed ? styles.grabbing : ""}
          ${isMobile ? styles.isMobile : ""}
        `}
        onMouseDown={(e) => {
          setIsPressed(true);
        }}
        containerRef={containerRef}
        positionX={positionProgressPlayed}
      />
    </div>
  );
};

export default ProgressBar;
