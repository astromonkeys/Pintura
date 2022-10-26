//TODOs
//maybe figure out how to prevent/work around screen clear on resize?


/* This file handles all of the background art generation/display */

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

}
