// FOR DEBUGGING
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

// toggle for widget toolbar
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}

// toggle for preferences toolbar
function togglePrefToolbar() {
    document.getElementById("pref-toolbar").classList.toggle("open");
    document.getElementById("nav-icon2").classList.toggle("open");
}

// widget list
function WidgetList(el) {
    var me = this;

    me.el = el;             // list element
    me.items = [];          // draggable items
    me.gap = 10;            // gap between items on drag

    me._left = el.clientLeft;
    me._width = el.clientWidth;
    me._dropZones = [];

    // Initialize el children as items in the list
    for (var i = 0; i < me.el.children.length; i++) {
        if (me.el.children[i].classList.contains("widget")) {
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
    }
    updatePositions();

    // create placeholder element
    var placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.left = me._left + 'px';
    placeholder.style.height = me.gap + 'px';

    function onGrab(item, x, y, e) {
        // move element in DOM
        document.body.appendChild(item.element);

        // prevent transition animation while dragging
        item.element.classList.add("dragging");

        // remove item
        var itemIndex = me.items.indexOf(item);
        me.items.splice(itemIndex, 1);
        updatePositions(me.gap);

        // insert placeholder
        placeholder.index = itemIndex;
        placeholder.style.top = me._dropZones[itemIndex] + 'px';
        me.el.appendChild(placeholder);
    }

    function onDrag(item, x, y, e) {
        function inDropZone(top, above, below) {
            return (x < me._left + me._width &&
                y > top - above / 2 && //me.threshold = above
                y < top + below / 2); //me.threshold = below
        }

        if (me.items.length == 0) {
            return;
        } else {
            // check first drop zone
            if (placeholder.index != 0 &&
                inDropZone(
                    me._dropZones[0] - me.el.scrollTop,
                    1000,
                    me.items[0].element.clientHeight)) {
                placeholder.style.top = me._dropZones[0] + 'px';
                placeholder.index = 0;
                me.el.scrollTop = 0;
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
                    if (y < 0 || y > me.el.clientHeight) {
                        placeholder.scrollIntoView();
                    }
                    return;
                }
            }
            // check last drop zone
            if (placeholder.index != me.items.length &&
                inDropZone(
                    me._dropZones[me._dropZones.length - 1] - me.el.scrollTop,
                    me.items[me.items.length - 1].element.clientHeight,
                    1000)) {
                placeholder.style.top = me._dropZones[me._dropZones.length - 1] + 'px';
                placeholder.index = me.items.length;
                me.el.scrollTop = me.el.scrollHeight;
                return;
            }
        }
    }

    function onRelease(item, x, y, event) {
        // add item to list
        me.items.splice(placeholder.index, 0, item);

        // update positions
        updatePositions();

        // move element in DOM
        me.el.appendChild(item.element)

        // remove placeholder
        me.el.removeChild(placeholder);

        // add transition animation
        item.element.classList.remove("dragging");
    }

    function updatePositions(gap) {
        var newZone = 0;
        me._dropZones = [newZone];
        for (var i in me.items) {
            newZone += me.items[i].element.clientHeight + me.gap;
            me._dropZones.push(newZone);

            var top = (i > 0) ? top + me.items[i - 1].element.clientHeight + (gap || 0) : (gap || 0);
            me.items[i].set(me._left, top);

            if (gap == null) me.items[i].element.style.marginBottom = '0px';
            else me.items[i].element.style.marginBottom = gap + 'px';
        }
    }
};

mylist = new WidgetList(document.getElementById("widget-toolbar"));

// Capture all input to .scrollable elements
(function () {
    var ongoingTouches = [];
    function handleStart(evt) {
        //evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            log("start touch " + i + " " + evt.currentTarget.id);
        }
    }

    function handleMove(evt) {
        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                log("continuing touch " + idx + " " + evt.currentTarget.id);
                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            } else {
                log("can't figure out which touch to continue");
            }
        }
    }

    function handleEnd(evt) {
        //evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);  // remove it; we're done
                log("end touch " + idx + " " + evt.currentTarget.id)
            } else {
                log("can't figure out which touch to end");
            }
        }
    }

    function handleCancel(evt) {
        //evt.preventDefault();
        log("touchcancel.");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }

    function copyTouch(touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }

    function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1;// not found
    }

    var scrollables = document.getElementsByClassName("scrollable");
    for (var i = 0; i < scrollables.length; i++) {
        var el = scrollables[i];
        el.addEventListener("touchstart", handleStart, { passive: false });
        el.addEventListener("touchend", handleEnd, { passive: false });
        el.addEventListener("touchcancel", handleCancel, { passive: false });
        el.addEventListener("touchmove", handleMove, { passive: false });
    }
    log("initialized.");
})();



