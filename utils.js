const teams = [
  { name: "Red Bull", time: 101.200 },
  { name: "Ferrari", time: 101.800 },
  { name: "Mercedes", time: 101.420 },
  { name: "McLaren", time: 101.345 },
  { name: "Aston Martin", time: 100.800 },
  { name: "Alpine", time: 103.756 },
  { name: "Williams", time: 105.345 },
  { name: "AlphaTauri", time: 106.234 },
  { name: "Haas", time: 102.600 },
  { name: "Sauber", time: 108.789 }
];

// Elementos para top-section
const topSectionSvg = document.querySelector(".top-section svg");
const topSectionLabels = document.querySelector(".top-section .labels");

// Elementos para bottom-section
const bottomSectionGrid = document.getElementById("circlesGrid");

const mainTimer = document.getElementById("main-timer"); // Timer principal

const minTime = Math.min(...teams.map(t => t.time));
const maxTime = Math.max(...teams.map(t => t.time));

const baseRadius = 60;
const spacing = 18;
const centerX = 300;
const centerY = 300;

const animationElements = [];

// Crear círculos concéntricos para todas las escuderías
teams
  .sort((a, b) => a.time - b.time)
  .forEach((team, index) => {
    const radius = baseRadius + index * spacing;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const circumference = 2 * Math.PI * radius;

    const relative = (team.time - minTime) / (maxTime - minTime);
    const duration = 2000 + relative * 8000;

    // Solo McLaren tiene color naranja
    const strokeColor = team.name === "McLaren" ? "#FF8700" : `hsl(0, 0%, ${30 + index * 5}%)`;

    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("class", "circle");

    circle.style.strokeDasharray = `0 ${circumference}`;
    circle.style.transition = `stroke-dasharray ${duration}ms ease-out`;

    topSectionSvg.appendChild(circle);

    // Crear etiquetas para cada escudería
    const label = document.createElement("div");
    label.className = "label hidden"; // le agregamos clase hidden

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.backgroundColor = strokeColor;

    const text = document.createElement("span");
    text.className = "team-name";
    text.textContent = team.name;

    const timeDisplay = document.createElement("span");
    timeDisplay.className = "team-time";
    timeDisplay.textContent = "0:00.000"; // Inicializar en 0

    label.appendChild(dot);
    label.appendChild(text);
    label.appendChild(timeDisplay);
    topSectionLabels.appendChild(label);

    // Guardar elementos para la animación
    animationElements.push({
      circle,
      textEl: timeDisplay,
      team,
      duration,
      circumference,
      startTime: team.time
    });

    setTimeout(() => {
      circle.style.strokeDasharray = `${circumference} 0`;
    
      // Mostrar el label al completar la vuelta
      setTimeout(() => {
        label.classList.remove("hidden");
        label.classList.add("visible");
        timeDisplay.textContent = formatTime(team.time); // Mostrar el tiempo final
      }, duration);
    }, 100);
    
  });
// Función para animar el contador principal
function animateMainTimer(finalTime, duration) {
  const startTime = 0;
  const startTimestamp = performance.now();

  function updateMainTimer(now) {
    const elapsed = now - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const currentTime = startTime + (finalTime - startTime) * progress;

    mainTimer.textContent = formatTime(currentTime);

    if (progress < 1) {
      requestAnimationFrame(updateMainTimer);
    }
  }

  requestAnimationFrame(updateMainTimer);
}
// Iniciar el timer principal
animateMainTimer(maxTime, 8000); // Sincronizar con el tiempo más lento

