/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useState } from "react";

import * as VideoDataProps from "../dtos/VideoDataPropsDTO";

interface VideoProps {
  videoElement: HTMLVideoElement | null;
  startIn?: number;
}
interface VideoResult {
  videoElement: HTMLVideoElement | null;
  videoData: VideoDataProps.VideoDataProps;
  isPlaying: boolean;
  bufferedChunks: VideoDataProps.BufferedChunk[];
  goToTime: (time: number) => void;
}

export const useVideo = ({
  videoElement,
  startIn,
}: VideoProps): VideoResult => {
  const [videoData, setVideoData] = useState<VideoDataProps.VideoDataProps>(
    {} as VideoDataProps.VideoDataProps
  );

  const [bufferedChunks, setBufferedChunks] = useState<
    VideoDataProps.BufferedChunk[]
  >([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const getBufferedVideo = useCallback((video: HTMLVideoElement) => {
    const buffers = video.buffered;
    // let buffered = 0;
    // for (let i = 0; i < buffers.length; i += 1) {
    //   buffered += buffers.end(i) - buffers.start(i);
    // }
    const buffered = {
      start: 0,
      end: 0,
      range: 0,
    };

    console.log("buffers.length", buffers.length);
    if (buffers.length > 0) {
      const lastBuffers = buffers.length - 1;
      buffered.start = (buffers.start(lastBuffers) / video.duration) * 100;
      buffered.end = (buffers.end(lastBuffers) / video.duration) * 100;
      buffered.range =
        ((buffers.end(lastBuffers) - buffers.start(lastBuffers)) /
          video.duration) *
        100;
      // console.log(
      //   buffers.end(lastBuffers),
      //   " - ",
      //   buffers.start(lastBuffers),
      //   " / ",
      //   video.duration
      // );
    }
    return buffered;
  }, []);

  useEffect(() => {
    if (videoElement) {
      videoElement.currentTime = startIn || 0;
    }
    setVideoData({
      currentTime: startIn ?? 0,
      duration: videoElement?.duration ?? 0,
    });
  }, [startIn, videoElement, getBufferedVideo]);

  const handleOnTimeUpdate = useCallback(() => {
    if (videoElement) {
      setVideoData({
        currentTime: videoElement.currentTime ?? 0,
        duration: videoElement.duration ?? 0,
      });
    }
  }, [videoElement]);

  useEffect(() => {
    if (videoElement) {
      videoElement.ontimeupdate = handleOnTimeUpdate;

      videoElement.onplay = () => {
        setIsPlaying(true);
      };

      videoElement.onpause = () => {
        setIsPlaying(false);
      };

      videoElement.onprogress = () => {
        const buffers = videoElement.buffered;
        const bufferedChunks = [];
        for (let i = 0; i < buffers.length; i += 1) {
          const buffered = {
            start: 0,
            end: 0,
            range: 0,
          };
          buffered.start = (buffers.start(i) / videoElement.duration) * 100;
          buffered.end = (buffers.end(i) / videoElement.duration) * 100;
          buffered.range =
            ((buffers.end(i) - buffers.start(i)) / videoElement.duration) * 100;
          bufferedChunks.push(buffered);
        }
        setBufferedChunks(bufferedChunks);
      };

      videoElement.oncanplay = () => {
        setVideoData({
          currentTime: videoElement.currentTime ?? 0,
          duration: videoElement.duration ?? 0,
        });
      };
    }
  }, [videoElement, handleOnTimeUpdate, getBufferedVideo]);

  const goToTime = useCallback(
    (position: number) => {
      if (videoElement) {
        videoElement.currentTime =
          position > videoElement.duration
            ? videoElement.duration
            : Number(position || 0);
      }
    },
    [videoElement]
  );

  return {
    videoElement,
    isPlaying,
    videoData,
    bufferedChunks,
    goToTime,
  };
};
