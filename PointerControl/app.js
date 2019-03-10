// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

// prevent chain scrolling and pull-to-refresh
var selection = {};
document.addEventListener('touchstart', function (e) {
    selection.el = e.target.closest('.scrollable');
    if (!selection.el) return;
    selection.lastTouchY = e.changedTouches[0].clientY;
    e.stopPropagation();
});

document.addEventListener('touchmove', function (e) {
    if (!selection.el) return;
    var el = selection.el,
        lastTouchY = selection.lastTouchY;

    var touchY = e.changedTouches[0].clientY,
        atTop = (el.scrollTop === 0),
        atBottom = (el.scrollTop === (el.scrollHeight - el.offsetHeight));

    if (atTop && touchY > lastTouchY && e.cancelable) {
        // stop scrolling up
        e.preventDefault();
        el.scrollTop = 0;
    }
    if (atBottom && touchY < lastTouchY && e.cancelable) {
        // stop scrolling down
        e.preventDefault();
        el.scrollTop = (el.scrollHeight - el.offsetHeight);
    }
    e.stopPropagation();
}, { passive: false });

document.addEventListener('touchend', function (e) {
    selection = {};
    e.stopPropagation();
});

document.addEventListener('touchcancel', function (e) {
    selection = {};
    e.stopPropagation();
});