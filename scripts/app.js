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
    me.threshold = 20;      // drop zone threshold

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
        // set initial position
        var top = (i > 0) ? top + me.el.children[i - 1].clientHeight : 0;
        item.set(0, top);

        me.items.push(item);
    };

    // create placeholder element
    var placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    function onGrab(item, x, y, e) {
        // prevent transition animation while dragging
        item.element.style.transition = "none";

        // insert placeholder
        var rect = item.element.getBoundingClientRect();;
        placeholder.style.top = rect.top + 'px';
        placeholder.style.left = rect.left + 'px';
        me.el.appendChild(placeholder);

        // remove item list and update positions of items
        me.items.splice(me.items.indexOf(item), 1);
    };

    function onDrag(item, x, y, e) {
        var mX = (e.targetTouches ? e.targetTouches[0] : e).clientX,
            mY = (e.targetTouches ? e.targetTouches[0] : e).clientY

        function inThreshold(top, left, width) {
            return (mX < left + width &&
                mY > top - me.threshold &&
                mY < top + me.threshold);
        }

        for (var i = 0; i < me.items.length; i++) {
            if (me.items[i] !== item) {
                var rect = me.items[i].element.getBoundingClientRect();
                if (inThreshold(rect.top, rect.left, rect.width)) {
                    // move placeholder to new drop zone
                    placeholder.style.top = rect.top + 'px';
                    placeholder.style.left = rect.left + 'px';
                    placeholder.index = i;
                    break;
                }
                if (i == me.items.length - 1 &&
                    inThreshold(rect.bottom, rect.left, rect.width)) {
                    // move placeholder to new drop zone
                    placeholder.style.top = rect.bottom + 'px';
                    placeholder.style.left = rect.left + 'px';
                    placeholder.index = me.items.length;
                    break;
                }
            }
        }
    };

    function onRelease(item, x, y, event) {
        // add transition animation
        item.element.style.transition = "ease-out 0.1s";
    
        // add item to list
        me.items.splice(placeholder.index, 0, item);

        // TODO update positions
        var rect = placeholder.getBoundingClientRect();
        item.set(rect.left, rect.top);

         // remove placeholder
         me.el.removeChild(placeholder);
    };
};