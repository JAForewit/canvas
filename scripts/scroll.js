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

        var velocity = 40;

        requestAnimationFrame(autoScroll);
        function autoScroll() {
            velocity *= 0.95;
            me.el.scrollTop += velocity;
            if (velocity < 0.2) {
                me.el.scrollTop = 0;
                velocity = 40;
            }
            requestAnimationFrame(autoScroll);
        }




    }

    return Scroll;
}));