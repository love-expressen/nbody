import uuid from "uuid";

export default class Hole {
  static get radius() {
    return 20
  };

  constructor(xPos, yPos) {
    this.id = uuid.v4();
    this.type = "Hole";
    this.x = xPos;
    this.y = yPos;
  }

  interact(ball, dt) {
    const distVec = {
      x: this.x - ball.position.x,
      y: this.y - ball.position.y
    };
    const distToHole = Math.sqrt(
      Math.pow(distVec.x, 2) +
      Math.pow(distVec.y, 2)
    );

    const normalizedDist = {
      x: distVec.x / distToHole,
      y: distVec.y / distToHole
    };
    const force = Math.min(1000, 100000 / Math.pow(distToHole, 1));
    ball.velocity.x += force * dt * normalizedDist.x;
    ball.velocity.y += force * dt * normalizedDist.y;
  }
};
