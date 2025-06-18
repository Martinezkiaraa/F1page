const svg = document.getElementById('svg');
const counter = document.getElementById('counter');

const totalCircles = 10;
const baseDuration = 10; // en segundos (para el círculo más externo)
const stepDuration = 4;  // más duración cuanto más adentro
const stepBetween = 30;
const minRadius = 50;
const maxRadius = minRadius + (totalCircles - 1) * stepBetween;

const centerX = 210;
const centerY = 210;

const circles = [];

for (let i = 0; i < totalCircles; i++) {
  const radius = maxRadius - i * stepBetween;
  const duration = baseDuration + (totalCircles - 1 - i) * stepDuration;

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", centerX);
  circle.setAttribute("cy", centerY);
  circle.setAttribute("r", radius);
  circle.setAttribute("stroke", i === totalCircles - 1 ? "#FF9800" : "#ccc");

  svg.appendChild(circle);

  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = circumference;

  circles.push({ element: circle, duration, circumference, startTime: null });
}

// ⏱ CONTADOR numérico (independiente)
let seconds = 0;
counter.textContent = `${seconds}s`;
const counterInterval = setInterval(() => {
  seconds++;
  counter.textContent = `${seconds}s`;
}, 100);

// 🌀 ANIMACIÓN de círculos (independiente)
function animateCircles(timestamp) {
  let allDone = true;

  circles.forEach(circle => {
    if (!circle.startTime) circle.startTime = timestamp;

    const elapsed = (timestamp - circle.startTime) / 1000; // en segundos
    const progress = Math.min(elapsed / circle.duration, 1);
    const offset = circle.circumference * (1 - progress);

    circle.element.style.strokeDashoffset = offset;

    if (progress < 1) allDone = false;
  });

  if (!allDone) {
    requestAnimationFrame(animateCircles);
  } else {
    clearInterval(counterInterval); // detener el contador si querés
  }
}
