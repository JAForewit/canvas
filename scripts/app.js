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
function wave(frequency, amplitude, width, height) {
    // define starting point
    let d = `M0,-1L0,${Math.random() * amplitude}`;

    let aspect = width / (height * frequency);
    let x1, x2, y1, y2;

    for (var i = 0; i < frequency; i++) {
        // define handle
        x1 = (0.5 + i * 2) * aspect;
        y1 = Math.random() * amplitude;

        // define point
        x2 = (1.5 + i * 2) * aspect;
        y2 = Math.random() * amplitude;

        d += `S${x1},${y1},${x2},${y2}`;
    }

    // define ending handle
    x1 = (0.5 + frequency * 2) * aspect;
    y1 = Math.random() * amplitude;

    // define ending point
    x2 = (frequency * 2 + 1) * aspect;
    y2 = Math.random() * amplitude;
    d += `S${x1},${y1},${x2},${y2}L${x2},-1Z`;

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0,-0.5,${(frequency * 2 + 1) * aspect},2`);
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.appendChild(path);

    return svg;
}

let svg = wave(3, 0.5, window.innerWidth, 800);
document.getElementById("top-curve").appendChild(svg)

