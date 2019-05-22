/*
//return array with height data from img
function getHeightData(img, scale) {

    if (scale == undefined) scale = 20;

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');

    var size = img.width * img.height;
    var data = new Float32Array(size);

    context.drawImage(img, 0, 0);

    for (var i = 0; i < size; i++) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0; i < pix.length; i += 4) {
        var all = pix[i] + pix[i + 1] + pix[i + 2];
        data[j++] = all / (12 * scale);
    }

    return data;
}

// terrain
var img = new Image();
img.onload = function () {

    //get height data from img
    var data = getHeightData(img);

    // plane
    var geometry = new THREE.PlaneGeometry(10, 10, 9, 9);
    var material = new THREE.MeshStandardMaterial({color: 0xaa5555});
    plane = new THREE.Mesh(geometry, material);

    //set height of vertices
    for (var i = 0; i < plane.geometry.vertices.length; i++) {
        plane.geometry.vertices[i].z = data[i] - 5;
    }
    plane.geometry.computeVertexNormals();

    scene.add(plane);
};
// load img source
img.src = "./resources/heightmap.png";
*/