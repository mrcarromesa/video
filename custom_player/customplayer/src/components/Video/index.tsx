import { useRef, useEffect, useState } from 'react';
import VideoAppProvider from "./hooks";
// import Progress from 'src/components/Video/Controls/ProgressBar/_old1_index'
import Progress from 'src/components/Video/Controls/ProgressBar'

interface VideoProps {
  video: any;
}

const Video: React.FC<VideoProps> = ({ video }) => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      setIsReady(true);
      videoRef.current.duration
    }
  }, []);
  return (
    <VideoAppProvider video={videoRef.current} startIn={0}>
      <>
        <video 
          style={{
            visibility: isReady ? 'visible' : 'hidden',
          }} 
          ref={videoRef} width="400" controls muted
        >
            <source src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
        <Progress />
      </>
    </VideoAppProvider>
  );
}

export default Video;