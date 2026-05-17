const apps = document.querySelectorAll('.app');
const errorCard = document.querySelector('#errorCard');
const errorText = document.querySelector('#errorText');
const screen = document.querySelector('#screen');
const youtubePull = document.querySelector('#youtubePull');

const errorMessages = [
  'This door does not open.',
  'The app begins to open, then forgets you.',
  'Not enough attention to enter.',
  'A small interruption. Then back again.',
  'Error: desire redirected.',
  'You were not here for long.'
];

let errorTimer;

function showError(appName) {
  const message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
  errorText.textContent = `${appName}: ${message}`;
  errorCard.classList.add('show');

  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    errorCard.classList.remove('show');
  }, 1500);
}

function animateFailedOpen(app) {
  app.classList.remove('opening-error');
  void app.offsetWidth;
  app.classList.add('opening-error');
  showError(app.dataset.app || 'App');
}

function openYouTube() {
  screen.classList.add('surrender');
  youtubePull.classList.add('show');

  setTimeout(() => {
    window.location.href = 'https://www.youtube.com';
  }, 1800);
}

apps.forEach((app) => {
  app.addEventListener('click', () => {
    if (app.dataset.open === 'true') {
      openYouTube();
    } else {
      animateFailedOpen(app);
    }
  });
});
