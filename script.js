let mode = "pomodoro";

let times = {
  pomodoro: 1500,
  break: 300,
  deep: 5400,
  sprint: 600,
  chill: 0
};

let time = times.pomodoro;
let timer = null;

let xp = localStorage.getItem("xp") || 0;
let sessions = localStorage.getItem("sessions") || 0;

document.getElementById("xp").innerText = xp;
document.getElementById("sessions").innerText = sessions;

/* AUDIO */
let lofi = document.getElementById("lofi");
let breakMusic = document.getElementById("breakMusic");

function stopMusic() {
  lofi.pause();
  breakMusic.pause();
  lofi.currentTime = 0;
  breakMusic.currentTime = 0;
}

/* DISPLAY */
function updateDisplay() {
  let m = Math.floor(time / 60);
  let s = time % 60;

  document.getElementById("time").innerText =
    m + ":" + (s < 10 ? "0" : "") + s;

  document.getElementById("mode").innerText = "Mode: " + mode;

  let total = times[mode] || 1;
  let percent = ((total - time) / total) * 100;
  document.getElementById("bar").style.width = percent + "%";
}

/* START */
function startTimer() {
  if (timer) return;

  if (mode === "pomodoro") lofi.play();
  if (mode === "break") breakMusic.play();

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;

      if (mode === "pomodoro") {
        xp++;
        sessions++;

        localStorage.setItem("xp", xp);
        localStorage.setItem("sessions", sessions);

        document.getElementById("xp").innerText = xp;
        document.getElementById("sessions").innerText = sessions;
      }

      switchMode();
      startTimer();
    }
  }, 1000);
}

/* PAUSE */
function pauseTimer() {
  clearInterval(timer);
  timer = null;
  lofi.pause();
  breakMusic.pause();
}

/* RESET */
function resetTimer() {
  clearInterval(timer);
  timer = null;
  stopMusic();
  time = times[mode];
  updateDisplay();
}

/* MODE SWITCH */
function setMode(m) {
  mode = m;
  stopMusic();
  time = times[m] || 0;
  resetTimer();
}

function switchMode() {
  if (mode === "pomodoro") mode = "break";
  else if (mode === "break") mode = "pomodoro";
  else return;

  time = times[mode];
  updateDisplay();
}

/* TASKS */
function addTask() {
  let input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  let li = document.createElement("li");
  li.innerText = input.value;
  li.onclick = () => li.remove();

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

updateDisplay();

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  lofi.play().then(() => {
    lofi.pause();
    lofi.currentTime = 0;
  }).catch(() => {});

  breakMusic.play().then(() => {
    breakMusic.pause();
    breakMusic.currentTime = 0;
  }).catch(() => {});

  audioUnlocked = true;
}