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
  
  const circlesGrid = document.getElementById("circlesGrid");
  
  const minTime = Math.min(...teams.map(t => t.time));
  const maxTime = Math.max(...teams.map(t => t.time));
  
  teams.forEach((team, index) => {
    const circleItem = document.createElement("div");
    circleItem.className = "circle-item";
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
  
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
  
    const relative = (team.time - minTime) / (maxTime - minTime);
    const duration = 2000 + relative * 8000;
  
    const strokeColor = team.name === "McLaren" ? "#FF8700" : "#666";
  
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
  
    const circleInfo = document.createElement("div");
    circleInfo.className = "circle-info";
  
    const circleName = document.createElement("div");
    circleName.className = "circle-name";
    circleName.textContent = team.name;
  
    const circleTime = document.createElement("div");
    circleTime.className = "circle-time";
    circleTime.textContent = formatTime(team.time);
  
    circleInfo.appendChild(circleName);
    circleInfo.appendChild(circleTime);
  
    circleItem.appendChild(svg);
    circleItem.appendChild(circleInfo);
    circlesGrid.appendChild(circleItem);
  
    setTimeout(() => {
      circle.style.strokeDasharray = `${circumference} 0`;
    }, 100);
  });
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3).padStart(6, "0");
    return `${mins}:${secs}`;
  }