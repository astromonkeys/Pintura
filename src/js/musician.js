/*
    This file handles all music playback stuff, auth.js handles authorization/token getting workload
*/

window.onbeforeunload = () => { closePlayer(); }

var spotify;
var userPlaylists = [];
var currentPlaylist = "";

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

    document.getElementById('playpause').onclick = function () {
        musician.togglePlay();
        playing = !playing;
        // TODO change button icon/filling/color
    };

    musician.connect();

    // set up web api wrapper
    spotify = new SpotifyWebApi();
    spotify.setAccessToken(localStorage.getItem("access_token"));

    // add placeholder album artwork using the api

    spotify.searchAlbums("dark side of the moon", {
        type: "album",
        limit: 2
    }, function (errorObject, data) {
        let art = data.albums.items[0].images[1].url;
        // TODO in reality, resize image to card size
        document.getElementById("album_art").src = art;
    });

    // TODO allow searching, selecting, and playing of user's playlists - the only music functionality I'm going to make for now
    //  - make play/pause, rewind and skip buttons do their jobs

    // gather playlists on startup
    getMyPlaylists();

    // TODO next: play selected playlist through the web player

}

function selectPlaylist(event) {
    let playlist;
    for (element of userPlaylists) { // this is fine for so few items
        if (element[0] == event.target.innerText)
            playlist = element;
    }
    // let playlist = userPlaylists.find(element => element[0] == event.target.innerText);
    // console.log(playlist);
    //let id = playlist[1];
    document.getElementById("nowPlaying").innerHTML = "Now playing: " + playlist[0];
}

function getMyPlaylists() {
    let dropdown = document.getElementById("playlistSelect");

    spotify.getUserPlaylists(secrets.PROFILE, { limit: 5 }, function (errorObject, data) {

        for (playlist of data.items) {
            userPlaylists.push([playlist.name, playlist.id, playlist.images[0].url]);
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.setAttribute('class', 'dropdown-item');
            a.setAttribute('href', '#');
            let img = document.createElement('img');
            img.setAttribute('src', playlist.images[0].url);
            img.style.paddingRight = '1rem';
            img.style.maxBlockSize = '30px';
            a.appendChild(img);
            a.appendChild(document.createTextNode(playlist.name));
            li.appendChild(a);
            li.setAttribute('onclick', "selectPlaylist(event)");
            dropdown.appendChild(li);
        }
        console.log(userPlaylists);
    });

}

function closePlayer() {
    musician.disconnect();
}

/* some ui stuff */

img_paths = {
    RW: "/icons/rw.svg",
    RW_FILL: "/icons/rw-fill.svg",
    FF: "/icons/ff.svg",
    FF_FILL: "/icons/ff-fill.svg",
    PLAY: "/icons/play.svg",
    PLAY_FILL: "/icons/play-fill.svg"
}

/* might not be the best way to do this, but oh well */
function changeButtonImg(event) {
    /* THIS WILL NEED TO BE CHANGED AFTER DEPLOYMENT */
    let currImgSrc = event.target.childNodes[0].src.split('5500')[1];

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