function animateCountdown(element, finalTime, duration) {
  const startTime = 0;
  const startTimestamp = performance.now();

  function updateCounter(now) {
    const elapsed = now - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const currentTime = startTime + (finalTime - startTime) * progress;

    element.textContent = formatTime(currentTime);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

setInterval(() => {
  const globalStart = performance.now() + 100;
  const maxDuration = Math.max(...animationElements.map(el => el.duration)); // Duración del círculo más lento

  animationElements.forEach(element => {
    element.circle.style.transition = "none";
    element.circle.style.strokeDasharray = `0 ${element.circumference}`;
    element.textEl.textContent = "0:00.000";

    // Ocultar el label
    const label = element.textEl.closest(".label");
    label.classList.remove("visible");
    label.classList.add("hidden");

    // Forzar reflow
    element.circle.getBoundingClientRect();

    setTimeout(() => {
      // Usar la duración individual de cada círculo
      element.circle.style.transition = `stroke-dasharray ${element.duration}ms ease-out`;
      element.circle.style.strokeDasharray = `${element.circumference} 0`;

      // Animar el timer individual con su duración específica
      animateCountdown(element.textEl, element.team.time, element.duration);

      // Al completar cada círculo individual, mostrar su label
      setTimeout(() => {
        label.classList.remove("hidden");
        label.classList.add("visible");
        element.textEl.textContent = formatTime(element.team.time);
      }, element.duration);

    }, 100);
  });

  // Reiniciar el main-timer con la duración del círculo más lento
  mainTimer.textContent = "0:00.000";
  animateMainTimer(maxTime, maxDuration);
}, 16000);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}

// --- Código fusionado de circles.js para los pit stops ---
const teamsPit = [
    { name: "Red Bull", time: 0.19 },
    { name: "Ferrari", time: 0.194 },
    { name: "Mercedes", time: 0.212 },
    { name: "McLaren", time: 0.19 },
    { name: "Aston Martin", time: 0.234 },
    { name: "Alpine", time: 0.279 },
    { name: "Williams", time: 0.239 },
    { name: "Racing Bulls", time: 0.201 },
    { name: "Haas", time: 0.251 },
    { name: "Sauber", time: 0.232 }
  ];

const circlesGrid = document.getElementById("circlesGrid");

const maxPitTime = Math.max(...teamsPit.map(t => t.time));

function createCircles() {
  if (!circlesGrid) return;
  circlesGrid.innerHTML = ""; // Limpiar el contenedor antes de reiniciar

  teamsPit.forEach((team, index) => {
    const circleItem = document.createElement("div");
    circleItem.className = "circle-item";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 120");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Duración proporcional al tiempo de cada equipo
    const duration = (team.time / maxPitTime) * 15000;

    // Color inicial: McLaren es naranja, el resto gris
    const strokeColor = team.name === "McLaren" ? "#FF8000" : "#666";

    circle.setAttribute("cx", "60");
    circle.setAttribute("cy", "60");
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke-width", "8");
    circle.setAttribute("stroke-linecap", "round");

    circle.style.strokeDasharray = `0 ${circumference}`;
    circle.style.transition = `stroke-dasharray ${duration}ms ease-out`;

    svg.appendChild(circle);

    // Información del círculo (nombre y tiempo)
    const circleInfo = document.createElement("div");
    circleInfo.className = "circle-info";

    const circleName = document.createElement("div");
    circleName.className = "circle-name";
    circleName.textContent = team.name;

    const circleTime = document.createElement("div");
    circleTime.className = "circle-time";
    circleTime.textContent = formatTimePit(0); // Inicializar en 0

    circleInfo.appendChild(circleName);
    circleInfo.appendChild(circleTime);

    circleItem.appendChild(svg);
    circleItem.appendChild(circleInfo);
    circlesGrid.appendChild(circleItem);

    // Animar el círculo y el timer
    setTimeout(() => {
      circle.style.strokeDasharray = `${circumference} 0`;
      animateCircleTimer(circleTime, team.time, duration);

      // Cambiar el color del timer a verde al completar la vuelta
      setTimeout(() => {
        circleTime.textContent = formatTimePit(team.time); // Asegura el tiempo final
        circleTime.style.color = "#00FF00"; // Verde
      }, duration);
    }, 100);
  });
}

// Función para animar el timer de cada círculo
function animateCircleTimer(element, finalTime, duration) {
  const startTime = 0;
  const startTimestamp = performance.now();

  function updateTimer(now) {
    const elapsed = now - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const currentTime = startTime + (finalTime - startTime) * progress;
    element.textContent = formatTimePit(currentTime);
    if (progress < 1) {
      requestAnimationFrame(updateTimer);
    }
  }
  requestAnimationFrame(updateTimer);
}

// Función para formatear el tiempo (pit stops)
function formatTimePit(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}

// Cambiar el intervalo de reinicio a 25 segundos (15s animación + 10s pausa)
let circlesTimeout;
function restartCirclesWithPause() {
  createCircles();
  if (circlesTimeout) clearTimeout(circlesTimeout);
  circlesTimeout = setTimeout(restartCirclesWithPause, 25000); // 25 segundos
}

// Iniciar la animación con pausa
restartCirclesWithPause();