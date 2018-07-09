module.exports = class Ball {
  constructor(xPos, yPos, radius) {
    this.type = "Ball";
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

  clear(ctx) {
    ctx.clearRect(
      this.position.x - this.radius -1,
      this.position.y - this.radius -1,
      this.radius * 2 + 2,
      this.radius * 2 +2
    )
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill()
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
