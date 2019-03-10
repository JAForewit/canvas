// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

// prevent chain scrolling and pull-to-refresh
for (var i = 0; i < document.getElementsByClassName('scrollable'); i++) {
    pointerControl(document.getElementsByClassName('scrollable')[i]);
}

var pointerControl = function (elem) {
    var lastTouchY;

    elem.addEventListener('touchstart', function (e) {
        lastTouchY = e.changedTouches[0].clientY;
        e.stopPropagation();
    });

    elem.addEventListener('touchmove', function (e) {
        var touchY = e.changedTouches[0].clientY,
            atTop = (elem.scrollTop === 0),
            atBottom = (elem.scrollTop === (elem.scrollHeight - elem.offsetHeight));

        if (atTop && touchY > lastTouchY && e.cancelable) {
            // stop scrolling up
            e.preventDefault();
            elem.scrollTop = 0;
        }
        if (atBottom && touchY < lastTouchY && e.cancelable) {
            // stop scrolling down
            e.preventDefault();
            elem.scrollTop = (elem.scrollHeight - elem.offsetHeight);
        }
        e.stopPropagation();
    }, { passive: false });

    elem.addEventListener('touchend', function (e) {
        e.stopPropagation();
    });
}
