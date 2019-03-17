// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// prevent all un-handled touchmove events
window.addEventListener('touchstart', touchstartHandler);
function touchstartHandler(e) {
    window.addEventListener('touchmove', touchmoveHandler, { passive: false });
    window.addEventListener('touchend', touchendHandler);
    window.addEventListener('touchcancel', touchendHandler);
}
function touchmoveHandler(e) {
    e.preventDefault();
    e.stopPropagation();
}
function touchendHandler(e) {
    window.removeEventListener('touchmove', touchmoveHandler);
    window.removeEventListener('touchend', touchendHandler);
    window.removeEventListener('touchcancel', touchendHandler);
}

// init draggable elements
var el = document.getElementsByClassName('draggable')[0],
    options = {
        handle: el.children[0]
    };
 
var drag = new Draggable(el, options);


