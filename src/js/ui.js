/* some ui stuff */

const MS_SKIP_SEEK = 5000; // if you're more than this amount of time through the song, the rewind button will function as a seek to beginning instead of skip to prev song

var playing;
var currentTrack = { uri: '' };
var shuffleState = 0; // 0 = off/white image, 1 = on/dark image
var repeatState = 0; // 0 = off/white image, 1 = context mode, 2 = track mode
var progressPct;

img_paths = {
    RW: "/icons/rw.svg",
    RW_FILL: "/icons/rw-fill.svg",
    FF: "/icons/ff.svg",
    FF_FILL: "/icons/ff-fill.svg",
    PLAY: "/icons/play.svg",
    PLAY_FILL: "/icons/play-fill.svg",
    PAUSE: "/icons/pause.svg",
    PAUSE_FILL: "/icons/pause-fill.svg",
    SHUFFLE: "/icons/shuffle.svg",
    REPEAT: "/icons/repeat.svg",
    REPEAT_TRACK: "/icons/repeat-1.svg",
}

function updateButtonStates(data) {
    /* update button icons based on play/paused, shuffling, etc. */
    //console.log(data);
    if (data.is_playing) {
        document.getElementById("playpausebtn").childNodes[0].src = img_paths.PAUSE;
        playing = true;
    } else {
        document.getElementById("playpausebtn").childNodes[0].src = img_paths.PLAY;
        playing = false;
    }

    if (data.shuffle_state) document.getElementById("shuffle_img").style.filter = "invert(0%)";
    else document.getElementById("shuffle_img").style.filter = "invert(100%)";

    switch (data.repeat_state) {
        case "off":
            document.getElementById("repeat").src = img_paths.REPEAT;
            document.getElementById("repeat").style.filter = "invert(100%)";
            break;
        case "context":
            document.getElementById("repeat").style.filter = "invert(0%)";
            break;
        case "track":
            document.getElementById("repeat").style.filter = "invert(0%)";
            document.getElementById("repeat").src = img_paths.REPEAT_TRACK;
            break;
        default:
            console.debug("Invalid repeat state");
            break;
    }
}

function updatePlaybackProgress() {
    spotify.getMyCurrentPlayingTrack({}, (errorObject, data) => {
        try {
            progressPct = data.progress_ms / data.item.duration_ms * 100;
            document.getElementById("playback-progress").style.width = progressPct + "%";
        } catch (error) {
            logApiResponse(error);
        }
    });
}

function setPlaybackState() {
    spotify.getMyCurrentPlaybackState({}, (errorObject, data) => {
        if (data != null && data != "") {
            if (currentTrack.uri != data.item.uri) {
                // update track/artist/etc info

                // update album art and p5 sketch
                document.getElementById("album_art").src = data.item.album.images[0].url;
                updateSketchColors();

                currentTrack = data.item;
                document.getElementById("songTitle").innerHTML = currentTrack.name;

                let artistStr = "";
                for (let i = 0; i < data.item.artists.length; i++) {
                    artistStr = artistStr.concat(data.item.artists[i].name, ", ");
                }
                artistStr = artistStr.substring(0, artistStr.length - 2);
                document.getElementById("artistName").innerHTML = artistStr;

                // update the "now playing from" field
                if (data.context != null) {
                    let nowPlaying = "";
                    let id = data.context.uri.split(":")[2];
                    switch (data.context.type) {
                        // in each case, get the name
                        case "playlist":
                            spotify.getPlaylist(id, {}, function (errorObject, data) {
                                document.getElementById("nowPlaying").innerHTML = data.name;
                            });
                            break;
                        case "artist":
                            spotify.getArtist(id, {}, function (errorObject, data) {
                                document.getElementById("nowPlaying").innerHTML = data.name;
                            });
                            break;
                        case "album":
                            spotify.getAlbum(id, {}, function (errorObject, data) {
                                document.getElementById("nowPlaying").innerHTML = data.name;
                            });
                            break;
                        case "collection":
                            document.getElementById("nowPlaying").innerHTML = "Liked songs";
                            break;
                        default:
                            document.getElementById("nowPlaying").innerHTML = "Your library";
                            break;
                    }
                }
            }

            // update buttons/playback progressbar
            updateButtonStates(data);
            updatePlaybackProgress();
        }
    });
}

