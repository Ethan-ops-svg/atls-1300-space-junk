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