const worldObjects = [
  new Hole(300, 150),
  new Bound(0, 600, 0, 600),
  new Bound(140, 190, 80, 180),
  new Bound(240, 300, 80, 180),
  new Bound(240, 300, 80, 180),
];

const balls = [
  new Ball(40, 40, 9),
  new Ball(340, 540, 20),
];
const s = 0;
balls[0].velocity.x = 100 * s;
balls[0].velocity.y = 40 * s;

const W = 600;
const H = 600;

const canvas = document.getElementById("canvas");
canvas.width = canvas.style.width = W;
canvas.height = canvas.style.height = H;

canvas.onclick = (e) => {
  worldObjects[0].clear(canvas.getContext("2d"), { alpha: false });
  worldObjects[0].x = e.x;
  worldObjects[0].y = e.y;
}

const step = (timeStep, firstDraw) => {
  const ctx = canvas.getContext("2d",{ alpha: firstDraw });
  ctx.save();
  balls.forEach(ball=>ball.clear(ctx));
  worldObjects.forEach(wo=>wo.clear(ctx));

  balls.forEach(ball => {
    worldObjects.forEach(wo => wo.interact(ball, timeStep));
    ball.interact(timeStep);
    ball.draw(ctx);
  });

  worldObjects.forEach(wo => wo.draw(ctx));
};

let lastTimestamp = 0;
let firstDraw = true;
frame = (timestamp) => {
  const timeStep = timestamp - lastTimestamp;
  step(timeStep/1000, firstDraw);
  firstDraw = false;
  lastTimestamp = timestamp;
  //window.requestAnimationFrame(frame);
};

window.requestAnimationFrame(frame);
