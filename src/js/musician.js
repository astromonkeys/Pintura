/*
    This file handles all music playback stuff, auth.js handles authorization work
*/

let playing = false;

window.onSpotifyWebPlaybackSDKReady = () => {

    console.log("sdk ready");

    let authorized = sessionStorage.getItem("authReceived");

    if (authorized == 'false') {
        console.log("here"); 
        requestAuthorization();
    }

    const token = localStorage.getItem("access_token");
    const player = new Spotify.Player({
        name: 'a',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Spotify player ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function () {
        player.togglePlay();
        playing = !playing;
    };

    player.connect();
}


