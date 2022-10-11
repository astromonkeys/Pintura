/*
      a barebones animated example for testing
*/

var canvas; //canvas, this global is ok

var inc = 1;
var scl = 200;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

function windowResized() { 
      resizeCanvas(windowWidth, windowHeight); 
      // this code is very important
      cols = floor(windowWidth / scl);
      rows = floor(windowHeight / scl);

      flowfield = new Array(cols * rows);
}

function setup() {
      canvas = createCanvas(windowWidth, windowHeight);
      canvas.position(0, 0);
      canvas.style('z-index', '-1');

      frameRate(10);

      cols = floor(windowWidth / scl);
      rows = floor(windowHeight / scl);
      fr = createP('');

      flowfield = new Array(cols * rows);

      //background(51);
}

function draw() {
      // background(51);
      // var yoff = 0;
      // for (var y = 0; y < rows; y++) {
      //       var xoff = 0;
      //       for (var x = 0; x < cols; x++) {
      //             var index = x + y * cols;
      //             var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      //             var v = p5.Vector.fromAngle(angle);
      //             v.setMag(1);
      //             flowfield[index] = v;
      //             xoff += inc;
      //             stroke(255, 50);
      //             push();
      //             translate(x * scl, y * scl);
      //             rotate(v.heading());
      //             strokeWeight(1);
      //             line(0, 0, scl, 0);
      //             pop();
      //       }
      //       yoff += inc;

      //       zoff += 0.0003;
      // }
      // for (var i = 0; i < particles.length; i++) {
      //       particles[i].follow(flowfield);
      //       particles[i].update();
      //       particles[i].edges();
      //       particles[i].show();
      // }
}
