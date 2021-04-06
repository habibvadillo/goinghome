let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.style.border = "2px solid black";

// Selectors
let menu = document.querySelector("#menu");
let startBtn = document.querySelector("#start");
let restartDiv = document.querySelector("#restart-div");
let winDiv = document.querySelector("#win-div");
let restartBtn = document.querySelectorAll(".restartBtn");
let menuBtn = document.querySelectorAll(".menuBtn");
let score = document.querySelector("#score");
let highscores = winDiv.querySelector("ul");
let highscoreTitle = winDiv.querySelector("h2");
let replayBtn = winDiv.querySelector(".restartBtn");
let sumbitScoreBtn = winDiv.querySelector(".submitScoreBtn");
let inputName = winDiv.querySelector("input");
let difficulty = document.querySelector("#difficulty");

// Images
let menuBg = new Image();
menuBg.src = "./images/menubg.png";

let sewerBg = new Image();
sewerBg.src = "./images/sewerbg.PNG";

let sewerFloor = new Image();
sewerFloor.src = "./images/sewerfloor.PNG";

let sewerExit = new Image();
sewerExit.src = "./images/sewerExit.jpg";

let slime = new Image();
slime.src = "./images/slime.png";

// Classes

class BackGround {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
  }
}

class Platform {
  constructor(y, width, number, type) {
    this.x =
      type === 1
        ? Math.floor(
            Math.random() * (canvas.width - platformWidth - slime.width * 2.4) +
              slime.width * 1.2
          )
        : Math.floor(
            Math.random() * (canvas.width - platformWidth - slime.width * 1) +
              slime.width * 0.5
          );
    this.y = y;
    this.width = width;
    this.number = number;
    this.type = type;
    this.broken = false;
  }
}

// Variables

let mode;
let redStart, blueStart;
let intervalId = 0;
let winningPlatform;
let printedEnd = false;
let hasWon = false;
let gameOver = false;
let startTime,
  seconds = 0,
  time = "00:00",
  winTime,
  winTimes = [{ name: "Habib", time: 61 }],
  reachedEnd = false;
let gameSpeed = 1;
let keys = {};
keys.LEFT = 37;
keys.RIGHT = 39;
keys.A = 65;
keys.D = 68;
keys.SPACE = 32;
let hitBlue = false;
let redBreak = false;

let floor = canvas.height - 165;

// Slime

let slimeX = canvas.width - 40 - slime.width,
  slimeY = floor,
  slimeSpeed = 5;

// Backgrounds

let bgs = [
  new BackGround(sewerFloor, 0, 0),
  new BackGround(sewerBg, 0, 0 - sewerBg.height),
];

// Platforms

let platformWidth = 100,
  platformHeight = 20,
  platformInterval = 80,
  platformLimit = Math.ceil(canvas.height / platformInterval),
  platformCount = 0,
  platforms = [],
  isOnPlatform = false,
  currentPlatform = {},
  nextPlatform = {};

let started = false;

// Jump

let jumpHeight,
  jumpSpeed,
  jumpBase,
  jumpIntId,
  jumping,
  falling = false,
  jumpDistance = 0,
  isJumping = false;

// GameSpeed

let wind = 0;
let faster = false;
let moveSpeed = 1;
let platformDown = 1;
let slimeDown = 1;
let BackGroundDown = 1;

// Keyboard Events

document.body.onkeyup = function (e) {
  if (inputName.value < 1) {
    sumbitScoreBtn.disabled = true;
  } else {
    sumbitScoreBtn.disabled = false;
  }
  keys[e.which] = e.type == "keydown";
};
document.body.onkeydown = function (e) {
  keys[e.which] = e.type == "keydown";
};

// Functions / Refactoring

let formatTime = (sec) => {
  return `${twoDigits(Math.floor(sec / 60))}:${twoDigits(sec % 60)}`;
};

