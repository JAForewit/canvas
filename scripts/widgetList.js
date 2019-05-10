// widget list
function WidgetList(el) {
    var me = this;

    me.el = el;             // list element
    me.items = [];          // draggable items
    me.gap = 10;            // gap between items on drag

    var _left = el.clientLeft,
        _width = el.clientWidth,
        _dropZones = [];

    // Initialize el children as items in the list
    for (var i = 0; i < me.el.children.length; i++) {
        if (me.el.children[i].classList.contains("widget")) {
            var element = me.el.children[i],
                options = {
                    handle: element.children[0],
                    onEnd: onRelease,
                    onStart: onGrab,
                    onMove: onDrag
                },
                item = new Drag(element, options);
            me.items.push(item);
        }
    }
    updatePositions();

    // create placeholder element
    var placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.left = _left + 'px';
    placeholder.style.height = me.gap + 'px';

    function onGrab(item) {
        // remove item
        var itemIndex = me.items.indexOf(item);
        me.items.splice(itemIndex, 1);
        updatePositions(me.gap);

        // insert placeholder
        placeholder.index = itemIndex;
        placeholder.style.top = _dropZones[itemIndex] + 'px';
        me.el.appendChild(placeholder);
    }

    function onDrag(item, x, y) {
        function inDropZone(top, above, below) {
            return (x < _left + _width &&
                y > top - above / 2 && //me.threshold = above
                y < top + below / 2); //me.threshold = below
        }

        if (me.items.length == 0) {
            return;
        } else {
            // check first drop zone
            if (placeholder.index != 0 &&
                inDropZone(
                    _dropZones[0] - me.el.scrollTop,
                    1000,
                    me.items[0].el.clientHeight)) {
                placeholder.style.top = _dropZones[0] + 'px';
                placeholder.index = 0;
                me.el.scrollTop = 0;
                return;
            }
            // check middle drop zones
            for (var i = 1; i < me.items.length; i++) {
                if (placeholder.index != i &&
                    inDropZone(
                        _dropZones[i] - me.el.scrollTop,
                        me.items[i - 1].el.clientHeight,
                        me.items[i].el.clientHeight)) {
                    placeholder.style.top = _dropZones[i] + 'px';
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
                    _dropZones[_dropZones.length - 1] - me.el.scrollTop,
                    me.items[me.items.length - 1].el.clientHeight,
                    1000)) {
                placeholder.style.top = _dropZones[_dropZones.length - 1] + 'px';
                placeholder.index = me.items.length;
                me.el.scrollTop = me.el.scrollHeight;
                return;
            }
        }
    }

    function onRelease(item) {
        // add item to list
        me.items.splice(placeholder.index, 0, item);

        // update positions
        updatePositions();

        // remove placeholder
        me.el.removeChild(placeholder);
    }

    function updatePositions(gap) {
        var newZone = 0;
        _dropZones = [newZone];
        for (var i in me.items) {
            newZone += me.items[i].el.clientHeight + me.gap;
            _dropZones.push(newZone);

            var top = (i > 0) ? top + me.items[i - 1].el.clientHeight + (gap || 0) : (gap || 0);

            me.items[i].el.style.left = _left + 'px';
            me.items[i].el.style.top = top + 'px';

            if (gap == null) me.items[i].el.style.marginBottom = '0px';
            else me.items[i].el.style.marginBottom = gap + 'px';
        }
    }
};