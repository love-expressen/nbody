import Pattern from "./Pattern";
import Ball from "../shared/Ball";
const TAIL_LENGTH = 500;

export default class ClientBall extends Ball {
  constructor(state = {}, scale = 1) {
    super(state.position.x, state.position.y, state.radius);
    this.tail = [];
    this.scalingFactor = scale;
  }

  setState(state) {
    super.setState(state);
  }

  interact(dt) {
    if(this.position){
      this.tail.unshift({...this.position});
      this.trimTail();
    }
    super.interact(dt);
  }

  trimTail() {
    if (this.tail.length <= TAIL_LENGTH) {
      return;
    }
    this.tail.splice(TAIL_LENGTH, this.tail.length - TAIL_LENGTH);
  };

  clear(ctx) {
    /*ctx.clearRect(
      this.position.x - this.radius - 1,
      this.position.y - this.radius - 1,
      this.radius * 2 + 2,
      this.radius * 2 + 2
    )*/
  }

  draw(ctx) {
    ctx.save();
    this.drawTail(ctx);
    this.drawTrace(ctx);
    this.drawCircle(ctx, this.position);
    ctx.restore();
  }

  drawTrace(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.position.x * this.scalingFactor, this.position.y * this.scalingFactor);
    this.tail.forEach((pos, idx) => {
      ctx.lineTo(pos.x * this.scalingFactor, pos.y * this.scalingFactor);
    });

    ctx.strokeStyle = "rgba(255,255,255,.3)";
    ctx.lineWidth = this.scalingFactor * 2;
    ctx.stroke();
  }

  drawTail(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.position.x * this.scalingFactor, this.position.y * this.scalingFactor);
    this.tail.forEach((pos, idx) => {
      if (idx < 100 && idx % 10 === 0) {
        this.drawCircle(ctx, pos, this.radius * (1 - (idx / 10) * .1));
      }
    });
  }

  drawCircle(ctx, offset, radius = this.radius) {
    const patternX = 400;
    const patternY = 50;
    ctx.restore();
    const translation = {
      x: offset.x * this.scalingFactor - patternX,
      y: offset.y * this.scalingFactor - patternY,
    };

    ctx.translate(translation.x, translation.y);
    if (!this.pattern) {
      this.pattern = new Pattern(ctx, "steel.jpg");
    }
    this.pattern.draw(ctx);
    ctx.beginPath();
    ctx.arc(patternX, patternY, radius * this.scalingFactor, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(-translation.x, -translation.y);
  }
};
