// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

var el = document.getElementsByClassName('draggable')[0],
    handle = document.getElementsByClassName('draggable')[0].children[0],
    options = {};

var drag = new Draggable(el, handle, options);