// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b

const preventDefault = e => e.preventDefault();
// When rendering our container
window.addEventListener('touchmove', preventDefault, {
    passive: false
});

function scrollToPreventBounce(htmlElement) {
    const { scrollTop, offsetHeight, scrollHeight } = htmlElement;

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
document.getElementById("scrollableBox").addEventListener('touchstart', scrollToPreventBounce);

/*
// Remember to clean up when removing it
window.removeEventListener('touchmove', preventDefault);
  // Remember to clean-up when removing it
  function beforeRemove() {
    document.getElementById("scrollableBox").removeEventListener('touchstart', scrollToPreventBounce);
  }
*/