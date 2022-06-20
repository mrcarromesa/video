import {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";

interface VideoProviderProps {
  children: ReactNode;
  video: HTMLVideoElement | null;
  startIn: number;
}

export interface VideoDataProps {
  duration: number;
  currentTime: number;
}

interface VideoContextData {
  videoData: VideoDataProps;
  videoDataRef: VideoDataProps;
  isPlaying: boolean;
  buffered: number;
  setIsChanging: (value: boolean) => void;
  setVideoPosition: (position: number) => void;
  handleOnTimeUpdate: () => void;
}


const VideoContext = createContext<VideoContextData>({} as VideoContextData);

export const VideoProvider: React.FC<VideoProviderProps> = ({
  children,
  video,
  startIn,
}) => {

  const [videoData, setVideoData] = useState<VideoDataProps>(
    {} as VideoDataProps
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const videoDataRef = useRef<VideoDataProps>(videoData);

  useEffect(() => {
    videoDataRef.current = videoData;
  }, [videoData]);
  

  useEffect(() => {
    if (isPlaying && isChanging) {
      // pause
      video?.pause();
    }

    if (isPlaying && !isChanging) {
      video?.play();
    }
  }, [isPlaying, isChanging, video]);

  useEffect(() => {

    setVideoData((prevState) => {
      return {
        ...prevState,
        currentTime: startIn ?? 0,
        duration: video?.duration ?? 0,
      }
    });
  }, [startIn, video]);

  const bufferedVideo = useCallback((video: HTMLVideoElement) => {
      const buffers = video.buffered;
      let buffered = 0;
      for(let i = 0; i<buffers.length; i++) {
        buffered += buffers.end(i) - buffers.start(i);
      }
      setBuffered((buffered / video.duration) * 100);

  }, []);

  const handleOnTimeUpdate = useCallback(() => {
    if (video) {
      bufferedVideo(video);
      
      setVideoData((prevState) => {
        return {
          ...prevState,
          currentTime: video?.currentTime ?? 0,
          duration: video?.duration ?? 0,
      }});
    }

  }, [video, bufferedVideo]);


  const setVideoPosition = useCallback((position: number) => {
    setVideoData((prevState) => {
      return {
        ...prevState,
        currentTime: position <= prevState.duration ? position : prevState.currentTime,
      };
    });
    if (video) {
      video.currentTime = position;
    }
  }, [video]);

  useEffect(() => {
    if (video) {
      video.ontimeupdate = handleOnTimeUpdate;

      video.oncanplay = () => {
        bufferedVideo(video);
      }
    }
  }, [video, handleOnTimeUpdate, bufferedVideo]);


  return (
    <VideoContext.Provider
      value={{
        videoData,
        videoDataRef: videoDataRef.current,
        setVideoPosition,
        isPlaying,
        setIsChanging,
        handleOnTimeUpdate,
        buffered,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextData => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
