import { ReactNode } from "react";
import { VideoProvider } from "./useVideo";

interface VideoAppProviderProps {
  children: ReactNode;
  video: HTMLVideoElement | null;
  startIn: number;
}

const VideoAppProvider: React.FC<VideoAppProviderProps> = ({ children, video, startIn  }) => {
  return (<VideoProvider video={video} startIn={startIn} >
    {children}
  </VideoProvider>);
}

export default VideoAppProvider;