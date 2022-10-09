/*
      a p5.js version of my flow field/convergence in processing
      using this as an example/debug sketch
*/

var canvas; //canvas

const inc = 0.01; // how zoomed in are we, lower is more zoomed in
const colorInc = 0.03;
const scale = 10; // how big is one box/vector in terms of pixels
const colorScale = 5;
const cols = Math.floor((windowWidth / scale));
const rows = Math.floor((windowHeight / scale));
const colorCols = Math.floor((windowWidth / colorScale));
const colorRows = Math.floor((windowHeight / colorScale));

let zoff = 0; // controls varying the 2d plane over time, taking "slices" of 3d space. higher = faster
let colorzoff = 0;

const numParticles = 100;
let particles = []; // particle list
const trailLen = 30;
const transparencyFactor = 10;

// color field varying based on more perlin noise so it's constantly changing
let colorField = [];
let colorOffset = 0; // vary the color pallette
let backgroundOffset = 0; // vary background
let offsetInc = 0.002; // play around with this
let offsetDirection = true; // true = add, false = subtract

const vectorField = []; // vector grid
const numVectors = cols * rows
const weakeningFactor = 10;

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function setup() {
      canvas = createCanvas(windowWidth, windowHeight);
      //canvas.parent("container");
      canvas.position(0, 0);
      canvas.style('z-index', '-1');
      frameRate(60); //later change to adapt to song tempo
      colorMode(HSB, 100);

      for (let i = 0; i < numParticles; i++) particles.push(new Particle(i));

}

function draw() {
      varyOffset();
      background(getBackgroundColor());
      generateBackground();
      flow();
}

// converts flow field value into an HSB color to draw particle with
function floatToHSV(val, offset, saturation, value) {
      return color(val + offset, saturation, value);
}

function getBackgroundColor() {
      let noiseVal = noise(colorzoff);
      return floatToHSV(noiseVal + backgroundOffset, 0, 1, 0.3);
}

function varyOffset() {
      if (colorOffset > 0.4 | colorOffset < -.35) offsetDirection = !offsetDirection;
      if (offsetDirection) { colorOffset += offsetInc; backgroundOffset -= offsetInc / 2; }
      else { colorOffset -= offsetInc; backgroundOffset += offsetInc / 2; }
}

function generateBackground() {
      let xoff = 0;
      for (let x = 0; x < colorRows; x++) {
            let yoff = 0;
            for (let y = 0; y < colorCols; y++) {
                  let index = x + (y * colorRows);
                  let noiseVal = noise(xoff, yoff, colorzoff);
                  colorField[index] = floatToHSV(noiseVal, colorOffset, 0.7, 1);
                  yoff += colorInc;
            }
            xoff += colorInc;
            colorzoff += 0.00005;
      }
}

function doParticles() {
      for (let i = 0; i < particles.length; i++) {
            particles[i].followField(vectorField);
            particles[i].update();
            particles[i].bounds();
            particles[i].show();
      }
}

function flow() {
      let yoff = 0;
      for (let y = 0; y < rows; y++) {
            let xoff = 0;
            for (let x = 0; x < cols; x++) {
                  let index = x + (y * cols);
                  let angle = noise(xoff, yoff, zoff) * 4 * PI;
                  let currVector = fromAngle(angle);
                  currVector.setMag(currVector.mag() / weakeningFactor);
                  vectorField[index] = currVector;
                  xoff += inc;
            }
            yoff += inc;
            zoff += 0.0001;
      }
      doParticles();
}

class Particle {
      constructor(index) {
            this.index = index;
            this.history = [];
            this.position = createVector(random(width), random(height));
            this.history.push(createVector(position.x, position.y));
            this.velocity = createVector(random(1), random(1));
            this.accel = createVector();
      }

      update() {
            this.velocity.add(accel);
            this.velocity.limit(maxSpeed);
            this.position.add(velocity);
            this.history.push(createVector(this.position.x, this.position.y));
            // check if history is at capacity
            if (this.history.length >= trailLen) {
                  this.history.shift();
            }
            this.accel = createVector();
      }

      // updates acceleration
      applyForce(force) {
            this.accel.add(force);
      }

      bounds() {
            if (this.position.x > width) this.position.x = 0;
            if (this.position.x < 0) this.position.x = width;
            if (this.position.y > height) this.position.y = 0;
            if (this.position.y < 0) this.position.y = height;
      }

      followField(field) {
            try {
                  let x = Math.floor(this.position.x / scale);
                  let y = Math.floor(this.position.y / scale);
                  let index = x + (y * cols);
                  let force = field[index];
                  this.applyForce(force);
            } catch (e) { // not sure why this happens? fix maybe but thing seem to work
                  console.log(e)
            }
      }

      // draws particle(as a point for now)
      show() {
            strokeWeight(4);
            for (let i = history.length - 1; i >= 0; i--) {
                  let transparency = 0 + transparencyFactor * i;
                  stroke(colorField[this.index / colorScale], transparency);
                  point(history[i].x, history[i].y);
            }
      }
}