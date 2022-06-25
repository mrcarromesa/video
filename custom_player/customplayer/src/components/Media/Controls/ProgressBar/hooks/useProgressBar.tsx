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
import * as MediaData from "src/components/Media/dtos/MediaDataDTO";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { calcMaxPercentPositionSliderButton } from "../utils/calcMaxPercentPositionSliderButton";
import {
  fixGapFromSliderButton,
  fixGapToSliderButton,
} from "../utils/fixSliderButtonPosition";

export interface ProgressBarProviderProps {
  children: ReactNode;
  mediaData: MediaData.MediaDataProps;
  bufferedChunks: MediaData.BufferedChunk[];
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
  mediaData: MediaData.MediaDataProps;
  bufferedChunks: MediaData.BufferedChunk[];
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
  mediaData,
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
  const mediaDataRef = useRef<MediaData.MediaDataProps>(mediaData);

  const [positionProgressSliderButton, setPositionProgressSliderButton] =
    useState(0);
  const [isHoldingSliderButton, setIsHoldingSliderButton] = useState(false);
  const [positionProgressPlayed, setPositionProgressPlayed] = useState(0);

  useEffect(() => {
    mediaDataRef.current = mediaData;
  }, [mediaData]);

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
      if (containerRef.current && mediaDataRef.current.duration > 0) {
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

        const mediaNewPos =
          (mediaDataRef.current.duration * fixedPosition) / 100;

        onSeek(mediaNewPos);
      }
    },
    [containerRef, position.x, onSeek]
  );

  useEffect(() => {
    if (!isSeeking.current && containerRef.current) {
      let percentResult = (mediaData.currentTime * 100) / mediaData.duration;

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
  }, [mediaData, containerRef]);

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
      mediaData,
      bufferedChunks,
    }),
    [
      bufferedChunks,
      handleGoToPositionInProgressBar,
      handleHoldSliderButton,
      isHoldingSliderButton,
      positionProgressSliderButton,
      positionProgressPlayed,
      mediaData,
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
