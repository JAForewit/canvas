new Vue({
    el: '#app',
    data: {},
    components: {
        'toolbar': {
            template: `
            <div v-bind:class="{ 'open': showToolbar }" class="toolbar">
                <button v-on:click="showToolbar = !showToolbar" style="float: right; margin-right: -100px;">toggle toolbar</button>    
                <slot></slot>
            </div>`,
            props: {},
            data: function () {
                return {
                    showToolbar: true
                }
            }
        },
    }
});


mylist = new sortableList(document.getElementById("mylist"));

// creates a list elemnt where children are sortable
function sortableList(list) {

    // Initialize list children as Draggable elements
    for (var i = 0; i < list.children.length; i++) {
        element = list.children[i];
        options = {
            setPosition: true,
            smoothDrag: true,
            handle: element.children[0],
            onDragEnd: release,
            onDragStart: grab,
            onDrag: dragging
        };
        drag = new Draggable(element, options);
        if (i > 0) {

        }
        var top = (i > 0) ? top + list.children[i - 1].clientHeight : 0;
        drag.set(0, top);
        console.log(top);
    };

    // create blank div element
    var placeholderEl = document.createElement('div');
    placeholderEl.classList.add('placeholder');

    function grab(drag, x, y, event) {
        var el = drag.element;

        // insert element before drag element
        //el.style.position = "absolute";
        //placeholderEl.style.height = drag._dimensions.height + 'px';
        //placeholderEl.style.width = drag._dimensions.width + 'px';
        //el.parentNode.insertBefore(placeholderEl, el);
    };

    // returns true if (x, y) is inside a draggable object
    function inside(mX, mY, el1, el2) {
        rect = el2.getBoundingClientRect();
        return (mX < rect.x + rect.width &&
            mY > rect.y + rect.height - el1.clientHeight &&
            mY < rect.y + rect.height);
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
            if (!el.isSameNode(nodes[i]) && inside(mousePos.x, mousePos.y, el, nodes[i])) {
                // insert placeholder
                //el.parentNode.removeChild(placeholderEl);
                //el.parentNode.insertBefore(placeholderEl, nodes[i])
                console.log(nodes[i].style.background);
                break;
            }
        }
    }


    function release(drag, x, y, event) {
        var el = drag.element;

        // drop drag into new position
        // 1. check for mouse pos in "widget"

        //el.style.position = "inherit";
        //el.style.top = 0;
        //el.style.left = 0;
        //placeholderEl.parentNode.replaceChild(el, placeholderEl);

    };
};
