/*
orders of business:
1. get generic animated p5.js sketch to function as the background
2. add some html element(s) on top of background, make sure everything's all good in the hood
3. add other elements/plan further
*/

//TODOs
//maybe figure out how to prevent/work around screen clear on resize?

var canvas; // canvas

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas.parent("container");
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  background(200);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}