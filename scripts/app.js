// prevent chain scrolling and pull-to-refresh
// all scrollable nodes need the .scrollable class
(function() {
    var selection = {};
    document.addEventListener('touchstart', function (e) {
        selection.el = e.target.closest('.scrollable');
        if (!selection.el || e.touches.length != 1) return;
        selection.lastTouchY = e.changedTouches[0].clientY;
        e.stopPropagation();
    });

    document.addEventListener('touchmove', function (e) {
        if (!selection.el || e.touches.length != 1) { 
            e.preventDefault(); 
            e.stopPropagation(); 
            log("cancled");
            return; 
        }

        var el = selection.el,
            lastTouchY = selection.lastTouchY;

        var touchY = e.changedTouches[0].clientY,
            atTop = (el.scrollTop === 0),
            atBottom = (el.scrollTop === (el.scrollHeight - el.offsetHeight));

        if ((atTop && touchY > lastTouchY && e.cancelable) ||
            (atBottom && touchY < lastTouchY && e.cancelable)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) { selection = {}; log(""); });
    document.addEventListener('touchcancel', function (e) { selection = {}; });
})();

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

// widget toolbar
mylist = new WidgetList(document.getElementById("widget-toolbar"));

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