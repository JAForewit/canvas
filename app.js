var el = document.getElementsByClassName('draggable')[0],
    handle = document.getElementsByClassName('draggable')[0].children[0],
    options = {};

var drag = new Draggable(el, handle, options);