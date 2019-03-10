/*
 * Author: Cyandev(www.github.com/unixzii)
 * Version: 0.1.0
 */
(function () {
	var isReady = false;
	var bodyEl;

	var decelerateFactor = 10;
	var velocityDelta = 20000;
	var initVelocity = 10000;
	var sensitive = 10;

	var Runner = function () {
		this.currentValue = 0;
		this.velocity = 0;
		this.intervalId = null;
		this.isRunning = false;
		this.direction = false;
		this.callback = null;
	}

	Runner.prototype.step = function () {
		this.currentValue += (this.direction ? this.velocity : -this.velocity) / 1000;
		this.velocity += -this.velocity / decelerateFactor;

		if (this.velocity <= 1) {
			this.stop();
		}

		if (this.callback(this.currentValue)) {
			this.stop();
		}
	}

	Runner.prototype.start = function (cb) {
		if (!this.isRunning) {
			this.callback = cb;
			var that = this;
			this.intervalId = setInterval(function () {
				that.step();
			}, 16);
			this.isRunning = true;
		}
	}

	Runner.prototype.stop = function () {
		if (this.isRunning) {
			clearInterval(this.intervalId);
			this.isRunning = false;
			this.velocity = 0;
		}
	}
	var runner = new Runner();
	window['a'] = runner;

	window.onload = function () {
		console.log("load");
		bodyEl = document.getElementsByTagName('body')[0];
		bodyEl.onmousewheel = onWheel;
		bodyEl.addEventListener('touchmove', touchmoveHandler, {passive: false});
		bodyEl.addEventListener('touchstart', setTouchStartPoint);
		isReady = true;
	}


	//My stuff
	let lastTouchY = 0;
	const setTouchStartPoint = event => {
		lastTouchY = event.touches[0].clientY;
	};
	const isScrollingUp = event => {
		const touchY = event.touches[0].clientY;
		const touchYDelta = touchY - lastTouchY;

		lastTouchY = touchY;
		return touchYDelta > 0;

	};
	const isScrollingDown = event => {
		const touchY = event.touches[0].clientY;
		const touchYDelta = touchY - lastTouchY;

		lastTouchY = touchY;
		return touchYDelta < 0;
	};
	var touchmoveHandler = function (e) {
		e.preventDefault();
		runner.currentValue = bodyEl.scrollTop;
		if (runner.isRunning) {
			var d = velocityDelta + runner.velocity / sensitive;

			//touch move direction
			if (isScrollingDown(e) != runner.direction) {
				d *= -1;
			}

			runner.velocity += d;
		} else {
			runner.velocity = initVelocity;
		}
		runner.direction = e.wheelDelta < 0;
		runner.start(doScroll);
	}
	// end my stuff


	var onWheel = function (e) {
		e.preventDefault();

		runner.currentValue = bodyEl.scrollTop;
		if (runner.isRunning) {
			var d = velocityDelta + runner.velocity / sensitive;
			if ((e.wheelDelta < 0) != runner.direction) {
				d *= -1;
			}
			runner.velocity += d;
		} else {
			runner.velocity = initVelocity;
		}
		runner.direction = e.wheelDelta < 0;
		runner.start(doScroll);
	}

	var doScroll = function (v) {
		console.log("do scroll " + v)
		bodyEl.scrollTop = v;
		if (v > bodyEl.scrollHeight || v < 0) {
			return true;
		}
		return false;
	}
})();
