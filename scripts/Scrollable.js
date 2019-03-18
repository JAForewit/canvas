(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Scrollable = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES

    // PRIVATE FUNCTIONS

    /*
    usage:
    new Scrollable (element, options)
      - or -
    new Scrollable (element)
    */
    function Scrollable(element, options) {
        var me = this;

    }

    return Scrollable;
}));