import uuid from "uuid";

export default class Ball {
  constructor(xPos, yPos, radius) {
    this.type = "Ball";
    this.id = uuid.v4();
    this.position = {
      x: xPos,
      y: yPos
    };

    this.velocity = {
      x: 0,
      y: 0
    };

    this.radius = radius;
  }

  setState(state){
    this.id = state.id;
    this.position = state.position || {x:0, y:0};
    this.velocity = state.velocity || {x: 0, y: 0};
    this.radius = state.radius || 10;
  }

  interact(dt) {
    this.velocity.x *= 1 - dt;
    if (Math.abs(this.velocity.x) < .01) this.velocity.x = 0;
    this.velocity.y *= 1 - dt;
    if (Math.abs(this.velocity.y) < .01) this.velocity.y = 0;

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }
};
