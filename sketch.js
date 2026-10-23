class Physics {
  constructor({ x = 0, y = 0, dx = 0, dy = 0, rotation = 0 } = {}) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.rotation = rotation;
  }

  
  move(delta, { constrain = false } = {}) {
    const seconds = delta / 1000;
    this.x += this.dx * seconds;
    this.y += this.dy * seconds;
    if (constrain) {
      while (this.x < 0) this.x += width;
      while (this.y < 0) this.y += height;
      while (this.x >= width) this.x -= width;
      while (this.y >= height) this.y -= height;
    }
  }

  
  rotate(rate, delta) {
    this.rotation += rate * (delta / 1000);
  }

  
  thrust(accel, delta) {
    const amt = accel * (delta / 1000);
    this.dx += Math.sin(this.rotation) * amt;
    this.dy += Math.cos(this.rotation) * -amt;
  }

  
  limitSpeed(maxSpeed) {
    const speed = Math.hypot(this.dx, this.dy);
    if (speed > maxSpeed) {
      this.dx = (this.dx / speed) * maxSpeed;
      this.dy = (this.dy / speed) * maxSpeed;
    }
  }
}


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


class Mothership {

  constructor(x, y) {
    this.physics = new Physics({ x, y });
  }

  
  isNear(itemPhysics) {
    const dx = Math.abs(itemPhysics.x - this.physics.x);
    const dy = Math.abs(itemPhysics.y - this.physics.y);
    return (
      dx < Mothership.WIDTH / 2 + Mothership.DELIVERY_MARGIN &&
      dy < Mothership.HEIGHT / 2 + Mothership.DELIVERY_MARGIN
    );
  }

  render(highlight = false) {
    push();
    translate(this.physics.x, this.physics.y);
    if (highlight) {
      noFill();
      stroke("#70eef580");
      strokeWeight(2);
      rectMode(CENTER);
      rect(
        0,
        0,
        Mothership.WIDTH + Mothership.DELIVERY_MARGIN * 2,
        Mothership.HEIGHT + Mothership.DELIVERY_MARGIN * 2,
        Mothership.CORNER_RADIUS + 10,
      );
    }
    Mothership.drawMothership({ rotation: this.physics.rotation });
    pop();
  }

  static drawMothership({ rotation }) {
    push();
    rotate(rotation);
    noStroke();
    fill("#741160");
    rectMode(CENTER);
    rect(0, 0, Mothership.WIDTH, Mothership.HEIGHT, Mothership.CORNER_RADIUS);
    fill("#70eef5");
    const gap = Mothership.WIDTH / (Mothership.NUM_PORTHOLES + 1);
    for (let i = 0; i < Mothership.NUM_PORTHOLES; i++) {
      const x = -Mothership.WIDTH / 2 + (i + 1) * gap;
      circle(x, 0, Mothership.PORTHOLE_DIAMETER);
    }
    pop();
  }
}


Mothership.WIDTH = 170;
Mothership.HEIGHT = 50;
Mothership.CORNER_RADIUS = 22;
Mothership.NUM_PORTHOLES = 5;
Mothership.PORTHOLE_DIAMETER = 12;
Mothership.DELIVERY_MARGIN = 30;


class Inputs {

  constructor(magpie) {
    this.magpie = magpie;
    this.down = new Set();
    this.restartRequested = false;
    window.addEventListener("keydown", (e) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault(); 
      }
      if (e.code === "KeyR") this.restartRequested = true;
      this.down.add(e.code);
    });
    window.addEventListener("keyup", (e) => this.down.delete(e.code));
    window.addEventListener("blur", () => this.down.clear());
  }

  isDown(...codes) {
    return codes.some((c) => this.down.has(c));
  }

  consumeRestart() {
    const r = this.restartRequested;
    this.restartRequested = false;
    return r;
  }

  
  handleKeyDown(delta) {
    const p = this.magpie.physics;
    if (this.isDown("KeyW", "ArrowUp")) p.thrust(Inputs.THRUST, delta);
    if (this.isDown("KeyS", "ArrowDown")) p.thrust(-Inputs.REVERSE_THRUST, delta);
    if (this.isDown("KeyA", "ArrowLeft")) p.rotate(-Inputs.TURN_RATE, delta);
    if (this.isDown("KeyD", "ArrowRight")) p.rotate(Inputs.TURN_RATE, delta);
    this.magpie.enableBeam(this.isDown("Space"));
  }
}


Inputs.THRUST = 170;
Inputs.REVERSE_THRUST = 100;
Inputs.TURN_RATE = Math.PI * 0.9;


class Level {

