const EMOTIONS = {
  anxious: {
    label: 'Anxious', colorClass: 'anxious', imagePrefix: 'anxious',
    folder: 'assets/images/anxious', pageFolder: 'pages/anxious',
    defaultNames: ['Pressure', 'Spiral', 'Noise', 'Restless', 'Static', 'Drift'],
    bg: '#eeeaf9', orb: ['#8f85d8', '#c0b8ee', '#6b62b0']
  },
  peaceful: {
    label: 'Peaceful', colorClass: 'peaceful', imagePrefix: 'peaceful',
    folder: 'assets/images/peaceful', pageFolder: 'pages/peaceful',
    defaultNames: ['Breath', 'Still', 'Water', 'Light', 'Quiet', 'Open'],
    bg: '#eef8f3', orb: ['#93cdb7', '#d6eee6', '#6ea993']
  },
  ambitious: {
    label: 'Ambitious', colorClass: 'ambitious', imagePrefix: 'ambitious',
    folder: 'assets/images/ambitious', pageFolder: 'pages/ambitious',
    defaultNames: ['Rise', 'Future', 'Drive', 'Climb', 'Wanting', 'Focus'],
    bg: '#fbf3e3', orb: ['#e7b955', '#f6d696', '#c89127']
  },
  apathetic: {
    label: 'Apathetic', colorClass: 'apathetic', imagePrefix: 'apathetic',
    folder: 'assets/images/apathetic', pageFolder: 'pages/apathetic',
    defaultNames: ['Blank', 'Delay', 'Muted', 'Routine', 'Distant', 'Low'],
    bg: '#f2f2f2', orb: ['#c2c2c2', '#e5e5e5', '#979797']
  },
  shameful: {
    label: 'Shameful', colorClass: 'shameful', imagePrefix: 'shameful',
    folder: 'assets/images/shameful', pageFolder: 'pages/shameful',
    defaultNames: ['Hide', 'Witness', 'Blush', 'Inside', 'Echo', 'Crooked'],
    bg: '#f7eef1', orb: ['#b78a97', '#e5c9d0', '#8c6572']
  },
  happiness: {
    label: 'Happiness', colorClass: 'happiness', imagePrefix: 'happiness',
    folder: 'assets/images/happiness', pageFolder: 'pages/happiness',
    defaultNames: ['Glow', 'Play', 'Sun', 'Warmth', 'Release', 'Bright'],
    bg: '#fff8e8', orb: ['#f0d149', '#f9eb9a', '#d9b01a']
  }
};

const LANDING_LAYOUT = [
  { key: 'anxious', x: '10%', y: '11%', duration: '26s', delay: '-8s' },
  { key: 'peaceful', x: '67%', y: '10%', duration: '29s', delay: '-15s' },
  { key: 'ambitious', x: '37%', y: '26%', duration: '24s', delay: '-11s' },
  { key: 'apathetic', x: '14%', y: '56%', duration: '31s', delay: '-21s' },
  { key: 'shameful', x: '61%', y: '54%', duration: '27s', delay: '-9s' },
  { key: 'happiness', x: '76%', y: '72%', duration: '25s', delay: '-17s' }
];

const OUTER_COUNT = 6;
const GEOMETRY = { centerSize: 24, outerSize: 16, radius: 31 };

function normalizeBasePath(path = './') { return path.endsWith('/') ? path : `${path}/`; }
function getBasePath() { return normalizeBasePath(document.body?.dataset?.basePath || './'); }
function assetPath(relativePath) { return `${getBasePath()}${relativePath}`; }
function getEmotionKey() { return document.body?.dataset?.emotion || null; }

function getOuterLayout() {
  const points = [];
  for (let i = 0; i < OUTER_COUNT; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / OUTER_COUNT;
    points.push({ x: 50 + Math.cos(angle) * GEOMETRY.radius, y: 50 + Math.sin(angle) * GEOMETRY.radius });
  }
  return points;
}

function buildLandingPage() {
  const field = document.querySelector('[data-floating-field]');
  if (!field) return;
  LANDING_LAYOUT.forEach(({ key, x, y, duration, delay }) => {
    const emotion = EMOTIONS[key];
    const bubble = document.createElement('a');
    bubble.className = `floating-bubble ${emotion.colorClass}`;
    bubble.href = `${key}.html`;
    bubble.style.left = x;
    bubble.style.top = y;
    bubble.style.setProperty('--duration', duration);
    bubble.style.setProperty('--delay', delay);
    bubble.innerHTML = `<span>${emotion.label}</span>`;
    field.appendChild(bubble);
  });
}

function buildEmotionPage() {
  const stage = document.querySelector('[data-web-stage]');
  const emotionKey = getEmotionKey();
  if (!stage || !emotionKey || !EMOTIONS[emotionKey]) return;

  const emotion = EMOTIONS[emotionKey];
  const outerLayout = getOuterLayout();
  const rotator = document.createElement('div');
  rotator.className = 'web-rotator';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'web-lines');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  rotator.appendChild(svg);

  const center = { x: 50, y: 50 };
  const centerRadius = GEOMETRY.centerSize / 2;
  const outerRadius = GEOMETRY.outerSize / 2;

  rotator.appendChild(createNode({ x: center.x, y: center.y, size: GEOMETRY.centerSize, href: null, imagePath: null, center: true }));
  rotator.appendChild(createLabelAnchor({ x: center.x, y: center.y, size: GEOMETRY.centerSize, text: emotion.label, extraClass: 'center-node-label' }));

  outerLayout.forEach((point, index) => {
    svg.appendChild(createLine(center, point, centerRadius, outerRadius));
    const href = `${getBasePath()}${emotion.pageFolder}/${emotion.imagePrefix}_img_${index + 1}.html`;
    const imagePath = assetPath(`${emotion.folder}/img-${index + 1}.jpg`);
    rotator.appendChild(createNode({ x: point.x, y: point.y, size: GEOMETRY.outerSize, href, imagePath, center: false }));
  });

  stage.appendChild(rotator);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') window.location.href = `${getBasePath()}index.html`;
  });
}

