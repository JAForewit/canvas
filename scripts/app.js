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
    var drags = [];

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
        var top = (i > 0) ? top + list.children[i - 1].clientHeight : 0;
        drag.set(0, top);
        drags.push(drag);
    };

    // create blank div element
    var placeholderEl = document.createElement('div');
    placeholderEl.classList.add('placeholder');
    var overEl; // element being hovered over


    function grab(drag, x, y, event) {
        var el = drag.element;
        el.style.transition = "none";

        // insert placeholder in the list scope
        placeholderEl.style.height = el.clientHeight + 'px';
        placeholderEl.style.width = el.clientWidth + 'px';
        placeholderEl.style.top = el.style.top;
        placeholderEl.style.left = el.style.left;
        list.parentNode.insertBefore(placeholderEl, list);
    };

    // returns true if (x, y) is inside a draggable object
    function inside(mX, mY, drag1, drag2) {
        rect = drag2.element.getBoundingClientRect();
        return (mX < rect.left + rect.width &&
            mY > rect.top + rect.height - drag1._dimensions.height &&
            mY < rect.top + rect.height);
    }

    function dragging(drag, x, y, e) {
        var mouse = {
            x: (e.targetTouches ? e.targetTouches[0] : e).clientX,
            y: (e.targetTouches ? e.targetTouches[0] : e).clientY
        };

        for (i in drags) {
            // is curser inside item
            //console.log(drags[i]);
            if (overEl !== drags[i] &&
                drag !== drags[i] &&
                inside(mouse.x, mouse.y, drag, drags[i])) {

                // insert placeholder
                console.log(drags[i].element.style.background);
                overEl = drags[i];
                break;
            }
        }
    }


    function release(drag, x, y, event) {
        drag.element.style.transition = "ease-out 0.1s";
        // drop drag into new position
        var rect = placeholderEl.getBoundingClientRect();
        drag.set(rect.left, rect.top);
        placeholderEl.parentNode.removeChild(placeholderEl);
    };
};
