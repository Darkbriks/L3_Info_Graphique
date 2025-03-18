function carreBasic()
{
    const geometry = new THREE.BufferGeometry()

    const vertices = new Float32Array([
        -1, 0, -1, // A
        -1, 0, 1, // B
        1, 0, 1, // C
        -1, 0, -1, // A
        1, 0, 1, // C
        1, 0, -1 // D
        ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const mat = new THREE.MeshBasicMaterial({color: 0x0000ff/*, side: THREE.DoubleSide*/})
    return new THREE.Mesh(geometry, mat)
}

function carreLambert()
{
    const geometry = new THREE.BufferGeometry()

    const vertices = new Float32Array([
        -1, 0, -1, // A
        -1, 0, 1, // B
        1, 0, 1, // C
        -1, 0, -1, // A
        1, 0, 1, // C
        1, 0, -1 // D
    ]);

    const normals = new Float32Array([
        0, 1, 0, // A
        0, 1, 0, // B
        0, 1, 0, // C
        0, 1, 0, // A
        0, 1, 0, // C
        0, 1, 0 // D
    ]);

    const colors = new Float32Array([
        1, 0, 0, // A
        0, 1, 0, // B
        0, 0, 1, // C
        1, 0, 0, // A
        0, 0, 1, // C
        1, 0, 1 // D
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.MeshLambertMaterial({color: 0xffffff, vertexColors: true})
    return new THREE.Mesh(geometry, mat)
}

function cubeLambert()
{
    const geometry = new THREE.BufferGeometry()

    // A : -1, -1, -1
    // B : -1, 1, -1
    // C : 1, 1, -1
    // D : 1, -1, -1
    // E : -1, -1, 1
    // F : -1, 1, 1
    // G : 1, 1, 1
    // H : 1, -1, 1

    const vertices = new Float32Array([
        // Face 1 : BFGC
        -1, 1, -1, // B
        -1, 1, 1, // F
        1, 1, 1, // G
        -1, 1, -1, // B
        1, 1, 1, // G
        1, 1, -1, // C

        // Face 2 : EAFB
        -1, -1, -1, // E
        -1, -1, 1, // A
        -1, 1, 1, // F
        -1, -1, -1, // E
        -1, 1, 1, // F
        -1, 1, -1, // B

        // Face 3 : EFGH
        1, 1, 1, // G
        -1, 1, 1, // F
        -1, -1, 1, // E
        1, 1, 1, // G
        -1, -1, 1, // E
        1, -1, 1, // H

        // Face 4 : DCBA
        -1, 1, -1, // B
        1, 1, -1, // C
        1, -1, -1, // D
        -1, 1, -1, // B
        1, -1, -1, // D
        -1, -1, -1, // A

        // Face 5 : CGHD
        1, 1, 1, // G
        1, -1, 1, // H
        1, -1, -1, // D
        1, 1, 1, // G
        1, -1, -1, // D
        1, 1, -1, // C

        // Face 6 : EADH
        -1, -1, 1, // A
        -1, -1, -1, // E
        1, -1, -1, // D
        -1, -1, 1, // A
        1, -1, -1, // D
        1, -1, 1 // H
    ]);

    const normals = new Float32Array([
        // Face 1
        0, 1, 0, // B
        0, 1, 0, // F
        0, 1, 0, // G
        0, 1, 0, // B
        0, 1, 0, // G
        0, 1, 0, // C

        // Face 2
        -1, 0, 0, // E
        -1, 0, 0, // A
        -1, 0, 0, // F
        -1, 0, 0, // E
        -1, 0, 0, // F
        -1, 0, 0, // B

        // Face 3
        0, 0, 1, // G
        0, 0, 1, // F
        0, 0, 1, // E
        0, 0, 1, // G
        0, 0, 1, // E
        0, 0, 1, // H

        // Face 4
        0, 0, -1, // B
        0, 0, -1, // C
        0, 0, -1, // D
        0, 0, -1, // B
        0, 0, -1, // D
        0, 0, -1, // A

        // Face 5
        1, 0, 0, // G
        1, 0, 0, // H
        1, 0, 0, // D
        1, 0, 0, // G
        1, 0, 0, // D
        1, 0, 0, // C

        // Face 6
        0, -1, 0, // E
        0, -1, 0, // A
        0, -1, 0, // D
        0, -1, 0, // E
        0, -1, 0, // D
        0, -1, 0 // H
    ]);

    // A : 1, 0, 0
    // B : 0, 1, 0
    // C : 0, 0, 1
    // D : 1, 1, 0
    // E : 1, 0, 1
    // F : 0, 1, 1
    // G : 1, 1, 1
    // H : 0, 0, 0

    const colors = new Float32Array([
        // Face 1
        0, 1, 0, // B
        0, 1, 1, // F
        1, 1, 1, // G
        0, 1, 0, // B
        0, 0, 1, // G
        0, 0, 1, // C

        // Face 2
        1, 0, 1, // E
        1, 0, 0, // A
        0, 1, 1, // F
        1, 0, 1, // E
        0, 1, 1, // F
        0, 1, 0, // B

        // Face 3
        1, 1, 1, // G
        0, 1, 1, // F
        1, 0, 1, // E
        1, 1, 1, // G
        1, 0, 1, // E
        0, 0, 0, // H

        // Face 4
        0, 1, 0, // B
        0, 0, 1, // C
        1, 1, 0, // D
        0, 1, 0, // B
        1, 1, 0, // D
        1, 0, 0, // A

        // Face 5
        1, 0, 0, // G
        0, 0, 0, // H
        1, 1, 0, // D
        1, 1, 1, // G
        1, 1, 0, // D
        0, 0, 1, // C

        // Face 6
        1, 0, 0, // A
        1, 0, 1, // E
        1, 1, 0, // D
        1, 0, 0, // A
        0, 0, 1, // D
        0, 0, 0, // H
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.MeshLambertMaterial({color: 0xffffff, vertexColors: true})
    return new THREE.Mesh(geometry, mat)
}