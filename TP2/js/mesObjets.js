
// construction d'un cube de côté c centrée à l'origine
// Chaque face du cube est d'une couleur différente
// prise parmi les 3 primaires et leur complémentaire
function cubeColore(c){
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
	// face supérieure
	-c/2.0, c/2.0,- c/2.0,  -c/2.0, c/2.0, c/2.0,  c/2.0, c/2.0, c/2.0,  -c/2.0, c/2.0, -c/2.0,  c/2.0, c/2.0, c/2.0,  c/2.0, c/2.0, -c/2.0,
	// face inférieure
	-c/2.0, -c/2.0, -c/2.0,  c/2.0, -c/2.0, -c/2.0,  c/2.0, -c/2.0, c/2.0,  -c/2.0, -c/2.0, -c/2.0,  c/2.0, -c/2.0, c/2.0,  -c/2.0, -c/2.0, c/2.0,
	// face gauche
	-c/2.0, c/2.0, c/2.0,  -c/2.0, c/2.0, -c/2.0,  -c/2.0, -c/2.0, c/2.0,  -c/2.0, -c/2.0, c/2.0,  -c/2.0, c/2.0, -c/2.0,  -c/2.0, -c/2.0, -c/2.0,
	// face droite
	c/2.0, c/2.0, c/2.0,  c/2.0, -c/2.0, c/2.0,  c/2.0, c/2.0, -c/2.0,  c/2.0, c/2.0, -c/2.0,  c/2.0, -c/2.0, c/2.0, c/2.0, -c/2.0, -c/2.0,
	// face avant
	-c/2.0, c/2.0, c/2.0,   -c/2.0, -c/2.0, c/2.0,  c/2.0, c/2.0, c/2.0,  c/2.0, c/2.0, c/2.0,  -c/2.0, -c/2.0, c/2.0, c/2.0, -c/2.0, c/2.0,
	// face arrière
	-c/2.0, c/2.0, -c/2.0,  c/2.0, c/2.0, -c/2.0,  -c/2.0, -c/2.0, -c/2.0,  -c/2.0, -c/2.0, -c/2.0,  c/2.0, c/2.0, -c/2.0,  c/2.0, -c/2.0, -c/2.0
    ] );
    
    const normals = new Float32Array( [
	// face supérieure - normale orientée selon Oy
	0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
	// face inférieure - normale orientée selon -Oy
	0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
	// face gauche - normale orientée selon -Ox
	-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
	// face droite - normale orientée selon Ox
	1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
	// face avant - normale orientée selon Oz
	0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
	// face arrière - normale orientée selon -Oz
	0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1
    ]);
    
    const colors = new Float32Array( [
	// face supérieure rouge
	1, 0, 0,  1, 0, 0,  1, 0, 0, 1, 0, 0,  1, 0, 0,  1, 0, 0,
	// face inférieure cyan
	0, 1, 1,  0, 1, 1,  0, 1, 1, 0, 1, 1,  0, 1, 1,  0, 1, 1,
	// face gauche vert
	0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
	// face droite magenta
	1, 0, 1,  1, 0, 1,  1, 0, 1,  1, 0, 1,  1, 0, 1,  1, 0, 1,
	// face avant bleu
	0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
	// face arrière jaune
	1, 1, 0,  1, 1, 0,  1, 1, 0,  1, 1, 0,  1, 1, 0,  1, 1, 0
    ]);
    
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    const lambert = new THREE.MeshLambertMaterial( {
	color: 0xffffff, // reflectance diffuse du materiau
	side: THREE.DoubleSide,// tenir compte des deux faces
	vertexColors: true // il y a des couleurs en chaque sommet
    });
    
    const mesh = new THREE.Mesh( geometry, lambert );
    return mesh;
}

function repere(size){
	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array( [
	    -size/2, 0, 0,  size/2, 0, 0,  0, -size/2, 0,  0, size/2, 0,  0, 0, -size/2,  0, 0, size/2
	] );

	const colors = new Float32Array( [
	    1, 0, 0,  1, 0, 0,  0, 1, 0,  0, 1, 0,  0, 0, 1,  0, 0, 1
	]);

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

	const material = new THREE.LineBasicMaterial( { vertexColors: true } );

	return new THREE.LineSegments(geometry, material);
}

function repereFleche(size)
{
	const originX = new THREE.Vector3(-size/2, 0, 0);
	const originY = new THREE.Vector3(0, -size/2, 0);
	const originZ = new THREE.Vector3(0, 0, -size/2);

	const xDir = new THREE.Vector3(1, 0, 0);
	const yDir = new THREE.Vector3(0, 1, 0);
	const zDir = new THREE.Vector3(0, 0, 1);

	const xArrow = new THREE.ArrowHelper(xDir, originX, size, 0xff0000);
	const yArrow = new THREE.ArrowHelper(yDir, originY, size, 0x00ff00);
	const zArrow = new THREE.ArrowHelper(zDir, originZ, size, 0x0000ff);

	const group = new THREE.Group();
	group.add(xArrow);
	group.add(yArrow);
	group.add(zArrow);
	return group;
}

function cubeRepere(c){
	const cube = cubeColore(c);
	const repFleche = repereFleche(c+3);
	const group = new THREE.Group();
	group.add(cube);
	group.add(repFleche);
	return group;
}