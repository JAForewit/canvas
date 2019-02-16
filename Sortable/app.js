sortableList(document.getElementById("mylist"));


// creates a list elemnt where children are sortable
function sortableList(list) {
    // Initialize list children as Draggable elements
    var items = [];
    for (var i=0; i<list.children.length; i++) {
        element = list.children[i];
        options = { 
            id: i,
            setPosition: false,
            smoothDrag: true,
            handle: element.children[0],
            onDragEnd: release,
            onDragStart: grab,
            onDrag: dragging,
        };
        drag = new Draggable(element, options);
        items.push(drag);
    };

    // create blank div element
    var placeholderEl = document.createElement('div');
    placeholderEl.classList.add('placeholder');

    function grab(drag, x, y, event) {
        console.log("grab");

        // insert element before drag element
        drag.element.parentNode.insertBefore(placeholderEl, drag.element);
        drag.element.style.position = "absolute";
    };

    function dragging(drag, x, y, event) {
        console.log("dragging");
    };

    function release(drag, x, y, event) {
        console.log("release");
        drag.element.style.position = "inherit";
        drag.element.style.top = 0;
        drag.element.style.left = 0;
        drag.element.parentNode.removeChild(placeholderEl);
    };


    /* LOGIC
    1. initiate list children as Draggable items???
    2. set trigger zone threshold (optional)
    3. event listener for mouse down on child handle
        -> set position of child to absolute (from relative)
        -> insert blank DIV in DOM
        -> remove previous blank DIV from DOM
    4. event listener for mouse up from child
        -> replace blank div with dragged child
    */
}