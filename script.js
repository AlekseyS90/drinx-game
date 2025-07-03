const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreLabel = document.getElementById("score");
const finishScreen = document.getElementById("finish");
const finalScoreText = document.getElementById("final-score");

let score = 0;
let isGameOver = false;

// Инициализация Telegram WebApp
Telegram.WebApp.ready();

function movePlayer(x) {
  const rect = gameContainer.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  let newX = x - playerWidth / 2;

  if (newX < 0) newX = 0;
  if (newX > rect.width - playerWidth) newX = rect.width - playerWidth;

  player.style.left = `${newX}px`;
}

gameContainer.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  movePlayer(touch.clientX);
});

// Создание бутылок
function spawnBottle() {
  if (isGameOver) return;

  const bottle = document.createElement("div");
  bottle.classList.add("bottle");
  const maxX = gameContainer.offsetWidth - 50;
  const x = Math.floor(Math.random() * maxX);
  bottle.style.left = `${x}px`;
  bottle.style.top = `-60px`;
  gameContainer.appendChild(bottle);

  let y = -60;
  const speed = 3 + Math.random() * 2;

  const fall = setInterval(() => {
    if (isGameOver) {
      clearInterval(fall);
      bottle.remove();
      return;
    }

    y += speed;
    bottle.style.top = `${y}px`;

    const playerRect = player.getBoundingClientRect();
    const bottleRect = bottle.getBoundingClientRect();

    // Столкновение
    if (
      y > gameContainer.offsetHeight - 100 &&
      bottleRect.left < playerRect.right &&
      bottleRect.right > playerRect.left
    ) {
      score++;
      scoreLabel.textContent = `Баллы: ${score}`;
      clearInterval(fall);
      bottle.remove();

      if (score >= 10) {
        endGame();
      }
    }

    if (y > gameContainer.offsetHeight) {
      clearInterval(fall);
      bottle.remove();
    }
  }, 16);
}

function startGame() {
  score = 0;
  isGameOver = false;
  scoreLabel.textContent = `Баллы: 0`;

  const interval = setInterval(() => {
    if (isGameOver) {
      clearInterval(interval);
    } else {
      spawnBottle();
    }
  }, 800);
}

function endGame() {
  isGameOver = true;
  finalScoreText.textContent = `Вы набрали ${score} баллов`;
  finishScreen.style.display = "block";
}

function sendResult() {
  Telegram.WebApp.sendData(JSON.stringify({ score }));
  Telegram.WebApp.close();
}

startGame();
