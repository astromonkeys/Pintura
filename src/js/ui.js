/* some ui stuff */

var playing = false;

img_paths = {
    RW: "/icons/rw.svg",
    RW_FILL: "/icons/rw-fill.svg",
    FF: "/icons/ff.svg",
    FF_FILL: "/icons/ff-fill.svg",
    PLAY: "/icons/play.svg",
    PLAY_FILL: "/icons/play-fill.svg",
    PAUSE: "/icons/pause.svg",
    PAUSE_FILL: "/icons/pause-fill.svg"
}

/* could not for the life of me find a more concise way to do this, since I want to handle a bunch of listeners */
function makeButtonsWork() {
    let b = document.getElementById("playpausebtn");
    b.addEventListener("click", function () {
        // toggle play, and change image to pause

        // maybe call another function to help with this if there's more to do
        musician.togglePlay();
        playing = !playing;

        let path = b.childNodes[0].src.split('5500')[1];
        if (playing) path = img_paths.PAUSE_FILL;
        else path = img_paths.PLAY_FILL;

        b.childNodes[0].src = path;
    });
    b.addEventListener("mouseenter", function () {
        // change image
        /* THIS WILL NEED TO BE CHANGED AFTER DEPLOYMENT */
        let path = b.childNodes[0].src.split('5500')[1];

        if (path == img_paths.PLAY) path = img_paths.PLAY_FILL;
        else path = img_paths.PAUSE_FILL;

        b.childNodes[0].src = path;
    });
    b.addEventListener("mouseleave", function () {
        // change image
        /* THIS WILL NEED TO BE CHANGED AFTER DEPLOYMENT */
        let path = b.childNodes[0].src.split('5500')[1];

        if (path == img_paths.PLAY_FILL) path = img_paths.PLAY;
        else path = img_paths.PAUSE;

        b.childNodes[0].src = path;
    });

    let r = document.getElementById("rewindbtn");
    r.addEventListener("click", function () {
        // skip song backward
        console.debug("skipping song backward");
    });
    r.addEventListener("mouseenter", function () {
        // change image
        r.childNodes[0].src = img_paths.RW_FILL;
    });
    r.addEventListener("mouseleave", function () {
        // change image
        r.childNodes[0].src = img_paths.RW;
    });

    let f = document.getElementById("forwardbtn");
    f.addEventListener("click", function () {
        // skip song forward
        console.debug("skipping song foward");
    });
    f.addEventListener("mouseenter", function () {
        // change image
        f.childNodes[0].src = img_paths.FF_FILL;
    });
    f.addEventListener("mouseleave", function () {
        // change image
        f.childNodes[0].src = img_paths.FF;
    });
}