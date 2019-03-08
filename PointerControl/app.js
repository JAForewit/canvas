// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b

const preventDefault = e => e.preventDefault();
// When rendering our container
window.addEventListener('touchmove', preventDefault, {
   passive: false
});
// Remember to clean up when removing it
window.removeEventListener('touchmove', preventDefault);



function scrollToPreventBounce(htmlElement) {
    const {scrollTop, offsetHeight, scrollHeight} = htmlElement;
  
    // If at top, bump down 1px
    if (scrollTop <= 0) {
      htmlElement.scrollTo(0, 1);
      return;
    }
  
    // If at bottom, bump up 1px
    if (scrollTop + offsetHeight >= scrollHeight) {
      htmlElement.scrollTo(0, scrollHeight - offsetHeight - 1);
    }
  }
  // When rendering the element
  function afterRender() {
     htmlElement.addEventListener('touchstart', scrollToPreventBounce);
  }
  // Remember to clean-up when removing it
  function beforeRemove() {
     htmlElement.removeEventListener('touchstart', scrollToPreventBounce);
  }



/*var el = document.getElementById("scrollableBox");
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
el.addEventListener("touchcancel", handleCancel, false);
el.addEventListener("touchmove", handleMove, false);
log("initialized.");

var ongoingTouches = [];

function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
    log("start touch " + i + " on " + evt.currentTarget.id);
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      log("continuing touch " + idx + " on " + evt.currentTarget.id);
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
    } else {
      log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);  // remove it; we're done
      log("end touch " + idx + " on " + evt.currentTarget.id)
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
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

function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}*/