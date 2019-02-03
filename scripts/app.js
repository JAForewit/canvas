// widget manager Vue
new Vue({
    el: '#manager',
    data: {
        showToolbar: true,
    },
});

// Initialize dragable widget
element = document.getElementsByClassName('widget')[0];
handle = document.getElementsByClassName('widget-handle')[0];
var options = {
	grid: 100,
    smoothDrag: true,
    handle: handle
};
var drag = new Draggable(element, options);