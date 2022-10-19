
/* various api urls */

// TODO change once app is actually deployed to pages.wisc address, update spotify app dashboard
var spotifyRedirectURI = "http://127.0.0.1:5500/index.html";

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

let playing = false; // is the player playing?

var sdkReady = false; // currently, we re-auth on page reload and while this isn't a problem it's not necessary... maybe fix eventually
var musician;

window.onSpotifyWebPlaybackSDKReady = () => { print("DEBUG: Spotify Web Playback SDK ready"); sdkReady = true; }

function onPageLoad() {
    if (window.location.search.length > 0) { // do we have the code in the URL?
        let code = getCodefromURL();
        fetchAccessToken(code);
        while (!sdkReady) { }
        // need to make sure tokens are good to go before starting the web player
        startWebPlayer();
        // trim URL without page reload
        window.history.replaceState(null, null, window.location.pathname);
    }
    else requestAuthorization();
}

function startWebPlayer() {
    const token = localStorage.getItem("access_token");
    console.log("DEBUG: Spotify Web Player starting");
    musician = new Spotify.Player({
        name: 'Pintura',
        getOAuthToken: cb => { cb(token); },
        volume: 0.05 //decrease volume by a lot
    });

    configurePlayer();
}

function requestAuthorization() {
    let url = AUTHORIZE;
    url += "?client_id=" + secrets.CLIENT_ID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(spotifyRedirectURI);
    url += "&show_dialog=false"; //set to false to skip auth screen
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";

    console.log("redirect");

    window.location.href = url; // Show Spotify's authorization screen
}

function getCodefromURL() {
    let code = null;
    const queryString = window.location.search; // this string is everything including and after '?' past the actual url
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }

    return code;
}

/* uses our auth code to fetch the actual access token we use for the api */
function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(spotifyRedirectURI);
    body += "&client_id=" + secrets.CLIENT_ID;
    body += "&client_secret=" + secrets.CLIENT_SECRET;
    callAuthorizationApi(body);
}

/* TODO figure out where to call this... haven't run into an issue yet but will eventually */
function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + localStorage.getItem("refresh_token");;
    body += "&client_id=" + secrets.CLIENT_ID;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(secrets.CLIENT_ID + ":" + secrets.CLIENT_SECRET));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        //console.log(data);
        if (data.access_token != undefined) {
            let access_token = data.access_token;
            localStorage.setItem("access_token", access_token); //saves with no expiration, use sessionStorage to delete when browser tab is closed
        }
        if (data.refresh_token != undefined) {
            let refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
    }
    else { //display error message
        console.log(this.responseText);
        alert(this.responseText);
    }
}
