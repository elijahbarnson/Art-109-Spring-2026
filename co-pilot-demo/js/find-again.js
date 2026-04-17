// This file manages the functionality for the "find again" page, including the random reorganization of words and the typing effects.

let words = [];
let input;
let typingSound;
let backgroundMusic;

function preload() {
    typingSound = loadSound('audio/type-loop.wav');
    backgroundMusic = loadSound('audio/background-music.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    
    input = createInput();
    input.position(width / 2 - 150, height / 2 - 50);
    input.size(300);
    input.input(updateWords);
    
    backgroundMusic.loop();
}

function draw() {
    background(255, 250, 250);
    if (words.length > 0) {
        for (let i = 0; i < words.length; i++) {
            let x = random(width);
            let y = random(height);
            text(words[i], x, y);
        }
    }
}

function updateWords() {
    if (this.value() !== '') {
        words = this.value().split(' ');
        typingSound.play();
        this.value(''); // Clear the input after capturing the words
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        randomizeWords();
    }
}

function randomizeWords() {
    words = shuffle(words);
}

// reads journal, randomly re-types words on canvas and fades them out; supports custom type-loop sound
(function(){
  const STORAGE_KEY = 'journalText';
  const textarea = document.getElementById('find-journal');
  const canvas = document.getElementById('find-canvas');
  const typeAudio = document.getElementById('type-sound');
  const fileInput = document.getElementById('type-sound-file');
  const stopBtn = document.getElementById('stop-animation');
  if(!canvas) return;

  // canvas sizing
  let dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);}
  window.addEventListener('resize', resize);
  resize();

  // load text
  textarea.value = localStorage.getItem(STORAGE_KEY) || '';
  textarea.addEventListener('input', ()=>{ localStorage.setItem(STORAGE_KEY, textarea.value); updatePool(); });

  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) typeAudio.src = URL.createObjectURL(f);
  });

  stopBtn.addEventListener('click', ()=> { running = !running; stopBtn.textContent = running ? 'Stop' : 'Start'; });

  function updatePool(){
    pool = (localStorage.getItem(STORAGE_KEY) || textarea.value || '').split(/\s+/).filter(Boolean);
  }
  let pool = [];
  updatePool();

  let particles = []; // {x,y,txt,alpha,size,ttl,vy}
  let running = true;

  function spawn(){
    if(!running || !pool.length) return;
    // spawn a few words
    const spawnCount = 1 + Math.floor(Math.random()*3);
    for(let i=0;i<spawnCount;i++){
      const w = pool[Math.floor(Math.random()*pool.length)];
      particles.push({
        x: Math.random()*canvas.clientWidth,
        y: canvas.clientHeight + 10,
        txt: w,
        alpha: 1,
        size: 12 + Math.random()*20,
        ttl: 120 + Math.random()*180,
        vx: (Math.random()-0.5)*1.2,
        vy: - (0.6 + Math.random()*1.4),
        rot: (Math.random()-0.5)*0.2
      });
    }
    // sound trigger
    typeAudio.volume = 0.15;
    typeAudio.play().catch(()=>{});
  }

  function step(){
    ctx.clearRect(0,0,canvas.width/dpr,canvas.height/dpr);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = `rgba(40,30,40,${p.alpha})`;
      ctx.font = `${p.size}px Nunito, sans-serif`;
      ctx.fillText(p.txt, 0, 0);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1/p.ttl;
      p.size *= 0.999;
      p.ttl--;
      if(p.ttl <=0 || p.alpha <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(step);
  }

  // spawn loop
  setInterval(spawn, 450);
  step();
})();