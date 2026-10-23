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