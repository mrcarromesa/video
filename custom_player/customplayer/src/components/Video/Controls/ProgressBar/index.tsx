import { useRef, useEffect, useState, useCallback } from "react";

import { useVideo, VideoDataProps } from "src/components/Video/hooks/useVideo";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";
import GrabButton from "./GrabButton";
import Played from "./Played";

import styles from "./styles.module.scss";

const ProgressBar: React.FC = () => {
  const {
    videoData,
    windowIsMouseDown,
    mousePosition,
    windowDimensions,
    setVideoPosition,
  } = useVideo();

  const { isMobile } = useWindowResize();

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarDotRef = useRef<HTMLDivElement>(null);

  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);
  const [maxPositionProgressBarDog, setMaxPositionProgressBarDog] = useState(0);

  const [hoverPlayerPreview, setHoverPlayerPreview] = useState(0);

  const [isPressed, setIsPressed] = useState(false);

  const [isReady, setIsReady] = useState(false);

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
    if (!windowIsMouseDown) {
      setIsPressed(false);
    }
  }, [windowIsMouseDown]);

  useEffect(() => {
    if (isPressed && containerRef.current && progressBarDotRef.current) {
      const position = mousePosition;

      const { offsetLeft, offsetWidth } = containerRef.current;
      const { clientWidth: elementOffsetWidth } = progressBarDotRef.current;

      const buttonPositionX = position.x - offsetLeft - elementOffsetWidth / 2;

      let percentResult = (buttonPositionX / offsetWidth) * 100;

      if (percentResult < 0) {
        percentResult = 0;
      }

      if (percentResult >= maxPositionProgressBarDog) {
        percentResult = 100;
      }

      setPositionProgressPlayed(percentResult);
    }
  }, [isPressed, mousePosition, maxPositionProgressBarDog]);


  const onHoverProgressBarPreview = useCallback(() => {
    if (containerRef.current) {
      const position = mousePosition;
      const { offsetLeft, offsetWidth } = containerRef.current;

      const positionX = position.x - offsetLeft;

      let percentResult = (positionX / offsetWidth);

      setHoverPlayerPreview(percentResult);

    }
  }, [mousePosition]);

  const handleGoToPositionInProgressBar = useCallback(() => {
    if (containerRef.current && progressBarDotRef.current) {
      const position = mousePosition;
      const { offsetLeft, offsetWidth } = containerRef.current;

      const buttonPositionX = position.x - offsetLeft;

      let percentResult = (buttonPositionX / offsetWidth) * 100;

      if (percentResult < 0) {
        percentResult = 0;
      }

      if (percentResult >= maxPositionProgressBarDog) {
        percentResult = 100;
      }

      setPositionProgressPlayed(percentResult);
    }
  }, [maxPositionProgressBarDog, mousePosition]);

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
        onClick={handleGoToPositionInProgressBar}
        onMouseDown={(e) => {
          console.log('aqui...');
          setIsPressed(true);
        }}
      >
        <div className={styles.progressBarBackground}></div>
        <div
          className={styles.progressBarLoaded}
          style={{
            width: "50%",
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
          className={styles.progressBarPlayed}
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
