let startTime = null;
let elapsed = 0;
let interval = null;
let needleAngle = 0;
let laps = [];

const needle = document.getElementById("needle");
const display = document.getElementById("display");
const lapsList = document.getElementById("laps");
const beep = document.getElementById("beep");

function format(ms) {
  const d = new Date(ms);
  return `${String(d.getUTCHours()).padStart(2, "0")}:` +
         `${String(d.getUTCMinutes()).padStart(2, "0")}:` +
         `${String(d.getUTCSeconds()).padStart(2, "0")}.` +
         `${String(d.getUTCMilliseconds()).padStart(3, "0")}`;
}

function update() {
  const now = Date.now();
  const diff = now - startTime;
  const time = elapsed + diff;

  needleAngle = (time % 60000) / 60000 * 360;
  needle.style.transform = `rotate(${needleAngle}deg)`;
  display.textContent = format(time);
}

document.getElementById("start").onclick = () => {
  if (!interval) {
    startTime = Date.now();
    interval = setInterval(update, 16);
    beep.currentTime = 0;
    beep.play();
  }
};

document.getElementById("pause").onclick = () => {
  if (interval) {
    elapsed += Date.now() - startTime;
    clearInterval(interval);
    interval = null;
    beep.pause();
  }
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  interval = null;
  startTime = null;
  elapsed = 0;
  needleAngle = 0;
  laps = [];
  needle.style.transform = `rotate(0deg)`;
  display.textContent = "00:00:00.000";
  lapsList.innerHTML = "";
  beep.pause();
  beep.currentTime = 0;
};

document.getElementById("lap").onclick = () => {
  if (!interval) return;
  const now = Date.now();
  const time = elapsed + (now - startTime);
  const lapTime = format(time);
  const li = document.createElement("li");
  li.textContent = `Lap ${laps.length + 1}: ${lapTime}`;
  laps.push(lapTime);
  lapsList.appendChild(li);
};

document.getElementById("export").onclick = () => {
  if (laps.length === 0) return alert("No laps to export.");
  const content = "data:text/csv;charset=utf-8," + laps.map((lap, i) => `Lap ${i + 1},${lap}`).join("\n");
  const encoded = encodeURI(content);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", "lap_times.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Theme buttons
document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.className = btn.dataset.theme;
  });
});

// Help button
document.getElementById("help").onclick = () => {
  alert(`
🕒 How to Use the Stopwatch:

▶ Start – Begins timing and plays beep.
⏸ Pause – Pauses time and stops beep.
🔁 Reset – Resets time, needle, laps and stops beep.
🏁 Lap – Records current time into a lap list.
📄 Export – Downloads lap times as CSV file.
🎨 Theme – Switch UI themes with Light, Dark, and Solarized.

Enjoy tracking time with style!
  `);
};
