import { useRef, useState } from "react";
import "./App.css";
import VideoControl from "./features/replaying/components/video-control";
import Sheet from "./components/spreadsheet";
import cursor from "./assets/cursor.png";
import { CellKeyDownEvent, RowNode } from "ag-grid-community";

interface InterceptedEvent {
  id: string;
  time: number;
}

interface TargetedEvent extends InterceptedEvent {
  target: EventTarget;
}

interface clickEvent extends TargetedEvent {}

interface mouseMoveEvent extends InterceptedEvent {
  mouseX: number;
  mouseY: number;
}

interface keydownEvent extends TargetedEvent {
  key: string;
  event: CellKeyDownEvent;
}

const interceptedEvents: InterceptedEvent[] = [];

function App() {
  const gridRef = useRef();
  let startTime: number = 0;
  let endTime: number = 0;
  let isRecording: boolean = false;
  let isReplaying: boolean = false;
  const [replayMouseX, setReplayMouseX] = useState(0);
  const [replayMouseY, setReplayMouseY] = useState(0);
  function handleClick(event: React.MouseEvent) {
    if (!isRecording) return;
    const newEvent: clickEvent = {
      id: crypto.randomUUID(),
      time: Date.now(),
      target: event.target,
    };
    interceptedEvents.push(newEvent);
  }
  function handleMouseMove(event: React.MouseEvent) {
    if (!isRecording) return;
    const newMoveEvent: mouseMoveEvent = {
      id: crypto.randomUUID(),
      time: Date.now(),
      mouseX: event.clientX,
      mouseY: event.clientY,
    };
    interceptedEvents.push(newMoveEvent);
  }
  function handleBtnClick() {
    if (isRecording) {
      startTime = Date.now();
    } else {
      endTime = Date.now();
    }
    isRecording = !isRecording;
    console.log("Are we recording?: ", isRecording);
  }
  function replay_input() {
    if (isReplaying || interceptedEvents.length == 0) return;
    isReplaying = true;
    startTime = Date.now();
    replayNextInput(0);
  }
  function replayNextInput(index: number) {
    if (index >= interceptedEvents.length) {
      isReplaying = false;
      return;
    }

    if (index < interceptedEvents.length - 1) {
      const moveEvent = interceptedEvents[index] as mouseMoveEvent;
      const keypressEvent = interceptedEvents[index] as keydownEvent;
      if (moveEvent.mouseX) {
        setReplayMouseX(moveEvent.mouseX);
        setReplayMouseY(moveEvent.mouseY);
      }
      if (keypressEvent.key) {
        const dataField = keypressEvent.event.colDef.field;
        const oldValue: string = keypressEvent.event.data[dataField];
        const newValue: string = oldValue.concat(keypressEvent.key);
        keypressEvent.event.node.setDataValue(dataField, newValue);
      }
      const delay =
        interceptedEvents[index + 1].time - interceptedEvents[index].time;
      setTimeout(() => replayNextInput(index + 1), delay);
    }
  }
  function onCellValueChanged(event: CellKeyDownEvent) {
    const keypress: keydownEvent = {
      id: crypto.randomUUID(),
      time: Date.now(),
      key: event.event.key,
      target: event.event.target,
      event: event,
    };
    //console.log(event.node.setDataValue(event.colDef.field,"testing123"))
    //console.log(gridRef.current.api.getRowNode(event.colDef.field))
    interceptedEvents.push(keypress);
  }
  return (
    <div onMouseMove={(e) => handleMouseMove(e)} style={{ height: "100vh" }}>
      <img
        src={cursor}
        id="mouse"
        style={{ left: replayMouseX, top: replayMouseY }}
      />
      <button onClick={handleBtnClick}>Start/Stop</button>
      <button onClick={replay_input}>Start/Stop replay</button>
      <Sheet
        onCellValueChangedCallback={onCellValueChanged}
        gridRef={gridRef}
      />
      <VideoControl />
    </div>
  );
}

export default App;
