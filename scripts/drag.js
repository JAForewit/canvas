(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Drag = factory();
    }
}(this, function () {
    'use strict';
    function Drag(element, options) {
        var me = this;
        if (!options) options = {};

        me.el = element;
        me.handle = (options.handle) ? options.handle : me.el;
        me.handlers = {
            onStart: (options.onStart) ? options.onStart : noop,
            onMove: (options.onMove) ? options.onMove : noop,
            onEnd: (options.onEnd) ? options.onEnd : noop
        };
        me.pointer = {};

        var _dimensions = {},
            _parent = me.el.parentNode;

        function startHandler(e) {
            if (e.type === 'mousedown') {
                window.addEventListener('mousemove', moveHandler, { passive: false });
                window.addEventListener('mouseup', endHandler);
                me.pointer = { x: e.clientX, y: e.clientY };
            } else {
                me.handle.addEventListener('touchmove', moveHandler, { passive: false });
                me.handle.addEventListener('touchend', endHandler);
                me.handle.addEventListener('touchcancel', endHandler);
                me.pointer = copyTouch(e.targetTouches[0]);
                e.preventDefault();
                e.stopPropagation();
            }

            var rect = me.el.getBoundingClientRect();
            _dimensions = {
                x: rect.left - me.pointer.x,
                y: rect.top - me.pointer.y,
                width: me.el.style.width,
                height: me.el.style.height,
                zIndex: me.el.style.zIndex
            };

            document.body.appendChild(me.el);
            me.el.style.width = rect.width + 'px';
            me.el.style.height = rect.height + 'px';
            me.el.style.zIndex = 1000;

            updatePosition();
            me.handlers.onStart();
        }

        function moveHandler(e) {
            me.pointer = (e.type == 'mousemove')
                ? { x: e.clientX, y: e.clientY }
                : copyTouch(e.targetTouches[0]);

            e.preventDefault();
            e.stopPropagation();
            updatePosition();
            me.handlers.onMove();
        }

        function endHandler(e) {
            if (e.type === 'mouseup') {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', endHandler);
            } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
                me.handle.removeEventListener('touchmove', moveHandler);
                me.handle.removeEventListener('touchend', endHandler);
                me.handle.removeEventListener('touchcancel', endHandler);
            } else {
                return;
            }

            _parent.appendChild(me.el);
            me.el.style.width = _dimensions.width;
            me.el.style.height = _dimensions.height;
            me.el.style.zIndex = _dimensions.zIndex;
            me.handlers.onEnd();
        }

        function updatePosition() {
            me.el.style.left = _dimensions.x + me.pointer.x + 'px';
            me.el.style.top = _dimensions.y + me.pointer.y + 'px';
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        function noop() { };

        me.handle.addEventListener('touchstart', startHandler, { passive: false });
        me.handle.addEventListener('mousedown', startHandler);
    }

    return Drag;
}));