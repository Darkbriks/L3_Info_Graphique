function DisplayLevelMenu()
{
    mainMenu.style.display = "none"
    levelMenu.style.display = "flex"
    levelMenu.innerHTML += "<button onclick='SaveEarth()'>SAVE EARTH</button>"
    levelMenu.innerHTML += "<button>SAVE SATURN</button>"
    levelMenu.innerHTML += "<button>SAVE HAUMEA</button>"

    // Placer la caméra dans le soleil
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);


    // Ajout d'une skybox
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
    CelestialBody.updateAllPosition(0);
    document.body.appendChild(renderer.domElement);
    currentLevelUpdate = LevelMenuUpdate;
}

let elapsedTime = 0;
function LevelMenuUpdate(deltaTime)
{
    CelestialBody.updateAllRotation(elapsedTime);
    //CelestialBody.updateAllPosition(elapsedTime);
}