let inc = 0.06;
let scl = 20;
let cols, rows;

let zoff = 0;
let flowfield = [];
let particles = [];

const worldWidth = 4200;
const worldHeight = 2800;
const baseParticleCount = 900;

function setup() {
  const canvas = createCanvas(worldWidth, worldHeight);
  canvas.parent("canvas-holder");

  background(255);

  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);

  for (let i = 0; i < baseParticleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(255, 18);

  let yoff = 0;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      let angle = noise(xoff, yoff, zoff) * TWO_PI * 6;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.28);

      flowfield[index] = v;

      xoff += inc;
    }

    yoff += inc;
  }

  zoff += 0.0025;

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    p.follow(flowfield);
    p.update();
    p.edges();
    p.show();

    if (p.finished()) {
      particles.splice(i, 1);
    }
  }

  while (particles.length < baseParticleCount) {
    particles.push(new Particle());
  }

  if (random() < 0.02 && particles.length < 1400) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function spawnBurst(x, y, count = 14) {
  for (let i = 0; i < count; i++) {
    particles.push(
      new Particle(
        x + random(-14, 14),
        y + random(-14, 14)
      )
    );
  }
}

function mousePressed() {
  spawnBurst(mouseX, mouseY, 50);
}

function mouseDragged() {
  spawnBurst(mouseX, mouseY, 12);
  return false;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(
      x !== undefined ? x : random(width * 0.2, width * 0.8),
      y !== undefined ? y : random(height * 0.2, height * 0.8)
    );

    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);

    this.maxspeed = random(2, 5);

    this.prevPos = this.pos.copy();

    this.alpha = random(140, 255);

    this.strokeSize = random(1.5, 8);
  }

  finished() {
    return this.alpha <= 0;
  }

  update() {
    this.acc.add(p5.Vector.random2D().mult(0.12));

    this.vel.add(this.acc);

    this.vel.limit(this.maxspeed);

    this.pos.add(this.vel);

    this.acc.mult(0);

    this.alpha -= 0.2;
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);

    x = constrain(x, 0, cols - 1);
    y = constrain(y, 0, rows - 1);

    let index = x + y * cols;

    let force = vectors[index];

    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    let speed = this.vel.mag();

    let sw = map(
      speed,
      0,
      this.maxspeed,
      0.8,
      this.strokeSize
    );

    stroke(0, this.alpha);

    strokeWeight(sw);

    line(
      this.pos.x,
      this.pos.y,
      this.prevPos.x,
      this.prevPos.y
    );

    if (random() < 0.03) {
      stroke(60, 20);

      strokeWeight(max(0.4, sw * 0.12));

      line(
        this.pos.x,
        this.pos.y,
        this.prevPos.x,
        this.prevPos.y
      );
    }

    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    let wrapped = false;

    if (this.pos.x > width) {
      this.pos.x = 0;
      wrapped = true;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
      wrapped = true;
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      wrapped = true;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
      wrapped = true;
    }

    if (wrapped) {
      this.updatePrev();
    }
  }
}
