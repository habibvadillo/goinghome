let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.style.border = "2px solid black";

// Selectors
let menu = document.querySelector("#menu");
let startBtn = document.querySelectorAll(".start");
let restartDiv = document.querySelector("#restart-div");
let winDiv = document.querySelector("#win-div");
let restartBtn = document.querySelectorAll(".restartBtn");
let menuBtn = document.querySelectorAll(".menuBtn");
let muteBtn = document.querySelector("#muteBtn");
let endMenuBtn = winDiv.querySelector(".menuBtn");
let score = document.querySelector("#score");
let highscores = winDiv.querySelector("ul");
let highscoreTitle = winDiv.querySelector("h3");
let replayBtn = winDiv.querySelector(".restartBtn");
let submitScoreBtn = winDiv.querySelector(".submitScoreBtn");
let inputName = winDiv.querySelector("input");
let difficulty = document.querySelector("#difficulty");
let windAlert = document.querySelector("#windAlert");
let bgAudio = document.querySelector("audio");
let howToBtn = document.querySelector("#howTo");
let howToDiv = document.querySelector("#howToPlay");
let howToInfo = howToDiv.querySelector("#howToInfo");
let nextPageBtn = document.querySelector("#nextPage");
let prevPageBtn = document.querySelector("#prevPage");
let deathAudio = document.querySelector("#deathsound");

highscoreTitle.style.font = "20px";
bgAudio.volume = 0.03;
muteBtn.style.left = `${canvas.width - 40}px`;
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
const HIGH_SCORES_PEACEFUL = "highscores",
  HIGH_SCORES_NORMAL = "highscores2",
  HIGH_SCORES_IMPOSSIBLE = "highscores3";
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
  winTimes = JSON.parse(localStorage.getItem(HIGH_SCORES_PEACEFUL)) || [],
  winTimes2 = JSON.parse(localStorage.getItem(HIGH_SCORES_NORMAL)) || [],
  winTimes3 = JSON.parse(localStorage.getItem(HIGH_SCORES_IMPOSSIBLE)) || [],
  reachedEnd = false;
// Pushing Friends's highscores
winTimes2.push({ name: "Dan The Man", time: 76 });
let gameSpeed = 1;
let keys = {};
keys.LEFT = 37;
keys.RIGHT = 39;
keys.A = 65;
keys.D = 68;
keys.SPACE = 32;
let hitBlue = false;
let redBreak = false;
let windIncoming = false,
  windSpeed;
