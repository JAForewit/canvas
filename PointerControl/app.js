
// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b

var prevent = false,
    element = document.getElementById('wrapper');

element.addEventListener('touchstart', function (e) {
    log(event.target.id + " start");
    var scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    prevent = (scrollY === 0);
});

element.addEventListener('touchmove', function (e) {
    log(event.target.id + " move");
    if (prevent) {
        prevent = false;
        e.preventDefault();
    }
}, { passive: false });



// DO NOT DELETE
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
  }