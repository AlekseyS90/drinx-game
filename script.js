const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 160, y: 550, width: 80, height: 30, speed: 5
};

let bottles = [];
let score = 0;
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBottle(b) {
  ctx.fillStyle = "#800000";
  ctx.fillRect(b.x, b.y, b.width, b.height);
}

function spawnBottle() {
  const bottle = {
    x: Math.random() * 360,
    y: -20,
    width: 20,
    height: 40,
    speed: 2 + Math.random() * 2
  };
  bottles.push(bottle);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();

  bottles.forEach((bottle, index) => {
    bottle.y += bottle.speed;
    drawBottle(bottle);

    if (
      bottle.y + bottle.height > player.y &&
      bottle.x < player.x + player.width &&
      bottle.x + bottle.width > player.x
    ) {
      bottles.splice(index, 1);
      score++;
    }

    if (bottle.y > canvas.height) {
      bottles.splice(index, 1);
    }
  });

  if (score >= 10) {
    document.getElementById("winMessage").style.display = "block";
    gameOver = true;
  }

  requestAnimationFrame(update);
}

setInterval(spawnBottle, 1000);
update();

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});