/* could not for the life of me find a more concise way to do this, since I want to handle a bunch of listeners */
function makeButtonsWork() {
    let b = document.getElementById("playpausebtn");
    b.addEventListener("click", () => {
        // toggle play, and change image to pause

        // maybe call another function to help with this if there's more to do
        playing = !playing;
        if (!playing) {
            spotify.pause({}, null);
        } else { spotify.play({}, null) }

        let path = b.childNodes[0].src.split('5500')[1];
        if (playing) path = img_paths.PAUSE_FILL;
        else path = img_paths.PLAY_FILL;

        b.childNodes[0].src = path;
    });
    b.addEventListener("mouseenter", () => {
        // change image
        /* THIS WILL NEED TO BE CHANGED AFTER DEPLOYMENT */
        let path = b.childNodes[0].src.split('5500')[1];

        if (path == img_paths.PLAY) path = img_paths.PLAY_FILL;
        else path = img_paths.PAUSE_FILL;

        b.childNodes[0].src = path;
    });
    b.addEventListener("mouseleave", () => {
        // change image
        /* THIS WILL NEED TO BE CHANGED AFTER DEPLOYMENT */
        let path = b.childNodes[0].src.split('5500')[1];

        if (path == img_paths.PLAY_FILL) path = img_paths.PLAY;
        else path = img_paths.PAUSE;

        b.childNodes[0].src = path;
    });

    let r = document.getElementById("rewindbtn");
    r.addEventListener("click", () => {
        // skip song backward
        //console.debug("skipping song backward");
        handleSeekSkip();
        setPlaybackState();
    });
    r.addEventListener("mouseenter", () => {
        // change image
        r.childNodes[0].src = img_paths.RW_FILL;
    });
    r.addEventListener("mouseleave", () => {
        // change image
        r.childNodes[0].src = img_paths.RW;
    });

    let f = document.getElementById("forwardbtn");
    f.addEventListener("click", () => {
        // skip song forward
        //console.debug("skipping song foward");
        spotify.skipToNext({}, (errorObject, data) => {
            logApiResponse(errorObject, data);
        });
        setPlaybackState();
    });
    f.addEventListener("mouseenter", () => {
        // change image
        f.childNodes[0].src = img_paths.FF_FILL;
    });
    f.addEventListener("mouseleave", () => {
        // change image
        f.childNodes[0].src = img_paths.FF;
    });

    let sh = document.getElementById("shufflebtn");
    sh.addEventListener("click", setShuffleMode);

    let re = document.getElementById("repeatbtn");
    re.addEventListener("click", setRepeatMode);
}

function handleSeekSkip() {
    // if song is within 5 seconds, skip backwards. else, seek to beginning
    spotify.getMyCurrentPlayingTrack({}, (errorObject, data) => {
        let position = data.progress_ms;
        if (position <= MS_SKIP_SEEK) {
            spotify.skipToPrevious({}, (errorObject, data) => {
                logApiResponse(errorObject, data);
            });
        } else {
            spotify.seek(0, {}, (errorObject, data) => {
                logApiResponse(errorObject, data);
            });
        }
    });
}


/* let updateButtonStates handle UI change */
function setShuffleMode() {
    let doShuffle = false;
    if (shuffleState == 1) {
        // shuffle is now on
        doShuffle = true;
        shuffleState = 0;
    } else {
        // shuffle is now off
        shuffleState = 1;
    }

    spotify.setShuffle(doShuffle, {}, (errorObject, data) => {
        //logApiResponse(errorObject, data);
    });
}


function setRepeatMode() {
    let doRepeat = "";
    switch (repeatState) {
        case 0:
            // repeat is now off
            doRepeat = "off";
            repeatState = 1;
            break;
        case 1:
            // context repeat is now on
            doRepeat = "context";
            repeatState = 2;
            break;
        case 2:
            // track repeat is now on
            doRepeat = "track";
            repeatState = 0;
            break;
        default:
            console.debug("Invalid repeat state");
            break;
    }
    spotify.setRepeat(doRepeat, {}, (errorObject, data) => {
        //logApiResponse(errorObject, data);
    });
}
