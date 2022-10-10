
let playing = false;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQCLC-W3cFhVHx4_LcMh1b6HPJVirsLNWL5mYdu2byaURQhaJMHO-6jThUdJCi96_MFvtgK6Bqc25iOdk221LbdAsKrJRIRKIutqXovYrvf1BqPTkStSfVhWEMfeznYzcp5xUPGyZ5AFz-bAoD6r5cEPKdGl3ZH1NRU8TX_S82pD4DispAzYRWwTRrHJ7dtT';
    const player = new Spotify.Player({
        name: 'Pintura',
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