
/* various api urls */

//TODO change once app is actually deployed
var spotifyRedirectURI = "http://127.0.0.1:5500/index.html";
var authorizationReceived = false;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";


window.onbeforeunload = function(){
    sessionStorage.setItem("authReceived", false);
 }

/* Stuff that should be ready when the user can interact with the page */
function onPageLoad() {
    if (window.location.search.length > 0) { handleRedirect(); }
}

function requestAuthorization() {
    let url = AUTHORIZE;
    url += "?client_id=" + api_key.CLIENT_ID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(spotifyRedirectURI);
    url += "&show_dialog=false"; //set to false to skip auth screen
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";

    sessionStorage.setItem("authReceived", true);
    authorizationReceived = true;

    window.location.href = url; // Show Spotify's authorization screen
}

function handleRedirect() {
    let code = null;
    const queryString = window.location.search; // this string is everything including and after '?' past the actual url
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    fetchAccessToken(code);
    window.history.pushState("", "", spotifyRedirectURI); // remove param from url
}

/* uses our auth code to fetch the actual access token we use for the api */
function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(spotifyRedirectURI);
    body += "&client_id=" + api_key.CLIENT_ID;
    body += "&client_secret=" + api_key.CLIENT_SECRET;
    callAuthorizationApi(body);
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + localStorage.getItem("refresh_token");;
    body += "&client_id=" + api_key.CLIENT_ID;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(api_key.CLIENT_ID + ":" + api_key.CLIENT_SECRET));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    console.log("herr");
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
        
        onPageLoad();
    }
    else { //display error message
        console.log(this.responseText);
        alert(this.responseText);
    }
}
