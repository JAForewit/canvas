// widget manager Vue
new Vue({
    el: '#manager',
    data: {
        showToolbar: false,
    },
});

// Initialize dragable widget
element = document.getElementsByClassName('widget')[0];
var options = {
	grid: 100,
	setCursor: true,
    smoothDrag: true
};
var drag = new Draggable(element, options);