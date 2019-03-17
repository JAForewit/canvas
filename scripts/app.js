// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// prevent all un-handled touchmove events
document.body.addEventListener('touchmove', function(d) {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

// init draggable elements
var el = document.getElementsByClassName('draggable')[0],
    options = {
        handle: el.children[0]
    };
 
var drag = new Draggable(el, options);