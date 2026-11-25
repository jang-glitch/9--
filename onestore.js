// 원스토어 웹게임 SDK 기본 연동과 게임 시작 순서를 담당한다.
// 일반 브라우저에서는 SDK 호출 없이 지금처럼 게임을 시작한다.
const SDK_URL = 'https://h5sdk.onestore.net/lib/v1.2.0/onestore-h5-sdk.min.js';
const PHASER_URL = 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js';

let sdk = null;
let inStore = false;
let game = null;
let pausedBeforeStart = false;

function pauseGame() {
  if (!game) { pausedBeforeStart = true; return; }
  game.pause();
  game.sound.pauseAll();
}

function resumeGame() {
  if (!game) { pausedBeforeStart = false; return; }
  game.resume();
  game.sound.resumeAll();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initStore() {
  try {
    const { createSDK } = await import(SDK_URL);
    sdk = createSDK();
    sdk.on('pause', pauseGame);
    sdk.on('resume', resumeGame);
    const init = await sdk.initializeAsync();
    inStore = !!init && !init.err;
  } catch (error) {
    inStore = false;
  }
}

function setProgress(value) {
  if (inStore) sdk.setLoadingProgress(value);
}

async function startStoreGame() {
  setProgress(100);
  if (!inStore) return;
  try { await sdk.startGameAsync(); } catch (error) { /* 실패해도 게임은 계속 진행한다. */ }
}

await initStore();
await loadScript(PHASER_URL);
setProgress(50);
({ game } = await import('./game.js'));
setProgress(90);
if (pausedBeforeStart) pauseGame();
if (game.isRunning) startStoreGame();
else game.events.once('ready', startStoreGame);
