import debounce from "lodash/debounce";
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as VideoDataProps from "src/components/Video/dtos/VideoDataPropsDTO";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { calcMaxPercentPositionSliderButton } from "../utils/calcMaxPercentPositionSliderButton";
import {
  fixGapFromSliderButton,
  fixGapToSliderButton,
} from "../utils/fixSliderButtonPosition";

export interface ProgressBarProviderProps {
  children: ReactNode;
  videoData: VideoDataProps.VideoDataProps;
  bufferedChunks: VideoDataProps.BufferedChunk[];
  containerRef: RefObject<HTMLDivElement>;
  progressBarDotRef: RefObject<HTMLDivElement>;
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

interface ProgressBarContextData {
  isHoldingSliderButton: boolean;
  positionProgressPlayed: number;
  positionProgressSliderButton: number;
  videoData: VideoDataProps.VideoDataProps;
  bufferedChunks: VideoDataProps.BufferedChunk[];
  handleHoldSliderButton: () => void;
  handleGoToPositionInProgressBar: () => void;
}

const ProgressBarContext = createContext<ProgressBarContextData>(
  {} as ProgressBarContextData
);

const WAIT_RELEASE_SLIDER_MILLISECONDS = 10;

export const ProgressBarProvider: React.FC<ProgressBarProviderProps> = ({
  containerRef,
  progressBarDotRef,
  videoData,
  bufferedChunks,
  children,
  onSeek,
  onSeekEnd,
  onSeekStart,
}) => {
  const { isMouseDown, position } = useMouseEvent();
  const { dimensions } = useWindowResize();

  const maxPositionProgressSliderButton = useRef(0);
  const gapSliderButton = useRef(0);
  const isSeeking = useRef(false);
  const videoDataRef = useRef<VideoDataProps.VideoDataProps>(videoData);

  const [positionProgressSliderButton, setPositionProgressSliderButton] =
    useState(0);
  const [isHoldingSliderButton, setIsHoldingSliderButton] = useState(false);
  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);

  useEffect(() => {
    videoDataRef.current = videoData;
  }, [videoData]);

  useEffect(() => {
    const buttonPxWidth = progressBarDotRef.current?.clientWidth || 1;
    const containerWidth =
      containerRef.current?.getBoundingClientRect().width || 1;
    maxPositionProgressSliderButton.current =
      calcMaxPercentPositionSliderButton({
        buttonWidth: buttonPxWidth,
        containerWidth,
      });
    gapSliderButton.current = 100 - maxPositionProgressSliderButton.current;
  }, [containerRef, dimensions, progressBarDotRef]);

  useEffect(() => {
    if (!isMouseDown && isSeeking.current) {
      setIsHoldingSliderButton(false);
      onSeekEnd();
      debounce(() => {
        isSeeking.current = false;
      }, WAIT_RELEASE_SLIDER_MILLISECONDS)();
    }
  }, [isMouseDown, onSeekEnd]);

  useEffect(() => {
    setPositionProgressPlayed(
      fixGapFromSliderButton({
        gapSliderButton: gapSliderButton.current,
        maxPositionProgressSliderButton:
          maxPositionProgressSliderButton.current,
        percentResult: positionProgressSliderButton,
      }) || 0
    );
  }, [positionProgressSliderButton, dimensions]);

  const handleGoToPositionInProgressBar = useCallback(
    (elementWidth = 0) => {
      if (containerRef.current && videoDataRef.current.duration > 0) {
        const { x, width } = containerRef.current.getBoundingClientRect();

        const positionX = position.x - x - elementWidth;

        let percentResult = (positionX / width) * 100;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= maxPositionProgressSliderButton.current) {
          percentResult = maxPositionProgressSliderButton.current;
        }

        const fixedPosition = fixGapFromSliderButton({
          gapSliderButton: gapSliderButton.current,
          maxPositionProgressSliderButton:
            maxPositionProgressSliderButton.current,
          percentResult,
        });
        setPositionProgressSliderButton(percentResult);

        const videoNewPos =
          (videoDataRef.current.duration * fixedPosition) / 100;

        onSeek(videoNewPos);
      }
    },
    [containerRef, position.x, onSeek]
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

      const realPosition = fixGapToSliderButton({
        gapSliderButton: gapSliderButton.current,
        percentResult,
      });
      setPositionProgressSliderButton(realPosition);
    }
  }, [videoData, containerRef]);

  useEffect(() => {
    if (isHoldingSliderButton && progressBarDotRef.current) {
      onSeekStart();
      isSeeking.current = true;
      const { clientWidth: elementOffsetWidth } = progressBarDotRef.current;
      handleGoToPositionInProgressBar(elementOffsetWidth / 2);
    }
  }, [
    isHoldingSliderButton,
    handleGoToPositionInProgressBar,
    onSeekStart,
    progressBarDotRef,
  ]);

  const handleHoldSliderButton = useCallback(() => {
    setIsHoldingSliderButton(true);
  }, []);

  const result: ProgressBarContextData = useMemo(
    () => ({
      positionProgressSliderButton,
      positionProgressPlayed,
      handleGoToPositionInProgressBar,
      handleHoldSliderButton,
      isHoldingSliderButton,
      videoData,
      bufferedChunks,
    }),
    [
      bufferedChunks,
      handleGoToPositionInProgressBar,
      handleHoldSliderButton,
      isHoldingSliderButton,
      positionProgressSliderButton,
      positionProgressPlayed,
      videoData,
    ]
  );

  return (
    <ProgressBarContext.Provider value={result}>
      {children}
    </ProgressBarContext.Provider>
  );
};

export const useProgressBar = (): ProgressBarContextData => {
  const context = useContext(ProgressBarContext);

  if (!context) {
    throw new Error("useProgressBar must be used within a ProgressBarProvider");
  }

  return context;
};
