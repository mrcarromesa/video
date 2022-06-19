// import { Container } from './styles';

import VideoAppProvider from "./hooks";
import { VideoSRC } from "./hooks/useVideo";
// import Progress from 'src/components/Video/Controls/ProgressBar/_old1_index'
import Progress from 'src/components/Video/Controls/ProgressBar'

interface VideoProps {
  video: VideoSRC;
}

const Video: React.FC<VideoProps> = ({ video }) => {
  return (
    <VideoAppProvider video={video}>
      <Progress />
      <br />
      <br />
      <br />
      <Progress />
    </VideoAppProvider>
  );
}

export default Video;