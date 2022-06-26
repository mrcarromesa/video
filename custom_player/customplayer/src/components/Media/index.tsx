import { useEffect, useRef, useState } from "react";
// import Progress from 'src/components/Video/Controls/ProgressBar/_old1_index'
import Progress from "src/components/Media/Controls/ProgressBar";

import { useMedia } from "./hooks/useMedia";

interface MediaProps {
  media: any;
}

const Media: React.FC<MediaProps> = () => {
  const [isReady, setIsReady] = useState(false);
  const mediaRef = useRef<HTMLVideoElement>(null);

  const { mediaData, goToTime, bufferedChunks } = useMedia({
    mediaElement: mediaRef.current,
    startIn: 5,
  });

  useEffect(() => {
    if (mediaRef.current) {
      setIsReady(true);
      mediaRef.current.duration;
    }
  }, []);
  return (
    <>
      <video
        id="va"
        style={{
          visibility: isReady ? "visible" : "hidden",
        }}
        ref={mediaRef}
        width="500"
        controls
        muted
      >
        <source
          src="https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4"
          type="video/mp4"
        />
      </video>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Progress
        mediaData={mediaData}
        bufferedChunks={bufferedChunks}
        onSeek={(time) => {
          goToTime(time);
        }}
        onSeekEnd={(time) => {
          console.log("end", time);
        }}
        onSeekStart={(time) => {
          console.log("start", time);
        }}
      />
    </>
  );
};

export default Media;
