
//TODOs
//maybe figure out how to prevent/work around screen clear on resize?


/* This file handles all of the background art generation/display */

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    blobs = [];
    generateBlobs();
    //console.log(width * height, numBlobs);
}

var canvas; // canvas

var fr;

let cpOffsetAngle;
let drawCp;

// vary these based on song tempo
let rNoise = 0;
let rInc = 0.00001;
let aNoise = 1;
let aInc = 0.00001;

let blobs = [];
let numBlobs;

let color1;
let color2;

let bgNoise = 0;
let bgInc = 0.01;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    color1 = color(248, 51, 60);
    color2 = color(252, 171, 16);
    generateBlobs()
}


function draw() {
    background(lerpColor(color1, color2, noise(bgNoise)));
    bgNoise += bgInc;
    //stroke(0);
    noStroke();

    // simulate the blobs as x,y points and move those points along the flow field, then use their coordinates to construct the blobs each draw cycle
    for (let i = 0; i < blobs.length; i++) {
        blobs[i].move();
        blobs[i].show();
    }
    //print(frameRate());
}

function generateBlobs() {
    // make numBlobs proportional to window area
    numBlobs = floor(width * height / 50000);

    for (let i = 0; i < numBlobs; i++) {
        blobs[i] = new Blob(i, color1, color2);
    }
}

// radiusRandomness = amount of random variation in the blob radius, higher = more variation
// seed is kind of like an id for the blob, just a unique number for generating noise
function blobAt(x, y, seed, numPoints, baseRadius, radiusRandomness, colorIn) {
    let points = getBlob(seed, numPoints, baseRadius, radiusRandomness);
    push();
    let fillColor = color(colorIn.levels[0], colorIn.levels[1], colorIn.levels[2], 240)
    fill(fillColor);
    translate(x, y);
    drawBlob(points);
    pop();
}

function drawBlob(points) {

    beginShape(); // start drawing the shape
    vertex(points[0].x, points[0].y); // first point is a plain vertex

    for (b = 1; b < points.length; b++) {
        // start from 1 (the second node in the ring)
        let bp = points[b];
        let pp = points[b - 1]; // previous node
        // bezier points go:
        // second control point from previous node
        // first control point from this node
        // x and y of this node
        bezierVertex(pp.cp[1].x, pp.cp[1].y, bp.cp[0].x, bp.cp[0].y, bp.x, bp.y);
    }
    // to finish, wrap around
    // so join the last point in the ring to the first point in the same way as above

    let lastp = points[points.length - 1];
    let firstp = points[0];

    bezierVertex(
        lastp.cp[1].x,
        lastp.cp[1].y,
        firstp.cp[0].x,
        firstp.cp[0].y,
        firstp.x,
        firstp.y
    );

    endShape(CLOSE);
}

function getBlob(seed, numPoints, baseRadius, radiusRandomness) {
    let blobPoints = [];
    controlPointAngle = map(noise(aNoise + seed), 0, 1, 0, TWO_PI);
    controlPointDist = map(noise(rNoise + seed), 0, 1, 50, 150);

    for (let p = 0; p < numPoints; p++) {
        let a = (p * TWO_PI) / numPoints; // angle of this point
        let r =
            baseRadius + map(noise(rNoise + p + seed), 0, 1, -radiusRandomness * baseRadius, radiusRandomness * baseRadius);
        let bp = { x: cos(a) * r, y: sin(a) * r, angle: a, cp: [] };
        blobPoints.push(bp);
        rNoise += rInc;
    }

    for (let b = 0; b < blobPoints.length; b++) {
        let thisp = blobPoints[b]; // current node
        let randomangle = map(noise(aNoise + b + seed), 0, 1, -controlPointAngle, controlPointAngle); // random angle for control points

        let cp1angle = thisp.angle - (HALF_PI + randomangle);
        let cp2angle = thisp.angle + (HALF_PI - randomangle);

        cp1 = {
            x: thisp.x + cos(cp1angle) * controlPointDist,
            y: thisp.y + sin(cp1angle) * controlPointDist,
        };
        cp2 = {
            x: thisp.x + cos(cp2angle) * controlPointDist,
            y: thisp.y + sin(cp2angle) * controlPointDist,
        };

        thisp.cp = [cp1, cp2]; // store control points in the current node in the blobPoints array

        aNoise += aInc;
    }

    return blobPoints;
}

/* Yeah I know javascript isn't object oriented, this is just easier. sue me */
class Blob {
    constructor(seed, color1, color2) {
        this.pos = createVector(random(width), random(height));
        // TODO vary this based on song's tempo?
        this.speed = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.seed = seed;
        this.numPoints = random(3, 6);
        this.baseRadius = random(150, 250);
        this.radiusRandomness = random(0.5, 1.5);
        // TODO more advanced color picking -> from palette with lerp
        this.color = lerpColor(color1, color2, random(0, 1));
    }

    move() {

        this.pos.add(this.speed);

        if (this.pos.x < 0) {
            this.speed.x = abs(this.speed.x);
        } else if (this.pos.x > width) {
            this.speed.x = -abs(this.speed.x);
        }

        if (this.pos.y < 0) {
            this.speed.y = abs(this.speed.y);
        } else if (this.pos.y > height) {
            this.speed.y = -abs(this.speed.y);
        }

    }

    show() {
        blobAt(this.pos.x, this.pos.y, this.seed, this.numPoints, this.baseRadius, this.radiusRandomness, this.color);
    }
}