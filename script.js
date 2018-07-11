var canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth - 20;

var c = canvas.getContext("2d");

// VARIABLES
var circles;
var palette = [
  "#588C7E",
  "#D96459"
];

var simplePalette = [
  "#000000",
  "#ff0000"
];

var mouseX;
var mouseY;
var onFollow = false;
var onSpeed = false;
var currentGen = 2;
var score = 0;

var bgmusic = document.createElement("AUDIO");
bgmusic.setAttribute("src","music/wakingstars.mp3");
bgmusic.play();
bgmusic.loop = true;
bgmusic.volume = 0.3;

var expand = document.createElement("AUDIO");
expand.setAttribute("src","music/wind-up-2.mp3");

document.addEventListener("mousemove", function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 16) {
    onSpeed = true;
  }
});

document.addEventListener("keyup", function(e) {
  if (e.keyCode == 16) {
    onSpeed = false;
  }
});

document.addEventListener("mouseup", function(e) {
  onFollow = !onFollow;
  expand.play();
});

function Circle (dx, dy, centerx, centery, radius, radians, distFromCenter, radianInc, color, isActive, generation) {
  this.dx = dx;
  this.dy = dy;
  this.centerx = centerx;
  this.centery = centery;
  this.x = centerx;
  this.y = centery;
  this.radius = radius;
  this.radians = radians;
  this.distFromCenter = distFromCenter;
  this.radianInc = radianInc;
  this.color = color;
  this.lastMouse = {x: centerx, y: centery};
  this.growthStage = 0;
  this.speedStage = 0;
  this.isActive = isActive;
  this.generation = generation;

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }

  this.loneUpdate = function() {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
    if (Math.abs(this.x - mouseX) < 10 && Math.abs(this.y - mouseY) < 10) {
      this.isActive = true;
      score++;
    }
  }

  this.update = function() {
    this.draw();
    this.radians += this.radianInc;
    this.x = this.lastMouse.x + (this.distFromCenter * Math.cos(this.radians));
    this.y = this.lastMouse.y + (this.distFromCenter * Math.sin(this.radians));

    if (onFollow) {
      this.lastMouse.x += (mouseX - this.lastMouse.x) * 0.05;
      this.lastMouse.y += (mouseY - this.lastMouse.y) * 0.05;
      if (this.growthStage < 50) {
        this.distFromCenter += 0.4;
        this.growthStage++;
      }
      if (this.growthStage == 10) {
        this.radianInc += 0.01;
      }

      this.color = palette[this.generation - 1];

      if (onSpeed) {
        if (this.speedStage < 30) {
            this.radianInc += 0.0015;
            this.speedStage++;
        }
      } else {
        if (this.speedStage > 0) {
            this.radianInc -= 0.0015;
            this.speedStage--;
            if (this.speedStage == 10) {
              colorBlend();
            }
        }
      }

    } else {
      this.lastMouse.x += ((canvas.width / 2) - this.lastMouse.x) * 0.05;
      this.lastMouse.y += ((canvas.height / 2) - this.lastMouse.y) * 0.05;
      if (this.growthStage > 0) {
        this.distFromCenter -= 0.4;
        this.growthStage--;
      }
      if (this.growthStage == 40) {
        expand.play();
        this.radianInc -= 0.01;
      }

      this.color = simplePalette[this.generation - 1];

    }

  }

}

function init() {
  circles = [];

  // GENERATE CIRCLES
  for (var i = 0; i < 20; i++) {
    circles.push(new Circle(0, 0, canvas.width / 2, canvas.height / 2, (Math.random() * 7) + 2, Math.random() * (Math.PI * 2), 55 + (Math.random() * 40), Math.random() * 0.03 + 0.01, "#000000", true, 1));
  }

}

var toBlend;

function colorBlend() {
  toBlend = [];
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].isActive) {
      toBlend.push(circles[i].color);
    }
  }
}

function spawnCircle() {
  circles.push(new Circle((Math.random() * 2) - 1, (Math.random() * 2) - 1, Math.random() * canvas.width, Math.random() * canvas.height, (Math.random() * 7) + 2, Math.random() * (Math.PI * 2), 55 + (Math.random() * 50), Math.random() * 0.03 + 0.01, simplePalette[Math.ceil(Math.random() * (currentGen - 1))], false, currentGen));
}


var spawnChance;

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  spawnChance = Math.floor(Math.random() * 200);
  if (spawnChance == 42) {
    console.log("Spawn");
    spawnCircle();
  }

  // UPDATE CIRCLES
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].isActive) {
      circles[i].update();
    } else {
      circles[i].loneUpdate();
    }
  }

  // SHOW SCORE
  if (!onFollow) {
    c.font = "30px PT Sans Narrow";
    c.fillStyle = "#000000";
    c.fillText(score.toString(), canvas.width / 2, canvas.height / 2);
  }

  // console.log(circles[0].radianInc);

}

init();
animate();
