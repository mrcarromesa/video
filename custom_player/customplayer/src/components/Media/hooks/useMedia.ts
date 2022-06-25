/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useState } from "react";

import * as MediaData from "../dtos/MediaDataDTO";

interface MediaProps {
  mediaElement: HTMLVideoElement | HTMLAudioElement | null;
  startIn?: number;
}
interface MediaResult {
  mediaElement: HTMLVideoElement | HTMLAudioElement | null;
  mediaData: MediaData.MediaDataProps;
  isPlaying: boolean;
  bufferedChunks: MediaData.BufferedChunk[];
  goToTime: (time: number) => void;
}

export const useMedia = ({
  mediaElement,
  startIn,
}: MediaProps): MediaResult => {
  const [mediaData, setMediaData] = useState<MediaData.MediaDataProps>(
    {} as MediaData.MediaDataProps
  );

  const [bufferedChunks, setBufferedChunks] = useState<
    MediaData.BufferedChunk[]
  >([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const getBufferedMedia = useCallback(
    (media: HTMLVideoElement | HTMLAudioElement) => {
      const buffers = media.buffered;
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
        buffered.start = (buffers.start(lastBuffers) / media.duration) * 100;
        buffered.end = (buffers.end(lastBuffers) / media.duration) * 100;
        buffered.range =
          ((buffers.end(lastBuffers) - buffers.start(lastBuffers)) /
            media.duration) *
          100;
        // console.log(
        //   buffers.end(lastBuffers),
        //   " - ",
        //   buffers.start(lastBuffers),
        //   " / ",
        //   media.duration
        // );
      }
      return buffered;
    },
    []
  );

  useEffect(() => {
    if (mediaElement) {
      mediaElement.currentTime = startIn || 0;
    }
    setMediaData({
      currentTime: startIn ?? 0,
      duration: mediaElement?.duration ?? 0,
    });
  }, [startIn, mediaElement, getBufferedMedia]);

  const handleOnTimeUpdate = useCallback(() => {
    if (mediaElement) {
      setMediaData({
        currentTime: mediaElement.currentTime ?? 0,
        duration: mediaElement.duration ?? 0,
      });
    }
  }, [mediaElement]);

  useEffect(() => {
    if (mediaElement) {
      mediaElement.ontimeupdate = handleOnTimeUpdate;

      mediaElement.onplay = () => {
        setIsPlaying(true);
      };

      mediaElement.onpause = () => {
        setIsPlaying(false);
      };

      mediaElement.onprogress = () => {
        const buffers = mediaElement.buffered;
        const bufferedChunks = [];
        for (let i = 0; i < buffers.length; i += 1) {
          const buffered = {
            start: 0,
            end: 0,
            range: 0,
          };
          buffered.start = (buffers.start(i) / mediaElement.duration) * 100;
          buffered.end = (buffers.end(i) / mediaElement.duration) * 100;
          buffered.range =
            ((buffers.end(i) - buffers.start(i)) / mediaElement.duration) * 100;
          bufferedChunks.push(buffered);
        }
        setBufferedChunks(bufferedChunks);
      };

      mediaElement.oncanplay = () => {
        setMediaData({
          currentTime: mediaElement.currentTime ?? 0,
          duration: mediaElement.duration ?? 0,
        });
      };
    }
  }, [mediaElement, handleOnTimeUpdate, getBufferedMedia]);

  const goToTime = useCallback(
    (position: number) => {
      if (mediaElement) {
        mediaElement.currentTime =
          position > mediaElement.duration
            ? mediaElement.duration
            : Number(position || 0);
      }
    },
    [mediaElement]
  );

  return {
    mediaElement,
    isPlaying,
    mediaData,
    bufferedChunks,
    goToTime,
  };
};
