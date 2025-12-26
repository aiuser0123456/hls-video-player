document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('player');
  const urlInput = document.getElementById('m3u8Url');
  const playButton = document.getElementById('playButton');
  let hls, plyrPlayer;

  function loadVideo(source) {
    if (!source) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = 'No stream URL provided. Please enter a .m3u8 URL.';
      document.body.appendChild(errorDiv);
      return setTimeout(() => errorDiv.remove(), 5000);
    }

    if (Hls.isSupported()) {
      if (hls) hls.destroy();
      hls = new Hls({ maxMaxBufferLength: 100 });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const qualities = hls.levels.map(l => l.height);
        const defaultQuality = qualities[0];

        if (plyrPlayer) plyrPlayer.destroy();
        plyrPlayer = new Plyr(video, {
          controls: ['play-large','play','mute','volume','settings','fullscreen','pip'],
          quality: {
            default: defaultQuality,
            options: qualities,
            forced: true,
            onChange: q => {
              hls.levels.forEach((l, i) => {
                if (l.height === q) hls.currentLevel = i;
              });
            }
          }
        });

        video.play();
      });
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      if (plyrPlayer) plyrPlayer.destroy();
      plyrPlayer = new Plyr(video);
      video.addEventListener('loadedmetadata', () => video.play());
    } 
    else {
      document.body.innerHTML = '<p>Your browser does not support HLS playback.</p>';
    }
  }

  function getQueryParam(p) {
    return new URLSearchParams(window.location.search).get(p);
  }

  const urlParam = getQueryParam('url');
  let initialSource =
    "https://zd.strmd.top/secure/HrDcTAZRSHOimBNsgpvQQeAuuGEYRvPH/hotel/stream/2nd-odi-england-vs-south-africa/2/playlist.m3u8";

  if (urlParam) {
    initialSource = decodeURIComponent(urlParam);
    urlInput.value = initialSource;
  }

  loadVideo(initialSource);
  playButton.addEventListener('click', () => loadVideo(urlInput.value.trim()));
});

window.addEventListener("load", () => {
  if (confirm("Join m3u8 player for more updates")) {
    window.location.href = "https://t.me/+tsTzlm760chhZDI1";
  }
});

window.onload = () => {
  const container = document.createElement('div');
  container.id = 'popup-container';
  document.body.appendChild(container);

  const popup = document.createElement('div');
  popup.classList.add('modal');
  popup.innerHTML = `
  <div class="modal-content">
    <h2>Support Us!</h2>
    <p>Join our Telegram channel <br><strong>m3u8 player</strong> for more updates.</p>
    <button id="joinButton">Join Now and support us</button>
    <button id="closeButton">Already Joined</button>
  </div>`;

  container.appendChild(popup);

  popup.querySelector('#joinButton').onclick = () =>
    window.open("https://t.me/+tsTzlm760chhZDI1", "_blank");

  popup.querySelector('#closeButton').onclick = () =>
    popup.remove();
};
