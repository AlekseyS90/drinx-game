const container = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const finish = document.getElementById("finish");
const finalScore = document.getElementById("final-score");
const sendBtn = document.getElementById("send-btn");

let score = 0;
let gameRunning = true;
let playerX = window.innerWidth / 2 - 45;

const bottleImages = [
  'bottle1.png',
  'bottle2.png',
  'bottle3.png',
  'bottle4.png',
  'bottle5.png'
];

// === Свайп ===
let touchStartX = 0;
document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener("touchmove", e => {
  if (!gameRunning) return;
  let touchX = e.touches[0].clientX;
  let deltaX = touchX - touchStartX;
  playerX += deltaX;
  if (playerX < 0) playerX = 0;
  if (playerX > window.innerWidth - 90) playerX = window.innerWidth - 90;
  player.style.left = `${playerX}px`;
  touchStartX = touchX;
});

// === Падающая бутылка ===
function spawnBottle() {
  const bottle = document.createElement("div");
  bottle.classList.add("bottle");
  bottle.style.backgroundImage = `url('${bottleImages[Math.floor(Math.random() * bottleImages.length)]}')`;
  bottle.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  container.appendChild(bottle);

  let top = 0;
  const fallInterval = setInterval(() => {
    if (!gameRunning) return clearInterval(fallInterval);
    top += 4;
    bottle.style.top = `${top}px`;

    const bottleRect = bottle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      bottleRect.bottom > playerRect.top &&
      bottleRect.left < playerRect.right &&
      bottleRect.right > playerRect.left
    ) {
      score++;
      scoreDisplay.innerText = `Баллы: ${score}`;
      container.removeChild(bottle);
      clearInterval(fallInterval);

      if (score >= 10) {
        gameRunning = false;
        finalScore.innerText = `Вы набрали ${score} баллов! 🎉`;
        finish.style.display = "block";
      }
    }

    if (top > window.innerHeight) {
      container.removeChild(bottle);
      clearInterval(fallInterval);
    }
  }, 16);
}

function startGameLoop() {
  const bottleInterval = setInterval(() => {
    if (!gameRunning) return clearInterval(bottleInterval);
    spawnBottle();
  }, 1200);
}

startGameLoop();

// === Отправка результата ===
sendBtn.addEventListener("click", () => {
  if (typeof Telegram === "undefined" || !Telegram.WebApp) {
    alert("❌ Telegram WebApp не инициализирован.");
    return;
  }

  Telegram.WebApp.ready(); // на всякий случай
  Telegram.WebApp.sendData(`drinx_game_result:${score}`);
  Telegram.WebApp.close();
});
