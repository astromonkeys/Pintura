
/*
* helper functions for my sketches
*/

// params
var frequency = 1; // also kinda how zoomed in we are
var amplitude = 1; // adjustment/multiplier for noise values, 1 is normal
var roughness = 2; // affects frequency at higher octaves
var persistence = 0.5; // affects amplitude in higher octaves
var octaves = 3;

var warpStrength = 100;

/* z as a constant will leave the 'slice' still in 3 dimensions 
this function returns a value from -1 to 1 instead of 0 to 1 */
function perlin(x, y, z = 0) {
    // let one = noise(x, y, z);
    // let two = map(one, 0, 1, -1, 1);
    // console.log("from 0 to 1: ", one);
    // console.log("from -1 to 1: ", two);
    return map(noise(x, y, z), 0, 1, -1, 1);
}

// generates a fractal noise value at an x,y,z point
function fractal(x, y, z, octaves) {
    let noiseVal = 0;
    for (let i = 0; i < octaves; i++) {
        let n = noise(x * frequency, y * frequency, z);

        noiseVal += n * amplitude;
        frequency *= roughness;
        amplitude *= persistence;
    }
    return noiseVal;
}

function domainWarp(x, y, zoff) {
    // let offsetX = fractal(x + 0, y + 0, z, 5);
    // let offsetY = fractal(x + 5.2, y + 2.4, z, 5);

    // return fractal(x + warpStrength * offsetX, y + warpStrength * offsetY, 0, 5);

    // 1. get noise value at x,y
    // 2. create a vector between 0 and 2pi
    // 3. move this point in the direction of the vector by warpStrength
    let warp = noise(x, y, zoff);
    let angle = map(warp, 0, 1, 0, 2 * Math.PI);
    let dx = Math.cos(angle) * warpStrength;
    let dy = Math.sin(angle) * warpStrength;

    return [dx, dy];
}