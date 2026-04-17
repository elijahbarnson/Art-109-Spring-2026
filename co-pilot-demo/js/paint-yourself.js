// This file handles the canvas functionality for the "paint yourself" page, including displaying words and triggering sound effects during mouse dragging.

(function(){
  const STORAGE_KEY = 'journalText';
  const canvas = document.getElementById('paint-canvas');
  const dragAudio = document.getElementById('drag-sound');
  const fileInput = document.getElementById('drag-sound-file');
  const clearBtn = document.getElementById('clear-canvas');

  if(!canvas) return;
  let ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;

  function resize(){
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    canvas.style.width = canvas.clientWidth + 'px';
    canvas.style.height = canvas.clientHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.lineCap = 'round';
  }
  window.addEventListener('resize', resize);
  resize();

  let drawing = false;
  let last = null;
  let words = (localStorage.getItem(STORAGE_KEY) || '').split(/\s+/).filter(Boolean);
  let floating = []; // list of wisps {x,y,tx,ty,alpha,txt,angle,vx,vy}

  // load custom drag sound
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) dragAudio.src = URL.createObjectURL(f);
  });

  canvas.addEventListener('mousedown', (e)=>{ drawing = true; last = getPos(e); });
  canvas.addEventListener('mouseup', ()=>{ drawing = false; last = null; dragAudio.pause(); dragAudio.currentTime = 0; });
  canvas.addEventListener('mouseleave', ()=>{ drawing = false; last = null; dragAudio.pause(); dragAudio.currentTime = 0; });

  canvas.addEventListener('mousemove', (e)=>{
    const pos = getPos(e);
    if(drawing){
      // draw line
      ctx.strokeStyle = 'rgba(30,20,25,0.6)';
      ctx.lineWidth = 3 + Math.random()*6;
      ctx.beginPath();
      ctx.moveTo(last.x,last.y);
      ctx.lineTo(pos.x,pos.y);
      ctx.stroke();
      last = pos;

      // play drag audio gently
      dragAudio.volume = 0.25;
      dragAudio.play().catch(()=>{});
      // spawn wisps of words
      spawnWisps(pos);
    }
  });

  // touch support
  canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); drawing = true; last = getPos(e.touches[0]); });
  canvas.addEventListener('touchend', ()=>{ drawing = false; last = null; dragAudio.pause(); dragAudio.currentTime = 0; });
  canvas.addEventListener('touchmove', (e)=>{ e.preventDefault(); const pos = getPos(e.touches[0]); if(drawing){ ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(pos.x,pos.y); ctx.stroke(); last = pos; dragAudio.volume=0.25; dragAudio.play().catch(()=>{}); spawnWisps(pos);} });

  clearBtn.addEventListener('click', ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    floating = [];
  });

  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) };
  }

  function spawnWisps(pos){
    if(!words.length) return;
    const count = 1 + Math.floor(Math.random()*3);
    for(let i=0;i<count;i++){
      const w = words[Math.floor(Math.random()*words.length)];
      floating.push({
        x: pos.x + (Math.random()*40-20),
        y: pos.y + (Math.random()*40-20),
        txt: w,
        alpha: 1,
        vx: (Math.random()*2-1)*0.6,
        vy: - (0.3 + Math.random()*1.2),
        rot: (Math.random()-0.5)*0.8,
        life: 80 + Math.random()*80
      });
    }
  }

  function drawFloating(){
    // draw over canvas with blend so words look whispery
    for(let i=floating.length-1;i>=0;i--){
      const f = floating[i];
      ctx.save();
      ctx.translate(f.x,f.y);
      ctx.rotate(f.rot);
      ctx.globalAlpha = Math.max(0, f.alpha*0.9);
      ctx.fillStyle = `rgba(60,50,70,${Math.min(0.9,f.alpha)})`;
      ctx.font = `${12 + Math.min(22, f.life/6)}px Nunito, sans-serif`;
      ctx.fillText(f.txt, 0, 0);
      ctx.restore();

      f.x += f.vx;
      f.y += f.vy;
      f.vy -= 0.01; // gentle upward drift
      f.alpha -= 0.006;
      f.rot += 0.01;
      f.life -= 1;
      if(f.life < 0 || f.alpha <= 0) floating.splice(i,1);
    }
  }

  function anim(){
    // subtle overlay to slightly fade previously drawn words (keeps the hand-drawn marks crisp)
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);
    drawFloating();
    requestAnimationFrame(anim);
  }
  anim();
})();