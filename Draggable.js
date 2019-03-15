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
            onEnd: (options.onEnd) ? options.onEnd : noop };
        me.ongoingTouches = [];
        me.mouse = {};

        function start(e) {
            if (e.type === 'mousedown') {
                me.mouse = { x: e.clientX, y: e.clientY };
                window.addEventListener('mousemove', drag, { passive: false });
                window.addEventListener('mouseup', end);
                console.log('mousedown');
                // TODO: handle mousedown

            } else if (e.targetTouches) {
                var touches = e.targetTouches;

                for (var i = 0; i < touches.length; i++) {
                    me.ongoingTouches.push(copyTouch(touches[i]));
                    console.log("start touch " + i);
                    // TODO: handle touchstart

                }

                me.handle.addEventListener('touchmove', drag, { passive: false });
                me.handle.addEventListener('touchend', end);
                me.handle.addEventListener('touchcancel', end);
            }

            me.handlers.onStart();
        }

        function drag(e) {

            if (e.type === 'mousemove') {
                console.log('mousemove')
                // TODO: handle mouse move

            } else if (e.targetTouches) {
                var touches = e.targetTouches;

                for (var i = 0; i < touches.length; i++) {
                    var idx = ongoingTouchIndexById(touches[i].identifier);

                    if (idx >= 0) {
                        me.ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
                        console.log("continuing touch " + idx);
                        // TODO: handle touch move

                    } else {
                        console.log("can't figure out which touch to continue");
                    }
                }
            }

            me.handlers.onMove();
        }

        function end(e) {
            if (e.type === 'mouseup') {
                console.log('mouseup, removed mouse listeners');
                window.removeEventListener('mousemove', drag);
                window.removeEventListener('mouseup', end);
                // TODO: handle mouseup

            } else if (e.targetTouches) {
                var touches = e.changedTouches;

                for (var i = 0; i < touches.length; i++) {
                    var idx = ongoingTouchIndexById(touches[i].identifier);

                    if (idx >= 0) {
                        me.ongoingTouches.splice(idx, 1);  // remove it; we're done
                        console.log("end touch " + idx)
                        // TODO: handle touchend/cancel

                    } else {
                        console.log("can't figure out which touch to end");
                    }
                }
                if (touches.length == 1) {
                    me.handle.removeEventListener('touchmove', drag);
                    me.handle.removeEventListener('touchend', end);
                    me.handle.removeEventListener('touchcancel', end);
                    console.log('removed touch listeners');
                }
            }

            me.handlers.onEnd();
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
        }

        function ongoingTouchIndexById(idToFind) {
            for (var i = 0; i < me.ongoingTouches.length; i++) {
                var id = me.ongoingTouches[i].identifier;
    
                if (id == idToFind) {
                    return i;
                }
            }
            return -1; // not found
        }

        // INITIALIZE
        me.handle.addEventListener('touchstart', start);
        me.handle.addEventListener('mousedown', start);
    }

    return Draggable;
}));