import uuid from "uuid";

export default class Breakable {

  constructor(xPos, yPos, radius, value) {
    this.id = uuid.v4();
    this.type = "Breakable";
    this.x = xPos;
    this.y = yPos;
    this.radius = radius;
    this.value = value;
  }

  interact(ball) {
    const distVec = {
      x: this.x - ball.position.x,
      y: this.y - ball.position.y
    };
    const distToHole = Math.sqrt(
      Math.pow(distVec.x, 2) +
      Math.pow(distVec.y, 2)
    );

    if(distToHole < this.radius) {
      return true;
    }

  }
};
