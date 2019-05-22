//**********************************
// init THREE.js functions
//**********************************

//scenes
let canvas = document.getElementById('canvas');
let scene = new THREE.Scene(),
    effectsScene = new THREE.Scene();

//camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

//renderer
let renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
let preRenderFunctions = [];

//raycaster
let raycaster = new THREE.Raycaster();
let clipMouse = new THREE.Vector2(1, -1);
let mouse = { x: 1, y: -1 };
function checkIntersection(object) {
    //tranlate to clipspace
    clipMouse.x = (mouse.x / window.innerWidth) * 2 - 1;
    clipMouse.y = -(mouse.y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(clipMouse, camera);

    var intersects = (object != undefined)
        ? [raycaster.intersectObject(object, false)]
        : raycaster.intersectObjects([scene], true);

    return (intersects.length > 0) ? intersects[0] : false;
}

//outline object
let outlineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
let outlineGeo = new THREE.Geometry();
let outline = new THREE.Mesh(outlineGeo, outlineMat);
outline.scale.multiplyScalar(1.1);
let outlinedObjects = [];
let selectedObject; //TODO: remove
function updateOutlines() {
    //TODO: change to "for i in selectedObjects"
    for (var i = 0; i < outlinedObjects.length; i++) {
        //outline objects
    }

    if (selectedObject) {
        outline.geometry = selectedObject.geometry;
        effectsScene.add(outline);
        outline.rotation.set(
            selectedObject.rotation.x,
            selectedObject.rotation.y,
            selectedObject.rotation.z
        );
        outline.position.set(
            selectedObject.position.x,
            selectedObject.position.y,
            selectedObject.position.z
        );
    } else {
        effectsScene.remove(outline);
    }
}
preRenderFunctions.push(updateOutlines);

//window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


//**********************************
// setup scene
//**********************************

//lights
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0.5, 0.5, 1);
scene.add(directionalLight);

//geometry
let geometry = new THREE.IcosahedronGeometry(1, 0);
let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);


//scene.fog = new THREE.FogExp2(0x000000, 0.128)

//controls
//var controls = new THREE.OrbitControls( camera );
//controls.update();

//**********************************
// render loop and game functions
//**********************************

//pointer control
canvas.addEventListener('touchstart', startHandler, { passive: false });
canvas.addEventListener('mousedown', startHandler);
function startHandler(e) {
    if (e.type === 'mousedown') {
        canvas.addEventListener('mousemove', moveHandler, { passive: false });
        canvas.addEventListener('mouseup', endHandler);
        mouse = { x: e.clientX, y: e.clientY };
    } else {
        canvas.addEventListener('touchmove', moveHandler, { passive: false });
        canvas.addEventListener('touchend', endHandler);
        canvas.addEventListener('touchcancel', endHandler);
        mouse = copyTouch(e.targetTouches[0]);
        e.preventDefault();
        e.stopPropagation();
    }
    //handle pointer start
    var intersection = checkIntersection();
    selectedObject = (intersection.object == cube) ? cube : undefined;

}
function moveHandler(e) {
    mouse = (e.type == 'mousemove')
        ? { x: e.clientX, y: e.clientY }
        : copyTouch(e.targetTouches[0]);

    e.preventDefault();
    e.stopPropagation();
    //handle pointer move
    var intersection = checkIntersection();
    selectedObject = (intersection.object == cube) ? cube : undefined;
}
function endHandler(e) {
    if (e.type === 'mouseup') {
        canvas.removeEventListener('mousemove', moveHandler);
        canvas.removeEventListener('mouseup', endHandler);
    } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
        canvas.removeEventListener('touchmove', moveHandler);
        canvas.removeEventListener('touchend', endHandler);
        canvas.removeEventListener('touchcancel', endHandler);
    } else {
        return;
    }
    //handle pointer end
    selectedObject = false;
}
function copyTouch(touch) {
    return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
}

//render loop
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.013;

    //pre render functions
    for (var i = 0; i < preRenderFunctions.length; i++) preRenderFunctions[i]();

    //orbital controls
    //controls.update();

    renderer.render(effectsScene, camera);
    renderer.render(scene, camera);
}
animate();