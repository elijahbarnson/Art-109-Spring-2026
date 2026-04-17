// This file manages the functionality for the "a starting point" page, including capturing user input and triggering sound effects on key presses.

let inputField;
let keyPressSound;

// saves journal text, plays key sound on keydown (file input allows custom sound)
(function(){
  const textarea = document.getElementById('journal');
  const countEl = document.getElementById('word-count');
  const keyAudio = document.getElementById('key-sound');
  const fileInput = document.getElementById('key-sound-file');
  const ambient = document.getElementById('ambient-music');

  const STORAGE_KEY = 'journalText';

  // load saved
  textarea.value = localStorage.getItem(STORAGE_KEY) || '';
  updateCount();

  // allow user to choose sound file
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) keyAudio.src = URL.createObjectURL(f);
  });

  // play ambient after first user interaction (browsers require gesture)
  function resumeAmbient(){ ambient.play().catch(()=>{}); window.removeEventListener('click', resumeAmbient); }
  window.addEventListener('click', resumeAmbient);

  // keydown: play sound, save
  textarea.addEventListener('keydown', (ev)=>{
    // small throttle to avoid overlapping loudness; play short
    if(keyAudio.paused) keyAudio.currentTime = 0;
    keyAudio.play().catch(()=>{});
    // store after a tiny delay so input value is updated
    setTimeout(()=> {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      updateCount();
    }, 0);
  });

  textarea.addEventListener('input', ()=>{
    localStorage.setItem(STORAGE_KEY, textarea.value);
    updateCount();
  });

  function updateCount(){
    const words = (textarea.value || '').trim().split(/\s+/).filter(Boolean);
    countEl.textContent = `Words: ${words.length}`;
    if(words.length < 100) {
      countEl.style.color = '#b45353';
    } else {
      countEl.style.color = '';
    }
  }
})();

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255, 250, 240); // Dream-like background color

    inputField = createInput();
    inputField.position(width / 2 - 100, height / 2);
    inputField.size(200);
    inputField.input(playKeyPressSound);
}

function draw() {
    // Optional: You can add more visual elements here if needed
}

function playKeyPressSound() {
    if (!keyPressSound) {
        keyPressSound = loadSound('audio/key-press.wav', () => {
            keyPressSound.play();
        });
    } else {
        keyPressSound.play();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}