/*
    This file handles all music playback stuff, auth.js handles authorization/token getting workload
*/

// not sure if either of these work
window.onbeforeunload = () => { disconnectDevices(); }

const POLL_SONG_CHANGE = 500; // ms between poll for song change

var spotify;
var userPlaylists = [];
var currentPlaylist = ""; // [name, uri, image url]
var pinturaDevice;


function configurePlayer() {
    // Ready
    
    // set up web api wrapper
    spotify = new SpotifyWebApi();
    spotify.setAccessToken(localStorage.getItem("access_token"));

    // retrieve current playlist/song/artist name on startup
    setPlaybackState();
    // gather playlists on startup
    getMyPlaylists();
    // sets up ui
    makeButtonsWork();

    musician.addListener('ready', ({ device_id }) => {
        console.debug('Spotify player ready with Device ID', device_id);
        pinturaDevice = device_id;
        // probably a better way to do this, but no listener exists afaik
        setInterval(setPlaybackState, POLL_SONG_CHANGE);
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


}

/* don't need to do anything with the data, just for debugging purposes */
function logApiResponse(errorObject, data) {
    if (errorObject != null) console.error(errorObject.message);
    else if(data) console.debug(data);
}

function playPlaylist(uri) {
    // choooses the active device by default
    spotify.play({ device_id: pinturaDevice, context_uri: uri }, (errorObject, data) => {
        logApiResponse(errorObject, data);
        setPlaybackState();
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

    spotify.getUserPlaylists(secrets.PROFILE, { limit: 10 }, (errorObject, data) => {

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

function disconnectDevices() {
    musician.disconnect();

    spotify.getMyDevices((errorObject, data) => {
        for (device of data.devices) {
            if (device.is_active == false && device.name == "Pintura") {
                // deletes the device by attempting to link to it
                spotify.transferMyPlayback(device.id, {}, (errorObject, data) => {});
            }
        }
    });
}
