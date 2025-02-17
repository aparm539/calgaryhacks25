import Timer from "@easytimer.js";
let recordedKeystrokes = [];
let recording = false;


var timer = new Timer();

const progress = document.getElementById("progress");
timer.start();

timer.addEventListener('secondsUpdated', function (e) {
    $('#basicUsage').html(timer.getTimeValues().toString());
});


function startRecording() {
    recordedKeystrokes = [];
    recording = true;
    console.log("recording")
}

function stopRecording() {
    recording = false;
    console.log("recording stopped")

}

document.addEventListener("keydown", function(event) {
    if (recording && document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        recordedKeystrokes.push({ key: event.key, time: Date.now() });
    }
});

function playBack() {
    if (recordedKeystrokes.length === 0) return;
    console.log(recordedKeystrokes)
    let startTime = recordedKeystrokes[0].time;
    let inputElement = document.getElementById("textInput");
    
    let end = recordedKeystrokes.slice(-1).time;
    const duration = end.getMinutes() - startTime.getMinutes();
    let current = Date.now();
    
    recordedKeystrokes.forEach((keystroke, index) => {
        setTimeout(() => {
            if (inputElement && (inputElement.tagName === "INPUT" || inputElement.tagName === "TEXTAREA")) {
              inputElement.value += keystroke.key;
              progress.value = Date.now() - current /duration

            }
        }, keystroke.time - startTime);
    });
}
