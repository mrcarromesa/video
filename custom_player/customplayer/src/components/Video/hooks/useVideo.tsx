import {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";
import {
  useMouseEvent,
  MousePosition,
} from "src/events/Mouse/hooks/useMouseEvent";

export interface VideoSRC {
  src: string;
  initialTime?: number;
}

interface VideoProviderProps {
  children: ReactNode;
  video: VideoSRC;
}

export interface VideoDataProps {
  size: number;
  currentTime: number;
  bufferSize: number;
  isPlaying: boolean;
}

interface WindowDimensions {
  width: number;
  height: number;
}

interface VideoContextData {
  videoData: VideoDataProps;
  videoDataRef: VideoDataProps;
  setVideoPosition: (position: number) => void;
  windowIsMouseDown: boolean;
  mousePosition: MousePosition;
  windowDimensions: WindowDimensions;
}


const VideoContext = createContext<VideoContextData>({} as VideoContextData);

export const VideoProvider: React.FC<VideoProviderProps> = ({
  children,
  video,
}) => {
  const { dimensions } = useWindowResize();
  const { isMouseDown, position } = useMouseEvent();

  const [windowDimensions, setWindowDimensions] = useState(dimensions);
  const [mousePosition, setMousePosition] = useState(position);

  const [videoData, setVideoData] = useState<VideoDataProps>(
    {} as VideoDataProps
  );

  const videoDataRef = useRef<VideoDataProps>(videoData);

  useEffect(() => {
    videoDataRef.current = videoData;
  }, [videoData]);

  useEffect(() => {
    setWindowDimensions(dimensions);
  }, [dimensions]);

  useEffect(() => {
    setMousePosition(position);
  }, [position]);

  useEffect(() => {
    setVideoData((prevState) => {
      return {
        ...prevState,
        currentTime: video.initialTime ?? 0,
        size: 10,
      }
    });
  }, [video]);


  const setVideoPosition = useCallback((position: number) => {
    setVideoData((prevState) => {
      return {
        ...prevState,
        currentTime: position <= prevState.size ? position : prevState.currentTime,
      };
    });
  }, []);


  return (
    <VideoContext.Provider
      value={{
        videoData,
        videoDataRef: videoDataRef.current,
        windowIsMouseDown: isMouseDown,
        mousePosition,
        windowDimensions,
        setVideoPosition,
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