function centerDiv(div) {
  Object.assign(div.style, {
    top: `${canvas.height / 2 - parseInt(div.offsetHeight) / 2 + 8}px`,
    left: `${canvas.width / 2 - parseInt(div.offsetWidth) / 2 + 8}px`,
    textAlign: "center",
  });
}

let twoDigits = (value) => {
  if (value < 10) {
    return "0" + value;
  } else {
    return value.toString();
  }
};

// Jump

let slimeJump = () => {
  if (!isJumping) {
    isJumping = true;
  } else {
    if (jumpDistance < jumpHeight && !falling && !hitBlue) {
      isOnPlatform = false;
      jumpDistance += 1 * gameSpeed;
      slimeY -= 1 * gameSpeed;
      platforms.forEach((plat) => {
        if (
          plat.type === 1 &&
          slimeY < plat.y + platformHeight &&
          slimeY > plat.y + platformHeight / 9 &&
          slimeX + slime.width >= plat.x &&
          slimeX < plat.x + platformWidth
        ) {
          hitBlue = true;
        }
      });
    } else {
      falling = true;
      jumpDistance -= 1 * gameSpeed;
      slimeY += 1 * gameSpeed;
      platforms.forEach((plat) => {
        slimeBase = slimeY + slime.height;
        if (
          !plat.broken &&
          slimeBase > plat.y &&
          slimeBase < plat.y + platformHeight / 2 &&
          slimeX + slime.width >= plat.x &&
          slimeX < plat.x + platformWidth
        ) {
          hitBlue = false;
          isOnPlatform = true;
          currentPlatform = plat;
          if (currentPlatform.type === 2) {
            setTimeout(() => {
              plat.broken = true;
              setTimeout(() => {
                plat.broken = false;
              }, 1500 / gameSpeed);
            }, 1000 / gameSpeed);
          }
          jumpDistance = 0;
          isJumping = false;
          falling = false;
          clearInterval(jumping);
        }
      });
    }
  }
};

// Left and Right movement

let moveCharacter = (dx) => {
  slimeX += dx * slimeSpeed;
};

let detectCharacterMovement = () => {
  if (keys[keys.LEFT] || keys[keys.A]) {
    if (slimeX > 0) {
      moveCharacter(-1);
    }
  }
  if (keys[keys.RIGHT] || keys[keys.D]) {
    if (slimeX < canvas.width - slime.width) {
      moveCharacter(1);
    }
  }
  if (keys[keys.SPACE]) {
    if (isJumping === false) {
      started = true;
      jumping = setInterval(slimeJump, 4);
    }
  }
};

//Loops & Moving everything down over time

let moveAllDown = (moveDownSpeed) => {
  bgs.forEach((bg) => {
    bg.y += BackGroundDown * moveDownSpeed;
  });
  platforms.forEach((plat) => {
    plat.y += platformDown * moveDownSpeed;
  });
  slimeY += slimeDown * moveDownSpeed;
  slimeX += wind * gameSpeed;
};

let loopBackgrounds = () => {
  for (let i = 0; i < bgs.length; i++) {
    ctx.drawImage(bgs[i].img, bgs[i].x, bgs[i].y);
  }
  if (
    bgs[0].y > canvas.height &&
    platformCount < winningPlatform - platformLimit - 1
  ) {
    console.log(bgs);
    bgs.push(new BackGround(sewerBg, 0, 0 - sewerBg.height));
    bgs.shift();
  }
};

let loopPlatforms = () => {
  for (let i = 0; i < platforms.length; i++) {
    drawPlatforms(platforms[i]);
  }
};

// Platform Functions

let fallOffPlatform = () => {
  slimeBase = slimeY + slime.height;
  if (
    (currentPlatform.broken && isOnPlatform) ||
    (isOnPlatform &&
      !isJumping &&
      (slimeX + slime.width < currentPlatform.x ||
        slimeX >= currentPlatform.x + platformWidth))
  ) {
    clearInterval(jumping);
    falling = true;
    jumping = setInterval(slimeJump, 4);
  }
};

