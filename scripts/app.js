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

    me._left = el.clientLeft;
    me._width = el.clientWidth;
    me._dropZones = [];

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
    placeholder.style.left = me._left + 'px';

    function onGrab(item, x, y, e) {
        // prevent transition animation while dragging
        item.element.classList.add("dragging");

        // remove item
        var itemIndex = me.items.indexOf(item);
        me.items.splice(itemIndex, 1);
        updatePositions(me.gap);

        // set drop zones
        var top = me.gap / 2;
        me._dropZones = [top];
        for (var i in me.items) {
            top += me.items[i].element.clientHeight + me.gap;
            me._dropZones.push(top);
        }

        // insert placeholder
        placeholder.index = itemIndex;
        placeholder.style.top = me._dropZones[itemIndex] + 'px';
        me.el.appendChild(placeholder);
    }

    function onDrag(item, x, y, e) {

        var mX = (e.targetTouches ? e.targetTouches[0] : e).clientX,
            mY = (e.targetTouches ? e.targetTouches[0] : e).clientY;

        function inDropZone(top, above, below) {
            return (mX < me._left + me._width &&
                mY > top - above / 2 &&
                mY < top + below / 2);
        }

        // TODO finish this logic
        if (me.items.length == 0) {
            return;
        } else {
            var zones = me._dropZones;

            // TODO check first drop zone
            if (placeholder.index != 0 &&
                inDropZone(me._dropZones[0], 0, me.items[0].element.clientHeight)) {
                console.log("zone 0");
            }
            // TODO check middle drop zone
            for (var i = 1; i < me._dropZones.length - 1; i++) {
                if (placeholder.index != i) {

                }
            }
            // TODO check last drop zone
            if (placeholder.index != me._dropZones.length) {

            }
        }

        // TODO REMOVE AFTER HERE
        function inThreshold(top, left, width, height) {
            return (mX < left + width &&
                mY > top - height / 2 &&
                mY < top + height / 2);
        }

        // find new drop zone
        for (var i = 0; i < me.items.length; i++) {

            var rect = me.items[i].element.getBoundingClientRect();
            if (inThreshold(rect.top, rect.left, rect.width, rect.height)) {
                // move placeholder to new drop zone
                //placeholder.style.top = rect.top - me.gap / 2 + 'px';
                placeholder.index = i;
                break;
            }
            if (i == me.items.length - 1 &&
                inThreshold(rect.bottom, rect.left, rect.width, rect.height)) {
                // move placeholder to new drop zone

                // TODO stop placeholder from placing during a transition
                // or add a check to stop it from constantly looking for drop zones +1
                //placeholder.style.top = rect.bottom + me.gap / 2 + 'px';
                placeholder.index = me.items.length;
                break;
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
            me.items[i].set(me._left, top);
        }
    }
};