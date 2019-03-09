// see: https://medium.com/turo-engineering/ios-mobile-scroll-in-web-react-1d92d910604b

// "fixed-element" is the class of the overlay (fixed element) what has "position: fixed"
// Call disableScroll() and enableScroll() to toggle

var freeze = function (e) {
    if (!document.getElementsByClassName("fixed-element")[0].contains(e.target)) {
        e.preventDefault();
    }
}

var disableScroll = function () {
    document.body.style.overflow = "hidden"; // Or toggle using class: document.body.className += "overflow-hidden-class";

    // Only accept touchmove from fixed-element
    document.addEventListener('touchmove', freeze, false);

    // Prevent background scrolling
    document.getElementsByClassName("fixed-element")[0].addEventListener("touchmove", function (e) {
        var top = this.scrollTop,
            totalScroll = this.scrollHeight,
            currentScroll = top + this.offsetHeight;

        if (top === 0 && currentScroll === totalScroll) {
            e.preventDefault();
        } else if (top === 0) {
            this.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
            this.scrollTop = top - 1;
        }
    });
}

var enableScroll = function () {
    document.removeEventListener("touchmove", freeze);
    document.body.style.overflow = "";
}

disableScroll();