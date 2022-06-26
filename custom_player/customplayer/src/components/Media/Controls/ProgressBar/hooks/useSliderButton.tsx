import { debounce } from "lodash";
import {
  createContext,
  ReactNode,
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

import {
  addGapToResult,
  removeGapFromResult,
} from "../utils/calcGapBetweenSliderButtonAndProgressBar";
import { calcMaxPercentPositionSliderButton } from "../utils/calcMaxPercentPositionSliderButton";
import { calcMediaPositionPercent } from "../utils/calcMediaPositionPercent";

export interface SliderButtonProviderProps {
  bufferedChunks: MediaData.BufferedChunk[];
  children: ReactNode;
  containerProgressBar: HTMLDivElement | null;
  mediaData: MediaData.MediaDataProps;
  progressBarSliderButton: HTMLDivElement | null;
  onSeek: (time: number) => void;
  onSeekEnd: (time: number) => void;
  onSeekStart: (time: number) => void;
}
interface SliderButtonContextData {
  bufferedChunks: MediaData.BufferedChunk[];
  gapSliderButton: number;
  isHoldingSliderButton: boolean;
  maxPositionProgressSliderButton: number;
  mediaData: MediaData.MediaDataProps;
  positionProgressSliderButton: number;
  progressBarSliderButton: HTMLDivElement | null;
  handleGoToPositionInProgressBar: () => void;
  handleHoldSliderButton: () => void;
}

const WAIT_RELEASE_SLIDER_MILLISECONDS = 10;

const SliderButtonContext = createContext<SliderButtonContextData>(
  {} as SliderButtonContextData
);

export const SliderButtonProvider: React.FC<SliderButtonProviderProps> = ({
  bufferedChunks,
  children,
  containerProgressBar,
  mediaData,
  progressBarSliderButton,
  onSeek,
  onSeekEnd,
  onSeekStart,
}) => {
  const { isMouseDown, position: mousePosition } = useMouseEvent();
  const { dimensions } = useWindowResize();

  const isSeeking = useRef(false);
  const gapSliderButton = useRef(0);
  const maxPositionProgressSliderButton = useRef(0);

  const mediaDataRef = useRef(mediaData);

  const [isHoldingSliderButton, setIsHoldingSliderButton] = useState(false);
  const [positionProgressSliderButton, setPositionProgressSliderButton] =
    useState(0);

  const handleGoToPositionInProgressBar = useCallback(
    (elementWidth = 0) => {
      if (containerProgressBar && mediaDataRef.current.duration > 0) {
        const {
          x: containerProgressBarPositionX,
          width: containerProgressBarWidth,
        } = containerProgressBar.getBoundingClientRect();

        const positionX =
          mousePosition.x - containerProgressBarPositionX - elementWidth;

        let percentResult = (positionX / containerProgressBarWidth) * 100;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= maxPositionProgressSliderButton.current) {
          percentResult = maxPositionProgressSliderButton.current;
        }

        setPositionProgressSliderButton(percentResult);

        const fixedPositionX = addGapToResult({
          gap: gapSliderButton.current,
          maxPosition: maxPositionProgressSliderButton.current,
          percentResult,
        });

        const mediaNewTimePos =
          (mediaDataRef.current.duration * fixedPositionX) / 100;

        onSeek(mediaNewTimePos);
      }
    },
    [containerProgressBar, mousePosition.x, onSeek]
  );

  const handleHoldSliderButton = useCallback(() => {
    setIsHoldingSliderButton(true);
  }, []);

  useEffect(() => {
    mediaDataRef.current = mediaData;
  }, [mediaData]);

  useEffect(() => {
    if (isHoldingSliderButton && !isSeeking.current) {
      isSeeking.current = true;
      onSeekStart(mediaDataRef.current.currentTime);
    }
  }, [isHoldingSliderButton, mediaDataRef.current.currentTime, onSeekStart]);

  useEffect(() => {
    const getMaxPositionToProgressSliderButton = () => {
      const buttonPxWidth =
        progressBarSliderButton?.getBoundingClientRect().width || 1;
      const containerWidth =
        containerProgressBar?.getBoundingClientRect().width || 1;
      maxPositionProgressSliderButton.current =
        calcMaxPercentPositionSliderButton({
          buttonWidth: buttonPxWidth,
          containerWidth,
        });
    };
    getMaxPositionToProgressSliderButton();

    gapSliderButton.current = 100 - maxPositionProgressSliderButton.current;
  }, [containerProgressBar, dimensions, progressBarSliderButton]);

  useEffect(() => {
    const onBrowsingProgressBar = () => {
      if (
        isHoldingSliderButton &&
        progressBarSliderButton &&
        isSeeking.current
      ) {
        const { clientWidth: elementOffsetWidth } = progressBarSliderButton;
        handleGoToPositionInProgressBar(elementOffsetWidth / 2);
      }
    };
    onBrowsingProgressBar();
  }, [
    isHoldingSliderButton,
    handleGoToPositionInProgressBar,
    progressBarSliderButton,
  ]);

  useEffect(() => {
    const onMediaIsRunning = () => {
      if (!isSeeking.current && containerProgressBar) {
        const percentResult = calcMediaPositionPercent({
          currentTime: mediaDataRef.current.currentTime,
          duration: mediaDataRef.current.duration,
        });
        const realPosition = removeGapFromResult({
          gap: gapSliderButton.current,
          percentResult,
        });

        setPositionProgressSliderButton(realPosition);
      }
    };
    onMediaIsRunning();
  }, [mediaData, containerProgressBar, dimensions]);

  useEffect(() => {
    const onReleaseMouseButtonFromSliderButton = () => {
      if (!isMouseDown && isSeeking.current) {
        setIsHoldingSliderButton(false);
        onSeekEnd(mediaDataRef.current.currentTime);
        debounce(() => {
          isSeeking.current = false;
        }, WAIT_RELEASE_SLIDER_MILLISECONDS)();
      }
    };

    onReleaseMouseButtonFromSliderButton();
  }, [isMouseDown, mediaData, onSeekEnd]);

  const result = useMemo(
    () => ({
      bufferedChunks,
      gapSliderButton: gapSliderButton.current,
      isHoldingSliderButton,
      maxPositionProgressSliderButton: maxPositionProgressSliderButton.current,
      mediaData,
      positionProgressSliderButton,
      progressBarSliderButton,
      handleGoToPositionInProgressBar,
      handleHoldSliderButton,
    }),
    [
      bufferedChunks,
      isHoldingSliderButton,
      mediaData,
      positionProgressSliderButton,
      progressBarSliderButton,
      handleGoToPositionInProgressBar,
      handleHoldSliderButton,
    ]
  );

  return (
    <SliderButtonContext.Provider value={result}>
      {children}
    </SliderButtonContext.Provider>
  );
};

export const useSliderButton = (): SliderButtonContextData => {
  const context = useContext(SliderButtonContext);

  if (!context) {
    throw new Error(
      "useSliderButton must be used within a SliderButtonProvider"
    );
  }

  return context;
};
