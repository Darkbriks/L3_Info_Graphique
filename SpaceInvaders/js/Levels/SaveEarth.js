function SaveEarth()
{
    mainMenu.style.display = "none";
    levelMenu.style.display = "none";

    const Earth = CelestialBody.GetBodyByName('Earth');
    player = new Characters({
        parent: 'Earth',
        latitude: 0,
        longitude: -90,
        orbitalPeriod: 1,
        color: 0x00ff00
    });
    player.init();
    player.update(0);

    for (let j = 0; j < 360; j += 10)
    {
        for (let i = -70; i < 70; i += 5)
        {
            let enemy = new Enemy({parent: "Earth", latitude: i, longitude: j});
            enemy.init();
        }
    }
    Enemy.updateAll(0);

    AnimateCamera(camera, BeginAnimation, function()
    {
        FocusCameraOnBody(camera, Earth, 8, function()
        {
            const cameraPosition = camera.position.clone();
            const cameraRotation = camera.rotation.clone();

            player.group.add(camera)
            camera.position.set(0, 0, 500/KM_BY_UNIT);
            camera.updateMatrixWorld(true);
            const transitionKeyPosition = camera.getWorldPosition(new THREE.Vector3());

            camera.rotation.set(0, 0, 0);
            camera.rotateZ(-90 * Math.PI / 180);
            let transitionKeyRotation = camera.rotation.clone();
            transitionKeyRotation.x += player.group.rotation.x;
            transitionKeyRotation.y += player.group.rotation.y;
            transitionKeyRotation.z += player.group.rotation.z;

            player.group.remove(camera);
            camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);

            const transitionKeyToPlayer = new AnimationKey(
                transitionKeyPosition,
                transitionKeyRotation,
                5,
                EasingFunctions.easeOutCubic
            )
            AnimateCameraOnce(camera, transitionKeyToPlayer, function()
            {
                player.group.add(camera)
                camera.position.set(0, 0, 500/KM_BY_UNIT);
                camera.rotation.set(0, 0, 0);
                camera.rotateZ(-90 * Math.PI / 180);

                currentLevelUpdate = SaveEarthUpdate;
            });
        });
    });
}

function SaveEarthUpdate(deltaTime)
{
    player.update(deltaTime);
    Enemy.updateAll(deltaTime);
}

const BeginAnimation = [
    {
        targetPosition: new THREE.Vector3(0, 0, 0),
        duration: 0.1,
        easingFunction: EasingFunctions.linear
    },
    {
        targetPosition: new THREE.Vector3(0, 1720000 * 3, 0),
        duration: 5,
        easingFunction: EasingFunctions.easeInCubic
    },
    {
        targetPosition: new THREE.Vector3(0, 1720000 / 1.5, 6000000),
        targetRotation: new THREE.Vector3(-0.3, 0, 0),
        duration: 6,
        easingFunction: EasingFunctions.easeOutCubic
    }
]