let audioOn = false;
let floor = canvas.height - 165;
let isOnFloor = true;
let pageTitles = ["Controls", "Platforms", "Winds", "Difficulty"];
let pagesArray = [
  // Controls Page
  `<p>
    Jump: <img src="./images/Spacekey.png" alt="spacekey" />
   </p>
   <p>
    Move Left: <img src="./images/Akey.png" alt="akey" /> or <img src="./images/Leftkey.png" alt="leftkey"/>
   </p>
   <p>
    Move Right: <img src="./images/Dkey.png" alt="dkey" /> or <img src="./images/Rightkey.png" alt="leftkey"/>
   </p>`,
  // Platforms Page
  `<p>
    <span style="color: blue; font-weight: bold;">Blue Platforms</span> are impossible to jump through so you must jump around them.
   </p>
   <p>
    <span style="color: red; font-weight: bold;">Red Platforms</span> will break shortly after you touch them but will reappear after a moment.
   </p>`,
  // Winds Page
  `<p>
    <span style="color: #E57FE5; font-weight: bold;">Winds</span> will come after 10 and every 30 or so platforms.
   </p>`,
  // Difficulty Page
  `<p>
    You're all set to start the journey <strong>home</strong>!
   </p>
   <p>
    Set your difficulty here and get on your way!
   </p>
   <label for="difficultyFromPages">Difficulty:</label>
   <select name="difficulty" id="difficultyFromPages">
     <option value="Normal">Normal</option>
     <option value="Peaceful">Peaceful</option>
     <option value="Impossible">Impossible</option>
   </select>`,
];
let pageIndex;
let deathCount = 0;
let deathSound;
let deathSounds = [
  "./audio/Death1.mp3",
  "./audio/Death2.mp3",
  "./audio/Death3.mp3",
  "./audio/Death4.mp3",
  "./audio/Death5.mp3",
];

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
  currentPlatform,
  nextPlatform,
  windStarts = [];

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
    submitScoreBtn.disabled = true;
  } else {
    submitScoreBtn.disabled = false;
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
  isOnFloor =
    mode === "Peaceful" &&
    bgs[0].img.src === "http://127.0.0.1:5500/images/sewerfloor.PNG" &&
    slimeY === floor + bgs[0].y;
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
          (!plat.broken &&
            slimeBase > plat.y &&
            slimeBase < plat.y + platformHeight / 2 &&
            slimeX + slime.width >= plat.x &&
            slimeX < plat.x + platformWidth) ||
          isOnFloor
        ) {
          clearInterval(jumping);
          jumpDistance = 0;
          isJumping = false;
          falling = false;
          currentPlatform = plat;
          if (currentPlatform > 0) {
            isOnFloor = false;
          } else {
            isOnPlatform = true;
          }
          hitBlue = false;
          if (currentPlatform.type === 2) {
            setTimeout(() => {
              plat.broken = true;
              setTimeout(() => {
                plat.broken = false;
              }, 1500 / gameSpeed);
            }, 1000 / gameSpeed);
          }
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
    !isOnFloor &&
    ((currentPlatform.broken && isOnPlatform) ||
      (isOnPlatform &&
        !isJumping &&
        (slimeX + slime.width < currentPlatform.x ||
          slimeX >= currentPlatform.x + platformWidth)))
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

let drawDeathCount = () => {
  ctx.font = "bold 16px Verdana";
  ctx.fillStyle = "red";
  ctx.fillText(`DEATHCOUNT: ${deathCount}`, 80, 56);
  ctx.lineWidth = 1;
  ctx.strokeText(`DEATHCOUNT: ${deathCount}`, 80, 56);
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

  windStarts.forEach((plat) => {
    if (currentPlatform.number === plat && !windIncoming) {
      windIncoming = true;
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      let incomingWind =
        (Math.floor(Math.random() * windSpeed) + 5) * plusOrMinus;
      let windDirection = plusOrMinus === 1 ? "Right" : "Left";
      windAlert.style.display = "flex";
      windAlert.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
      windAlert.innerHTML = `<p>Winds Incoming! ${Math.abs(
        incomingWind
      )}km/h to the ${windDirection} </p>`;
      centerDiv(windAlert);
      setTimeout(() => {
        windAlert.style.display = "none";
        wind = incomingWind / 10;
        setTimeout(() => {
          windAlert.style.backgroundColor = "rgba(66, 203, 245, 0.8)";
          windAlert.style.display = "flex";
          windAlert.innerHTML =
            "<p style='padding: 25px; margin: 0px'>The winds have calmed<p>";
          windIncoming = false;
          wind = 0;
          setTimeout(() => {
            windAlert.style.display = "none";
            windAlert.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
          }, 2000);
        }, 9000);
      }, 4000);
    }
  });

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
      wind = 0;
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
    moveSpeed = mode === "Peaceful" && !reachedEnd ? 0 : 1;
  }

  if (slimeY > canvas.height) {
    if (mode === "Impossible") {
    }
    hasWon = false;
    deathCount++;
    deathAudio.volume = 0.1;
    deathAudio.play();
    gameOver = true;
  }
  if (!reachedEnd) {
    drawTime();
    if (mode === "Impossible") {
      drawDeathCount();
    }
  }

  if (gameOver) {
    cancelAnimationFrame(intervalId);
    windAlert.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    windAlert.style.display = "none";
    let id = window.setTimeout(function () {}, 0);
    while (id--) {
      window.clearTimeout(id);
    }
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

  deathSound = Math.floor(Math.random() * deathSounds.length);
  deathAudio.src = deathSounds[deathSound];
  windStarts = [];
  windIncoming = false;
  windAlert.style.display = "none";
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
    windSpeed = 1;
    winningPlatform = 50;
    redStart = winningPlatform;
    blueStart = winningPlatform;
  } else if (mode === "Normal") {
    windSpeed = 5;
    gameSpeed = 1.3;
    redStart = 50;
    blueStart = 25;
    winningPlatform = 100;
  } else {
    windSpeed = 7;
    gameSpeed = 2;
    redStart = 0;
    blueStart = 0;
    winningPlatform = 100;
  }

  // Add platforms that initiate winds

  for (let i = 0; i < Math.floor(winningPlatform / 30); i++) {
    windStarts.push(Math.floor(Math.random() * 10 + 10 * (1 + i * 3)));
  }
  jumpHeight = platformInterval + 20;
  jumpSpeed = 3 * gameSpeed;
  howToDiv.style.display = "none";
  highscoreTitle.style.display = "none";
  endMenuBtn.style.display = "none";
  replayBtn.style.display = "none";
  loadPlatforms();
  gameLoop();
};

