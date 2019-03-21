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

        var _initialTouch = {},
            _initialScrollTop,
            _scrolling = false,
            _ticker,
            _offset,
            _velocity,
            _timestamp;

        function touchstartHandler(e) {
            if (_scrolling) return;
            me.el.addEventListener('touchmove', touchmoveHandler, { passive: false });
            me.el.addEventListener('touchend', touchendHandler);
            me.el.addEventListener('touchcancel', touchendHandler);

            me.touch = copyTouch(e.touches[0]);
            _initialTouch = me.touch;
            _initialScrollTop = me.el.scrollTop;
            _scrolling = true;
            _timestamp = Date.now();
            _velocity = 0;
            _offset = 0;

            clearInterval(_ticker);
            _ticker = setInterval(track, 100);
        }

        function touchmoveHandler(e) {
            if (e.touches[0].identifier != _initialTouch.identifier) return;
            
            var touch = copyTouch(e.touches[0]);
            _offset += me.touch.y - touch.y;
            me.el.scrollTop = _initialScrollTop + _initialTouch.y - touch.y;
            me.touch = touch;

            e.preventDefault();
            e.stopPropagation();
        }

        function touchendHandler(e) {
            if (e.changedTouches[0].identifier == _initialTouch.identifier
                || e.touches.length == 0 || e.type == 'touchcancel') {

                me.el.removeEventListener('touchmove', touchmoveHandler);
                me.el.removeEventListener('touchend', touchendHandler);
                me.el.removeEventListener('touchcancel', touchendHandler);
                
                _scrolling = false;
                clearInterval(_ticker);
                requestAnimationFrame(autoScroll);
            }
        }

        function autoScroll() {
            // Kinetic Scrolling Tutorial: https://github.com/ariya/kinetic
            // see: https://stackoverflow.com/questions/1810742/algorithm-to-implement-kinetic-scrolling

        }

        function track() {
            var now, elapsed, v;
            now = Date.now();
            elapsed = now - _timestamp;
            _timestamp = now;

            v = 100 * _offset / elapsed;
            _velocity = Math.round(0.8 * v + 0.2 * _velocity);
            log(_velocity);

            _offset = 0;
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
