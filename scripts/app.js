function toggleToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
}

window.addEventListener('scroll', function () {
    console.log("scroll");
});

mylist = new WidgetList(document.getElementById("wrapper"));

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
        
        // move item in DOM
        me.el.removeChild(item.element);
        document.body.appendChild(item.element);

        // insert placeholder
        placeholder.index = itemIndex;
        placeholder.style.top = me._dropZones[itemIndex] + 'px';
        me.el.appendChild(placeholder);
    }

    function onDrag(item, x, y, e) {
        var mX = (e.targetTouches ? e.targetTouches[0] : e).clientX,
            mY = (e.targetTouches ? e.targetTouches[0] : e).clientY;

        function inDropZone(y, above, below) {
            return (mX < me._left + me._width &&
                mY > y - above / 2 &&
                mY < y + below / 2);
        }

        if (me.items.length == 0) {
            return;
        } else {
            // check first drop zone
            if (placeholder.index != 0 &&
                inDropZone(
                    me._dropZones[0] - me.el.scrollTop,
                    0,
                    me.items[0].element.clientHeight)) {
                placeholder.style.top = me._dropZones[0] + 'px';
                placeholder.index = 0;
                return;
            }
            // check middle drop zones
            for (var i = 1; i < me.items.length; i++) {
                if (placeholder.index != i &&
                    inDropZone(
                        me._dropZones[i] - me.el.scrollTop,
                        me.items[i - 1].element.clientHeight,
                        me.items[i].element.clientHeight)) {
                    placeholder.style.top = me._dropZones[i] + 'px';
                    placeholder.index = i;
                    return;
                }
            }
            // check last drop zone
            if (placeholder.index != me.items.length &&
                inDropZone(
                    me._dropZones[me._dropZones.length - 1] - me.el.scrollTop,
                    me.items[me.items.length - 1].element.clientHeight,
                    0)) {
                placeholder.style.top = me._dropZones[me._dropZones.length - 1] + 'px';
                placeholder.index = me.items.length;
                return;
            }
        }
    }

    function onRelease(item, x, y, event) {
        // add transition animation
        item.element.classList.remove("dragging");

        // move item in DOM
        document.body.removeChild(item.element);
        me.el.appendChild(item.element);

        // add item to list
        me.items.splice(placeholder.index, 0, item);

        // update positions
        updatePositions();

        // remove placeholder
        me.el.removeChild(placeholder);
    }

    function updatePositions(gap) {
        var zone = me.gap / 2;
        me._dropZones = [zone];
        for (var i in me.items) {
            zone += me.items[i].element.clientHeight + me.gap;
            me._dropZones.push(zone);

            var top = (i > 0) ? top + me.items[i - 1].element.clientHeight + (gap || 0) : (gap || 0);
            me.items[i].set(me._left, top);
        }
    }
};