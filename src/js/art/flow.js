/*
      a barebones animated example for testing
*/

/*
end goal: get a perlin noise color field based on a gradient -> lerpcolor and domain warp it
*/

var canvas; //canvas, this global is ok

var zoom = 0.01; // how zoomed in are we, lower is more zoomed in
var animSpeed = 0.005; // speed of our "slice's" movement, higher is faster (0.005 is pretty smooth), this is what we will use the song's tempo to vary
var zoff = 0; // controls varying the 2d plane over time, taking "slices" of 3d space
var scl = 25; // how big is one box/vector in terms of pixels
var cols, rows;
var noiseScl = .01;

var colorOff = 0;
var colorInc = 0.00001;
var colorScl = .01;

var one;
var two;

var numItems;

var fr;


function setup() {
  createCanvas(800, 800);
  colorMode(RGB);
  pixelDensity(1);
  one = color(0, 59, 54);
  two = color(167, 201, 87);
  background(255);
  noStroke();
  numItems = rows * cols;
  fr = createP('');
  noLoop();
}

/* good start! this should be made a lot faster... should run at least 30 fps in the browser */
function draw() {
  background(255);

  loadPixels();


  var xoff = 0;
  for (let x = 0; x < width; x++) {
    var yoff = 0;
    for (let y = 0; y < height; y++) {
      let pixelIndex = (x + y * width) * 4;


      // get fill color
      //let noiseVal = fractal(xoff, yoff, 1, 5); // replace 1 with zoff for animated
      let noiseVal = noise(xoff, yoff, zoff);
      let fillColor = lerpColor(one, two, noiseVal);
      pixels[pixelIndex + 0] = fillColor.levels[0]; // r
      pixels[pixelIndex + 1] = fillColor.levels[1]; // g
      pixels[pixelIndex + 2] = fillColor.levels[2]; // b
      pixels[pixelIndex + 3] = fillColor.levels[3]; // a (255)

      //fill(fillColor);
      //ellipse(xpos + dp[0]+200, ypos + dp[1]+200, 10, 10);
      yoff += zoom;
      colorOff += colorInc;
    }
    xoff += zoom;
  }
  zoff += animSpeed;

  updatePixels();
  fr.html(floor(frameRate()));
}

// old code
//let xpos = x * 10;
//let ypos = y * 10;
//let dp = domainWarp(xoff, yoff, zoff);
//let dp = [0,0];
//fill(fillColor);
//ellipse(xpos + dp[0]+200, ypos + dp[1]+200, 10, 10);
//yoff += zoom;
//colorOff += colorInc;

// starter code
// var xoff = 0;
//   for (let x = 0; x < cols; x++) {
//     var yoff = 0;
//     for (let y = 0; y < rows; y++) {
//       yoff += zoom;
//     }
//     xoff += zoom;
//   }
//   zoff += animSpeed;

// garbage (I think)

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
