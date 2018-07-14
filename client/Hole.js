import Hole from "../shared/Hole";

export default class ClientHole extends Hole {

  constructor(state = {}, scale = 1) {
    super(state.x, state.y);
    this.scalingFactor = scale;
    this.setState(state);
    this.radius = 20 * scale;
  }

  setState(state) {
    this.id = state.id;
    this.x = state.x || 0;
    this.y = state.y || 0;
  }

  clear(ctx) {
    ctx.clearRect(
      (this.x - this.radius) * this.scalingFactor,
      (this.y - this.radius) * this.scalingFactor,
      (this.radius * 2) * this.scalingFactor,
      (this.radius * 2) * this.scalingFactor
    )
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(255,255,0,.9)";
    ctx.beginPath();
    ctx.arc(
      this.x * this.scalingFactor,
      this.y * this.scalingFactor,
      this.radius * this.scalingFactor,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
};
