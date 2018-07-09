class Hole {
  static get radius() {
    return 20
  };

  constructor(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }

  clear(ctx) {
    ctx.clearRect(
      this.x - Hole.radius,
      this.y - Hole.radius,
      Hole.radius * 2,
      Hole.radius * 2
    )
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(0,0,0,.4)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, Hole.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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
