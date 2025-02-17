import { useState } from 'react'
import './App.css'
import VideoControl from './components/video-control'
import Sheet from './components/spreadsheet' 
import cursor from './assets/cursor.png'

interface MouseEvent{
  id: string, 
  time: number
}

interface clickEvent extends MouseEvent{ 
  element: EventTarget
}

interface mouseMoveEvent extends MouseEvent{ 
  mouseX:number, 
  mouseY:number
}

const mouseEvents: MouseEvent[] = []

function App() {
  let replayIndex: number = 0;
  let startTime: number = 0;
  let isRecording:boolean = false; 
  let isReplaying:boolean = false; 
  const [replayMouseX, setReplayMouseX]  = useState(0);
  const [replayMouseY, setReplayMouseY]  = useState(0);
  function handleClick(event: React.MouseEvent) { 
    if(!isRecording) return;
    const newEvent:clickEvent = {id:crypto.randomUUID(), time: Date.now(), element:event.target}
    mouseEvents.push(newEvent,)
  };
  function handleMouseMove(event:React.MouseEvent){ 
    if(!isRecording) return;
    const newMoveEvent:mouseMoveEvent ={id:crypto.randomUUID(), time: Date.now(), mouseX:event.clientX, mouseY:event.clientY} 
    mouseEvents.push(newMoveEvent,)
    console.log(mouseEvents.length)
  };
  function handleBtnClick(){ 
    startTime = Date.now();
    isRecording = !isRecording;
    console.log("Are we recording?: ", isRecording)
  }
  function replay_input(){
    if (isReplaying || mouseEvents.length == 0) return;
    isReplaying = true;
    startTime = Date.now()
    replayNextInput(0);

  }
  function replayNextInput(index:number){ 
    console.log(index)
    if(index >=mouseEvents.length){ 
      isReplaying = false;
      return;
    }; 

    if(index < mouseEvents.length-1){
      let moveEvent = mouseEvents[index] as mouseMoveEvent
      if (moveEvent.mouseX){ 
        setReplayMouseX(moveEvent.mouseX)
        setReplayMouseY(moveEvent.mouseY)
      }
      let delay = mouseEvents[index +1 ].time - mouseEvents[index].time;
      setTimeout(() => replayNextInput(index+1), delay);
    }
  }
  return (
    < div onMouseMove={(e) => handleMouseMove(e)}>
      <img src={cursor} id="mouse" style={{left:replayMouseX, top:replayMouseY}}/> 
      <textarea id="21"onClick={(e) => handleClick(e)}> </textarea>
      <button onClick={handleBtnClick}>Start/Stop</button>
      <button onClick={replay_input}>Start/Stop replay</button>
      <Sheet/>
      <VideoControl/> 
    </div>

  )
}

export default App
