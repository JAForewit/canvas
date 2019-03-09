// Function to disable "pull-to-refresh" effect present in some webviews.
// Especially Crosswalk 12 and above (Chromium 41+) runtimes.

window.addEventListener('load', function () {
    var maybePreventPullToRefresh = false,
        element = document.getElementById("scrollableBox");

    var touchstartHandler = function (e) {
        maybePreventPullToRefresh = (element.scrollTop === 0) || (element.scrollTop >= (element.scrollHeight - element.offsetHeight));
        log(maybePreventPullToRefresh);
    };

    var touchmoveHandler = function (e) {
        if (maybePreventPullToRefresh) {
            maybePreventPullToRefresh = false;
            e.preventDefault();
            return;
        }
    };

    document.addEventListener('touchstart', touchstartHandler);
    document.addEventListener('touchmove', touchmoveHandler, { passive: false });
});

// DO NOT DELETE
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}