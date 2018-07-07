var canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var c = canvas.getContext("2d");

// VARIABLES
var circles;
var palette = [
  "#588C7E",
  "#D96459"
];
var mouseX;
var mouseY;
var onFollow = false;

document.addEventListener("mousemove", function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 32) {
    onFollow = !onFollow;
  }
})

function Circle (centerx, centery, radius, radians, distFromCenter, radianInc, color) {
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

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }

  this.update = function() {
    this.draw();
    this.radians += radianInc;
    this.x = this.lastMouse.x + (this.distFromCenter * Math.cos(this.radians));
    this.y = this.lastMouse.y + (this.distFromCenter * Math.sin(this.radians));

    if (onFollow) {
      this.lastMouse.x += (mouseX - this.lastMouse.x) * 0.05;
      this.lastMouse.y += (mouseY - this.lastMouse.y) * 0.05;
      if (this.growthStage < 50) {
        this.distFromCenter += 1;
        this.growthStage++;
      }

    } else {
      this.lastMouse.x += ((canvas.width / 2) - this.lastMouse.x) * 0.05;
      this.lastMouse.y += ((canvas.height / 2) - this.lastMouse.y) * 0.05;
      if (this.growthStage > 0) {
        this.distFromCenter -= 1;
        this.growthStage--;
      }
    }

  }
}

function init() {
  circles = [];

  // GENERATE CIRCLES
  for (var i = 0; i < 50; i++) {
    circles.push(new Circle(canvas.width / 2, canvas.height / 2, (Math.random() * 7) + 3, Math.random() * (Math.PI * 2), 75 + (Math.random() * 50), Math.random() * 0.05 + 0.01, "#000000"));
  }

}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // UPDATE CIRCLES
  for (var i = 0; i < circles.length; i++) {
    circles[i].update();
  }

}

init();
animate();