import { ReactNode } from "react";
import { SliderButtonProvider } from "src/components/Media/Controls/ProgressBar/hooks/useSliderButton";
import * as MediaData from "src/components/Media/dtos/MediaDataDTO";

interface ElementProps {
  x: number;
  width: number;
}

interface SliderButtonProviderProps {
  bufferedChunks: MediaData.BufferedChunk[];
  containerProgressBar: ElementProps;
  progressBarSliderButton: ElementProps;
  mediaData: MediaData.MediaDataProps;
  onSeek?: (time: number) => void;
  onSeekEnd?: (time: number) => void;
  onSeekStart?: (time: number) => void;
}

interface SliderButtonWrapperProps {
  children?: ReactNode;
  initialState?: SliderButtonProviderProps;
}

const emptyFun = () => {};

export const SliderButtonWrapper: React.FC<SliderButtonWrapperProps> = ({
  children,
  initialState,
}) => (
  <SliderButtonProvider
    bufferedChunks={initialState?.bufferedChunks || []}
    containerProgressBar={
      {
        getBoundingClientRect: () =>
          initialState?.containerProgressBar as DOMRect,
      } as HTMLDivElement
    }
    mediaData={initialState?.mediaData || { currentTime: 0, duration: 0 }}
    onSeek={initialState?.onSeek || emptyFun}
    onSeekEnd={initialState?.onSeekEnd || emptyFun}
    onSeekStart={initialState?.onSeekStart || emptyFun}
    progressBarSliderButton={
      {
        getBoundingClientRect: () =>
          initialState?.progressBarSliderButton as DOMRect,
      } as HTMLDivElement
    }
  >
    {children}
  </SliderButtonProvider>
);
