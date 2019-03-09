
// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b


function preventPullToRefresh(element) {
    var prevent = false;

    document.querySelector(element).addEventListener('touchstart', function(e){
      if (e.touches.length !== 1) { return; }

      var scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
      prevent = (scrollY === 0);
    });

    document.querySelector(element).addEventListener('touchmove', function(e){
      if (prevent) {
        prevent = false;
        e.preventDefault();
      }
    });
  }

  preventPullToRefresh('html') // pass #id or html tag into the method