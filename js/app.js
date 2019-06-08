//FOR DEBUGGING
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg;
}

//setup toolbar toggle buttons
function toggleWidgetToolbar() {
    document.getElementById("widget-toolbar").classList.toggle("open");
    document.getElementById("nav-icon").classList.toggle("open");
}
function togglePrefToolbar() {
    document.getElementById("pref-toolbar").classList.toggle("open");
    document.getElementById("nav-icon2").classList.toggle("open");
}

/*
//prevent all un-handled touchmove events
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });
*/

//init widget list with draggable elements
var widgetToolbar = new widgetToolbar(document.getElementById("widget-toolbar"));

//init scrollable elements
for (var i = 0; i < document.getElementsByClassName('scrollable').length; i++) {
    var scrollEl = document.getElementsByClassName('scrollable')[i],
        options = {};
    var scrollable = new Scroll(scrollEl, options);
}

//THREE.Cache.enabled = true;
var loader = new THREE.FileLoader();
loader.load('./resources/pref.json', success, progress, error);

function error(err) { console.error('An error happened'); };
function progress(xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); };
function success(data) {
    var json = null;
    try { json = JSON.parse(data); }
    catch (err) { error(err); return; }

    //load Canvas
    var newCanvas = new gg.Canvas(json);
};