(function () {
  const mount = document.querySelector('[data-p5-background]');
  if (!mount || typeof window.p5 === 'undefined') return;

  const theme = window.__emotionTheme || {
    bg: '#f4f1ec',
    orb: ['#d5d1cb', '#ece8e1', '#b8b0a7']
  };

  new window.p5((p) => {
    const particles = [];
    const RESX = 58;
    const DT = 0.055;
    const particleCount = 230;
    let tick = 0;

    function hexToRgb(hex) {
      const clean = hex.replace('#', '');
      const value = parseInt(clean, 16);
      return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
      };
    }

    function mix(a, b, amount) {
      return a + (b - a) * amount;
    }

    function softColor(hex, amount = 0.42) {
      const c = hexToRgb(hex);
      return {
        r: mix(c.r, 255, amount),
        g: mix(c.g, 255, amount),
        b: mix(c.b, 255, amount)
      };
    }

    class Particle {
      constructor(i) {
        this.s = p.createVector(p.random(p.width), p.random(p.height));
        this.v = p.createVector(0, 0);
        this.a = p.createVector(0, 0);
        this.seed = p.random(1000);
        this.base = softColor(theme.orb[i % theme.orb.length], p.random(0.36, 0.58));
        this.size = p.random(5, 13);
        this.alpha = p.random(36, 82);
      }

      target() {
        const scale = 0.00065;
        const n1 = p.noise(this.seed, tick * 0.12);
        const n2 = p.noise(this.seed + 90, tick * 0.12);
        const waveX = p.sin(tick * 0.22 + this.seed) * 0.075;
        const waveY = p.cos(tick * 0.18 + this.seed) * 0.07;
        return p.createVector(
          (n1 + waveX) * p.width,
          (n2 + waveY) * p.height + p.sin(this.s.x * scale + tick * 0.55) * 26
        );
      }

      update() {
        const target = this.target();
        const pull = window.p5.Vector.sub(target, this.s).mult(0.034);
        this.a.add(pull);

        const mouse = p.createVector(p.mouseX || p.width / 2, p.mouseY || p.height / 2);
        const mouseVec = window.p5.Vector.sub(mouse, this.s);
        const d = Math.max(42, mouseVec.mag());
        if (d < 260) {
          mouseVec.normalize().mult(-520 / (d * 0.18));
          this.a.add(mouseVec);
        }

        const swirl = p.createVector(
          p.sin(tick + this.seed) * 0.042,
          p.cos(tick * 0.9 + this.seed) * 0.042
        );
        this.a.add(swirl);
        this.v.add(window.p5.Vector.mult(this.a, DT));
        this.v.mult(0.92);
        this.s.add(this.v);
        this.a.mult(0);

        if (this.s.x < -40) this.s.x = p.width + 40;
        if (this.s.x > p.width + 40) this.s.x = -40;
        if (this.s.y < -40) this.s.y = p.height + 40;
        if (this.s.y > p.height + 40) this.s.y = -40;
      }

      display() {
        p.fill(this.base.r, this.base.g, this.base.b, this.alpha);
        p.circle(this.s.x, this.s.y, this.size);
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight).parent(mount);
      p.noStroke();
      for (let i = 0; i < particleCount; i += 1) particles.push(new Particle(i));
    };

    p.draw = () => {
      tick += 0.012;
      const bg = hexToRgb(theme.bg);
      p.background(bg.r, bg.g, bg.b, 238);

      const cursorColor = softColor(theme.orb[0], 0.34);
      const mx = p.mouseX || p.width / 2;
      const my = p.mouseY || p.height / 2;
      p.noStroke();
      p.fill(cursorColor.r, cursorColor.g, cursorColor.b, 24);
      p.circle(mx, my, 280 + p.sin(tick * 2) * 30);
      p.fill(255, 255, 255, 16);
      p.circle(mx, my, 480 + p.cos(tick * 1.4) * 40);

      for (let i = 0; i < particles.length; i += 1) {
        particles[i].update();
        particles[i].display();
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
})();
