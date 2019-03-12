// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

(function () {
    var ongoingTouches = [];
    function handleStart(evt) {

        var el = e.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            log("start touch " + i + evt.srcElement.id);
        }
    }

    function handleMove(evt) {

        var el = e.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                log("continuing touch " + idx);
                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            } else {
                log("can't figure out which touch to continue");
            }
        }
    }
    function handleEnd(evt) {
        
        var el = e.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);  // remove it; we're done
                log("end touch " + idx)
            } else {
                log("can't figure out which touch to end");
            }
        }
    }
    function handleCancel(evt) {

        var el = e.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        log("touchcancel.");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
    function copyTouch(touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }
    function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1;    // not found
    }

    document.addEventListener("touchstart", handleStart, false);
    document.addEventListener("touchend", handleEnd, false);
    document.addEventListener("touchcancel", handleCancel, false);
    document.addEventListener("touchmove", handleMove, false);
    log("initialized.");

    /*
    var scrollables = document.getElementsByClassName('scrollable');
    for (var i = 0; i < scrollables.length; i++) {

        var el = scrollables[i];
        el.addEventListener("touchstart", handleStart, false);
        el.addEventListener("touchend", handleEnd, false);
        el.addEventListener("touchcancel", handleCancel, false);
        el.addEventListener("touchmove", handleMove, false);
        log("initialized.");
    }
    */
})();



