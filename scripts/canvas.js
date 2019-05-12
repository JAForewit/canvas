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

        //scene
        var scene = new THREE.Scene();
        
        //camera
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        //lights
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0,0,1);
        scene.add(directionalLight);
        
        //renderer
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById('canvas'),
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        //geometry
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
        var cube = new THREE.Mesh( geometry, material );
        scene.add(cube);

        //render loop
        function animate() {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        }
        animate();

        //initialize pointer control
        me.pointer = {}; 

        canvas.addEventListener('touchstart', startHandler, { passive: false });
        canvas.addEventListener('mousedown', startHandler);

        function startHandler(e) {
            if (e.type === 'mousedown') {
                canvas.addEventListener('mousemove', moveHandler, { passive: false });
                canvas.addEventListener('mouseup', endHandler);
                me.pointer = { x: e.clientX, y: e.clientY };
            } else {
                canvas.addEventListener('touchmove', moveHandler, { passive: false });
                canvas.addEventListener('touchend', endHandler);
                canvas.addEventListener('touchcancel', endHandler);
                me.pointer = copyTouch(e.targetTouches[0]);
                e.preventDefault();
                e.stopPropagation();
            }

            //handle pointer start

            //FOR DEBUGGING
            log('startHnadler');
        }

        function moveHandler(e) {
            me.pointer = (e.type == 'mousemove')
                ? { x: e.clientX, y: e.clientY }
                : copyTouch(e.targetTouches[0]);

            e.preventDefault();
            e.stopPropagation();

            //handle pointer move

            //FOR DEBUGGING
            log('moveHandler');
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

            //FOR DEBUGGING
            log('endHandler');
        }

        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }
    }

    return Canvas;
}));