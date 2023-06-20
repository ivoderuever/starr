// Single color support
const arcs = Array(21).fill("#0A0B18");

const paper = document.querySelector('#paper'),
  pencil = paper.getContext('2d');

let startTime = new Date().getTime();;

const draw = () => {
  const currentTime = new Date().getTime(),
    elapsedTime = (currentTime - startTime) / 1000;

  paper.width = paper.clientWidth;
  paper.height = paper.clientHeight;

  const start = {
    x: paper.width * 0.25,
    y: paper.height * 0.5
  }

  const end = {
    x: paper.width * 0.75,
    y: paper.height * 0.5
  }

  pencil.strokeStyle = "white";
  pencil.lineWidth = 6;

  // draw line
  // pencil.beginPath();
  // pencil.moveTo(start.x, start.y);
  // pencil.lineTo(end.x, end.y);
  // pencil.stroke();

  const center = {
    x: paper.width * 0.5,
    y: paper.height * 0.5
  };

  const length = end.x - start.x,
    initalArcRadius = length * 0.03;

  const spacing = (length / 1.92 - initalArcRadius) / arcs.length;

  // center dot
  pencil.fillStyle = "white";
  pencil.beginPath();
  pencil.arc(center.x, center.y, length * 0.0065, Math.PI, (4 * Math.PI));
  pencil.fill();


  arcs.forEach((arc, index) => {
    const arcRadius = initalArcRadius + (index * spacing);

    // draw arc
    pencil.beginPath();
    pencil.strokeStyle = arc;
    pencil.arc(center.x, center.y, arcRadius, Math.PI, 4 * Math.PI);
    pencil.stroke();

    const oneFullLoop = 2 * Math.PI,
      numberOfLoops = 50 - index,
      velocity = (oneFullLoop * numberOfLoops) / 120,
      maxAngle = 2 * Math.PI,
      distance = Math.PI + ((elapsedTime * velocity)),
      modDistance = distance % maxAngle,
      adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

    const x = center.x + arcRadius * Math.cos(modDistance),
      y = center.y + arcRadius * Math.sin(modDistance);

    // draw dot
    pencil.fillStyle = "white";
    pencil.beginPath();
    pencil.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
    pencil.fill();
  });

  requestAnimationFrame(draw);
};

draw();