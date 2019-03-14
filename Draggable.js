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

    // PROPERTIES
    var defaults = {
    }

    // PRIVATE FUNCTIONS

    /*
    usage:

    new Draggable (element, options)
      - or -
    new Draggable (element)
    */
    function Draggable(element, options) {
        var me = this;

    }

    return Draggable;
}));