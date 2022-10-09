/*
orders of business:
1. get generic animated p5.js sketch to function as the background
2. add some html element(s) on top of background, make sure everything's all good in the hood
3. add other elements/plan further
*/

var cnv;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	cnv.parent("container");
    cnv.position(0,0);
	background(0);
}

function draw() {
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
  }