function DisplayLevelMenu()
{
    mainMenu.style.display = "none"
    levelMenu.style.display = "block"
    levelMenu.innerHTML += "<button onclick='SaveEarth()'>SAVE EARTH</button>"
    levelMenu.innerHTML += "<button>SAVE SATURN</button>"
    levelMenu.innerHTML += "<button>SAVE HAUMEA</button>"

    // Placer la caméra dans le soleil
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // Ajout d'une skybox
    const loader = new THREE.TextureLoader();
    loader.load('Images/2k_stars_milky_way.jpg', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    celestialBodiesData.forEach(data => { new CelestialBody(data[0], data[1], data[2], data[3]); });
    CelestialBody.initAll();

    let light = new THREE.PointLight(0xffffff, 1, 0, 2);
    let Sun = CelestialBody.GetBodyByName('Sun');
    Sun.mesh.add(light);

    CelestialBody.GetBodyByName('Saturn').addRing({
        ringInnerRadius: 66900,
        ringOuterRadius: 483000,
        ringDiffuseTextureUrl: 'Images/Saturn/saturnringcolor.jpg',
        ringTransparencyTextureUrl: 'Images/Saturn/saturnringpattern.gif'
    })

    CelestialBody.GetBodyByName('Uranus').addRing({
        ringInnerRadius: 36750,
        ringOuterRadius: 103000,
        ringDiffuseTextureUrl: 'Images/Uranus/uranusringcolour.jpg',
        ringTransparencyTextureUrl: 'Images/Uranus/uranusringtrans.gif'
    })

    CelestialBody.focusedBody = Sun;
    LevelMenuUpdate();
    document.body.appendChild(renderer.domElement);
}

let elapsedTime = 0;
function LevelMenuUpdate()
{
    elapsedTime += clock.getDelta() * timeMultiplier;

    CelestialBody.updateAllRotation(elapsedTime);
    CelestialBody.updateAllPosition(elapsedTime);

    renderer.render(scene, camera);
    requestAnimationFrame(LevelMenuUpdate);
}