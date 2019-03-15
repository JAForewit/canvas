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
    var util = {
        addEvent: ('attachEvent' in Element.prototype)
            ? function (element, e, fn) { element.attachEvent('on' + e, fn) }
            : function (element, e, fn) { element.addEventListener(e, fn, false) },

        removeEvent: ('attachEvent' in Element.prototype)
            ? function (element, e, fn) { element.detachEvent('on' + e, fn) }
            : function (element, e, fn) { element.removeEventListener(e, fn) }
    }

    /*
    usage:

    new Draggable (element, handle, options)
      - or -
    new Draggable (element, handle)
    */
    function Draggable(element, handle, options) {
        var me = this;

        me.el = element;
        me.handle = handle;
        me.ongoingPointers = [];
        me.status = 'init';
        me.handlers = {
            start: function () {
                // record touch.identifier

                // add appropriate move, end, and cancel eventListeners

                // set isDragging to true

            },
            move: function () {
                // check for the correct touch.identifier (same as touchstart)

                // move draggable parent
                //  - preventDefault()
                //  - stopPropagation()

            },
            end: function () {
                // check for correct touch.identifier (same as touchstart)

                // remove touch from tracked touches list

                // remove move, end, and cancel eventListeners

            }
        };

        // INITIALIZE
        util.addEvent(handle, 'touchmove', me.handlers.start);
        util.addEvent(handle, 'mousedown', me.handlers.start);
        me.status = 'start'; 
    }

    return Draggable;
}));