let submitScore = (difficulty, times) => {
  let newScore = { name: `${inputName.value}`, time: winTime };
  times.push(newScore);
  localStorage.setItem(difficulty, JSON.stringify(times));
  times.sort((a, b) => a.time - b.time);
  for (let i = 0; i < times.length; i++) {
    if (i < 5) {
      let listItem = document.createElement("li");
      listItem.innerText = `${times[i].name}: ${formatTime(times[i].time)}`;
      highscores.appendChild(listItem);
    }
  }
  highscoreTitle.style.display = "block";
  highscoreTitle.innerHTML = `Highscores (${mode})`;
  endMenuBtn.style.display = "inline";
  replayBtn.style.display = "inline";
  submitScoreBtn.style.display = "none";
  inputName.style.display = "none";
};

let restart = () => {
  highscores.innerHTML = "";
  inputName.style.display = "inline";
  restartDiv.style.display = "none";
  winDiv.style.display = "none";
  submitScoreBtn.style.display = "inline";
  start();
};

let backToMenu = () => {
  loadMainMenu();
  deathCount = 0;
  menu.style.display = "flex";
  highscores.innerHTML = "";
  inputName.style.display = "inline";
  restartDiv.style.display = "none";
  winDiv.style.display = "none";
  submitScoreBtn.style.display = "inline";
};

let loadPage = () => {
  howToInfo.innerHTML = pagesArray[pageIndex];
  howToDiv.querySelector("h2").innerText = pageTitles[pageIndex];
};

let nextPage = () => {
  if (pageIndex < pagesArray.length - 1) {
    pageIndex++;
  }
  loadPage();
  if (pageIndex === pagesArray.length - 1) {
    nextPageBtn.style.visibility = "hidden";
    howToDiv.querySelector(".start").style.display = "inline";
    difficulty.value = difficultyFromPages.value;
    document
      .querySelector("#difficultyFromPages")
      .addEventListener("change", () => {
        difficulty.value = difficultyFromPages.value;
      });
  }
  prevPageBtn.innerText = "Prev";
};

let prevPage = () => {
  if (pageIndex > 0) {
    pageIndex--;
    howToDiv.querySelector(".start").style.display = "none";
    nextPageBtn.style.visibility = "visible";
  }
  if (pageIndex === 0) {
    prevPageBtn.innerText = "Back";
  }
  nextPageBtn.innerText = "Next";
  loadPage();
};

window.addEventListener("load", () => {
  loadMainMenu();

  howToBtn.addEventListener("click", () => {
    console.log("howto!");
    pageIndex = 0;
    loadPage();
    howToDiv.querySelector(".start").style.display = "none";
    nextPageBtn.style.visibility = "visible";
    nextPageBtn.innerText = "Next";
    prevPageBtn.innerText = "Back";
    howToDiv.style.display = "flex";
    menu.style.display = "none";
    centerDiv(howToDiv);
  });
  nextPageBtn.addEventListener("click", () => {
    if (pageIndex === pagesArray.length - 1) {
      howToDiv.style.display = "none";
      start();
    } else {
      nextPage();
    }
  });
  prevPageBtn.addEventListener("click", () => {
    if (pageIndex === 0) {
      howToDiv.style.display = "none";
      loadMainMenu();
      menu.style.display = "flex";
    } else {
      prevPage();
    }
  });
  startBtn.forEach((b) => {
    b.addEventListener("click", () => {
      start();
      if (audioOn) {
        bgAudio.play();
        muteBtn.style.backgroundImage = 'url("./images/audioOn.png")';
      }
    });
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
  submitScoreBtn.addEventListener("click", () => {
    if (mode === "Peaceful") {
      submitScore(HIGH_SCORES_PEACEFUL, winTimes);
    } else if (mode === "Normal") {
      submitScore(HIGH_SCORES_NORMAL, winTimes2);
    } else {
      submitScore(HIGH_SCORES_IMPOSSIBLE, winTimes3);
    }
  });
  muteBtn.addEventListener("click", () => {
    muteBtn.blur();
    if (audioOn) {
      audioOn = false;
      bgAudio.pause();
      muteBtn.style.backgroundImage = 'url("./images/audioOff.png")';
    } else {
      audioOn = true;
      bgAudio.play();
      muteBtn.style.backgroundImage = 'url("./images/audioOn.png")';
    }
  });
});
