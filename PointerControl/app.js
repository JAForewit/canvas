// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

(function () {
    var ongoingTouches = [];
    function handleStart(evt) {

        var el = evt.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            log("start touch " + i + " " + el.id);
        }
    }

    function handleMove(evt) {

        var el = evt.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                log("continuing touch " + idx + " " + el.id);
                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            } else {
                log("can't figure out which touch to continue");
            }
        }
    }
    function handleEnd(evt) {

        var el = evt.target.closest('.scrollable');
        if (!el) return;

        evt.preventDefault();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);  // remove it; we're done
                log("end touch " + idx + " " + el.id)
            } else {
                log("can't figure out which touch to end");
            }
        }
    }
    function handleCancel(evt) {

        var el = evt.target.closest('.scrollable');
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

    document.addEventListener("touchstart", handleStart, { passive: false });
    document.addEventListener("touchend", handleEnd, { passive: false });
    document.addEventListener("touchcancel", handleCancel, { passive: false });
    document.addEventListener("touchmove", handleMove, { passive: false });
    log("initialized.");
})();



