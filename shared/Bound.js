import uuid from "uuid";

export default class Bound {
  constructor(xMin, xMax, yMin, yMax, style = "BOX") {
    this.id = uuid.v4();
    this.type = "Bound";
    this.x = {min: xMin, max: xMax};
    this.y = {min: yMin, max: yMax};
    this.bounceFactor = .9;
    this.style = style;
  }

  get width() {
    return this.x.max - this.x.min;
  }

  get height() {
    return this.y.max - this.y.min;
  }

  isInside2d(pos, radius) {
    return ["x", "y"].every(
      (dim) => this.getContainmentDim(pos, radius, dim) === 0
    );
  }

  isOutside2d(pos, radius) {
    return ["x", "y"].some(
      (dim) => !this.getContainmentDim(pos, -radius, dim) !== 0
    );
  }

  getContainmentDim(pos, radius, dim) {
    if(pos[dim] - radius < this[dim].min) return -1; //"Inside left"
    if(pos[dim] + radius > this[dim].max) return 1; //"Inside right"

    return 0; //Inside
  }


  interact(ball, dt) {

    const r = ball.radius;
    const pNow = ball.position;
    const pNext = {
      x: pNow.x + ball.velocity.x * dt,
      y: pNow.y + ball.velocity.y * dt
    };

    // Bounces on inside
    if (this.isInside2d(pNow, r)) {
      if(!this.isInside2d(pNext, r)){
        ["x", "y"].forEach(dim => {
          if (this.getContainmentDim(pNow, r, dim) !== this.getContainmentDim(pNext, r, dim)) {
            //Todo: Calculate distance to bounce and deduct.
            ball.velocity[dim] *= -1 * this.bounceFactor;
          }
        });
      }

    }
    //Bounces outside
    else{
      //Inside x
      if(this.getContainmentDim(pNow, -r, "x") === 0){
        if(this.getContainmentDim(pNext, -r, "y") === 0){
          ball.velocity.y *= -1 * this.bounceFactor;
        }
      }
      if(this.getContainmentDim(pNow, -r, "y") === 0){
        if(this.getContainmentDim(pNext, - r, "x") === 0){
          ball.velocity.x *= -1 * this.bounceFactor;
        }
      }
    }
  }
};
