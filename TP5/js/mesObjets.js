// fonction permettant la création d'un carré
// c : côté du carré
function carre(c)
{

    const geometry = new THREE.BufferGeometry();
    
    // sommets des deux triangles du carré dans le plan 0xy, centré à l'origine
    const vertices = new Float32Array( [
	-c/2, -c/2, 0.0, 
	c/2, -c/2, 0.0,
	c/2, c/2, 0.0,

	-c/2, -c/2, 0.0, 
	c/2, c/2, 0.0,
	-c/2, c/2, 0.0
    ] );


    // assignation des sommets à la géométrie
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    // définition du matériel
    const diffus = new THREE.MeshBasicMaterial( {
	color: 0xffffff, side: THREE.DoubleSide });

    // construction du mesh
    return new THREE.Mesh(geometry, diffus);
}

function carreTexture(c, texture)
{

    const geometry = new THREE.BufferGeometry();

    // sommets des deux triangles du carré dans le plan 0xy, centré à l'origine
    const vertices = new Float32Array( [
        -c/2, -c/2, 0.0,
        c/2, -c/2, 0.0,
        c/2, c/2, 0.0,

        -c/2, -c/2, 0.0,
        c/2, c/2, 0.0,
        -c/2, c/2, 0.0
    ] );

    const uvs = new Float32Array( [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ] );


    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    const diffus = new THREE.MeshBasicMaterial( { map: texture } );

    // construction du mesh
    return new THREE.Mesh(geometry, diffus);
}

function carreTexture2(c, texture, nbRepetitions)
{
    const geometry = new THREE.BufferGeometry();

    // sommets des deux triangles du carré dans le plan 0xy, centré à l'origine
    const vertices = new Float32Array( [
        -c/2, -c/2, 0.0,
        c/2, -c/2, 0.0,
        c/2, c/2, 0.0,

        -c/2, -c/2, 0.0,
        c/2, c/2, 0.0,
        -c/2, c/2, 0.0
    ] );

    const uvs = new Float32Array( [
        0.0, 0.0,
        nbRepetitions, 0.0,
        nbRepetitions, nbRepetitions,

        0.0, 0.0,
        nbRepetitions, nbRepetitions,
        0.0, nbRepetitions
    ] );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    const diffus = new THREE.MeshBasicMaterial( { map: texture } );

    // construction du mesh
    return new THREE.Mesh(geometry, diffus);
}

function cubeTexture(c, texture1, texture2, texture3)
{
    let cube = new THREE.Group();

    // Création de la face supérieure
    const vertices1 = new Float32Array( [
        -c/2, c/2, c/2,
        c/2, c/2, c/2,
        c/2, c/2, -c/2,

        -c/2, c/2, c/2,
        c/2, c/2, -c/2,
        -c/2, c/2, -c/2
    ] );

    const uvs1 = new Float32Array( [
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ] );

    const geometry1 = new THREE.BufferGeometry();
    geometry1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    geometry1.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs1, 2 ) );
    const diffus1 = new THREE.MeshBasicMaterial( { map: texture1, side: THREE.DoubleSide } );
    cube.add(new THREE.Mesh(geometry1, diffus1));

    // Création de la face inférieure
    const vertices2 = new Float32Array( [
        -c/2, -c/2, c/2,
        c/2, -c/2, c/2,
        c/2, -c/2, -c/2,

        -c/2, -c/2, c/2,
        c/2, -c/2, -c/2,
        -c/2, -c/2, -c/2
    ] );

    const uvs2 = new Float32Array( [
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,

        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ] );

    const geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );
    geometry2.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs2, 2 ) );
    const diffus2 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } );
    cube.add(new THREE.Mesh(geometry2, diffus2));

    // Création des 4 faces latérales
    const vertices3 = new Float32Array( [
        // Face avant
        -c/2, c/2, c/2,
        c/2, c/2, c/2,
        c/2, -c/2, c/2,

        -c/2, c/2, c/2,
        c/2, -c/2, c/2,
        -c/2, -c/2, c/2,

        // Face gauche
        -c/2, c/2, c/2,
        -c/2, c/2, -c/2,
        -c/2, -c/2, -c/2,

        -c/2, c/2, c/2,
        -c/2, -c/2, -c/2,
        -c/2, -c/2, c/2,

        // Face droite
        c/2, c/2, c/2,
        c/2, c/2, -c/2,
        c/2, -c/2, -c/2,

        c/2, c/2, c/2,
        c/2, -c/2, -c/2,
        c/2, -c/2, c/2,

        // Face arrière
        -c/2, c/2, -c/2,
        c/2, c/2, -c/2,
        c/2, -c/2, -c/2,

        -c/2, c/2, -c/2,
        c/2, -c/2, -c/2,
        -c/2, -c/2, -c/2
    ] );

    const uvs3 = new Float32Array( [
        // Face avant
        0.0, 1.0,
        0.25, 1.0,
        0.25, 0.0,

        0.0, 1.0,
        0.25, 0.0,
        0.0, 0.0,

        // Face gauche
        1.0, 1.0,
        0.75, 1.0,
        0.75, 0.0,

        1.0, 1.0,
        0.75, 0.0,
        1.0, 0.0,

        // Face droite
        0.25, 1.0,
        0.5, 1.0,
        0.5, 0.0,

        0.25, 1.0,
        0.5, 0.0,
        0.25, 0.0,

        // Face arrière
        0.75, 1.0,
        0.5, 1.0,
        0.5, 0.0,

        0.75, 1.0,
        0.5, 0.0,
        0.75, 0.0
    ] );

    const geometry3 = new THREE.BufferGeometry();
    geometry3.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices3, 3 ) );
    geometry3.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs3, 2 ) );
    const diffus3 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
    cube.add(new THREE.Mesh(geometry3, diffus3));

    return cube;
}