let currentCity = "Dhaka";
let alarmTime = null;
let alarmTriggered = false;

function updateClock() 
{
  const now = new Date();
  let hrs = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const dateStr = now.toLocaleDateString(undefined, 
  {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  hrs = hrs % 12 || 12;
  hrs = String(hrs).padStart(2, '0');

  document.getElementById('clock').textContent = `${hrs}:${mins}:${secs}`;
  document.getElementById('ampm').textContent = ampm;
  document.getElementById('date').textContent = `📅 ${dateStr}`;

  checkAlarm();
}

async function updateTemperature(city = "Dhaka") {
  try {
    const res = await fetch(`https://wttr.in/${city}?format=%t`);
    const temp = await res.text();
    document.getElementById('temperature').innerHTML =
      `<span class="weather-icon">🌡️</span> ${city}: ${temp.trim()}`;
  } 
  catch {
    document.getElementById('temperature').innerHTML =
      `<span class="weather-icon">⚠️</span> Temp unavailable`;
  }
}

function updateBatteryStatus() {
  if (!navigator.getBattery) {
    document.getElementById('battery').textContent = "🔋 Battery: Unsupported";
    return;
  }
  navigator.getBattery().then(battery => {
    const level = Math.round(battery.level * 100);
    document.getElementById('battery').textContent = `🔋 Battery: ${level}%`;
  });
}

function updateNetworkStatus() {
  const status = navigator.onLine ? "Online ✅" : "Offline ❌";
  document.getElementById('network').textContent = `🌐 Network: ${status}`;
}

function initThemeToggle() {
  const toggle = document.getElementById('modeToggle');
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('light');
    localStorage.setItem("theme", document.body.classList.contains('light') ? 'light' : 'dark');
  });
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    toggle.checked = true;
  }
}

function checkAlarm() {
  if (!alarmTime || alarmTriggered) return;
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (current === alarmTime) {
    document.getElementById('alarmStatus').textContent = "🚨 Alarm ringing!";
    document.getElementById('alarmSound').play();
    alarmTriggered = true;
  }
}

document.getElementById('setCity').addEventListener('click', () => {
  const city = document.getElementById('cityName').value.trim();
  if (city) {
    currentCity = city;
    updateTemperature(currentCity);
  }
});

document.getElementById('setAlarmBtn').addEventListener('click', () => {
  alarmTime = document.getElementById('alarmTime').value;
  if (alarmTime) {
    document.getElementById('alarmStatus').textContent = `Alarm set for ${alarmTime}`;
    alarmTriggered = false;
  } else {
    document.getElementById('alarmStatus').textContent = "Alarm: Not set";
    alarmTime = null;
  }
});

setInterval(updateClock, 1000);
setInterval(() => updateTemperature(currentCity), 60000);
setInterval(updateBatteryStatus, 30000);
setInterval(updateNetworkStatus, 5000);

updateClock();
updateTemperature(currentCity);
updateBatteryStatus();
updateNetworkStatus();
initThemeToggle();