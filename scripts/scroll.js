(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Scroll = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES

    // PRIVATE FUNCTIONS

    /*
    usage:
    new Scroll (element, options)
      - or -
    new Scroll (element)
    */
    function Scroll(element, options) {
        var me = this;

        me.el = element;
        me.touch = {};

        var _velocity = 0;

        function touchstartHandler(e) {
            me.el.addEventListener('touchmove', touchmoveHandler, { passive: false });
            me.el.addEventListener('touchend', touchendHandler);
            me.el.addEventListener('touchcancel', touchendHandler);
            me.touch = copyTouch(e.targetTouches[0]);
            e.preventDefault();
            e.stopPropagation();
            updateScroll();
        }

        function touchmoveHandler(e) {
            var delta = copyTouch(e.targetTouches[0]);
            updateScroll(delta);
            me.touch = delta;

            e.preventDefault();
            e.stopPropagation();
        }

        function touchendHandler(e) {
            if (e.targetTouches.length != 0 && e.targetTouches[0].identifier == me.touch.identifier) return;
            me.handle.removeEventListener('touchmove', moveHandler);
            me.handle.removeEventListener('touchend', endHandler);
            me.handle.removeEventListener('touchcancel', endHandler);
        }

        function updateScroll(delta) {
            // update position scroll
            // see: https://stackoverflow.com/questions/1810742/algorithm-to-implement-kinetic-scrolling
        
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        me.el.addEventListener('touchstart', touchstartHandler, { passive: false });
    }

    return Scroll;
}));