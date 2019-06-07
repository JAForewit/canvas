var gg = {
    //GLOBAL properties
};

//url to a canvas options JSON file
gg.Canvas = function (options) {
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

    //outlining
    this.outlineMesh = new THREE.Mesh(
        new THREE.Geometry(),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide })
    );
    this.outlineMesh.scale.multiplyScalar(1.1);

    //AxesHelper
    this.axesHelper = new THREE.AxesHelper(100);
    this.scene.add(this.axesHelper);

    //controls
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enableRotate = false;
    this.controls.enableKeys = false;
    this.controls.update();

    //Board
    let grid = (options.grid.type == "HEX") ? new vg.HexGrid() : new vg.SqrGrid();
    grid.fromJSON(options.grid);
    this.board = new vg.Board(grid);
    this.board.generateTilemap({ tileScale: 0.96 });
    this.scene.add(this.board.group);

    //setup scene
    this.init(options.pref);
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

    init: function (pref) {
        //TODO: use pref to initialize
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

        this.controls.update();
    },
};

gg.Canvas.prototype.constructor = gg.Canvas;