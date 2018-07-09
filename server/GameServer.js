"use strict";

const Hole = require("./Hole");
const Ball = require("./Ball");
const Bound = require("./Bound");

module.exports = class GameServer {
  constructor() {
    this.worldObjects = [
      new Hole(250, 150),
      new Bound(0, 600, 0, 600),
      new Bound(140, 190, 80, 180),
      new Bound(240, 300, 80, 180),
      new Bound(240, 300, 80, 180),
    ];

    this.balls = [
      new Ball(40, 40, 9),
      new Ball(340, 540, 20),
    ];
    const s = 0;
    this.balls[0].velocity.x = 100 * s;
    this.balls[0].velocity.y = 40 * s;

    this.W = 600;
    this.H = 600;
  }

  moveHole(data){
    const hole = this.worldObjects.find(wo=>wo.type==="Hole");
    hole.x = data.x;
    hole.y = data.y;
  }

  step(timeStep, firstDraw) {
    this.balls.forEach(ball => {
      this.worldObjects.forEach(wo => wo.interact(ball, timeStep));
      ball.interact(timeStep);
    });
  }

  getState() {
    return {
      worldObjects: this.worldObjects,
      balls: this.balls,
      W: this.W,
      H: this.H
    }
  }
};

