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

import { calcMaxPercentPositionGrabButton } from "../utils/calcMaxPercentPositionGrabButton";
import {
  fixGapFromGrabButton,
  fixGapToGrabButton,
} from "../utils/fixGrabButtonPosition";

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
  positionProgressGrabButton: number;
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

  const maxPositionProgressGrabButton = useRef(0);
  const gapGrabButton = useRef(0);
  const isSeeking = useRef(false);
  const videoDataRef = useRef<VideoDataProps.VideoDataProps>(videoData);

  const [positionProgressGrabButton, setPositionProgressGrabButton] =
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
    maxPositionProgressGrabButton.current = calcMaxPercentPositionGrabButton({
      buttonWidth: buttonPxWidth,
      containerWidth,
    });
    gapGrabButton.current = 100 - maxPositionProgressGrabButton.current;
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
      fixGapFromGrabButton({
        gapGrabButton: gapGrabButton.current,
        maxPositionProgressGrabButton: maxPositionProgressGrabButton.current,
        percentResult: positionProgressGrabButton,
      }) || 0
    );
  }, [positionProgressGrabButton, dimensions]);

  const handleGoToPositionInProgressBar = useCallback(
    (elementWidth = 0) => {
      if (containerRef.current && videoDataRef.current.duration > 0) {
        const { x, width } = containerRef.current.getBoundingClientRect();

        // add to lib
        const positionX = position.x - x - elementWidth;

        let percentResult = (positionX / width) * 100;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= maxPositionProgressGrabButton.current) {
          percentResult = maxPositionProgressGrabButton.current;
        }
        // /add to lib

        const fixedPosition = fixGapFromGrabButton({
          gapGrabButton: gapGrabButton.current,
          maxPositionProgressGrabButton: maxPositionProgressGrabButton.current,
          percentResult,
        });
        setPositionProgressGrabButton(percentResult);

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

      const realPosition = fixGapToGrabButton({
        gapGrabButton: gapGrabButton.current,
        percentResult,
      });
      setPositionProgressGrabButton(realPosition);
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
      positionProgressGrabButton,
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
      positionProgressGrabButton,
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
