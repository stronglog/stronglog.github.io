let increment = document.getElementById("increment_timer");
let decrement = document.getElementById("decrement_timer");

let startTimer = document.getElementById("start_timer");
startTimer.addEventListener("click", startCountdown);

let stopTimer = document.getElementById("stop_timer");
stopTimer.addEventListener("click", stopCountdown);

increment.addEventListener("pointerdown", startIncrement);
decrement.addEventListener("pointerdown", startDecrement);

increment.addEventListener("pointerup", stopIncDecrement);
decrement.addEventListener("pointerup", stopIncDecrement);

increment.addEventListener("pointerleave", stopIncDecrement);
decrement.addEventListener("pointerleave", stopIncDecrement);

var intervalId;
var currentDurationSeconds;
var timerRunning;

function checkForRunningTimer() {
    let countdownStart = localStorage.getItem("countdownStart");
    if (countdownStart !== null) {
        //resume running timer
        currentDurationSeconds = localStorage.getItem("currentDurationSeconds");
        timerRunning = true;
        intervalId = setInterval(countdown, 100, countdownStart, currentDurationSeconds);
    } else {
        let timerSetting = localStorage.getItem("timerSetting");
        if (timerSetting !== null) {
            displayTimer(timerSetting);
        }
    }
}

function startCountdown() {
    let countdownStart = Date.now();
    localStorage.setItem("countdownStart", countdownStart);

    currentDurationSeconds = getCurrentDurationSeconds();
    localStorage.setItem("currentDurationSeconds", currentDurationSeconds);

    timerRunning = true;
    intervalId = setInterval(countdown, 100, countdownStart, currentDurationSeconds);
}

function stopCountdown() {
    if (timerRunning) {
        clearInterval(intervalId);
        timerRunning = false;
        currentDurationSeconds = localStorage.getItem("currentDurationSeconds");
        displayTimer(+currentDurationSeconds)
        localStorage.removeItem("currentDurationSeconds");
        localStorage.removeItem("countdownStart");
    }
}

function countdown(countdownStart, currentDurationSeconds) {
    let currentTime = Date.now();
    let elapsedTimeSeconds = (currentTime - countdownStart) / 1000;

    let remainingDuration = currentDurationSeconds - elapsedTimeSeconds;
    if (remainingDuration < 0) {
        window.navigator.vibrate(200);
        setTimeout(stopCountdown, 200);
    } else {
        remainingDuration = Math.floor(remainingDuration);
        displayTimer(remainingDuration);
    }   
}

function getCurrentDurationSeconds() {
    let currentTimeText = document.getElementById("timer_text").innerText;
    let [minutes, seconds] = currentTimeText.split(":");
    currentDurationSeconds = ((+minutes)*60)+(+seconds);
    return currentDurationSeconds;
}

function startIncrement() {
    if (!timerRunning) {
        currentDurationSeconds = getCurrentDurationSeconds();
        incrementTimer()
        intervalId = setInterval(incrementTimer, 50);
    }
}

function startDecrement() {
    if (!timerRunning) {
        currentDurationSeconds = getCurrentDurationSeconds();
        decrementTimer()
        intervalId = setInterval(decrementTimer, 50);
    }
}


function stopIncDecrement() {
    if (!timerRunning) {
        clearInterval(intervalId);
        currentDurationSeconds = getCurrentDurationSeconds();
        localStorage.setItem("timerSetting", currentDurationSeconds);
    }
}


function incrementTimer() {
    if (currentDurationSeconds < 3599) {
        currentDurationSeconds = currentDurationSeconds + 1;
        displayTimer(currentDurationSeconds)
    } else {
        stopIncDecrement();
    }

}


function decrementTimer() {
    if (currentDurationSeconds > 0) {
        currentDurationSeconds = currentDurationSeconds - 1;
        displayTimer(currentDurationSeconds)
    } else {
        stopIncDecrement();
    }
}

function displayTimer(currentDurationSeconds) {
    let seconds = currentDurationSeconds % 60;
    let minutes = Math.floor(currentDurationSeconds / 60);

    seconds = seconds.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    let timeText = minutes+":"+seconds;
    
    document.getElementById("timer_text").innerText = timeText;
}