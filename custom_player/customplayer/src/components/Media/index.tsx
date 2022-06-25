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
          src="http://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
      </video>
      <Progress
        mediaData={mediaData}
        bufferedChunks={bufferedChunks}
        onSeek={(time) => {
          goToTime(time);
        }}
        onSeekEnd={() => {}}
        onSeekStart={() => {}}
      />
    </>
  );
};

export default Media;
