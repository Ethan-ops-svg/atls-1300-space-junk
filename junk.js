class Junk {

  constructor(x, y, dx, dy) {
    this.physics = new Physics({ x, y, dx, dy });
    this.beamTime = 0; 
  }

  update(delta) {
    this.physics.move(delta, { constrain: true });
  }

  render(catchTimeMs) {
    const { x, y } = this.physics;
    push();
    translate(x, y);
    Junk.drawJunk();
    
    if (this.beamTime > 0) {
      const frac = constrain(this.beamTime / catchTimeMs, 0, 1);
      noFill();
      stroke("#f5f370");
      strokeWeight(2);
      arc(0, 0, Junk.DIAMETER + 10, Junk.DIAMETER + 10, -HALF_PI, -HALF_PI + TWO_PI * frac);
    }
    pop();
  }

 
  static drawJunk() {
    push();
    noStroke();
    fill("#a0936a");
    circle(0, 0, Junk.DIAMETER);
    pop();
  }
}


Junk.DIAMETER = 18;