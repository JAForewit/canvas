// Function to disable "pull-to-refresh" effect present in some webviews.
// Especially Crosswalk 12 and above (Chromium 41+) runtimes.

window.addEventListener('load', function() {
    var lastTouchY = 0 ;
    var maybePreventPullToRefresh = false ;

    // Pull-to-refresh will only trigger if the scroll begins when the
    // document's Y offset is zero.

    var touchstartHandler = function(e) {
        if( e.touches.length != 1 ) {             
            return ;
        }
        lastTouchY = e.touches[0].clientY ;
        // maybePreventPullToRefresh = (preventPullToRefreshCheckbox.checked) && (window.pageYOffset == 0) ;
        maybePreventPullToRefresh = (window.pageYOffset === 0) ;
        //document.getElementById('txtLog').textContent = "maybePreventPullToRefresh: " + maybePreventPullToRefresh;
    };

    // To suppress pull-to-refresh it is sufficient to preventDefault the
    // first overscrolling touchmove.

    var touchmoveHandler = function(e) {
        var touchY = e.touches[0].clientY ;
        var touchYDelta = touchY - lastTouchY ;
        lastTouchY = touchY ;

        if (maybePreventPullToRefresh) {
            maybePreventPullToRefresh = false ;
            if (touchYDelta >= 0) {
                e.preventDefault() ;
               log("pull-to-refresh event detected" + touchYDelta) ;
                return ;
            }
        }

        // if (preventScrollCheckbox.checked) {
        //     e.preventDefault() ;
        //     return ;
        // }

        // if (preventOverscrollGlowCheckbox.checked) {
        //     if (window.pageYOffset == 0 && touchYDelta > 0) {
        //         e.preventDefault() ;
        //         return ;
        //     }
        // }
    };

    document.addEventListener('touchstart', touchstartHandler, false) ;
    document.addEventListener('touchmove', touchmoveHandler, {passive: false}) ;
}) ;

// DO NOT DELETE
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
  }