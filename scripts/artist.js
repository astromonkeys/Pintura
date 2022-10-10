/*
orders of business:
1. get generic animated p5.js sketch to function as the background -> done!
2. add some html element(s) on top of background, make sure everything's all good in the hood
  - spotify web player, google search, weather
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
  
}