const profileCard = document.querySelector("#profile-card");
const morePanel = document.querySelector("#more-panel");
const openMore = document.querySelector("#open-more");
const closeMore = document.querySelector("#close-more");
const profileClock = document.querySelector("#profile-clock");
const transparencySlider = document.querySelector("#transparency-slider");
const themeButtons = document.querySelectorAll("[data-preset]");
const menuButtons = document.querySelectorAll("[data-view]");
const backButtons = document.querySelectorAll(".sub-back");
const panelViews = document.querySelectorAll(".panel-view");

const discordUserId = "222604250667155456";
const statusLabels = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

function updateClock() {
  profileClock.textContent = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

function showProfile() {
  profileCard.classList.remove("is-hidden");
  morePanel.classList.remove("is-visible");
  morePanel.setAttribute("aria-hidden", "true");
  showPanelView("more-home-view");
}

function showMore() {
  profileCard.classList.add("is-hidden");
  morePanel.classList.add("is-visible");
  morePanel.setAttribute("aria-hidden", "false");
}

function showPanelView(viewId) {
  panelViews.forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });
}

function applyPreset(preset) {
  document.body.classList.remove("blue-preset", "orange-preset", "mono-preset", "dark-preset");
  document.body.classList.add(preset);
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === preset);
  });
}

function getDiscordAvatarUrl(user) {
  if (!user?.id || !user?.avatar) {
    return "https://raw.githubusercontent.com/wolfiinator/wolf.lol-beta/main/assets/profile.gif";
  }

  const extension = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
}

function renderSpotifyPresence(presence) {
  const spotifyPresence = document.querySelector("#spotify-presence");
  const spotifyAvatar = document.querySelector("#spotify-avatar");
  const spotifyLabel = document.querySelector("#spotify-label");
  const spotifySong = document.querySelector("#spotify-song");
  const spotifyArtist = document.querySelector("#spotify-artist");
  const spotify = presence?.spotify;

  if (!spotify) {
    spotifyPresence.classList.add("hidden");
    spotifyAvatar.src = "https://raw.githubusercontent.com/wolfiinator/wolf.lol-beta/main/assets/profile.gif";
    spotifySong.textContent = "not listening";
    spotifyArtist.textContent = "waiting for profile";
    return;
  }

  spotifyPresence.classList.remove("hidden");
  spotifyAvatar.src = spotify.album_art_url || spotifyAvatar.src;
  spotifyAvatar.alt = `${spotify.song || "Spotify"} album art`;
  spotifyLabel.textContent = "spotify • listening";
  spotifySong.textContent = spotify.song || "unknown song";
  spotifyArtist.textContent = [spotify.artist, spotify.album].filter(Boolean).join(" • ") || "unknown artist";
}

function renderDiscordPresence(presence) {
  const discordAvatar = document.querySelector("#discord-avatar");
  const discordLabel = document.querySelector("#discord-label");
  const discordName = document.querySelector("#discord-name");
  const discordStatus = document.querySelector("#discord-status");

  if (!presence) {
    discordLabel.textContent = "discord profile";
    discordName.textContent = "profile unavailable";
    discordStatus.textContent = `user ${discordUserId}`;
    renderSpotifyPresence(null);
    return;
  }

  const user = presence.discord_user || {};
  const status = statusLabels[presence.discord_status] || "offline";
  const customStatus = presence.activities?.find((activity) => activity.type === 4);
  const displayName = user.global_name || user.display_name || user.username || "wolf.";
  const customText = [customStatus?.emoji?.name, customStatus?.state].filter(Boolean).join(" ").trim();

  discordAvatar.src = getDiscordAvatarUrl(user);
  discordAvatar.alt = `${displayName} Discord avatar`;
  discordLabel.textContent = `discord profile • ${status}`;
  discordName.textContent = displayName;
  discordStatus.textContent = customText || status;
  renderSpotifyPresence(presence);
}

async function updatePresence() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Lanyard responded ${response.status}`);
    const payload = await response.json();
    renderDiscordPresence(payload?.success ? payload.data : null);
  } catch (error) {
    renderDiscordPresence(null);
  }
}

openMore.addEventListener("click", showMore);
closeMore.addEventListener("click", showProfile);
backButtons.forEach((button) => button.addEventListener("click", () => showPanelView("more-home-view")));
menuButtons.forEach((button) => button.addEventListener("click", () => showPanelView(button.dataset.view)));
themeButtons.forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));

transparencySlider.addEventListener("input", (event) => {
  document.documentElement.style.setProperty("--card-alpha", Number(event.target.value) / 100);
});

updateClock();
setInterval(updateClock, 1000);
updatePresence();
setInterval(updatePresence, 60000);
