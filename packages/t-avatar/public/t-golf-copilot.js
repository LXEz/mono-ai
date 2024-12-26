const option = new URLSearchParams(location.search).get('option') ?? '';
const mode = new URLSearchParams(location.search).get('mode') ?? '';

const div = document.createElement('div');

div.innerHTML = `<iframe width="100%" height="100%" allow="camera; microphone" id="golf-chatbot-wrapper" frameBorder="0" src="http://localhost:3000/t-golf-copilot.html?initClientWidth=${window.innerWidth}&initClientHeight=${window.innerHeight}&option=${option}&mode=${mode}"
>
</iframe>`;

div.style.position = 'fixed';
div.style.bottom = 0;
div.style.right = 0;
div.style.zIndex = 999999;
div.style.width = '120px';
div.style.height = '120px';

document.body.appendChild(div);

const iframe = document.getElementById('golf-chatbot-wrapper');

window.addEventListener('message', function (event) {
  if (event.source === iframe.contentWindow) {
    div.style.width = event.data.width + 'px';
    div.style.height = event.data.height + 'px';
  }
});

window.addEventListener('resize', function () {
  iframe.contentWindow.postMessage({ clientWidth: window.innerWidth, clientHeight: window.innerHeight }, '*');
});
