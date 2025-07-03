const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreLabel = document.getElementById("score");
const finishScreen = document.getElementById("finish");
const finalScoreText = document.getElementById("final-score");

let score = 0;
let isGameOver = false;

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

// Появление бутылок
function spawnBottle() {
  if (isGameOver) return;

  const bottle = document.createElement("div");
  bottle.className = "bottle";
  bottle.style.left = `${Math.random() * (gameContainer.offsetWidth - 60)}px`;
  bottle.style.top = `-60px`;
  gameContainer.appendChild(bottle);

  let y = -60;
  const fallSpeed = 3 + Math.random() * 3;

  const interval = setInterval(() => {
    if (isGameOver) {
      bottle.remove();
      clearInterval(interval);
      return;
    }

    y += fallSpeed;
    bottle.style.top = `${y}px`;

    const bottleRect = bottle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      y > gameContainer.offsetHeight - 120 &&
      bottleRect.left < playerRect.right &&
      bottleRect.right > playerRect.left
    ) {
      score++;
      scoreLabel.textContent = `Баллы: ${score}`;
      bottle.remove();
      clearInterval(interval);

      if (score >= 10) {
        endGame();
      }
    }

    if (y > gameContainer.offsetHeight) {
      bottle.remove();
      clearInterval(interval);
    }
  }, 16);
}

function startGame() {
  score = 0;
  isGameOver = false;
  scoreLabel.textContent = `Баллы: 0`;
  finishScreen.style.display = "none";

  const gameInterval = setInterval(() => {
    if (isGameOver) clearInterval(gameInterval);
    else spawnBottle();
  }, 900);
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
