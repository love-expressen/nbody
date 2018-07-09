let lastTimestamp = 0;
let firstDraw = true;
const canvas = document.getElementById("canvas");
const network = new Network();
network.login("MY_ROOM");
network.onData = (d) => {
  canvas.width = canvas.style.width = d.W;
  canvas.height = canvas.style.height = d.H;
  const balls = d.balls.map(ballData => new Ball(ballData));
  const worldObjects = d.worldObjects.map(woData => {
    if(woData.type === "Hole") return new Hole(woData);
    if(woData.type === "Bound") return new Bound(woData);
  });
  const ctx = canvas.getContext("2d",{ alpha: firstDraw });
  ctx.save();
  balls.forEach(ball=>ball.clear(ctx));
  worldObjects.forEach(wo=>wo.clear(ctx));
  balls.forEach(ball=>ball.draw(ctx));
  worldObjects.forEach(wo => wo.draw(ctx));
  firstDraw = false;
};


canvas.onclick = (e) => {
  //worldObjects[0].clear(canvas.getContext("2d"), { alpha: false });
  network.send({x:e.x, y:e.y});
}



frame = (timestamp) => {
  /*const timeStep = timestamp - lastTimestamp;
  step(timeStep/1000, firstDraw);
  firstDraw = false;
  lastTimestamp = timestamp;*/
  //window.requestAnimationFrame(frame);
};

window.requestAnimationFrame(frame);