let drawPlatforms = (platform) => {
  if (!platform.broken) {
    ctx.fillStyle =
      platform.type === 0 ? "yellow" : platform.type === 1 ? "blue" : "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillRect(platform.x, platform.y, platform.width, platformHeight);
    ctx.strokeRect(platform.x, platform.y, platform.width, platformHeight);
    ctx.font = "bold 16px Verdana";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(
      platform.number,
      platform.x + platform.width / 2,
      platform.y + 10
    );
  }
};

let loadPlatforms = () => {
  for (let i = 1; i <= platformLimit + 1; i++) {
    platforms.push(
      new Platform(
        slime.height + floor - platformInterval * i,
        platformWidth,
        i,
        mode === "Impossible" ? Math.floor(Math.random() * 3) : 0
      )
    );
  }
};

let clearAddPlatforms = () => {
  if (lastPlatform.y > 0) {
    if (lastPlatform.number !== winningPlatform) {
      platformCount++;
      platforms.shift();
      let type = 0;
      let typeNum = Math.floor(Math.random() * 3);
      if (platformCount + platforms.length + 1 > blueStart) {
        type = typeNum === 1 ? 1 : 0;
        if (platformCount + platforms.length + 1 > redStart) {
          type = Math.floor(Math.random() * 3);
        }
      }
      platforms.push(
        new Platform(
          -platformInterval,
          platformWidth,
          platformCount + platforms.length + 1,
          type
        )
      );
    }
  }
};

// Main Menu

let loadMainMenu = () => {
  ctx.drawImage(menuBg, 0, 0);
};

// Time

let drawTime = () => {
  ctx.font = "36px Orbitron";
  ctx.fillStyle = "#07fc03";
  ctx.fillText(`${time}`, 70, 25);
  ctx.lineWidth = 1;
  ctx.strokeText(`${time}`, 70, 25);
};

// End Screen

// Animation loop

