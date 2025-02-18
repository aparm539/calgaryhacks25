import "./video-control.css"
import ProgressBar from "./progress-bar"
import PlaybackBtn from "./playback-btn"
export default function VideoControl (){
    return ( 
        <div id="video-control-bar"> 
            <PlaybackBtn />
            <ProgressBar />
        </div> 
    )
}