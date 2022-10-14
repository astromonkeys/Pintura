/*
    This file handles all music playback stuff, auth.js handles authorization/token getting workload
*/

window.onbeforeunload = () => { closePlayer(); }

var spotify;

function configurePlayer() {
    // Ready
    musician.addListener('ready', ({ device_id }) => {
        console.log('DEBUG: Spotify player ready with Device ID', device_id);
    });

    // Not Ready
    musician.addListener('not_ready', ({ device_id }) => {
        console.log('DEBUG: Device ID has gone offline', device_id);
    });

    musician.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    musician.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    musician.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('play').onclick = function () {
        musician.togglePlay();
        playing = !playing;
        // TODO change button icon/filling/color
    };

    // TODO set up web api wrapper and add placeholder album artwork
    spotify = new SpotifyWebApi();
    spotify.setAccessToken(localStorage.getItem("access token"));
    console.log(spotify);

    musician.connect();

}

function closePlayer() {
    musician.disconnect();
}

/* some ui stuff */

img_paths = {
    RW: "assets/icons/rw.svg",
    RW_FILL: "assets/icons/rw-fill.svg",
    FF: "assets/icons/ff.svg",
    FF_FILL: "assets/icons/ff-fill.svg",
    PLAY: "assets/icons/play.svg",
    PLAY_FILL: "assets/icons/play-fill.svg"
}

/* might not be the best way to do this, but oh well */
function changeButtonImg(event) {
    let currImgSrc = event.target.childNodes[0].src.split('Pintura/')[1];

    if (event.type == "mouseenter") {
        switch (currImgSrc) {
            case img_paths.RW:
                currImgSrc = img_paths.RW_FILL;
                break;
            case img_paths.PLAY:
                currImgSrc = img_paths.PLAY_FILL;
                break;
            case img_paths.FF:
                currImgSrc = img_paths.FF_FILL;
                break;
            default:
                console.log("default");
            // do nothing
        }
    } else if (event.type == "mouseleave") {
        switch (currImgSrc) {
            case img_paths.RW_FILL:
                currImgSrc = img_paths.RW;
                break;
            case img_paths.PLAY_FILL:
                currImgSrc = img_paths.PLAY;
                break;
            case img_paths.FF_FILL:
                currImgSrc = img_paths.FF;
                break;
            default:
            // do nothing
        }
    }
    // TODO handle icon change on button click? -> later
    event.target.childNodes[0].src = currImgSrc;
}



