// -----------------------------
// FIREBASE AUTHENTICATION
let ui = new firebaseui.auth.AuthUI(firebase.auth());

// Auth UI configuration
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    //signInSuccessUrl: 'app.canvas.gg',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        //firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



// -----------------------------
// FIREBASE USER PROFILE
var user = firebase.auth().currentUser;
// user.displayName
// user.email
// user.uid



// -----------------------------
// RANDOMIZED SVG Curves
// How to write SVG path: https://css-tricks.com/svg-path-syntax-illustrated-guide/
function wave(svg, path, frequency, amplitude, flipped=false) {
    
    // define starting point
    let d = (flipped) ? 'M0,2' : 'M0,-1';
    d += `L0,${Math.random() * amplitude}`;

    let x1, x2, y1, y2;

    for (var i = 0; i < frequency; i++) {
        // define bezier handle and point
        x1 = 0.5 + i * 2;
        y1 = Math.random() * amplitude;
        x2 = 1.5 + i * 2;
        y2 = Math.random() * amplitude;
        d += `S${x1},${y1},${x2},${y2}`;
    }

    // define last bezier handle and point
    x1 = 0.5 + frequency * 2;
    y1 = Math.random() * amplitude;
    x2 = 1 + frequency * 2;
    y2 = Math.random() * amplitude;
    d += `S${x1},${y1},${x2},${y2}`

    // define ending point
    d += (flipped) ? `L${x2},2Z` : `L${x2},-1Z`;

    // set SVG attributes
    svg.setAttribute("viewBox", `0,-1,${frequency * 2 + 1},3`);
    svg.setAttribute("preserveAspectRatio", "none")
    path.setAttribute("d", d);
}

// Create page top curve
let topPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
let topSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
topSVG.appendChild(topPath);
document.getElementById("top-curve").appendChild(topSVG)

// create page bottom curve
let bottomPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
let bottomSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
bottomSVG.appendChild(bottomPath);
document.getElementById("bottom-curve").appendChild(bottomSVG)


// -----------------------------
// DEBOUNCED RESIZE EVENT
var rtime;
var timeout = false;
var delta = 200;
window.addEventListener('resize',function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;

        // Resize finished
        wave(topSVG, topPath, 7, 1);
        wave(bottomSVG, bottomPath, 3, 0.7, true)
    }
}
resizeend();