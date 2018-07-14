"use strict";
const Hole = require("./../shared/Hole").default;
const Ball = require("./../shared/Ball").default;
const Bound = require("./../shared/Bound").default;
const Breakable = require("./../shared/Breakable").default;
const GameEngine = require("./../shared/GameEngine").default;
const MAX_AGE = 5000;
const DT = 1 / 60;

module.exports = class GameServer {
  constructor(onStateChange, onGameEnd) {
    this.age = 0;
    this.dt = DT;
    this.status = "INITIALIZING";
    this.gameEngine = new GameEngine();
    this.onStateChange = onStateChange;
    this.onGameEnd = onGameEnd;
  }

  initializeMap() {
    this.gameEngine.setState({
      statics: [
        new Bound(0, 1000, 0, 1000, "stars.jpeg"),
        new Bound(140, 190, 80, 180),
         new Bound(240, 300, 80, 180),
        new Hole(250, 150),
      ],
      dynamics: [
        new Breakable(500, 500, 40, 101)
      ],
      balls: [
        //new Ball(40, 40, 9),
        new Ball(340, 340, 20),
      ],
      W: 1000,
      H: 1000
    });
  }

  moveHole(playerId, data) {
    this.gameEngine.moveHole(playerId, data.x, data.y);
  }

  start() {
    if (this.interval) return;
    this.status = "RUNNING";
    this.initializeMap();
    this.interval = setInterval(() => {
      this.step(this.dt, false);
      try {
        this.onStateChange(this.gameEngine.state);
        if (this.age++ > MAX_AGE) {
          clearInterval(this.interval);
          this.status = "ENDED";
          this.onGameEnd();
        }
      } catch (e) {
        console.error(e);
      }
    }, this.dt * 1000);
  }

  step(timeStep) {
    if (Math.random() < 0.01) {
      const radius = Math.random() * 20 + 10;
      this.gameEngine.addBreakable(
        this.gameEngine.W * Math.random(),
        this.gameEngine.H * Math.random(),
        radius,
        Math.round(100 / radius)
      );
    }
    this.gameEngine.step(timeStep);
    this.onStateChange(this.gameEngine.state);
  }

};