  constructor(number, avoid) {
    this.number = number;
    this.junk = [];
    const count = 2 + number * 2; 
    const maxSpeed = 30 + number * 12;
    let tries = 0;
    while (this.junk.length < count && tries++ < 1000) {
      const x = random(Junk.DIAMETER, width - Junk.DIAMETER);
      const y = random(Junk.DIAMETER, height - Junk.DIAMETER);
      
      if (avoid.some((a) => dist(x, y, a.x, a.y) < a.radius)) continue;
      const angle = random(TWO_PI);
      const speed = random(15, maxSpeed);
      this.junk.push(new Junk(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
    }
    this.total = this.junk.length;
  }

  update(delta) {
    for (const j of this.junk) j.update(delta);
  }

  remove(junk) {
    const i = this.junk.indexOf(junk);
    if (i >= 0) this.junk.splice(i, 1);
  }

  get isCleared() {
    return this.junk.length === 0;
  }
}


Level.MAX_LEVEL = 5;


class Game {

  constructor() {
    this.magpie = new Magpie(width / 2, height / 2);
    this.mothership = new Mothership(width / 2, 70);
    this.inputs = new Inputs(this.magpie);
    this.restart();
  }

  restart() {
    this.score = 0;
    this.levelNumber = 1;
    this.state = "banner"; 
    this.bannerTimer = Game.BANNER_MS;
    this.startLevel(1);
  }

  startLevel(n) {
    this.levelNumber = n;
    this.magpie.reset(width / 2, height / 2 + 120);
    this.level = new Level(n, [
      { x: this.magpie.physics.x, y: this.magpie.physics.y, radius: 140 },
      { x: this.mothership.physics.x, y: this.mothership.physics.y, radius: 160 },
    ]);
    this.state = "banner";
    this.bannerTimer = Game.BANNER_MS;
  }

  update(delta) {
    if (this.state === "won") {
      if (this.inputs.consumeRestart()) this.restart();
      return;
    }
    if (this.state === "banner") {
      this.bannerTimer -= delta;
      if (this.bannerTimer <= 0) this.state = "playing";
      return;
    }

    this.inputs.handleKeyDown(delta);
    this.magpie.update(delta);
    this.level.update(delta);

    
    const caught = this.resolveBeam(delta);
    if (caught && !this.magpie.capturedJunk) {
      this.level.remove(caught);
      caught.beamTime = 0;
      this.magpie.capturedJunk = caught;
      this.magpie.enableBeam(false);
    }

    
    if (this.magpie.capturedJunk && this.mothership.isNear(this.magpie.physics)) {
      this.magpie.capturedJunk = null;
      this.score += Game.POINTS_PER_JUNK;
    }

    
    if (this.level.isCleared && !this.magpie.capturedJunk) {
      if (this.levelNumber >= Level.MAX_LEVEL) {
        this.state = "won";
      } else {
        this.startLevel(this.levelNumber + 1);
      }
    }
  }

  
  resolveBeam(delta) {
    const inBeam = [];
    for (const junk of this.level.junk) {
      if (this.magpie.beamContains(junk.physics)) {
        junk.beamTime += delta;
        inBeam.push(junk);
      } else {
        junk.beamTime = Math.max(0, junk.beamTime - delta);
      }
    }
    if (inBeam.length > 0) {
      let best = inBeam[0];
      for (const junk of inBeam) {
        if (junk.beamTime > best.beamTime) best = junk;
      }
      if (best.beamTime > Game.JUNK_CATCH_TIME_MS) return best;
    }
    return null;
  }

  render() {
    background("#0b0d1a");
    this.renderStars();
    this.mothership.render(!!this.magpie.capturedJunk);
    for (const j of this.level.junk) j.render(Game.JUNK_CATCH_TIME_MS);
    this.magpie.render();
    this.renderHud();
    if (this.state === "banner") this.renderBanner(`Level ${this.levelNumber}`, "Beam up the junk and bring it to the mothership");
    if (this.state === "won") this.renderBanner("Space is clean!", `Final score: ${this.score}  -  press R to play again`);
  }

  renderStars() {
    
    if (!this.stars) {
      randomSeed(42);
      this.stars = Array.from({ length: 80 }, () => [random(width), random(height), random(1, 2.2)]);
      randomSeed(millis());
    }
    noStroke();
    fill("#ffffff80");
    for (const [x, y, s] of this.stars) circle(x, y, s);
  }

  renderHud() {
    push();
    noStroke();
    fill("#e8ecff");
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Score: ${this.score}`, 12, 10);
    text(`Level: ${this.levelNumber}/${Level.MAX_LEVEL}`, 12, 32);
    textAlign(RIGHT, TOP);
    text(`Junk left: ${this.level.junk.length + (this.magpie.capturedJunk ? 1 : 0)}`, width - 12, 10);
    textAlign(CENTER, BOTTOM);
    fill("#e8ecff99");
    textSize(13);
    const hint = this.magpie.capturedJunk
      ? "Carrying junk - fly to the mothership!"
      : "W/S thrust   A/D turn   SPACE tractor beam";
    text(hint, width / 2, height - 10);
    pop();
  }

  renderBanner(title, sub) {
    push();
    noStroke();
    fill("#0b0d1acc");
    rect(0, height / 2 - 60, width, 120);
    fill("#e8ecff");
    textAlign(CENTER, CENTER);
    textSize(36);
    text(title, width / 2, height / 2 - 14);
    textSize(16);
    text(sub, width / 2, height / 2 + 28);
    pop();
  }
}


Game.JUNK_CATCH_TIME_MS = 1000;
Game.POINTS_PER_JUNK = 100;
Game.BANNER_MS = 2000;


let game;

function setup() {
  createCanvas(800, 600);
  game = new Game();
}

function draw() {
  
  const delta = Math.min(deltaTime, 50);
  game.update(delta);
  game.render();
}