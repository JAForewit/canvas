// FOR DEBUGGING
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// prevent all un-handled touchmove events
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });


// init draggable elements
var dragEl = document.getElementsByClassName('draggable')[1],
    options = {
        handle: dragEl.children[0]
    };
var drag = new Drag(dragEl, options);

// init scrollable elements
var scrollEl = document.getElementsByClassName('scrollable')[0],
    options = {};
var scroll = new Scroll(scrollEl, options);