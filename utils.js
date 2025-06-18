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

const svg = document.querySelector("svg");
const labelContainer = document.getElementById("labels");
const circlesGrid = document.getElementById("circlesGrid");
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

    svg.appendChild(circle);

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
    labelContainer.appendChild(label);

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
      element.circle.style.transition = `stroke-dasharray ${element.duration}ms ease-out`;
      element.circle.style.strokeDasharray = `${element.circumference} 0`;

      // Al completar, mostrar el label de nuevo con tiempo final
      setTimeout(() => {
        label.classList.remove("hidden");
        label.classList.add("visible");
        element.textEl.textContent = formatTime(element.team.time);
      }, element.duration);

    }, 100);
  });

  // Reiniciar el main-timer
  mainTimer.textContent = "0:00.000";
  animateMainTimer(maxTime, 14000);
}, 16000);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}