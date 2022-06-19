import { ReactNode } from "react";
import { VideoProvider, VideoSRC } from "./useVideo";

interface VideoAppProviderProps {
  children: ReactNode;
  video: VideoSRC;
}

const VideoAppProvider: React.FC<VideoAppProviderProps> = ({ children, video  }) => {
  return (<VideoProvider video={video} >
    {children}
  </VideoProvider>);
}

export default VideoAppProvider;