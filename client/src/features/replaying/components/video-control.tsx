import "./video-control.css";
import ProgressBar from "../../../components/ui/progress-bar";
import PlaybackBtn from "../../../components/ui/playback-btn";
export default function VideoControl() {
  return (
    <div id="video-control-bar">
      <PlaybackBtn />
      <ProgressBar />
    </div>
  );
}
