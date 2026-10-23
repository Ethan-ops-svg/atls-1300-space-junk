class Magpie {

  constructor(x, y) {
    this.physics = new Physics({ x, y });
    this.beam = false;
    this.capturedJunk = null;
  }

  reset(x, y) {
    this.physics = new Physics({ x, y });
    this.beam = false;
    this.capturedJunk = null;
  }

  update(delta) {
    this.physics.limitSpeed(Magpie.MAX_SPEED);
    this.physics.move(delta, { constrain: true });
  }

  
  enableBeam(v) {
    if (!v) this.beam = false;
    else if (!this.capturedJunk) this.beam = true;
  }

  
  beamContains(itemPhysics) {
    if (!this.beam) return false;
    const wx = itemPhysics.x - this.physics.x;
    const wy = itemPhysics.y - this.physics.y;
    const r = this.physics.rotation;
    const lx = wx * Math.cos(r) + wy * Math.sin(r);
    const ly = -wx * Math.sin(r) + wy * Math.cos(r);
    if (ly < 0 || ly > Magpie.BEAM_HEIGHT) return false;
    const halfWidthAtY = (ly / Magpie.BEAM_HEIGHT) * (Magpie.BEAM_WIDTH / 2);
    return Math.abs(lx) <= halfWidthAtY;
  }

  render() {
    push();
    translate(this.physics.x, this.physics.y);
    Magpie.drawMagpie({
      rotation: this.physics.rotation,
      beam: this.beam,
      carrying: !!this.capturedJunk,
    });
    pop();
  }

  static drawMagpie({ rotation, beam, carrying = false }) {
    push();
    rotate(rotation);
    noStroke();
    if (beam) {
      const bx = Magpie.BEAM_WIDTH / 2;
      const bh = Magpie.BEAM_HEIGHT;
      fill("#f5f37040");
      triangle(0, 0, bx, bh, -bx, bh);
    }
    if (carrying) {
      
      push();
      translate(0, Magpie.DOME_HEIGHT / 2 + Magpie.PLATFORM_HEIGHT + Junk.DIAMETER / 2);
      Junk.drawJunk();
      pop();
    }
    rectMode(CENTER);
    fill("#525d80");
    rect(0, 0, Magpie.DOME_WIDTH, Magpie.DOME_HEIGHT, 8);
    fill("#959ebb");
    rect(0, Magpie.DOME_HEIGHT / 2, Magpie.PLATFORM_WIDTH, Magpie.PLATFORM_HEIGHT);
    Magpie.drawWindow();
    pop();
  }

  static drawWindow() {
    push();
    rectMode(CORNER);
    fill("#70eef5");
    const winX = Magpie.DOME_WIDTH / 2 - Magpie.WINDOW_WIDTH;
    const winY = -Magpie.WINDOW_HEIGHT;
    rect(winX, winY, Magpie.WINDOW_WIDTH, Magpie.WINDOW_HEIGHT, 1.5);
    pop();
  }
}


Magpie.DOME_WIDTH = 40;
Magpie.DOME_HEIGHT = 30;
Magpie.PLATFORM_WIDTH = 60;
Magpie.PLATFORM_HEIGHT = 6;
Magpie.WINDOW_WIDTH = 12;
Magpie.WINDOW_HEIGHT = 10;
Magpie.BEAM_WIDTH = 110;
Magpie.BEAM_HEIGHT = 140;
Magpie.MAX_SPEED = 280;