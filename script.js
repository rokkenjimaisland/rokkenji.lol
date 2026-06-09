const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const panels = $$('.modal');
const moreView = $('#more-view');
const profileView = $('#profile-view');
const messages = JSON.parse(localStorage.getItem('wolf-comments') || '[]');

let currentTrack = 0;
let loopEnabled = false;

const tracks = [
  { title: 'No track selected', artist: 'wolf.', art: 'https://api.dicebear.com/9.x/shapes/svg?seed=album&backgroundColor=222222&shape1Color=ffffff' },
  { title: 'not listening', artist: 'spotify', art: 'https://api.dicebear.com/9.x/shapes/svg?seed=spotify&backgroundColor=191414&shape1Color=1db954&shape2Color=ffffff' },
  { title: 'waiting for profile', artist: 'profile', art: 'https://api.dicebear.com/9.x/thumbs/svg?seed=wolf&backgroundColor=111827' },
];

const interests = [
  {
    name: 'Beastars',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/BEASTARS%2C_volume_1.jpg/250px-BEASTARS%2C_volume_1.jpg',
    description: "In this anthropomorphic world, gentle wolf Legoshi struggles with instinct, identity, and love after a classmate's murder deepens the divide between carnivores and herbivores at Cherryton Academy.",
  },
  {
    name: 'Fantastic Mr. Fox',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Fantastic_mr_fox.jpg/250px-Fantastic_mr_fox.jpg',
    description: 'A clever stop-motion heist story about family, confidence, and the trouble that follows a fox who cannot stop chasing one more perfect plan.',
  },
  {
    name: 'The Bad Guys (1)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/The_Bad_Guys_poster.jpeg/250px-The_Bad_Guys_poster.jpeg',
    description: 'A stylish crew of animal criminals discovers that pretending to be good can slowly become the real thing.',
  },
  {
    name: 'The Bad Guys (2)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/39/The_Bad_Guys_2_poster.jpg/250px-The_Bad_Guys_2_poster.jpg',
    description: 'The crew returns for another glossy caper with more redemption, chaos, and sharp suits.',
  },
];

const characters = [
  {
    name: 'Mr. Wolf (The Bad Guys)',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/The_Bad_Guys_poster.jpeg/250px-The_Bad_Guys_poster.jpeg',
    description: 'Mr. Wolf is smooth and confident on the outside, but what makes him great is how he uses that confidence to protect his crew and slowly choose empathy over ego.',
  },
  {
    name: 'Legoshi',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/BEASTARS%2C_volume_1.jpg/250px-BEASTARS%2C_volume_1.jpg',
    description: 'A gentle gray wolf whose quiet strength comes from questioning himself and trying to care for others despite instinct and fear.',
  },
  {
    name: 'Jack',
    image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=jack&backgroundColor=facc15,111827',
    description: 'A loyal friend with bright energy and a soft spot for the people he cares about.',
  },
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

function renderTabs(items, container, render) {
  container.innerHTML = '';
  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.name;
    button.addEventListener('click', () => {
      $$('button', container).forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      render(item);
    });
    if (index === 0) button.classList.add('active');
    container.append(button);
  });
  render(items[0]);
}

function renderInterest(item) {
  $('#interest-image').src = item.image;
  $('#interest-image').alt = `${item.name} poster art`;
  $('#interest-name').textContent = item.name;
  $('#interest-description').textContent = item.description;
}

function renderCharacter(item) {
  $('#character-image').src = item.image;
  $('#character-image').alt = `${item.name} character art`;
  $('#character-name').textContent = item.name;
  $('#character-description').textContent = item.description;
}

function renderTrack() {
  const track = tracks[currentTrack];
  $('#album-art').src = track.art;
  $('#track-title').textContent = track.title;
  $$('#artist-list button').forEach((button, index) => button.classList.toggle('active', index === currentTrack));
}

function renderArtists() {
  const list = $('#artist-list');
  list.innerHTML = '';
  tracks.forEach((track, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = track.artist;
    button.addEventListener('click', () => {
      currentTrack = index;
      renderTrack();
      showPanel('music');
    });
    list.append(button);
  });
  renderTrack();
}

function renderMessages() {
  const list = $('#messages-list');
  if (messages.length === 0) {
    list.textContent = 'loading messages...';
    return;
  }

  list.innerHTML = '';
  messages.toReversed().forEach((message) => {
    const card = document.createElement('article');
    card.className = 'message';
    card.innerHTML = '<strong></strong><p></p>';
    $('strong', card).textContent = message.name;
    $('p', card).textContent = message.text;
    list.append(card);
  });
}

$('#open-more').addEventListener('click', () => showPanel('home'));
moreView.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (opener) showPanel(opener.dataset.open);
  if (event.target.closest('[data-action="close"]')) closeMore();
});

$$('[data-theme]').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));

$('#reload-frame').addEventListener('click', () => {
  $('#movie-frame').src = 'https://vr-m.net/';
  $('#movie-status').textContent = 'Loaded vr-m.net inside this page.';
});

$('#save-comment-profile').addEventListener('click', () => {
  const pfp = $('#comment-pfp').value.trim();
  if (pfp) $('#comment-preview').src = pfp;
});

$('#post-comment').addEventListener('click', () => {
  const text = $('#comment-text').value.trim();
  if (!text) return;

  messages.push({ name: $('#comment-name').value.trim() || 'wolf fan', text });
  localStorage.setItem('wolf-comments', JSON.stringify(messages));
  $('#comment-text').value = '';
  renderMessages();
});

$('#prev-track').addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  renderTrack();
});

$('#next-track').addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  renderTrack();
});

$('#play-track').addEventListener('click', (event) => {
  event.currentTarget.textContent = event.currentTarget.textContent === 'Play' ? 'Pause' : 'Play';
});

$('#loop-track').addEventListener('click', (event) => {
  loopEnabled = !loopEnabled;
  event.currentTarget.textContent = `Loop: ${loopEnabled ? 'on' : 'off'}`;
});

setTheme(localStorage.getItem('wolf-theme') || 'blue');
renderTabs(interests, $('#interest-tabs'), renderInterest);
renderTabs(characters, $('#character-tabs'), renderCharacter);
renderArtists();
renderMessages();
