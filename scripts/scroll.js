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
    function Scroll(element, options) {
        var me = this;

        me.el = element;
        me.touch = {};

        var _initialTap = {},
            _initialScroll,
            _velocity,
            _scrolling = false;

        function touchstartHandler(e) {
            if (_scrolling) return;
            me.el.addEventListener('touchmove', touchmoveHandler, { passive: false });
            me.el.addEventListener('touchend', touchendHandler);
            me.el.addEventListener('touchcancel', touchendHandler);

            me.touch = copyTouch(e.targetTouches[0]);
            _initialTap = me.touch;
            _initialScroll = me.el.scrollTop;
            _scrolling = true;
        }

        function touchmoveHandler(e) {
            var touch = copyTouch(e.targetTouches[0]);
            if (touch.identifier != _initialTap.identifier) return;

            var scrollDelta = _initialTap.y - touch.y,
                dy = touch.y - me.touch.y,
                dt = touch.time - me.touch.time;

            me.el.scrollTop = _initialScroll + scrollDelta;
            _velocity = dy / dt;

            me.touch = touch;

            e.preventDefault();
            e.stopPropagation();
        }

        function touchendHandler(e) {
            for (var i = 0; i < e.targetTouches.length; i++) {
                if (e.targetTouches[i].identifier === _initialTap.identifier) return;
            }
            me.el.removeEventListener('touchmove', touchmoveHandler);
            me.el.removeEventListener('touchend', touchendHandler);
            me.el.removeEventListener('touchcancel', touchendHandler);
            _scrolling = false;
            autoScroll();
        }

        function autoScroll() {
            // see: https://stackoverflow.com/questions/1810742/algorithm-to-implement-kinetic-scrolling
            // implement easing function
            // (0.25, 0.1, 0.25, 1) ease function
            // cubic-beizer: f(t) = a(1 - t)^3 + 3b(1 - t)^2 + 3c(1 - t)t^2 + dt^3
            console.log('v: ' + _velocity);
        }

        function copyTouch(touch) {
            return {
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
        }

        me.el.addEventListener('touchstart', touchstartHandler);
    }

    return Scroll;
}));
