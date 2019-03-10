// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}


// theoretical
/*
scrollable sections should have the .scrollable class

on .scrollable element

touchstart: 
touchmove: 
touchend: 

*/
var elem = document.getElementsByClassName("scrollable")[0],
    lastTouchY;

elem.addEventListener('touchstart', function (e) {
    var touches = e.changedTouches;
    lastTouchY = touches[0].clientY;
    log("startY: " + lastTouchY);
    e.stopPropagation();
});

elem.addEventListener('touchmove', function (e) {
    var touches = e.changedTouches;
        touchY = touches[0].clientY,
        atTop = (elem.scrollTop === 0),
        atBottom = (elem.scrollTop === (elem.scrollHeight - elem.offsetHeight));
    
    if (atTop && touchY > lastTouchY) {
        // stop scrolling up
        console.log("up");
        elem.scrollTop = 0;
    }
    if (atBottom && touchY < lastTouchY) {
        // stop scrolling down
        console.log("down");
        elem.scrollTop = (elem.scrollHeight - elem.offsetHeight);
    }
    e.stopPropagation();
});

elem.addEventListener('touchend', function (e) {
    var touches = e.changedTouches;
    log("endY: " + touches[0].clientY);
    e.stopPropagation();
});



/*
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
        atBottom = (element.scrollTop === (element.scrollHeight - element.offsetHeight));
        log("top: " + atTop + " bot: " + atBottom);
    };

    var touchmoveHandler = function (e) {

        if (atTop && isScrollingUp(e) && e.cancelable) {
            e.preventDefault();
            return;
        }
        if (atBottom && isScrollingDown(e) && e.cancelable) {
            e.preventDefault();
            return;
        }
    };

    element.addEventListener('touchstart', touchstartHandler);
    element.addEventListener('touchmove', touchmoveHandler, { capture: true, passive: false });
});


*/