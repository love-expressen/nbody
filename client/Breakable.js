import Breakable from "../shared/Breakable";

export default class ClientBreakable extends Breakable{

  constructor(state = {}, scale = 1) {
    console.log("MAKE breakable");
    super(state.x, state.y, state.radius, state.value);
    this.scalingFactor = scale;
    this.setState(state);
  }

  setState(state) {
    this.id = state.id;
    this.x = state.x || 0;
    this.y = state.y || 0;
    this.radius = state.radius || 0;
    this.scale(this.scalingFactor);
  }

  //TODO: Just scale while drawing!
  scale(val) {
    this.x *= val;
    this.y *= val;
  }

  clear(ctx) {
    ctx.clearRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    )
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,0,.9)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};
