/*
    This file handles all music playback stuff, auth.js handles authorization/token getting workload
*/

window.onbeforeunload = () => { closePlayer(); }

function configurePlayer() {
    // Ready
    musician.addListener('ready', ({ device_id }) => {
        console.log('Spotify player ready with Device ID', device_id);
    });

    // Not Ready
    musician.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
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

    document.getElementById('togglePlay').onclick = function () {
        musician.togglePlay();
        playing = !playing;
    };

    musician.connect();
}

function closePlayer() {
    musician.disconnect();
}

