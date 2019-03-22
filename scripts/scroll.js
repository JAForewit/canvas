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

    // TODO: catch scroll event while scrolling

    function Scroll(element, options) {
        var me = this;

        me.el = element;
        me.touch = {};

        var _initialTouch = {},
            _scrolling = false,
            _offset;

        function touchstartHandler(e) {
            if (_scrolling) return;
            me.el.addEventListener('touchmove', touchmoveHandler);
            me.el.addEventListener('touchend', touchendHandler);
            me.el.addEventListener('touchcancel', touchendHandler);

            me.touch = copyTouch(e.touches[0]);
            _initialTouch = me.touch;
            _scrolling = true;
        }

        function touchmoveHandler(e) {
            if (e.touches[0].identifier != _initialTouch.identifier) return;

            var touch = copyTouch(e.touches[0]);
            _offset = me.touch.y - touch.y;
            me.el.scrollTop += _offset;
            me.touch = touch;
        }

        function touchendHandler(e) {
            if (e.changedTouches[0].identifier == _initialTouch.identifier
                || e.touches.length == 0 || e.type == 'touchcancel') {

                me.el.removeEventListener('touchmove', touchmoveHandler);
                me.el.removeEventListener('touchend', touchendHandler);
                me.el.removeEventListener('touchcancel', touchendHandler);

                _scrolling = false;

                var event = new MouseEvent( "scroll",{delta: -650} );
                me.el.dispatchEvent(event);
            }
        }
        function cubicBezier(t, p1, p2) {
            return 3 * p1 * (1 - 2 * t + t * t) + 3 * p2 * t * t * (1 - t) + t * t * t;
        }

        function ease(t) {
            return 0.3 * t + 2.4 * t * t - 1.7 * t * t * t;
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        me.el.addEventListener('touchstart', touchstartHandler);
    }

    return Scroll;
}));