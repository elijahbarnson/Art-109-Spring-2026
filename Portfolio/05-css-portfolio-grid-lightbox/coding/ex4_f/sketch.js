// === AB Ex3 → Class Conversion ===
// Controls:
// Click: set swarm target
// X: clear target
// V: toggle variant
// S: toggle spin
// C: randomize color

let swarm = [];
const N = 18;
let target = null;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('alien-sketch-container');

  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  angleMode(RADIANS);

  for (let i = 0; i < N; i++) {
    let variant = random([0, 1]);
    let pos = createVector(random(width), random(height));
    let vel = p5.Vector.random2D().mult(random(1.2, 2.0));
    let s = random(0.6, 1.4);
    let rot = random(TWO_PI);
    let spin = random(-0.02, 0.02);
    let col = color(random(120,255), random(120,255), random(120,255));
    swarm.push(new AB_Alien(pos, vel, s, rot, spin, col, variant));
  }
}

function draw() {
  background(18, 20, 28);
  abBackgroundStars();

  for (let a of swarm) {
    if (target) a.setTarget(target);
    a.update();
    a.display(); // parent display method internally calls child methods
  }

  abHud();
}

// ===== UI / World (not part of creature) =====
function mousePressed() {
  target = createVector(mouseX, mouseY);
  for (let a of swarm) a.setTarget(target);
}

function keyPressed() {
  if (key === 'X' || key === 'x') {
    target = null;
    for (let a of swarm) a.clearTarget();
  } else if (key === 'V' || key === 'v') {
    for (let a of swarm) a.toggleVariant();
  } else if (key === 'S' || key === 's') {
    for (let a of swarm) a.toggleSpin();
  } else if (key === 'C' || key === 'c') {
    for (let a of swarm) a.randomizeColor();
  }
}

function abBackgroundStars() {
  push();
  fill(255, 180);
  for (let i = 0; i < 50; i++) {
    let x = (i * 150 + frameCount * 0.4) % (width + 60) - 30;
    let y = (i * 97) % height;
    circle(x, y, (i % 5) + 1);
  }
  pop();
}

function abHud() {
  push();
  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  text("Aliens Bouncing around in Space!  |  Click: Seek  X: Clear  V: Variant  S: Spin  C: Color", 220, 10);
  pop();
}

// =====================================================
// Class: AB_Alien  (Parent + Child display/action methods)
// =====================================================
class AB_Alien {
  constructor(pos, vel, s, rot, spin, col, variant=0) {
    // --- Vector movement (Ex3 style) ---
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.acc = createVector(0, 0);
    this.maxSpeed = 2.4;
    this.maxForce = 0.08;

    // --- Transform / appearance ---
    this.s = s;
    this.rot = rot;
    this.spin = spin;     // base spin speed
    this.spinOn = true;   // toggle via action method
    this.col = col;
    this.variant = variant; // 0 fins+mouth, 1 wings+beak

    // --- Behavior ---
    this.target = null; // seek target when set
  }

  // -------- ACTION METHODS (interactive) --------
  toggleVariant() {
    this.variant = (this.variant === 0) ? 1 : 0;
  }

  toggleSpin() {
    this.spinOn = !this.spinOn;
  }

  randomizeColor() {
    this.col = color(random(120,255), random(120,255), random(120,255));
  }

  setTarget(v) {
    this.target = v ? v.copy() : null;
  }

  clearTarget() {
    this.target = null;
  }

  // -------- PHYSICS / UPDATE --------
  update() {
    // Seek target if present, otherwise coast and bounce
    if (this.target) {
      this.applyForce(this._seek(this.target));
    }

    if (this.spinOn) this.rot += this.spin;

    // Integrate
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Bounce at edges (inside class)
    this._bounceEdges();
  }

  applyForce(f) {
    this.acc.add(f);
  }

  _seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    const d = desired.mag();
    desired.normalize();
    // Arrive behavior near target
    const speed = (d < 120) ? map(d, 0, 120, 0, this.maxSpeed) : this.maxSpeed;
    desired.mult(speed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  _bounceEdges() {
    const margin = 20;
    if (this.pos.x < margin) { this.pos.x = margin; this.vel.x *= -1; }
    if (this.pos.x > width - margin) { this.pos.x = width - margin; this.vel.x *= -1; }
    if (this.pos.y < margin) { this.pos.y = margin; this.vel.y *= -1; }
    if (this.pos.y > height - margin) { this.pos.y = height - margin; this.vel.y *= -1; }
  }

  // -------- PARENT DISPLAY METHOD --------
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    scale(this.s);

    // BODY (child call)
    this._body(90, 60, this.col);

    // Variant-specific parts (child calls)
    if (this.variant === 0) {
      this._fin(-36,  2, 26, 14, -0.2);
      this._fin( 36,  2, 26, 14,  0.2);
      this._mouth(0, 12, 22, 4);
    } else {
      this._wing(-44, -10, 48, 24, -0.3);
      this._wing( 44, -10, 48, 24,  0.3);
      this._beak(0, 12, 18, 8);
    }

    // Shared features (child calls)
    this._eye(-12, -10, 10);
    this._eye( 12, -10, 10);
    this._antenna(-10, -28, 18, -0.5);
    this._antenna( 10, -28, 18,  0.5);

    pop();
  }

  // -------- CHILD DISPLAY METHODS (moved inside the class) --------
  _body(w, h, c) {
    push();
    noStroke();
    fill(c);
    ellipse(0, 0, w, h);
    fill(255, 20);
    ellipse(0, -6, w * 0.92, h * 0.92);
    pop();
  }

  _eye(dx, dy, r) {
    push();
    translate(dx, dy);
    noStroke();
    fill(255);
    circle(0, 0, r * 2);
    fill(30);
    circle(r * 0.25, 0, r * 0.9);
    pop();
  }

  _mouth(dx, dy, w, h) {
    push();
    translate(dx, dy);
    fill(40);
    rect(0, 0, w, h, 4);
    pop();
  }

  _beak(dx, dy, w, h) {
    push();
    translate(dx, dy);
    fill(255, 210, 120);
    triangle(-w * 0.5, 0, w * 0.5, 0, 0, h);
    pop();
  }

  _antenna(dx, dy, len, a) {
    push();
    translate(dx, dy);
    rotate(a);
    stroke(255);
    strokeWeight(2);
    line(0, 0, 0, -len);
    noStroke();
    fill(255, 80, 120);
    circle(0, -len, 6);
    pop();
  }

  _fin(dx, dy, w, h, a) {
    push();
    translate(dx, dy);
    rotate(a);
    fill(120, 200, 255, 180);
    ellipse(0, 0, w, h);
    pop();
  }

  _wing(dx, dy, w, h, a) {
    push();
    translate(dx, dy);
    rotate(a);
    fill(255, 230);
    ellipse(0, 0, w, h);
    pop();
  }
}
