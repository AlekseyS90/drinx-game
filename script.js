const container = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const finish = document.getElementById("finish");
const finalScore = document.getElementById("final-score");
const sendBtn = document.getElementById("send-btn");
const explosionElement = document.getElementById("explosion");

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

// Аудиоэлементы
const bottleSound = document.getElementById("bottleSound");
const explosionSound = document.getElementById("explosionSound");

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

// === Падающая бутылка и бомба ===
function spawnItem() {
  const item = document.createElement("div");
  item.classList.add("item"); // общий класс для бутылок и бомб

  const isBomb = Math.random() < 0.2; // 20% шанс появления бомбы

  if (isBomb) {
    item.classList.add("bomb");
    item.style.backgroundImage = "url('bomb.png')"; // убедитесь, что файл bomb.png существует
  } else {
    item.classList.add("bottle");
    item.style.backgroundImage = `url('${bottleImages[Math.floor(Math.random() * bottleImages.length)]}')`;
  }

  item.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  container.appendChild(item);

  let top = 0;
  const fallInterval = setInterval(() => {
    if (!gameRunning) return clearInterval(fallInterval);
    top += 4;
    item.style.top = `${top}px`;

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom > playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      container.removeChild(item);
      clearInterval(fallInterval);

      if (isBomb) {
        // Взрыв
        gameRunning = false;
        finalScore.innerText = "Вы взорвались! 💥";
        finish.style.display = "block";
        sendBtn.disabled = true; // деактивируем кнопку

        // Проигрышная анимация
        explosionElement.style.display = "block";
        explosionElement.style.left = `${playerRect.left + playerRect.width / 2 - 100}px`;
        explosionElement.style.top = `${playerRect.top - 100}px`;

        // Воспроизводим звук взрыва
        explosionSound.play();

        // Скрываем анимацию через 1 секунду
        setTimeout(() => {
          explosionElement.style.display = "none";
        }, 1000);
      } else {
        // Сбор бутылки
        score++;
        scoreDisplay.innerText = `Баллы: ${score}`;
        bottleSound.play(); // Воспроизводим звук сбора бутылки

        if (score >= 10) {
          gameRunning = false;
          finalScore.innerText = `Вы набрали ${score} баллов! 🎉`;
          finish.style.display = "block";
          sendBtn.disabled = false;
        }
      }
    }

    if (top > window.innerHeight) {
      container.removeChild(item);
      clearInterval(fallInterval);
    }
  }, 16);
}

function startGameLoop() {
  const itemInterval = setInterval(() => {
    if (!gameRunning) return clearInterval(itemInterval);
    spawnItem();
  }, 1200);
}

startGameLoop();

// === Отправка результата ===
sendBtn.addEventListener("click", () => {
  const finalScoreValue = parseInt(scoreDisplay.innerText.replace(/\D+/g, ''), 10);

  if (isNaN(finalScoreValue) || finalScoreValue < 10) {
    alert("Вы должны набрать минимум 10 баллов!");
    return;
  }

  if (typeof Telegram === "undefined" || !Telegram.WebApp) {
    alert("❌ Telegram WebApp не инициализирован.");
    return;
  }

  Telegram.WebApp.ready(); // на всякий случай
  Telegram.WebApp.sendData(`drinx_game_result:${finalScoreValue}`);
  Telegram.WebApp.close();
});
