import {
  ProgressBarProvider,
  ProgressBarProviderProps,
} from "./useProgressBar";

const AppProgressBarProvider: React.FC<ProgressBarProviderProps> = ({
  containerRef,
  progressBarDotRef,
  videoData,
  bufferedChunks,
  onSeek,
  onSeekEnd,
  onSeekStart,
  children,
}) => (
  <ProgressBarProvider
    containerRef={containerRef}
    progressBarDotRef={progressBarDotRef}
    videoData={videoData}
    bufferedChunks={bufferedChunks}
    onSeek={onSeek}
    onSeekEnd={onSeekEnd}
    onSeekStart={onSeekStart}
  >
    {children}
  </ProgressBarProvider>
);

export default AppProgressBarProvider;
