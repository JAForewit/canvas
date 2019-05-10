(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Canvas = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES

    // PRIVATE FUNCTIONS

    /*
    usage:
    new Canvas (element, options)
      - or -
    new Canvas (element)
    */
    function Canvas(element, options) {
        var me = this;

        me.pointer = {};
        me.el = element;

        //initialize event handlers
        me.el.addEventListener('touchstart', startHandler, { passive: false });
        me.el.addEventListener('mousedown', startHandler);
    

        function startHandler(e) {
            if (e.type === 'mousedown') {
                me.el.addEventListener('mousemove', moveHandler, { passive: false });
                me.el.addEventListener('mouseup', endHandler);
                me.pointer = { x: e.clientX, y: e.clientY };
            } else {
                me.el.addEventListener('touchmove', moveHandler, { passive: false });
                me.el.addEventListener('touchend', endHandler);
                me.el.addEventListener('touchcancel', endHandler);
                me.pointer = copyTouch(e.targetTouches[0]);
                e.preventDefault();
                e.stopPropagation();
            }

            //handle pointer start

            //FOR DEBUGGING
            log('startHnadler');
        }

        function moveHandler(e) {
            me.pointer = (e.type == 'mousemove')
                ? { x: e.clientX, y: e.clientY }
                : copyTouch(e.targetTouches[0]);

            e.preventDefault();
            e.stopPropagation();

            //handle pointer move

            //FOR DEBUGGING
            log('moveHandler');
        }

        function endHandler(e) {
            if (e.type === 'mouseup') {
                me.el.removeEventListener('mousemove', moveHandler);
                me.el.removeEventListener('mouseup', endHandler);
            } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
                me.el.removeEventListener('touchmove', moveHandler);
                me.el.removeEventListener('touchend', endHandler);
                me.el.removeEventListener('touchcancel', endHandler);
            } else {
                return;
            }

            //handle pointer end

            //FOR DEBUGGING
            log('endHandler');
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }
    }

    return Canvas;
}));