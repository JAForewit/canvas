var gg = {
    //GLOBAL properties
};

gg.Canvas = function (config) {
    //must include <canvas id="canvas"></canavs>
    this.canvas = document.getElementById('canvas');

    //scenes
    this.scene = new THREE.Scene();
    this.effectsScene = new THREE.Scene();

    //camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 150, 0);
    this.camera.lookAt(0, 0, 0);

    //renderer
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;

    //raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = { x: 1, y: -1 };
    this.clipMouse = new THREE.Vector2(1, -1);

    //outline object
    this.outlineMesh = new THREE.Mesh(
        new THREE.Geometry(),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide })
    );
    this.outlineMesh.scale.multiplyScalar(1.1);
    this.selectedObject; //TODO: replace with OutlinedObjects

    //AxesHelper
    this.axesHelper = new THREE.AxesHelper(100);
    this.scene.add(this.axesHelper);

    //controls
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enableRotate = false;
    this.controls.enableKeys = false;
    this.controls.update();

    //setup scene
    this.init(config);
};

gg.Canvas.prototype = {
    checkIntersection: function (object) {
        //tranlate to clipspace
        this.clipMouse.x = (this.mouse.x / window.innerWidth) * 2 - 1;
        this.clipMouse.y = -(this.mouse.y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.clipMouse, this.camera);

        var intersects = (object != undefined)
            ? [this.raycaster.intersectObject(object, false)]
            : this.raycaster.intersectObjects([this.scene], true);

        return (intersects.length > 0) ? intersects[0] : false;
    },

    updateOutlines: function () {
        if (this.selectedObject) {
            this.outlineMesh.geometry = this.selectedObject.geometry;
            this.effectsScene.add(this.outlineMesh);
            this.outlineMesh.rotation.set(
                this.selectedObject.rotation.x,
                this.selectedObject.rotation.y,
                this.selectedObject.rotation.z
            );
            this.outlineMesh.position.set(
                this.selectedObject.position.x,
                this.selectedObject.position.y,
                this.selectedObject.position.z
            );
        } else {
            this.effectsScene.remove(this.outlineMesh);
        }
    },

    init: function (config) {
        //TODO: use config to initialize
        let me = this;

        //lights
        let directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, 1, 0).normalize();
        me.scene.add(directionalLight);
        //scene.fog = new THREE.FogExp2(0x000000, 0.128)

        //geometry
        let geometry = new THREE.IcosahedronGeometry(10, 0);
        let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        me.cube = new THREE.Mesh(geometry, material);
        me.scene.add(me.cube);

        let grid = new vg.SqrGrid({ cellSize: 11 });
        grid.generate({ size: 5 });
        let board = new vg.Board(grid);
        board.generateTilemap({ tileScale: 0.96 });
        me.scene.add(board.group);

        //pointer control
        me.canvas.addEventListener('touchstart', startHandler, { passive: false });
        me.canvas.addEventListener('mousedown', startHandler);
        function startHandler(e) {
            if (e.type === 'mousedown') {
                //canvas.addEventListener('mousemove', moveHandler, { passive: false });
                me.canvas.addEventListener('mouseup', endHandler);
                me.mouse = { x: e.clientX, y: e.clientY };
            } else {
                //canvas.addEventListener('touchmove', moveHandler, { passive: false });
                me.canvas.addEventListener('touchend', endHandler);
                me.canvas.addEventListener('touchcancel', endHandler);
                me.mouse = copyTouch(e.targetTouches[0]);
                e.preventDefault();
                e.stopPropagation();
            }
            //handle pointer start
            let intersection = me.checkIntersection();
            me.selectedObject = (intersection.object == me.cube) ? me.cube : undefined;
        }
        function moveHandler(e) {
            me.mouse = (e.type == 'mousemove')
                ? { x: e.clientX, y: e.clientY }
                : copyTouch(e.targetTouches[0]);

            e.preventDefault();
            e.stopPropagation();
            //handle pointer move
            let intersection = me.checkIntersection();
            me.selectedObject = (intersection.object == me.cube) ? me.cube : undefined;
        }
        function endHandler(e) {
            if (e.type === 'mouseup') {
                me.canvas.removeEventListener('mousemove', moveHandler);
                me.canvas.removeEventListener('mouseup', endHandler);
            } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.mouse.identifier) {
                me.canvas.removeEventListener('touchmove', moveHandler);
                me.canvas.removeEventListener('touchend', endHandler);
                me.canvas.removeEventListener('touchcancel', endHandler);
            } else {
                return;
            }
            //handle pointer end
            me.selectedObject = false;
        }
        function copyTouch(touch) {
            return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
        }

        //handle resize
        function resize() {
            //TODO: add dynamic FOV
            var width = window.innerWidth;
            var height = window.innerHeight;
            me.camera.aspect = width / height;
            me.camera.updateProjectionMatrix();
            me.renderer.setSize(width, height);
        }
        window.addEventListener('resize', resize);

        //render loop
        function render() {
            requestAnimationFrame(render);
            
            me.update();

            me.renderer.render(me.effectsScene, me.camera);
            me.renderer.render(me.scene, me.camera);
        }
        render();
    },

    update: function () {
        this.cube.rotation.z += 0.01;
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y -= 0.013;

        this.updateOutlines();

        this.controls.update();
    },
};

gg.Canvas.prototype.constructor = gg.Canvas;