import Ball from "./Ball";
import Hole from "./Hole";
import Bound from "./Bound";
import Network from "./Network";
import Breakable from "./Breakable";
import GameEngine from "../shared/GameEngine";

let lastTimestamp = 0;
let firstDraw = true;
const canvas = document.getElementById("canvas");
const network = new Network();
network.login("MY_ROOM");
const SCALE = 4;

const gameEngine = new GameEngine();

window.onresize = () => {
  const gameRatio = canvas.width / canvas.height;
  const windowRatio = window.innerWidth / window.innerHeight;

  if (windowRatio <= gameRatio) {
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerWidth / gameRatio;
  } else {
    canvas.style.width = window.innerHeight / gameRatio;
    canvas.style.height = window.innerHeight;
  }

  firstDraw = true;
};

let lastBoardState;

const gameObjects = {};

function objFactory(state, clazz) {
  if (gameObjects[state.id]) {
    gameObjects[state.id].setState(state);
    return gameObjects[state.id];
  }
  return gameObjects[state.id] = new clazz(state, SCALE);
}

network.onData = (d) => {
  //if(lastBoardState) return; //Uncomment for local mode
  lastBoardState = d;
  const scale = SCALE;
  if (canvas.width != d.W * scale) {
    setTimeout(window.onresize, 1);
  }
  canvas.width = d.W * scale;
  canvas.height = d.H * scale;

  const balls = d.balls.map(ballData => objFactory(ballData, Ball));
  const statics = d.statics.map(woData => {
    if (woData.type === "Hole") return objFactory(woData, Hole);
    if (woData.type === "Bound") return objFactory(woData, Bound);
  });
  const dynamics = d.dynamics.map(woData => {
    if (woData.type === "Breakable") return objFactory(woData, Breakable);
  });
  gameEngine.setState({balls, statics, dynamics});
};

canvas.onclick = (e) => {
  const canvasDrawSize = canvas.getBoundingClientRect().width;
  const screenToGameRatio = lastBoardState.W / canvasDrawSize;
  const x = e.offsetX * screenToGameRatio;
  const y = e.offsetY * screenToGameRatio;
  //Uppdate locallu
  gameEngine.moveHole(0, x, y);

  //Send to server
  network.send({x, y});
};

const frame = (timestamp) => {
  const timeStep = timestamp - lastTimestamp;
  gameEngine.step(timeStep / 1000);
  lastTimestamp = timestamp;
  draw(gameEngine.state);
  window.requestAnimationFrame(frame);
};

const draw = (state) => {
  const ctx = canvas.getContext("2d", {alpha: firstDraw});
  ctx.imageSmoothingEnabled = true;
  ctx.save();
  state.balls.forEach(ball => ball.clear(ctx));
  state.dynamics.forEach(d => d.clear(ctx));
  state.statics.forEach(s => s.clear(ctx));
  state.statics.forEach(s => s.draw(ctx));
  state.dynamics.forEach(d => d.draw(ctx));
  state.balls.forEach(ball => ball.draw(ctx));
  firstDraw = false;
};

window.requestAnimationFrame(frame);
