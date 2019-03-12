// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}


// Capture all input to .scrollable elements
(function () {
    var ongoingTouches = [];
    function handleStart(evt) {
        evt.stopPropagation();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
            log("start touch " + i + " " + evt.currentTarget.id);
        }
    }

    function handleMove(evt) {
        evt.stopPropagation();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                log("continuing touch " + idx + " " + evt.currentTarget.id);
                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            } else {
                log("can't figure out which touch to continue");
            }
        }
    }

    function handleEnd(evt) {
        evt.stopPropagation();
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);  // remove it; we're done
                log("end touch " + idx + " " + evt.currentTarget.id)
            } else {
                log("can't figure out which touch to end");
            }
        }
    }

    function handleCancel(evt) {
        evt.stopPropagation();
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

    var scrollables = document.getElementsByClassName("scrollable");
    for (var i = 0; i < scrollables.length; i++) {
        var el = scrollables[i];
        el.addEventListener("touchstart", handleStart, { passive: true });
        el.addEventListener("touchend", handleEnd, { passive: true });
        el.addEventListener("touchcancel", handleCancel, { passive: true });
        el.addEventListener("touchmove", handleMove, { passive: true });
    }
    log("initialized.");

})();