function createLine(centerPoint, outerPoint, centerRadius, outerRadius) {
  const dx = outerPoint.x - centerPoint.x;
  const dy = outerPoint.y - centerPoint.y;
  const distance = Math.hypot(dx, dy) || 1;
  const unitX = dx / distance;
  const unitY = dy / distance;
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', (centerPoint.x + unitX * centerRadius).toFixed(3));
  line.setAttribute('y1', (centerPoint.y + unitY * centerRadius).toFixed(3));
  line.setAttribute('x2', (outerPoint.x - unitX * outerRadius).toFixed(3));
  line.setAttribute('y2', (outerPoint.y - unitY * outerRadius).toFixed(3));
  return line;
}

function createNode({ x, y, size, href, imagePath, center }) {
  const node = document.createElement(href ? 'a' : 'div');
  node.className = `web-node ${center ? 'center-node' : 'image-node'}`;
  node.style.width = `${size}%`;
  node.style.height = `${size}%`;
  node.style.left = `calc(${x}% - ${size / 2}%)`;
  node.style.top = `calc(${y}% - ${size / 2}%)`;
  if (href) node.href = href;
  if (center) {
    const fill = document.createElement('div');
    fill.className = 'node-fill';
    node.appendChild(fill);
  } else {
    const thumb = document.createElement('div');
    thumb.className = 'node-thumb';
    thumb.style.backgroundImage = `url('${imagePath}')`;
    node.appendChild(thumb);
  }
  return node;
}

function createLabelAnchor({ x, y, size, text, extraClass }) {
  const anchor = document.createElement('div');
  anchor.className = `web-label-anchor ${extraClass}`.trim();
  anchor.style.width = `${size}%`;
  anchor.style.height = `${size}%`;
  anchor.style.left = `calc(${x}% - ${size / 2}%)`;
  anchor.style.top = `calc(${y}% - ${size / 2}%)`;

  const label = document.createElement('span');
  label.className = 'node-label';
  label.textContent = text;
  anchor.appendChild(label);
  return anchor;
}

function buildDetailPage() {
  const stage = document.querySelector('[data-detail-stage]');
  const overlay = document.querySelector('[data-fullscreen-overlay]');
  const overlayImage = document.querySelector('[data-fullscreen-image]');
  if (!stage) return;

  const emotionKey = getEmotionKey();
  const imageIndex = Number(document.body?.dataset?.imageIndex || 1);
  const emotion = EMOTIONS[emotionKey];
  if (!emotion) return;

  const imgPath = assetPath(`${emotion.folder}/img-${imageIndex}.jpg`);
  const backLink = document.querySelector('[data-detail-back]');
  if (backLink) backLink.href = `${getBasePath()}${emotionKey}.html`;

  const floating = document.createElement('button');
  floating.className = 'floating-image-orb rendering-image';
  floating.type = 'button';
  floating.setAttribute('aria-label', `Open ${emotion.label} image ${imageIndex} fullscreen`);
  floating.innerHTML = `<img src="${imgPath}" alt="${emotion.label} image ${imageIndex}"><span class="render-grid" aria-hidden="true"></span>`;
  stage.appendChild(floating);

  const img = floating.querySelector('img');
  img.addEventListener('load', () => floating.classList.add('is-loaded'));
  if (img.complete) floating.classList.add('is-loaded');

  const motion = { x: 0, y: 0, vx: 0.38 + imageIndex * 0.035, vy: 0.28 + imageIndex * 0.025, size: 360 };
  function setStart() {
    const minSide = Math.min(window.innerWidth, window.innerHeight);
    motion.size = Math.max(210, Math.min(minSide * 0.52, 440));
    motion.x = (window.innerWidth - motion.size) / 2;
    motion.y = (window.innerHeight - motion.size) / 2;
    floating.style.width = `${motion.size}px`;
    floating.style.height = `${motion.size}px`;
  }
  function bounce() {
    motion.x += motion.vx;
    motion.y += motion.vy;
    if (motion.x <= 0 || motion.x + motion.size >= window.innerWidth) {
      motion.vx *= -1;
      motion.x = Math.max(0, Math.min(window.innerWidth - motion.size, motion.x));
    }
    if (motion.y <= 0 || motion.y + motion.size >= window.innerHeight) {
      motion.vy *= -1;
      motion.y = Math.max(0, Math.min(window.innerHeight - motion.size, motion.y));
    }
    floating.style.transform = `translate3d(${motion.x}px, ${motion.y}px, 0)`;
    requestAnimationFrame(bounce);
  }
  setStart();
  bounce();
  window.addEventListener('resize', setStart);

  function openFullscreen() {
    if (!overlay || !overlayImage) return;
    overlayImage.src = imgPath;
    overlayImage.alt = `${emotion.label} image ${imageIndex}`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeFullscreen() {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }
  floating.addEventListener('click', openFullscreen);
  overlay?.addEventListener('click', closeFullscreen);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (overlay?.classList.contains('open')) closeFullscreen();
    else window.location.href = `${getBasePath()}${emotionKey}.html`;
  });
}

function exposeEmotionPalette() {
  const emotionKey = getEmotionKey();
  const emotion = EMOTIONS[emotionKey] || { label: 'Landing', bg: '#f4f1ec', orb: ['#d5d1cb', '#ece8e1', '#b8b0a7'] };
  window.__emotionTheme = emotion;
}

exposeEmotionPalette();
buildLandingPage();
buildEmotionPage();
buildDetailPage();
