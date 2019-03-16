/*
Draggable Class

Expected: 
---------------------------------------------------------------------------
<div style="position: absolute">    absolutely positioned draggable parent
    <div></div>                     1st child = handle

    whatever...
</div>

Dragging the handler should result in modifying the parent's top and
left style relative to the viewpoert position of the pointer.
---------------------------------------------------------------------------

Properties:
-------------------------------------------------------------------------
ongoingTouches - [] - list  of tracked touch identifiers
isDragging - BOOLEAN - false until touchstart and after touchend/cancel
-------------------------------------------------------------------------

functions:
-------------------------------------------------------------------------------
Constructor - add eventListeners for all touchstart events using startHandler()

startHandler()
    1. record touch.identifier
    2. add appropriate move, end, and cancel eventListeners
    3. set isDragging to true

dragHandler()
    1. check for the correct touch.identifier (same as touchstart)
    2. move draggable parent
        - preventDefault()
        - stopPropagation()

endHandler()
    1. check for correct touch.identifier (same as touchstart)
    2. remove touch from tracked touches list
    3. remove move, end, and cancel eventListeners
-------------------------------------------------------------------------------
*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Draggable = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES

    // PRIVATE FUNCTIONS
    function noop() { };

    /*
    usage:

    new Draggable (element, handle, options)
      - or -
    new Draggable (element, handle)
    */
    function Draggable(element, handle, options) {
        var me = this;
        if (!options) options = {};

        me.el = element;
        me.handle = handle;
        me.handlers = {
            onStart: (options.onStart) ? options.onStart : noop,
            onMove: (options.onMove) ? options.onMove : noop,
            onEnd: (options.onEnd) ? options.onEnd : noop
        };
        me.pointer = {};

        var _posDelta = {},
            _parent = me.el.parentNode;

        function startHandler(e) {
            if (e.type === 'mousedown') {
                window.addEventListener('mousemove', moveHandler, { passive: false });
                window.addEventListener('mouseup', endHandler);
                me.pointer = { x: e.clientX, y: e.clientY };
                // TODO: handle mousedown specifics

            } else if (e.targetTouches) {
                me.handle.addEventListener('touchmove', moveHandler, { passive: false });
                me.handle.addEventListener('touchend', endHandler);
                me.handle.addEventListener('touchcancel', endHandler);
                me.pointer = copyTouch(e.targetTouches[0]);
                // TODO: handle touchstart specifics

            } else {
                return;
            }

            var rect = me.el.getBoundingClientRect();
            _posDelta = {
                x: rect.left - me.pointer.x,
                y: rect.top - me.pointer.y
            };

            document.body.appendChild(me.el);
            updatePosition();
            me.handlers.onStart();
        }

        function moveHandler(e) {

            if (e.type === 'mousemove') {
                me.pointer = { x: e.clientX, y: e.clientY };
                // TODO: handle mousemove
                updatePosition();

            } else if (e.targetTouches) {
                var touches = e.targetTouches;

                for (var i = 0; i < touches.length; i++) {
                    if (touches[i].identifier == me.pointer.identifier) {
                        me.pointer = copyTouch(touches[i]);
                        // TODO: handle touchmove
                        updatePosition();

                        break;
                    }
                }
            } else {
                return;
            }

            me.handlers.onMove();
        }

        function endHandler(e) {
            if (e.type === 'mouseup') {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', endHandler);
                // TODO: handle mouseup

            } else if (e.targetTouches) {
                var touches = e.changedTouches,
                    isDone = (touches.length <= 1);

                for (var i = 0; i < touches.length; i++) {
                    if (touches[i].identifier == me.pointer.identifier) {
                        isDone = true;
                        break;
                    }
                }

                if (!isDone) return;
                me.handle.removeEventListener('touchmove', moveHandler);
                me.handle.removeEventListener('touchend', endHandler);
                me.handle.removeEventListener('touchcancel', endHandler);
                // TODO: handle touchend specifics

            } else {
                return;
            }

            _parent.appendChild(me.el);
            me.pointer = {};
            me.handlers.onEnd();
        }

        function updatePosition() {
            console.log(me.pointer);
            me.el.style.left = _posDelta.x + me.pointer.x + 'px';
            me.el.style.top = _posDelta.y + me.pointer.y + 'px';
        }


        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        // INITIALIZE
        me.handle.addEventListener('touchstart', startHandler);
        me.handle.addEventListener('mousedown', startHandler);
    }

    return Draggable;
}));