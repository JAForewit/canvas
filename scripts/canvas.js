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

        //Setup scene
        var scene = new Scene(canvas); // REQUIRES: gl-scene

        var camera = new Camera(
            glMatrix.toRadian(45) * (canvas.clientHeight / 800),
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100.0
        );
        camera.orient(
            [-5, 0, 10],
            [0, 0, 0],
            [0, 1, 0]
        );

        var pointLight = new PointLight(
            [0, 0, 0],
            [0, 0, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1.0, 0.045, 0.0075]
        );
        scene.Add(pointLight);
        var sphere = new Model(
            './models/sphere.json',
            './models/sphere.png',
            './models/sphere_specular.png',
            function () {
                scene.Add(sphere);
                sphere.setPosition(pointLight.position);
            }
        );

        var pointLight2 = new PointLight(
            [3, 0, -3],
            [0, 0, 0],
            [0, 1, 1],
            [0, 1, 1],
            [1.0, 0.045, 0.0075]
        );
        scene.Add(pointLight2);
        var sphere2 = new Model(
            './models/sphere.json',
            './models/sphere.png',
            './models/sphere_specular.png',
            function () {
                scene.Add(sphere2);
                sphere2.setPosition(pointLight2.position);
            }
        );

        var c1 = new Model(
            './models/cube.json',
            './models/cube.png',
            './models/cube_specular.png',
            function () {
                scene.Add(c1);
                c1.setPosition([0, -3, 0]);
                c1.shine = 100;
            }
        );
        var c2 = new Model(
            './models/cube.json',
            './models/cube.png',
            './models/cube_specular.png',
            function () {
                scene.Add(c2);
                c2.setPosition([3, 0, 0]);
                c2.shine = 100;
            }
        );

        function resize() {
            if (canvas.width != canvas.clientWidth ||
                canvas.height != canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;

                camera.update(
                    glMatrix.toRadian(45) * (canvas.clientHeight / 800),
                    canvas.clientWidth / canvas.clientHeight,
                    0.1,
                    100.0
                );
            }
        }

        var t0 = performance.now();
        var animate = function (time) {
            var perSec = (performance.now() - t0) / 1000;
            resize();

            mat4.rotate(
                c1.world,
                c1.world,
                glMatrix.toRadian(20) * perSec,
                [1, 0, 0]
            )
            mat4.rotate(
                c2.world,
                c2.world,
                glMatrix.toRadian(20) * perSec,
                [0, 1, 0]
            )
            if (camera.position[2] > -10) {
                camera.position[2] -= 1 * perSec;
                camera.orient(camera.position, [0, 0, 0], [0, 1, 0]);
            }

            scene.Render(camera);
            t0 = performance.now();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);


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