const Hole = require("./../shared/Hole").default;
const Ball = require("./../shared/Ball").default;
const Bound = require("./../shared/Bound").default;
const Breakable = require("./../shared/Breakable").default;

export default class GameEngine{
  constructor(){
    this.setState({
      statics: [],
      dynamics: [],
      balls: [],
      W:0,
      H:0
    });
  }

  moveHole(playerId, x, y){
    const hole = this.statics.find(wo=>wo.type==="Hole");
    hole.x = x;
    hole.y = y;
  }

  addBall(playerId, x, y) {

  }

  addBreakable(x, y, radius, score) {
    const newBreakable = new Breakable(x, y, radius, score);
    this.dynamics.push(newBreakable);
  }

  setState(state){
    if(state.statics !== undefined) this.statics = state.statics;
    if(state.dynamics !== undefined) this.dynamics = state.dynamics;
    if(state.balls !== undefined) this.balls = state.balls;
    if(state.W !== undefined) this.W = state.W;
    if(state.H !== undefined) this.H = state.H;
  }

  get state() {
    return {
      statics: this.statics,
      dynamics: this.dynamics,
      balls: this.balls,
      W: this.W,
      H: this.H
    }
  }

  step(timeStep) {
    this.balls.forEach(ball => {
      this.statics.forEach(st => st.interact(ball, timeStep));
      this.dynamics = this.dynamics.filter(d => !d.interact(ball, timeStep));
      ball.interact(timeStep);
    });
  }

}