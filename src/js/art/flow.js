/*
      a barebones animated example for testing
*/

var canvas; //canvas, this global is ok

var zoom = 0.01; // how zoomed in are we, lower is more zoomed in
var animSpeed = 0.005; // speed of our "slice's" movement, higher is faster (0.005 is pretty smooth)
var zoff = 0; // controls varying the 2d plane over time, taking "slices" of 3d space
var scl = 25; // how big is one box/vector in terms of pixels
var cols, rows;
var noiseScl = .01;
var fr;


function setup() {
  createCanvas(800, 800);
  background(255);
  cols = 60;
  rows = 60;
  fr = createP('');
  //noLoop();
}

/* good start! this should be made a lot faster... should run at least 30 fps in the browser */
function draw() {
  background(255);
  var xoff = 0;
  for (let x = 0; x < cols; x++) {
    var yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xpos = x * 10;
      let ypos = y * 10;
      let dp = domainWarp(xoff, yoff, zoff);
      fill(0);
      ellipse(xpos + dp[0], ypos + dp[1], 3, 3);
      yoff += zoom;
    }
    xoff += zoom;
  }
  zoff += animSpeed;

  fr.html(floor(frameRate()));
}


// var inc = 1;
// var scl = 200;
// var cols, rows;

// var zoff = 0;

// var fr;

// var particles = [];

// var flowfield;

// function windowResized() {
//       resizeCanvas(windowWidth, windowHeight);
//       // this code is very important
//       cols = floor(windowWidth / scl);
//       rows = floor(windowHeight / scl);

//       flowfield = new Array(cols * rows);
// }

// function setup() {
//       canvas = createCanvas(windowWidth, windowHeight);
//       canvas.position(0, 0);
//       canvas.style('z-index', '-1');

//       frameRate(10);

//       cols = floor(windowWidth / scl);
//       rows = floor(windowHeight / scl);
//       fr = createP('');

//       flowfield = new Array(cols * rows);

//       //background(51);
// }

// function draw() {
//       background(51);
//       var yoff = 0;
//       for (var y = 0; y < rows; y++) {
//             var xoff = 0;
//             for (var x = 0; x < cols; x++) {
//                   var index = x + y * cols;
//                   var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
//                   var v = p5.Vector.fromAngle(angle);
//                   v.setMag(1);
//                   flowfield[index] = v;
//                   xoff += inc;
//                   stroke(255, 50);
//                   push();
//                   translate(x * scl, y * scl);
//                   rotate(v.heading());
//                   strokeWeight(1);
//                   line(0, 0, scl, 0);
//                   pop();
//             }
//             yoff += inc;

//             zoff += 0.0003;
//       }
//       for (var i = 0; i < particles.length; i++) {
//             particles[i].follow(flowfield);
//             particles[i].update();
//             particles[i].edges();
//             particles[i].show();
//       }
// }
