const paper = document.querySelector('#paper'),
  pencil = paper.getContext('2d');

let soundEnabled = false;

const settings = {
  startTime: new Date().getTime(),
  duration: 300, // in seconds
  pulseEnabled: true
}

document.onvisibilitychange = () => soundEnabled = false;

// paper.onclick = () => soundEnabled = !soundEnabled;

const calculateNextImpactTime = (currentImpactTime, velocity) => {
  return currentImpactTime + (Math.PI / velocity) * 1000;
};

const calculateDynamicOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  const timeSinceImpact = currentTime - lastImpactTime,
    percentage = Math.min(timeSinceImpact / duration, 1),
    opacityDelta = maxOpacity - baseOpacity;

  return maxOpacity - (opacityDelta * percentage);
}

const determineOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
  if (!settings.pulseEnabled) return baseOpacity;

  return calculateDynamicOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration);
}

// Single color support
const arcs = Array(21).fill("#0A0B18").map((color, index) => {
  const audio = new Audio(`assets/sounds/note_${index}.mp3`);

  audio.volume = 0.01;

  const oneFullLoop = 2 * Math.PI,
    lastImpactTime = 0,
    numberOfLoops = oneFullLoop * (100 - index),
    velocity = numberOfLoops / settings.duration;

  return {
    color,
    audio,
    lastImpactTime,
    nextImpactTime: calculateNextImpactTime(settings.startTime, velocity),
    velocity
  }
});

const draw = () => {
  const currentTime = new Date().getTime(),
    elapsedTime = (currentTime - settings.startTime) / 1000;

  paper.width = paper.clientWidth;
  paper.height = paper.clientHeight;

  const length = Math.min(paper.width, paper.height) * 0.9,
    offset = (paper.width - length) / 2;

  const start = {
    x: offset,
    y: paper.height / 2
  }

  const end = {
    x: paper.width - offset,
    y: paper.height / 2
  }

  pencil.strokeStyle = "white";
  pencil.lineWidth = 1;

  // draw line
  // pencil.beginPath();
  // pencil.moveTo(start.x, start.y);
  // pencil.lineTo(end.x, end.y);
  // pencil.stroke();

  const center = {
    x: paper.width * 0.5,
    y: paper.height * 0.5
  };

  const initalArcRadius = length * 0.03;

  const spacing = (length / 1.92 - initalArcRadius) / arcs.length;

  // center dot
  // pencil.fillStyle = "white";
  // pencil.beginPath();
  // pencil.arc(center.x, center.y, length * 0.0025, Math.PI, (4 * Math.PI));
  // pencil.fill();


  arcs.forEach((arc, index) => {
    const arcRadius = initalArcRadius + (index * spacing);

    // draw arc
    pencil.shadowColor = 'transparent'; // remove shadow for arc
    pencil.beginPath();
    pencil.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.08, 0.20, 1000);
    console.log
    pencil.strokeStyle = "arc.color";
    pencil.arc(center.x, center.y, arcRadius, Math.PI, 4 * Math.PI);
    pencil.stroke();

    const maxAngle = 2 * Math.PI,
      distance = Math.PI + ((elapsedTime * arc.velocity)),
      modDistance = distance % maxAngle,
      adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

    const x = center.x + arcRadius * Math.cos(modDistance),
      y = center.y + arcRadius * Math.sin(modDistance);

    // draw dot with dropshadow glow
    pencil.globalAlpha = 1;
    pencil.shadowColor = 'white';
    pencil.shadowBlur = 10;
    pencil.shadowOffsetX = 0;
    pencil.shadowOffsetY = 0;
    pencil.fillStyle = "white";
    pencil.beginPath();
    pencil.arc(x, y, length * 0.0030, 0, 2 * Math.PI);
    pencil.fill();
    pencil.shadowColor = 'transparent'; // remove shadow for next dot


    if (currentTime >= arc.nextImpactTime) {
      if (soundEnabled) {
        arc.audio.play();
      }
      arc.lastImpactTime = arc.nextImpactTime;
      arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
    }
  });

  requestAnimationFrame(draw);
};

draw();