let lastTouchY = 0;
const setTouchStartPoint = event => {
    lastTouchY = event.touches[0].clientY;
};
const isScrollingUp = event => {
    const touchY = event.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;

    lastTouchY = touchY;

    return touchYDelta > 0;
};
const isScrollingDown = event => {
    const touchY = event.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;

    lastTouchY = touchY;

    return touchYDelta < 0;
};


window.addEventListener('load', function () {
    var atTop = false,
        atBottom = false,
        element = document.getElementById("scrollableBox");

    var touchstartHandler = function (e) {
        setTouchStartPoint(e);
        atTop = (element.scrollTop === 0);
        atBottom = (element.scrollTop >= (element.scrollHeight - element.offsetHeight));
        log("top: " + atTop + " bot: " + atBottom);
    };

    var touchmoveHandler = function (e) {
        if (atTop && isScrollingUp(e) && e.cancelable) {
            atTop = false;
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (atBottom && isScrollingDown(e) && e.cancelable) {
            atBottom = false;
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    };

    element.addEventListener('touchstart', touchstartHandler);
    element.addEventListener('touchmove', touchmoveHandler, { passive: false });
});


// DO NOT DELETE
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}