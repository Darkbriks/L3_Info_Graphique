function createBox() {
    // Création de 5 plans
    var boxGroup = new THREE.Group();

    for (var i = 0; i < 5; i++) {
        var geometry = new THREE.PlaneGeometry(4.2, 4.2);
        var material = new THREE.MeshLambertMaterial({color: 0x80ff80});
        var plane = new THREE.Mesh(geometry, material);
        boxGroup.add(plane);

        if (i === 0) {
            plane.position.set(0, 0, -2.1);
        } else if (i === 1) {
            plane.position.set(2.1, 0, 0);
            plane.rotation.y = -Math.PI / 2;
        } else if (i === 2) {
            plane.position.set(-2.1, 0, 0);
            plane.rotation.y = Math.PI / 2;
        } else if (i === 3) {
            plane.position.set(0, 2.1, 0);
            plane.rotation.x = Math.PI / 2;
        } else if (i === 4) {
            plane.position.set(0, -2.1, 0);
            plane.rotation.x = -Math.PI / 2;
        }
    }

    return boxGroup;
}