let gameLoop = () => {
  if (started === true) {
    loopBackgrounds();
    loopPlatforms();
    clearAddPlatforms();
    seconds = parseInt((new Date().getTime() - startTime) / 1000, 10);
    time = formatTime(seconds);
    moveAllDown(moveSpeed * gameSpeed);
  } else {
    startTime = new Date().getTime();
    ctx.drawImage(bgs[0].img, bgs[0].x, bgs[0].y);
    for (let i = 0; i < platforms.length; i++) {
      drawPlatforms(platforms[i], i);
    }
  }
  if (!reachedEnd) {
    drawTime();
  }

  if (mode !== "Peaceful") {
    if (platforms[platforms.length - 1].number > winningPlatform / 2) {
      console.log("winds incoming!");
    }
    if (currentPlatform.number === winningPlatform / 2) {
      wind = 0;
    }
  }

  lastPlatform = platforms[platforms.length - 1];

  ctx.drawImage(slime, slimeX, slimeY);

  if (isJumping) {
    slimeSpeed = 4 * gameSpeed;
  } else {
    slimeSpeed = 5 * gameSpeed;
  }

  detectCharacterMovement();

  fallOffPlatform();

  if (
    lastPlatform.number === winningPlatform &&
    lastPlatform.y > -platformInterval &&
    !printedEnd
  ) {
    bgs.push(new BackGround(sewerExit, 0, 0 - canvas.height));
    printedEnd = true;
  }

  if (currentPlatform.number === winningPlatform) {
    if (!reachedEnd) {
      keys = {
        SPACE: 32,
      };
      reachedEnd = true;
      gameSpeed = 0;
      winTime = seconds;
      score.innerText = `Your time: ${time}`;
      setTimeout(() => {
        gameSpeed = 2;
        slimeY -= 2;
      }, 1000);
    }
    if (slimeY > canvas.height - 165) {
      hasWon = true;
      gameOver = true;
    }
  }

  if (slimeY < canvas.height / 4) {
    if (slimeY < canvas.height / 5) {
      if (slimeY < canvas.height / 8) {
        moveSpeed = 3;
      } else {
        moveSpeed = 2;
      }
    } else {
      moveSpeed = 1.5;
    }
  } else {
    moveSpeed = 1;
  }

  if (slimeY > canvas.height) {
    hasWon = false;
    gameOver = true;
  }

  if (gameOver) {
    cancelAnimationFrame(intervalId);
    if (hasWon) {
      winDiv.style.display = "flex";
      centerDiv(winDiv);
    } else {
      restartDiv.style.display = "flex";
      centerDiv(restartDiv);
    }
  } else {
    intervalId = requestAnimationFrame(gameLoop);
  }
};
let start = () => {
  // Reset settings

  time = "00:00";
  gameOver = false;
  keys.LEFT = 37;
  keys.RIGHT = 39;
  keys.A = 65;
  keys.D = 68;
  keys.SPACE = 32;
  clearInterval(jumping);
  reachedEnd = false;
  hitBlue = false;
  gameSpeed = 1;
  printedEnd = false;
  currentPlatform = 0;
  seconds = 0;
  platformCount = 0;
  falling = false;
  jumpDistance = 0;
  isJumping = false;
  slimeX = canvas.width - 40 - slime.width;
  slimeY = canvas.height - 165;
  slimeSpeed = 5;
  bgs = [
    new BackGround(sewerFloor, 0, 0),
    new BackGround(sewerBg, 0, 0 - sewerBg.height),
  ];
  wind = 0;
  started = false;
  platforms = [];
  menu.style.display = "none";

  // Set Difficulty

  mode = difficulty.value;

  if (mode === "Peaceful") {
    winningPlatform = 50;
  } else if (mode === "Normal") {
    gameSpeed = 1.5;
    redStart = 50;
    blueStart = 25;
    winningPlatform = 100;
  } else {
    gameSpeed = 2;
    redStart = 0;
    blueStart = 0;
    winningPlatform = 100;
  }
  jumpHeight = platformInterval + 20;
  jumpSpeed = 3 * gameSpeed;
  highscoreTitle.style.display = "none";
  replayBtn.style.display = "none";
  loadPlatforms();
  gameLoop();
};

let sumbitScore = () => {
  winTimes.push({ name: `${inputName.value}`, time: winTime });
  winTimes.sort((a, b) => a.winTime - b.winTime);
  winTimes.forEach((t) => {
    let newScore = document.createElement("li");
    newScore.innerText = `${t.name}: ${formatTime(t.time)}`;
    highscores.appendChild(newScore);
  });
  replayBtn.style.display = "inline";
  highscoreTitle.style.display = "block";
  sumbitScoreBtn.style.display = "none";
  inputName.style.display = "none";
};

let restart = () => {
  highscores.innerHTML = "";
  inputName.style.display = "inline";
  restartDiv.style.display = "none";
  winDiv.style.display = "none";
  sumbitScoreBtn.style.display = "inline";
  start();
};

let backToMenu = () => {
  loadMainMenu();
  menu.style.display = "flex";
  highscores.innerHTML = "";
  inputName.style.display = "inline";
  restartDiv.style.display = "none";
  winDiv.style.display = "none";
  sumbitScoreBtn.style.display = "inline";
};

window.addEventListener("load", () => {
  loadMainMenu();
  startBtn.addEventListener("click", () => {
    start();
  });
  restartBtn.forEach((b) => {
    b.addEventListener("click", () => {
      restart();
    });
  });
  menuBtn.forEach((b) => {
    b.addEventListener("click", () => {
      backToMenu();
    });
  });
  sumbitScoreBtn.addEventListener("click", () => {
    sumbitScore();
  });
});
