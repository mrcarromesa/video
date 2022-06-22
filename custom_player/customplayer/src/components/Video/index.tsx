import { useEffect, useRef, useState } from "react";
// import Progress from 'src/components/Video/Controls/ProgressBar/_old1_index'
import Progress from "src/components/Video/Controls/ProgressBar";

import { useVideo } from "./hooks/useVideo";

interface VideoProps {
  video: any;
}

const Video: React.FC<VideoProps> = () => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { videoData, goToTime } = useVideo({
    videoElement: videoRef.current,
    startIn: 5,
  });

  useEffect(() => {
    if (videoRef.current) {
      setIsReady(true);
      videoRef.current.duration;
    }
  }, []);
  return (
    <>
      <video
        id="va"
        style={{
          visibility: isReady ? "visible" : "hidden",
        }}
        ref={videoRef}
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
        videoData={videoData}
        onSeek={(time) => {
          goToTime(time);
        }}
        onSeekEnd={() => {}}
        onSeekStart={() => {}}
      />
    </>
  );
};

export default Video;
