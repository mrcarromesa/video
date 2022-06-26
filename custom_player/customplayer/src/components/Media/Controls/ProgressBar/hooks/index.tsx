import {
  SliderButtonProvider,
  SliderButtonProviderProps,
} from "./useSliderButton";

const AppProgressBarProvider: React.FC<SliderButtonProviderProps> = ({
  containerProgressBar,
  progressBarSliderButton,
  mediaData,
  bufferedChunks,
  onSeek,
  onSeekEnd,
  onSeekStart,
  children,
}) => (
  <SliderButtonProvider
    containerProgressBar={containerProgressBar}
    progressBarSliderButton={progressBarSliderButton}
    mediaData={mediaData}
    bufferedChunks={bufferedChunks}
    onSeek={onSeek}
    onSeekEnd={onSeekEnd}
    onSeekStart={onSeekStart}
  >
    {children}
  </SliderButtonProvider>
);

export default AppProgressBarProvider;
