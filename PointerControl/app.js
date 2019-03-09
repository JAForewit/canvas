
// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b


function preventPullToRefresh(element) {
    var prevent = false;

    window.addEventListener('touchstart', function(e){
      var scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
      prevent = (scrollY === 0);
    });

    window.addEventListener('touchmove', function(e){
      if (prevent) {
        prevent = false;
        e.preventDefault();
      }
    }, { passive: false });
  }

  preventPullToRefresh('html') // pass #id or html tag into the method