sortableList(document.getElementById("mylist"));


// creates a list elemnt where children are sortable
function sortableList(list) {
    // Initialize list children as Draggable elements
    var drags = [];
    for (var i = 0; i < list.children.length; i++) {
        element = list.children[i];
        options = {
            id: i,
            setPosition: false,
            smoothDrag: true,
            handle: element.children[0],
            onDragEnd: release,
            onDragStart: grab,
            onDrag: dragging
        };
        drag = new Draggable(element, options);
        drags.push(drag);
    };

    // create blank div element
    var placeholderEl = document.createElement('div');
    placeholderEl.classList.add('placeholder');


    // returns true if (x, y) is inside a draggable object
    function inside(x, y, drag) {
        var dx = drag._dimensions.left,
            dy = drag._dimensions.top,
            dh = drag._dimensions.height,
            dw = drag._dimensions.width;

        if (x > dx + dw) return false;
        if (y < dy || y > dy + dh) return false;
        return true;
    }


    function grab(drag, x, y, event) {
        var el = drag.element;

        // insert element before drag element
        //drag.set(0, 0);
        el.style.position = "absolute";
        placeholderEl.style.height = drag._dimensions.height + 'px';
        placeholderEl.style.width = drag._dimensions.width + 'px';
        el.parentNode.insertBefore(placeholderEl, el);

        for (i in drags) {
            console.log(parseInt((drags[i].element.style.left,10) ||  drags[i].element.offsetLeft), drags[i].element.style.background);
        }
    };

    function dragging(drag, x, y, e) {
        var el = drag.element;
        mousePos = {
            x: (e.targetTouches ? e.targetTouches[0] : e).clientX,
            y: (e.targetTouches ? e.targetTouches[0] : e).clientY
        };
        for (i in drags) {
            // is curser inside item
            if (inside(mousePos.x, mousePos.y, drags[i])) {
                //console.log(drags[i].element.style.background);
                //el.parentNode.insertBefore(placeholderEl, drags[i].element)
                //break;
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
        el.parentNode.removeChild(placeholderEl);

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