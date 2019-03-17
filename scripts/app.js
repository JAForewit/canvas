// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// prevent all un-handled touchmove events
document.body.addEventListener('touchstart', touchstartHandler, { passive: false });
function touchstartHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    document.body.addEventListener('touchmove', touchmoveHandler, { passive: false });
    document.body.addEventListener('touchend', touchendHandler);
    document.body.addEventListener('touchcancel', touchendHandler);
}
function touchmoveHandler(e) {
    e.preventDefault();
    e.stopPropagation();
}
function touchendHandler(e) {
    document.body.removeEventListener('touchmove', touchmoveHandler);
    document.body.removeEventListener('touchend', touchendHandler);
    document.body.removeEventListener('touchcancel', touchendHandler);
}

// init draggable elements
var el = document.getElementsByClassName('draggable')[0],
    options = {
        handle: el.children[0]
    };
 
var drag = new Draggable(el, options);


