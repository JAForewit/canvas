mylist = new sortableList(document.getElementById("mylist"));


// creates a list elemnt where children are sortable
function sortableList(list) {
    var me = this;

    // Initialize list children as Draggable elements
    for (var i = 0; i < list.children.length; i++) {
        element = list.children[i];
        options = {
            setPosition: false,
            smoothDrag: true,
            handle: element.children[0],
            onDragEnd: release,
            onDragStart: grab,
            onDrag: dragging
        };
        drag = new Draggable(element, options);
    };

    // create blank div element
    var placeholderEl = document.createElement('div');
    placeholderEl.classList.add('placeholder');

    function grab(drag, x, y, event) {
        var el = drag.element;

        // insert element before drag element
        el.style.position = "absolute";
        placeholderEl.style.height = drag._dimensions.height + 'px';
        placeholderEl.style.width = drag._dimensions.width + 'px';
        placeholderEl.id = drag.id;
        el.parentNode.insertBefore(placeholderEl, el);
    };

    // returns true if (x, y) is inside a draggable object
    function inside(x, y, element) {
        rect = element.getBoundingClientRect();

        if (x > rect.x + rect.width) return false;
        if (y < rect.y || y > rect.y + rect.height) return false;
        return true;
    }


    function dragging(drag, x, y, e) {
        var el = drag.element;
        var nodes = el.parentNode.children;
        mousePos = {
            x: (e.targetTouches ? e.targetTouches[0] : e).clientX,
            y: (e.targetTouches ? e.targetTouches[0] : e).clientY
        };

        for (var i = 0; i < nodes.length; i++) {
            // is curser inside item
            if (!el.isSameNode(nodes[i]) && inside(mousePos.x, mousePos.y, nodes[i])) {
                // insert placeholder
                el.parentNode.removeChild(placeholderEl);
                el.parentNode.insertBefore(placeholderEl, nodes[i])
                break;
            }
        }
    }


    function release(drag, x, y, event) {
        var el = drag.element;

        // drop drag into new position
        // 1. check for mouse pos in "widget"

        el.style.position = "inherit";
        el.style.top = 0;
        el.style.left = 0;
        placeholderEl.parentNode.replaceChild(el, placeholderEl);

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