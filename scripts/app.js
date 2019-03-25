// FOR DEBUGGING
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

// toggle for toolbars
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}
function togglePrefToolbar() {
    document.getElementById("pref-toolbar").classList.toggle("open");
    document.getElementById("nav-icon2").classList.toggle("open");
}

// prevent all un-handled touchmove events
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });


// init draggable elements
for (var i = 0; i < document.getElementsByClassName('draggable').length; i++) {
    var dragEl = document.getElementsByClassName('draggable')[i],
        options = {
            handle: dragEl.children[0]
        };
    var drag = new Drag(dragEl, options);
}

// init scrollable elements
for (var i = 0; i < document.getElementsByClassName('scrollable').length; i++) {
    var scrollEl = document.getElementsByClassName('scrollable')[i],
        options = {};
    var scroll = new Scroll(scrollEl, options);
}