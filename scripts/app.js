// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// toggle for preferences toolbar
function togglePrefToolbar() {
    document.getElementById("pref-toolbar").classList.toggle("open");
    document.getElementById("nav-icon2").classList.toggle("open");
}

// prevent chain scrolling and pull-to-refresh
// all scrollable nodes need the .scrollable class
var selection = {};
document.addEventListener('touchstart', function (e) {
    selection.el = e.target.closest('.scrollable');
    if (!selection.el) return;
    selection.lastTouchY = e.changedTouches[0].clientY;
    e.stopPropagation();
});

document.addEventListener('touchmove', function (e) {
    if (!selection.el) { e.preventDefault(); e.stopPropagation(); console.log("hi"); return; }

    var el = selection.el,
        lastTouchY = selection.lastTouchY;

    var touchY = e.changedTouches[0].clientY,
        atTop = (el.scrollTop === 0),
        atBottom = (el.scrollTop === (el.scrollHeight - el.offsetHeight));

    if ((atTop && touchY > lastTouchY && e.cancelable) ||
        (atBottom && touchY < lastTouchY && e.cancelable)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, { passive: false });

document.addEventListener('touchend', function (e) { selection = {}; });
document.addEventListener('touchcancel', function (e) { selection = {}; });
