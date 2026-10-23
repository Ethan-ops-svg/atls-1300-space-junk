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