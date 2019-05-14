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

    /*
    function cubicBezier(t, p1, p2) {
        return 3 * p1 * (1 - 2 * t + t * t) + 3 * p2 * t * t * (1 - t) + t * t * t;
    }

    function ease(t) {
        return 0.3 * t + 2.4 * t * t - 1.7 * t * t * t;
    }
    */

    function Scroll(element, options) {
        var me = this;

        me.el = element;
        me.touch = {};

        var _initialTouch = {},
            _initialScrollTop,
            _scrolling = false;

        function touchstartHandler(e) {
            if (_scrolling) return;
            me.el.addEventListener('touchmove', touchmoveHandler);
            me.el.addEventListener('touchend', touchendHandler);
            me.el.addEventListener('touchcancel', touchendHandler);

            _initialTouch = copyTouch(e.touches[0]);
            _initialScrollTop = me.el.scrollTop;
            _scrolling = true;
        }

        function touchmoveHandler(e) {
            if (e.touches[0].identifier != _initialTouch.identifier) return;
            me.el.scrollTop = _initialScrollTop + _initialTouch.y - e.touches[0].clientY;
        }

        function touchendHandler(e) {
            if (e.changedTouches[0].identifier == _initialTouch.identifier
                || e.touches.length == 0 || e.type == 'touchcancel') {

                me.el.removeEventListener('touchmove', touchmoveHandler);
                me.el.removeEventListener('touchend', touchendHandler);
                me.el.removeEventListener('touchcancel', touchendHandler);
                _scrolling = false;
            }
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        me.el.addEventListener('touchstart', touchstartHandler);
    }

    return Scroll;
}));