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

import {
  addGapToResult,
  removeGapFromResult,
} from "../utils/calcGapBetweenSliderButtonAndProgressBar";
import { calcMaxPercentPositionSliderButton } from "../utils/calcMaxPercentPositionSliderButton";

export interface ProgressBarProviderProps {
  children: ReactNode;
  mediaData: MediaData.MediaDataProps;
  bufferedChunks: MediaData.BufferedChunk[];
  containerProgressBarRef: RefObject<HTMLDivElement>;
  progressBarSliderButtonRef: RefObject<HTMLDivElement>;
  onSeek: (time: number) => void;
  onSeekStart: (time: number) => void;
  onSeekEnd: (time: number) => void;
}

interface ProgressBarContextData {
  isHoldingSliderButton: boolean;
  positionProgressPlayed: number;
  positionProgressSliderButton: number;
  progressBarSliderButton: HTMLDivElement | null;
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
  containerProgressBarRef,
  progressBarSliderButtonRef,
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
    const getMaxPositionToProgressSliderButton = () => {
      const buttonPxWidth =
        progressBarSliderButtonRef.current?.getBoundingClientRect().width || 1;
      const containerWidth =
        containerProgressBarRef.current?.getBoundingClientRect().width || 1;
      maxPositionProgressSliderButton.current =
        calcMaxPercentPositionSliderButton({
          buttonWidth: buttonPxWidth,
          containerWidth,
        });
    };
    getMaxPositionToProgressSliderButton();

    gapSliderButton.current = 100 - maxPositionProgressSliderButton.current;
  }, [containerProgressBarRef, dimensions, progressBarSliderButtonRef]);

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
  }, [isMouseDown, onSeekEnd]);

  useEffect(() => {
    setPositionProgressPlayed(
      addGapToResult({
        gapSliderButton: gapSliderButton.current,
        maxPositionProgressSliderButton:
          maxPositionProgressSliderButton.current,
        percentResult: positionProgressSliderButton,
      }) || 0
    );
  }, [positionProgressSliderButton]);

  const handleGoToPositionInProgressBar = useCallback(
    (elementWidth = 0) => {
      if (
        containerProgressBarRef.current &&
        mediaDataRef.current.duration > 0
      ) {
        const { x, width } =
          containerProgressBarRef.current.getBoundingClientRect();

        const positionX = position.x - x - elementWidth;

        let percentResult = (positionX / width) * 100;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= maxPositionProgressSliderButton.current) {
          percentResult = maxPositionProgressSliderButton.current;
        }

        const fixedPosition = addGapToResult({
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
    [containerProgressBarRef, position.x, onSeek]
  );

  useEffect(() => {
    const onWhileMediaIsRunning = () => {
      if (!isSeeking.current && containerProgressBarRef.current) {
        let percentResult = (mediaData.currentTime * 100) / mediaData.duration;

        if (percentResult < 0) {
          percentResult = 0;
        }

        if (percentResult >= 100) {
          percentResult = 100;
        }

        const realPosition = removeGapFromResult({
          gapSliderButton: gapSliderButton.current,
          percentResult,
        });

        setPositionProgressSliderButton(realPosition);
      }
    };
    onWhileMediaIsRunning();
  }, [mediaData, containerProgressBarRef, dimensions]);

  useEffect(() => {
    const onWhileBrowsingProgressBar = () => {
      if (isHoldingSliderButton && progressBarSliderButtonRef.current) {
        const { clientWidth: elementOffsetWidth } =
          progressBarSliderButtonRef.current;
        handleGoToPositionInProgressBar(elementOffsetWidth / 2);
      }
    };
    onWhileBrowsingProgressBar();
  }, [
    isHoldingSliderButton,
    handleGoToPositionInProgressBar,
    progressBarSliderButtonRef,
  ]);

  useEffect(() => {
    if (isHoldingSliderButton && !isSeeking.current) {
      isSeeking.current = true;
      onSeekStart(mediaDataRef.current.currentTime);
    }
  }, [isHoldingSliderButton, onSeekStart]);

  const handleHoldSliderButton = useCallback(() => {
    setIsHoldingSliderButton(true);
  }, []);

  const result: ProgressBarContextData = useMemo(
    () => ({
      positionProgressSliderButton,
      progressBarSliderButton: progressBarSliderButtonRef.current,
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
      progressBarSliderButtonRef,
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
