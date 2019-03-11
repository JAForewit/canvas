// DO NOT DELETE 
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

/*
// prevent chain scrolling and pull-to-refresh
// all scrollable nodes need the .scrollable class
(function() {
    var selection = {};
    document.addEventListener('touchstart', function (e) {
        selection.el = e.target.closest('.scrollable');
        if (!selection.el || e.touches.length != 1) return;
        selection.lastTouchY = e.changedTouches[0].clientY;
        e.stopPropagation();
    });

    document.addEventListener('touchmove', function (e) {
        if (!selection.el || e.touches.length != 1) { 
            e.preventDefault(); 
            e.stopPropagation(); 
            return; 
        }

        var el = selection.el,
            lastTouchY = selection.lastTouchY;

        var touchY = e.changedTouches[0].clientY,
            atTop = (el.scrollTop === 0),
            atBottom = (el.scrollTop === (el.scrollHeight - el.offsetHeight));

        if ((atTop && touchY > lastTouchY && e.cancelable) ||
            (atBottom && touchY < lastTouchY && e.cancelable)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) { selection = {}; });
    document.addEventListener('touchcancel', function (e) { selection = {}; });
})();*/
function handleOverscroll(event) {
    const delta = -event.deltaY;
    if (delta < 0 && elem.offsetHeight - delta > elem.scrollHeight - elem.scrollTop) {
      elem.scrollTop = elem.scrollHeight;
      event.preventDefault();
      return false;
    }
    if (delta > elem.scrollTop) {
      elem.scrollTop = 0;
      event.preventDefault();
      return false;
    }
    return true;
  }

  document.getElementById('scrollableBox').addEventListener('wheel', handleOverscroll, { passive: false });
  document.getElementById('scrollableBox2').addEventListener('wheel', handleOverscroll, { passive: false });