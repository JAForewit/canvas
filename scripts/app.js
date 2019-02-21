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


mylist = new WidgetList(document.getElementById("mylist"));

// creates a list elemnt where children are sortable
function WidgetList(el) {
    var me = this;

    me.el = el;             // list element
    me.items = [];          // draggable items
    me.threshold = 100;     // drop zone threshold
    me.gap = 10;            // gap between items on drag
    me.left = el.clientLeft;

    // Initialize el children as items in the list
    for (var i = 0; i < me.el.children.length; i++) {
        var element = me.el.children[i],
            options = {
                setPosition: true,
                smoothDrag: true,
                handle: element.children[0],
                onDragEnd: onRelease,
                onDragStart: onGrab,
                onDrag: onDrag
            },
            item = new Draggable(element, options);
        me.items.push(item);
    }
    updatePositions();

    // create placeholder element
    var placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.left = me.left + 'px';

    function onGrab(item, x, y, e) {
        // prevent transition animation while dragging
        item.element.classList.add("dragging");

        // remove item list and update positions of items
        me.items.splice(me.items.indexOf(item), 1);
        updatePositions(me.gap);

        // insert placeholder
        placeholder.style.top = item.element.clientTop + me.gap / 2 + 'px';
        me.el.appendChild(placeholder);
    }

    function onDrag(item, x, y, e) {
        var mX = (e.targetTouches ? e.targetTouches[0] : e).clientX,
            mY = (e.targetTouches ? e.targetTouches[0] : e).clientY

        function inThreshold(top, left, width, height) {
            return (mX < left + width &&
                mY > top - height / 2 &&
                mY < top + height / 2);
        }

        // find new drop zone
        for (var i = 0; i < me.items.length; i++) {
            if (me.items[i] !== item) {
                var rect = me.items[i].element.getBoundingClientRect();
                if (inThreshold(rect.top, rect.left, rect.width, rect.height)) {
                    // move placeholder to new drop zone
                    placeholder.style.top = rect.top - me.gap / 2 + 'px';
                    placeholder.index = i;
                    break;
                }
                if (i == me.items.length - 1 &&
                    inThreshold(rect.bottom, rect.left, rect.width, rect.height)) {
                    // move placeholder to new drop zone

                    // TODO stop placeholder from placing during a transition
                    // or add a check to stop it from constantly looking for drop zones +1
                    placeholder.style.top = rect.bottom + me.gap / 2 + 'px';
                    placeholder.index = me.items.length;
                    break;
                }
            }
        }
    }

    function onRelease(item, x, y, event) {
        // add transition animation
        item.element.classList.remove("dragging");

        // add item to list
        me.items.splice(placeholder.index, 0, item);

        // update positions
        updatePositions();

        // remove placeholder
        me.el.removeChild(placeholder);
    }

    function updatePositions(gap) {
        for (var i = 0; i < me.items.length; i++) {
            var top = (i > 0) ? top + me.items[i - 1].element.clientHeight + (gap || 0) : (gap || 0);
            me.items[i].set(me.left, top);
        }
    }
};