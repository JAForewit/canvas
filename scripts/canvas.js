(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Canvas = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES

    // PRIVATE FUNCTIONS

    /*
    usage:
    new Canvas (element, options)
      - or -
    new Canvas (element)
    */
    function Canvas(canvas, options) {
        var me = this;

        //scenes
        var scene = new THREE.Scene();
        var effectsScene = new THREE.Scene();

        //camera
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        //lights
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        //renderer
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;
        var preRenderFunctions = [];

        //raycaster
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2(1,-1);
        var touchedObject = null;

        window.addEventListener('mousemove', onTouchMove);
        window.addEventListener('touchmove', onTouchMove);

        function onTouchMove(e) {

            var x, y;
            if (event.changedTouches) {
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY;
            } else {
                x = event.clientX;
                y = event.clientY;
            }
            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = - (y / window.innerHeight) * 2 + 1;
        }
        function checkIntersection() {
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects([scene], true);
            if (intersects.length > 0) {
                var selectedObject = intersects[0].object;
                touchedObject = selectedObject;
            } else if (touchedObject != null) {
                touchedObject = null;
            }
        }
        preRenderFunctions.push(checkIntersection);

        //window resize
        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        //geometry
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        //outline object
        //CURRENTLY: outline any item hovered over
        var outlineMat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.BackSide});
        var outlineMesh = new THREE.Mesh(cube.geometry, outlineMat);
        outlineMesh.scale.multiplyScalar(1.1);
        function updateOutlines() {
            if (touchedObject) {
                effectsScene.add(outlineMesh);
                outlineMesh.rotation.set(
                    touchedObject.rotation.x, 
                    touchedObject.rotation.y, 
                    touchedObject.rotation.z
                );
            } else if (outlineMesh.parent === effectsScene) {
                effectsScene.remove(outlineMesh);
            }
        }
        preRenderFunctions.push(updateOutlines);

        //render loop
        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.z += 0.01;
            cube.rotation.x += 0.01;

            //pre render functions
            for (var i = 0; i < preRenderFunctions.length; i++) preRenderFunctions[i]();

            renderer.render(effectsScene, camera);
            renderer.render(scene, camera);
        }
        animate();
    } 

    return Canvas;
}));