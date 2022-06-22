/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useState } from "react";

interface VideoProps {
  videoElement: HTMLVideoElement | null;
  startIn?: number;
}

export interface VideoDataProps {
  duration: number;
  currentTime: number;
  bufferPercent: number;
}

interface VideoResult {
  videoElement: HTMLVideoElement | null;
  videoData: VideoDataProps;
  isPlaying: boolean;
  goToTime: (time: number) => void;
}

export const useVideo = ({
  videoElement,
  startIn,
}: VideoProps): VideoResult => {
  const [videoData, setVideoData] = useState<VideoDataProps>(
    {} as VideoDataProps
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const getBufferedVideo = useCallback((video: HTMLVideoElement) => {
    const buffers = video.buffered;
    let buffered = 0;
    for (let i = 0; i < buffers.length; i += 1) {
      buffered += buffers.end(i) - buffers.start(i);
    }
    return (buffered / video.duration) * 100;
  }, []);

  useEffect(() => {
    let bufferPercent = 0;
    if (videoElement) {
      bufferPercent = getBufferedVideo(videoElement);
      videoElement.currentTime = startIn || 0;
    }
    setVideoData({
      currentTime: startIn ?? 0,
      duration: videoElement?.duration ?? 0,
      bufferPercent,
    });
  }, [startIn, videoElement, getBufferedVideo]);

  const handleOnTimeUpdate = useCallback(() => {
    if (videoElement) {
      setVideoData({
        currentTime: videoElement.currentTime ?? 0,
        duration: videoElement.duration ?? 0,
        bufferPercent: getBufferedVideo(videoElement),
      });
    }
  }, [videoElement, getBufferedVideo]);

  useEffect(() => {
    if (videoElement) {
      videoElement.ontimeupdate = handleOnTimeUpdate;

      videoElement.onplay = () => {
        setIsPlaying(true);
      };

      videoElement.onpause = () => {
        setIsPlaying(false);
      };

      videoElement.oncanplay = () => {
        setVideoData({
          currentTime: videoElement.currentTime ?? 0,
          duration: videoElement.duration ?? 0,
          bufferPercent: getBufferedVideo(videoElement),
        });
      };
    }
  }, [videoElement, handleOnTimeUpdate, getBufferedVideo]);

  const goToTime = useCallback(
    (position: number) => {
      if (videoElement) {
        videoElement.currentTime =
          position > videoElement.duration ? videoElement.duration : position;
      }
    },
    [videoElement]
  );

  return {
    videoElement,
    isPlaying,
    videoData,
    goToTime,
  };
};
