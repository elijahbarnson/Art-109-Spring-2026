// This file contains the main JavaScript functionalities for the website, handling navigation and common features across pages.

document.addEventListener('DOMContentLoaded', function() {
    // Play background music
    const backgroundMusic = new Audio('audio/background-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Optional: Add any additional navigation effects here
        });
    });
});

// subtle floating bubbles background; very light so not distracting
(function(){
  const container = document.getElementById('bubbles-bg');
  if(!container) return;

  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  container.appendChild(cvs);
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w,h, bubbles = [];

  function resize(){
    w = container.clientWidth;
    h = container.clientHeight;
    cvs.width = w * dpr; cvs.height = h * dpr;
    cvs.style.width = w+'px'; cvs.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function createBubble(){
    return {
      x: Math.random()*w,
      y: h + 20 + Math.random()*80,
      r: 6 + Math.random()*36,
      speed: 0.2 + Math.random()*0.8,
      alpha: 0.06 + Math.random()*0.12
    };
  }

  function init(){
    resize();
    bubbles = Array.from({length: Math.round(w/140)}, createBubble);
    loop();
  }

  function loop(){
    ctx.clearRect(0,0,w,h);
    for(let b of bubbles){
      b.y -= b.speed;
      b.x += Math.sin(b.y*0.01 + b.r)*0.2;
      ctx.beginPath();
      ctx.fillStyle = `rgba(250,245,240,${b.alpha})`;
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
      if(b.y + b.r < -20) {
        Object.assign(b, createBubble());
        b.y = h + 10;
      }
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', ()=>{ resize(); });
  init();
})();