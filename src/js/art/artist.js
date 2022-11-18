
//TODOs
//maybe figure out how to prevent/work around screen clear on resize?


/* This file handles all of the background art generation/display */

// palette definitions, 10 colors each, 5 palettes atm -> will need to adjust if I add more

const PALETTES = { relaxed: ["#476a6f", "#519e8a", "#7eb09b", "#aa6373", "#ecbeb4", "#8fc0a9", "#b3b3f1", "#f5c396", "#982649", "#3a2e39"], tangy: ["#15f449", "#ff221f", "#02393b", "#07eaed", "#ffda1f", "#007bff", "#daff34", "#1d465d", "#e43f6e", "#bd4ca5"], fall: ["#bfd3eb", "#d38c1f", "#b83713", "#b0641b", "#6a3b0a", "#5a9d43", "#e1c6b3", "#b0641b", "#661e02", "#12543b"], neon: ["#ff7578", "#14ffc4", "#0fd3ff", "#0084db", "#7ef500", "#006b14", "#51ff2e", "#ff2b4f", "#5e008a", "#ffeb0f"], psychedelic: ["#af0040", "#0065bd", "#f8ff1e", "#ff68eb", "#15a9ff", "#00c66a", "#f4f400", "#ff5735", "#0074ef", "#005481"], paletteLen: 10, numPalettes: 5 };

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    blobs = [];
    generateBlobs();
    //console.log(width * height, numBlobs);
}

var canvas; // canvas

var currPalette; // colors
var currSongTempo;
var currSongDurationMs;

var fr;

let cpOffsetAngle;
let drawCp;

// TODO vary these based on song tempo
let rNoise = 0;
let rInc = 0.000004;
let aNoise = 1;
let aInc = 0.000004;

let blobs = [];
let numBlobs;

var color1;
var color2;

var bgcolor1;
var bgcolor2;

let bgNoise = 0;
let bgInc = 0.005;

let colorsExist = false;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    // generate placeholder colors for the first song. there's probably a fix for this, but idc
    initColors();
    generateBlobs();
}


function draw() {
    background(lerpColor(bgcolor1, bgcolor2, noise(bgNoise)));
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

function initColors() {

    let paletteIndex = Math.floor(Math.random() * PALETTES.numPalettes);
    switch (paletteIndex) {
        case 0:
            currPalette = PALETTES.fall;
            break;
        case 1:
            currPalette = PALETTES.neon;
            break;
        case 2:
            currPalette = PALETTES.psychedelic;
            break;
        case 3:
            currPalette = PALETTES.tangy;
            break;
        case 4:
            currPalette = PALETTES.relaxed;
            break;
        default:
            currPalette = PALETTES.psychedelic;
            break;
    }

    let index1 = Math.floor(Math.random() * PALETTES.paletteLen);
    let index2 = Math.floor(Math.random() * PALETTES.paletteLen);
    // can't have two of the same color
    while (index2 == index1) {
        index2 = Math.floor(Math.random() * PALETTES.paletteLen);
    }
    // use these colors when generating blobs
    color1 = color(currPalette[index1]);
    color2 = color(currPalette[index2]);

    // do background colors, super clunky but works I suppose
    for (let i = 0; i < PALETTES.paletteLen; i++) {
        if (i != index1 && i != index2) bgcolor1 = color(currPalette[i]);
    }
    for (let i = PALETTES.paletteLen - 1; i >= 0; i--) {
        if (i != index1 && i != index2) bgcolor2 = color(currPalette[i]);
    }

    console.debug("Selected palette: ", currPalette);

}


function updateSketchColors() {
    // get spotify song data
    if (!currentTrack.id) { console.log("no current track"); return; }

    spotify.getAudioFeaturesForTrack(currentTrack.id, (errorObject, data) => {
        // extract relevant features
        let acousticness = data.acousticness; // more muted colors
        let upbeatness = (data.danceability + data.energy) / 2;
        let valence = data.valence;
        currSongTempo = data.tempo;
        currSongDurationMs = data.duration_ms;

        // generate two colors from data
        // idea: lerp between two colors in the selected pallete
        // TODO in the future, make this more advanced, maybe between more colors
        // or pick two colors from palette to lerp between when generating each blob -> next time

        if (acousticness > 0.5) {
            if (Math.floor(Math.random() * 2) == 0) currPalette = PALETTES.fall;
            else currPalette = PALETTES.relaxed;
        } else if (upbeatness > 0.5) {
            if (valence > 0.3) currPalette = PALETTES.tangy;
            else currPalette = PALETTES.neon;
        } else currPalette = PALETTES.psychedelic;

        let index1 = Math.floor(Math.random() * PALETTES.paletteLen);
        let index2 = Math.floor(Math.random() * PALETTES.paletteLen);
        // can't have two of the same color
        while (index2 == index1) index2 = Math.floor(Math.random() * PALETTES.paletteLen);

        // use these colors when generating blobs
        color1 = color(currPalette[index1]);
        color2 = color(currPalette[index2]);

        // do background colors, super clunky but works I suppose
        for (let i = 0; i < PALETTES.paletteLen; i++) {
            if (i != index1 && i != index2) bgcolor1 = color(currPalette[i]);
        }
        for (let i = PALETTES.paletteLen - 1; i >= 0; i--) {
            if (i != index1 && i != index2) bgcolor2 = color(currPalette[i]);
        }

        console.debug("Selected palette: ", currPalette);

        // update blobs
        generateBlobs();
    });

}

function generateBlobs() {
    // make numBlobs proportional to window area
    numBlobs = floor(width * height / 40000);

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