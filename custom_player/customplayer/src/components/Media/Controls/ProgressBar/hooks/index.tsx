import {
  ProgressBarProvider,
  ProgressBarProviderProps,
} from "./useProgressBar";

const AppProgressBarProvider: React.FC<ProgressBarProviderProps> = ({
  containerProgressBarRef,
  progressBarSliderButtonRef,
  mediaData,
  bufferedChunks,
  onSeek,
  onSeekEnd,
  onSeekStart,
  children,
}) => (
  <ProgressBarProvider
    containerProgressBarRef={containerProgressBarRef}
    progressBarSliderButtonRef={progressBarSliderButtonRef}
    mediaData={mediaData}
    bufferedChunks={bufferedChunks}
    onSeek={onSeek}
    onSeekEnd={onSeekEnd}
    onSeekStart={onSeekStart}
  >
    {children}
  </ProgressBarProvider>
);

export default AppProgressBarProvider;
