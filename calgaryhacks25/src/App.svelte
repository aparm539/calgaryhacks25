<script>
  import Sheet from './sheet.svelte';
  import { onMount, onDestroy } from 'svelte';
  let keyLogs = [];
  let mouseLogs = [];
  let replayIndex = 0;
  let isReplaying = false;
  let isRecording = false;
  let inputValues = Array(100).join(".").split(".")
  let progress = 0;
  let totalReplayTime = 0;
  let replayStartTime = 0;
  let mouseX = 0, mouseY = 0;
  let replayMouseX = 0, replayMouseY = 0;
  let inputBoxIndex = 0;

  let data = $state([
		[
			{ value: 'Item', bgColor: '#6aa84f', color: '#fff' },
			{ value: 'Price', bgColor: '#6aa84f', color: '#fff' },
			{ value: 'Quantity', bgColor: '#6aa84f', color: '#fff' },
			{ value: 'Total', bgColor: '#51803d', color: '#fff' },

		],
		[{ value: 'Milk' }, { value: '3' }, { value: '2' }, {value: '=MULTIPLY(B2,C2)'}],
		[{ value: 'Oats' }, { value: '4' }, { value: '1' }, {value: '=MULTIPLY(B3,C3)'}],
		[{ value: 'Honey' }, { value: '5' }, { value: '2' }, {value: '=MULTIPLY(B4,C4)'}],
		[{ value: 'Strawberries' }, { value: '2' }, { value: '2' }, {value: '=MULTIPLY(B5,C5)'}],
		[{ value: '', bgColor: '#b4a7d6' }, { value: '', bgColor: '#b4a7d6' }, { value: 'Total', bgColor: '#b4a7d6',color: '#000' }, {value: '=SUM(D2,D3,D4,D5)',  bgColor: '#8e7eb6',color: '#000' }]
	]);


  function handleKeydown(event) {
    if (!isRecording) return;
    
    if (event.key === "Backspace") {
      keyLogs = [...keyLogs, { key: event.key, time: Date.now(), cell_id: inputBoxIndex}];
      inputValues[inputBoxIndex] = inputValues[inputBoxIndex].slice(0, -1);
    } else {
      keyLogs = [...keyLogs, { key: event.key, time: Date.now(), cell_id: inputBoxIndex}];
      inputValues[inputBoxIndex] += event.key;
    }
  }

  function handleMouseMove(event) {
    if (!isRecording) return;
    mouseLogs = [...mouseLogs, { x: event.clientX, y: event.clientY, time: Date.now() }];
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  function startRecording() {
    keyLogs = [];
    mouseLogs = [];
    inputValues = ["", "", "", ""];
    isRecording = true;
  }

  function stopRecording() {
    isRecording = false;
  }

  function replayKeys() {
    if (isReplaying || keyLogs.length === 0) return;
    isReplaying = true;
    replayIndex = 0;
    inputValues = ["", "", "", ""];
    progress = 0;
    replayStartTime = Date.now();
    totalReplayTime = keyLogs[keyLogs.length - 1].time - keyLogs[0].time;
    replayNextKey();
    replayMouseMove(0);
  }

  function replayNextKey() {
    if (replayIndex >= keyLogs.length) {
      isReplaying = false;
      progress = 100;
      return;
    }
    
    if (keyLogs[replayIndex].key === "Backspace") {
      inputValues[keyLogs[replayIndex].cell_id] = inputValues[keyLogs[replayIndex].cell_id].slice(0, -1);
    } else {
      inputValues[keyLogs[replayIndex].cell_id] += keyLogs[replayIndex].key;
    }
    
    progress = ((Date.now() - replayStartTime) / totalReplayTime) * 100;
    
    if (replayIndex < keyLogs.length - 1) {
      let delay = keyLogs[replayIndex + 1].time - keyLogs[replayIndex].time;
      setTimeout(replayNextKey, Math.max(delay, 10));
    } else {
      isReplaying = false;
    }
    replayIndex++;
  }

  function replayMouseMove(index) {
    if (index >= mouseLogs.length) return;
    replayMouseX = mouseLogs[index].x;
    replayMouseY = mouseLogs[index].y;
    
    if (index < mouseLogs.length - 1) {
      let delay = mouseLogs[index + 1].time - mouseLogs[index].time;
      setTimeout(() => replayMouseMove(index + 1), Math.max(delay, 10));
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('mousemove', handleMouseMove);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('mousemove', handleMouseMove);
  });
</script>

<main>
  <Sheet bind:data />
  <div class="content">
    <h1>Keyboard Logger</h1>
    <div class="excel-grid">
      {#each Array(100) as _, i}
        <div class="excel-cell" on:click={() => inputBoxIndex = i}>
          <input type="text" bind:value={inputValues[i]} readonly />
        </div>
      {/each}
    </div>
    <div class="mouse-indicator" style="left: {replayMouseX}px; top: {replayMouseY}px;"></div>
    <button on:click={() => { startRecording(); inputBoxIndex = 0; }}>Start Recording</button>
    <button on:click={() => { stopRecording(); inputBoxIndex = 0; }}>Stop Recording</button>
    <button on:click={() => { replayKeys(); inputBoxIndex = 0; }} disabled={isReplaying}>Replay Keys</button>
  </div>
  <div class="progress-bar-container">
    <button class="playback-button" on:click={() => { replayKeys(); inputBoxIndex = 0; }} disabled={isReplaying}>
      {#if isReplaying}
        <svg viewBox="0 0 24 24" class="pause-icon">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" class="play-icon">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      {/if}
    </button>
    <div class="progress-bar" style="width: {progress}%;"></div>
  </div>
</main>

<style>
  .excel-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 1px;
  }

  .excel-cell {
    border: 1px solid #ddd;
    padding: 5px;
    text-align: center;
    cursor: pointer;
  }

  .excel-cell input {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    text-align: center;
    
  }
  main {
    font-family: Arial, sans-serif;
    height: 80vh;
    display: flex;
    flex-direction: column;
  }
  
  .content {
    max-width: 500px;
    margin: auto;
    text-align: center;
    flex-grow: 1;
    padding: 20px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 16px;
  }

  p {
    font-size: 14px;
    color: #555;
  }

  .mouse-indicator {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    pointer-events: none;
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }

  .playback-button {
    margin-right: 10px;
  }

  .progress-bar {
    height: 20%;
    background: #4caf50;
    transition: width 0.1s linear;
  }

  .play-icon, .pause-icon {
    width: 56px;
    height: 56px;
    fill: white;
    display:inline;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
