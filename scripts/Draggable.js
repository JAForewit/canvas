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
    function noop() { };

    function Draggable(element, options) {
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

        var _state = {},
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
            _state = {
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

            e.preventDefault();
            e.stopPropagation();
            updatePosition();
            me.handlers.onStart();
        }

        function moveHandler(e) {
            me.pointer = (e.type === 'mousemove') ? { x: e.clientX, y: e.clientY } 
                : (e.targetTouches) ?  copyTouch(e.targetTouches[0]) : me.pointer;

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
            me.el.style.width = _state.width;
            me.el.style.height = _state.height;
            me.el.style.zIndex = _state.zIndex;
            me.handlers.onEnd();
        }

        function updatePosition() {
            me.el.style.left = _state.x + me.pointer.x + 'px';
            me.el.style.top = _state.y + me.pointer.y + 'px';
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        me.handle.addEventListener('touchstart', startHandler, { passive: false });
        me.handle.addEventListener('mousedown', startHandler);
    }

    return Draggable;
}));