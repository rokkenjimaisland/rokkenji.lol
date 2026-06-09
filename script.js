const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const panels = $$('.panel');
const moreView = $('#more-view');
const profileView = $('#profile-view');
const messages = JSON.parse(localStorage.getItem('wolf-comments') || '[]');
let currentTrack = 0;
let loop = false;

const tracks = [
  { title: 'night drive', artist: 'wolf radio', art: '☾' },
  { title: 'cyan static', artist: 'beta mix', art: '∿' },
  { title: 'glass paws', artist: 'lofi den', art: '◇' },
];

const interests = [
  { key: 'beastars', name: 'Beastars', image: 'BEASTARS', description: "In this anthropomorphic world, gentle wolf Legoshi struggles with instinct, identity, and love after a classmate's murder deepens the divide between carnivores and herbivores at Cherryton Academy." },
  { key: 'fox', name: 'Fantastic Mr. Fox', image: 'FOX', description: 'A clever stop-motion heist story about family, confidence, and the trouble that follows a fox who cannot stop chasing one more perfect plan.' },
  { key: 'bad-guys-1', name: 'The Bad Guys (1)', image: 'BAD GUYS', description: 'A stylish crew of animal criminals discovers that pretending to be good can slowly become the real thing.' },
  { key: 'bad-guys-2', name: 'The Bad Guys (2)', image: 'BAD GUYS 2', description: 'The crew returns for another glossy caper with more redemption, chaos, and sharp suits.' },
];

const characters = [
  { key: 'mr-wolf', name: 'Mr. Wolf (The Bad Guys)', image: 'MR. WOLF', description: 'Mr. Wolf is smooth and confident on the outside, but what makes him great is how he uses that confidence to protect his crew and slowly choose empathy over ego.' },
  { key: 'legoshi', name: 'Legoshi', image: 'LEGOSHI', description: 'A gentle gray wolf whose quiet strength comes from questioning himself and trying to care for others despite instinct and fear.' },
  { key: 'jack', name: 'Jack', image: 'JACK', description: 'A loyal friend with bright energy and a soft spot for the people he cares about.' },
];

function showPanel(name) {
  panels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== name));
  moreView.classList.remove('hidden');
  profileView.classList.add('hidden');
}

function closeMore() {
  moreView.classList.add('hidden');
  profileView.classList.remove('hidden');
}

function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('wolf-theme', theme);
}

function renderTabs(items, node, renderer) {
  node.innerHTML = '';
  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.name.replace(' (The Bad Guys)', '');
    button.addEventListener('click', () => {
      $$('.tabs button', node.parentElement).forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      renderer(item);
    });
    if (index === 0) button.classList.add('active');
    node.append(button);
  });
  renderer(items[0]);
}

function renderInterest(item) {
  $('#interest-image').textContent = item.image;
  $('#interest-name').textContent = item.name;
  $('#interest-description').textContent = item.description;
}

function renderCharacter(item) {
  $('#character-image').textContent = item.image;
  $('#character-name').textContent = item.name;
  $('#character-description').textContent = item.description;
}

function renderTrack() {
  const track = tracks[currentTrack];
  $('#album-art').textContent = track.art;
  $('#track-title').textContent = track.title;
  $('#artist-name').textContent = track.artist;
  $$('#artist-list button').forEach((button, index) => button.classList.toggle('active', index === currentTrack));
}

function renderArtists() {
  const list = $('#artist-list');
  list.innerHTML = '';
  tracks.forEach((track, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = track.artist;
    button.addEventListener('click', () => { currentTrack = index; renderTrack(); });
    list.append(button);
  });
  renderTrack();
}

function renderMessages() {
  const list = $('#messages-list');
  if (!messages.length) {
    list.textContent = 'loading messages... no local messages yet.';
    return;
  }
  list.innerHTML = '';
  messages.forEach((message) => {
    const card = document.createElement('article');
    card.className = 'message';
    card.innerHTML = `<strong></strong><p></p>`;
    $('strong', card).textContent = message.name;
    $('p', card).textContent = message.text;
    list.prepend(card);
  });
}

function initStars() {
  const canvas = $('#stars');
  const ctx = canvas.getContext('2d');
  const stars = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .3, s: Math.random() * .6 + .2 }));
  function size() { canvas.width = innerWidth; canvas.height = innerHeight; }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    stars.forEach((star) => {
      star.y += star.s / 220;
      if (star.y > 1) star.y = 0;
      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  addEventListener('resize', size);
  size();
  draw();
}

$('#open-more').addEventListener('click', () => showPanel('home'));
moreView.addEventListener('click', (event) => {
  const open = event.target.closest('[data-open]');
  if (open) showPanel(open.dataset.open);
  if (event.target.closest('[data-action="close"]')) closeMore();
});

$$('[data-theme]').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));
$('#reload-frame').addEventListener('click', () => {
  $('#movie-frame').src = 'about:blank';
  $('#movie-status').textContent = 'Embed reloaded. External pages may block iframe display.';
});
$('#save-comment-profile').addEventListener('click', () => {
  $('#comment-preview').textContent = ($('#comment-name').value || 'w').trim().charAt(0).toLowerCase();
});
$('#post-comment').addEventListener('click', () => {
  const text = $('#comment-text').value.trim();
  if (!text) return;
  messages.push({ name: $('#comment-name').value.trim() || 'wolf fan', text });
  localStorage.setItem('wolf-comments', JSON.stringify(messages));
  $('#comment-text').value = '';
  renderMessages();
});
$('#prev-track').addEventListener('click', () => { currentTrack = (currentTrack - 1 + tracks.length) % tracks.length; renderTrack(); });
$('#next-track').addEventListener('click', () => { currentTrack = (currentTrack + 1) % tracks.length; renderTrack(); });
$('#play-track').addEventListener('click', (event) => { event.target.textContent = event.target.textContent === 'Play' ? 'Pause' : 'Play'; });
$('#loop-track').addEventListener('click', (event) => { loop = !loop; event.target.textContent = `Loop: ${loop ? 'on' : 'off'}`; });

const savedTheme = localStorage.getItem('wolf-theme') || 'blue';
setTheme(savedTheme);
renderTabs(interests, $('#interest-tabs'), renderInterest);
renderTabs(characters, $('#character-tabs'), renderCharacter);
renderArtists();
renderMessages();
initStars();
