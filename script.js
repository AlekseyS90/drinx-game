let score = 0;
const game = document.getElementById('game');
const scoreEl = document.getElementById('score');

function createBottle() {
  const bottle = document.createElement('div');
  bottle.classList.add('bottle');
  bottle.style.left = Math.random() * (window.innerWidth - 30) + 'px';
  bottle.style.top = '-60px';
  game.appendChild(bottle);

  let y = -60;
  const fall = setInterval(() => {
    y += 4;
    bottle.style.top = y + 'px';
    if (y > window.innerHeight) {
      clearInterval(fall);
      bottle.remove();
    }
  }, 30);

  bottle.addEventListener('click', () => {
    score++;
    scoreEl.textContent = `Баллы: ${score}`;
    bottle.remove();
    clearInterval(fall);

    if (score === 10) {
      telegram.sendData(JSON.stringify({ score: 10 })); // Передаём баллы боту
      alert("🎉 Вы выиграли скидку! Показан QR-код.");
    }
  });
}

setInterval(createBottle, 1000);
