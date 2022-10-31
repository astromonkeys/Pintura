
var fr;
var slider;

let numPoints = 5; // play with this
let baseRadius = 200;
let radiusRandomness = 1; // amount of random variation in the blob radius, higher = more variation

let cpOffsetAngle;
let drawCp;

let rNoise = 0;
let aNoise = 1;

function setup() {
    createCanvas(800, 800);
    fr = createP('');
    //noiseSeed(99);
    // slider = createSlider(0, 5, 0);
    //noLoop();
}

function draw() {
    background(200);
    translate(width / 2, height / 2);
    stroke(0);
    noFill();

    let points = getBlob();
    //print(points);
    drawBlob(points);

    fr.html(floor(frameRate()));
}

// now, how to move along flow field?

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

function getBlob() {
    let blobPoints = [];
    controlPointAngle = map(noise(aNoise), 0, 1, 0, PI);
    controlPointDist = map(noise(rNoise), 0, 1, 50, 150); // this needs to be generated with noise, I think

    for (let p = 0; p < numPoints; p++) {
        let a = (p * TWO_PI) / numPoints; // angle of this point
        let r =
            baseRadius + map(noise(rNoise + p), 0, 1, -radiusRandomness * baseRadius, radiusRandomness * baseRadius);
        let bp = { x: cos(a) * r, y: sin(a) * r, angle: a, cp: [] };
        blobPoints.push(bp);
        rNoise += 0.0001;
    }

    for (let b = 0; b < blobPoints.length; b++) {
        let thisp = blobPoints[b]; // current node
        let randomangle = map(noise(aNoise + b), 0, 1, -controlPointAngle, controlPointAngle); // random angle for control points

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

        aNoise += 0.0005;
    }

    return blobPoints;
}

// var noiseMax = 0.5;
// var zoff = 0; // increment this based on song tempo
// var numPoints = 5;

//beginShape();
    // let noiseMax = slider.value();
    // // TODO use 2 bezier curves and join them to make a smooth shape
    // for (let a = 0; a < TWO_PI; a += 0.01) {
    //     let xoff = map(cos(a), -1, 1, 0, noiseMax);
    //     let yoff = map(sin(a), -1, 1, 0, noiseMax);
    //     let r = map(noise(xoff, yoff, zoff), 0, 1, 100, 200);
    //     let x = r * cos(a);
    //     let y = r * sin(a);
    //     vertex(x, y);
    // }
    // endShape(CLOSE);
    // zoff += 0.01; 