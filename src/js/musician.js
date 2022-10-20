/*
    This file handles all music playback stuff, auth.js handles authorization/token getting workload
*/

// not sure if either of these work
window.onbeforeunload = () => { musician.disconnect(); }
window.onclose = () => { musician.disconnect(); }

var spotify;
var userPlaylists = [];
var currentPlaylist = ""; // [name, uri, image url]
var pinturaDevice;

function configurePlayer() {
    // Ready
    musician.addListener('ready', ({ device_id }) => {
        console.debug('Spotify player ready with Device ID', device_id);
        pinturaDevice = device_id;
    });

    // Not Ready
    musician.addListener('not_ready', ({ device_id }) => {
        console.debug('Device ID has gone offline', device_id);
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

    musician.connect();

    // set up web api wrapper
    spotify = new SpotifyWebApi();
    spotify.setAccessToken(localStorage.getItem("access_token"));

    // add placeholder album artwork using the api

    // TODO retrieve current playlist/song/artist name on startup

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
    // - update album artwork
    // - update song/artist names
    // - add song progress bar -> add scrubbing later

    // gather playlists on startup
    getMyPlaylists();
    // sets up ui
    makeButtonsWork();
}

/* don't need to do anything with the data, just for debugging purposes */
function logApiResponse(errorObject, data) {
    if (errorObject != null) console.error(errorObject);
    else console.debug(data);
}

function playPlaylist(uri) {
    /* leave shuffle on for now, TODO fix and add this feature later */
    //spotify.setShuffle(true, { device_id: pinturaDevice }, function (errorObject, data) {
    //    logApiResponse(errorObject, data);
    //});

    // choooses the active device by default
    spotify.play({ device_id: pinturaDevice, context_uri: uri }, function (errorObject, data) {
        logApiResponse(errorObject, data);
    });
}

function selectPlaylist(event) {
    let playlist;
    for (element of userPlaylists) { // this is fine for so few items
        if (element[0] == event.target.innerText)
            playlist = element;
    }
    document.getElementById("nowPlaying").innerHTML = playlist[0];
    playPlaylist(playlist[1]);
}

function getMyPlaylists() {
    let dropdown = document.getElementById("playlistSelect");

    spotify.getUserPlaylists(secrets.PROFILE, { limit: 10 }, function (errorObject, data) {

        for (playlist of data.items) {
            userPlaylists.push([playlist.name, playlist.uri, playlist.images[0].url]);
            // create new list element

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
    });

}
