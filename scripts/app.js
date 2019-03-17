// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

var el = document.getElementsByClassName('draggable')[0],
    options = {
        handle: el.children[0]
    };
 
var drag = new Draggable(el, options);