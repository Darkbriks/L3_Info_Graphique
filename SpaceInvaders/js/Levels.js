function LoadMoon() { nbEnemiesToKill = 4; currentLevel = LoadMoon; LoadLevel("Moon", MoonEnemyCreation, "Audio/At Dooms Gate.mp3"); }
function LoadMercury()  { nbEnemiesToKill = 27; currentLevel = LoadMercury; LoadLevel("Mercury", MercuryEnemyCreation, "Audio/Casualty.mp3"); }
function LoadVenus() { nbEnemiesToKill = 27; currentLevel = LoadVenus; LoadLevel("Venus", VenusEnemyCreation, "Audio/Hellwalker.mp3"); }
function LoadMars() { nbEnemiesToKill = 60; currentLevel = LoadMars; LoadLevel("Mars", MarsEnemyCreation, "Audio/Reignbreaker.mp3"); }
function LoadEarth() { nbEnemiesToKill = 65; currentLevel = LoadEarth; LoadLevel("Earth", EarthEnemyCreation, "Audio/Rip & Tear.mp3"); }
function LoadUranus() { nbEnemiesToKill = 150; currentLevel = LoadUranus; LoadLevel("Uranus", UranusEnemyCreation, "Audio/Flesh & Metal.mp3"); }
function LoadSaturn() { nbEnemiesToKill = 150; currentLevel = LoadSaturn; LoadLevel("Saturn", SaturnEnemyCreation, "Audio/Bfg Division.mp3"); }

function LoadLevel(bodyName, enemiesCreationFunction, music = null)
{
    mainMenu.style.display = "none";
    levelMenu.style.display = "none";
    deathMenu.style.display = "none";
    winMenu.style.display = "none";
    hudLife.innerHTML = "";
    hudScore.innerHTML = "";
    hud.style.display = "flex";
    killEnemies = 0;

    if (music)
    {
        audioLoader.load(music, (buffer) => {
            levelSound.setBuffer(buffer);
            levelSound.setLoop(true);
            levelSound.setVolume(1);
            crossfade(menuSound, levelSound, 3, EasingFunctions.easeOutCubic);
        });
    }

    const Body = CelestialBody.GetBodyByName(bodyName);
    player = new Player({
        parent: bodyName,
        latitude: 0,
        longitude: -90,
        orbitalPeriod: 1,
        color: 0x00ff00
    });
    player.init();
    player.update(0);

    enemiesCreationFunction(bodyName);

    AnimateCamera(camera, BeginAnimation, function()
    {
        FocusCameraOnBody(camera, Body, 8, function()
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

                currentLevelUpdate = LevelUpdate;
            });
        });
    });
}

function LevelUpdate(deltaTime)
{
    player.update(deltaTime);
    Enemy.updateAll(deltaTime);
    Projectile.updateAll(deltaTime);
    PowerUp.updateAll(deltaTime);

    if (killEnemies >= nbEnemiesToKill)
    {
        ClearScene();
        currentLevelUpdate = null;
        DisplayWinMenu();
    }

    hudLife.innerHTML = "";
    if (player.life > -999)
    {
        for (let i = 0; i < player.life; i++) { hudLife.innerHTML += "❤️"; }
        for (let i = player.shield; i > 0; i--) { hudLife.innerHTML += "🛡️"; }
    }
    else { hudLife.innerHTML = "💀"; }

    hudScore.innerHTML = "SCORE : " + killEnemies + "/" + nbEnemiesToKill;
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

// Difficulté : Tutorial
function MoonEnemyCreation(bodyName)
{
    // Placer chacun des powerUp devant la position de départ du joueur
    const powerUp1 = new LifePowerUp({parent: bodyName, latitude: -2.5, longitude: -105});
    const powerUp2 = new InvincibilityPowerUp({parent: bodyName, latitude: 2.5, longitude: -105});
    const powerUp3 = new ShootSpeedPowerUp({parent: bodyName, latitude: -7.5, longitude: -105});
    const powerUp4 = new ShieldPowerUp({parent: bodyName, latitude: 7.5, longitude: -105});
    powerUp1.init(); powerUp2.init(); powerUp3.init(); powerUp4.init();

    // Placer un ennemi immobile devant la position de départ du joueur
    const enemy1 = new Enemy({parent: bodyName, latitude: 0, longitude: -135, projectile: BasicProjectile, timeBetweenShots: 1});
    enemy1.init();

    // Placer un ennemi qui se déplace a l'opposé du joueur pour apprendre au joueur que le mouvement est possible
    const enemy2 = new Enemy({parent: bodyName, latitude: 0, longitude: 90, projectile: BasicProjectile, timeBetweenShots: 1, waypoints: [
        {
            latitude: 3,
            longitude: 90,
            duration: 2,
            easing: EasingFunctions.linear
        },
        {
            latitude: -3,
            longitude: 90,
            duration: 2,
            easing: EasingFunctions.linear
        }
    ]});
    enemy2.init();

    // Placer un ennemi a chaque pôle pour contrôler que le joueur arrive a se déplacer
    const enemy3 = new Enemy({parent: bodyName, latitude: 70, longitude: 0, projectile: BasicProjectile, timeBetweenShots: 1});
    const enemy4 = new Enemy({parent: bodyName, latitude: -70, longitude: 180, projectile: BasicProjectile, timeBetweenShots: 1});
    enemy3.init(); enemy4.init();

    Enemy.updateAll(0);
}

// Difficulté : Facile
function MercuryEnemyCreation(bodyName)
{
    for (let j = 0; j < 360; j += 40)
    {
        for (let i = -30; i <= 30; i += 30)
        {
            let enemy = new Enemy({parent: bodyName, latitude: i, longitude: j + i/3, projectile: BasicProjectile, timeBetweenShots: 0.5});
            enemy.init();
        }
    }
    Enemy.updateAll(0);
}

// Difficulté : Facile
function VenusEnemyCreation(bodyName)
{
    for (let j = 0; j < 360; j += 40)
    {
        for (let i = -30; i <= 30; i += 30)
        {
            let enemy = new Enemy({parent: bodyName, latitude: i + Math.floor(Math.random() * 11) - 5, longitude: j + Math.floor(Math.random() * 11) - 5, projectile: BasicProjectile, timeBetweenShots: 0.5});
            enemy.init();
        }
    }
    Enemy.updateAll(0);

    const powerUp1 = new LifePowerUp({parent: bodyName, latitude: 0, longitude: -10});
    const powerUp2 = new LifePowerUp({parent: bodyName, latitude: 0, longitude: 170});
    const powerUp3 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: -100, effect: 10});
    const powerUp4 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: 80, effect: 10});
    powerUp1.init(); powerUp2.init(); powerUp3.init(); powerUp4.init();
}

// Difficulté : Moyenne
function MarsEnemyCreation(bodyName)
{
    for (let j = 0; j < 360; j += 20)
    {
        let dir = 1;
        for (let i = -30; i <= 30; i += 20)
        {
            let enemy = new Enemy({parent: bodyName, latitude: i, longitude: j, projectile: BasicProjectile, timeBetweenShots: 0.35, waypoints: [
                {
                    latitude: i + 5 * dir,
                    longitude: j,
                    duration: 2,
                    easing: EasingFunctions.linear
                },
                {
                    latitude: i - 5 * dir,
                    longitude: j,
                    duration: 2,
                    easing: EasingFunctions.linear
                }
            ]});
            enemy.init();
            dir *= -1;
        }
    }
    Enemy.updateAll(0);

    const powerUp1 = new LifePowerUp({parent: bodyName, latitude: 0, longitude: -10});
    const powerUp2 = new LifePowerUp({parent: bodyName, latitude: 0, longitude: 170});
    const powerUp3 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: -100, effect: 15});
    const powerUp4 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: 80, effect: 15});
    powerUp1.init(); powerUp2.init(); powerUp3.init(); powerUp4.init();
}

// Difficulté : Moyenne+
function EarthEnemyCreation(bodyName)
{
    let dir_j = 1;
    for (let j = 0; j < 360; j += 20)
    {
        let dir_i = 1;
        for (let i = -30; i <= 30; i += 20)
        {
            let enemy = new Enemy({parent: bodyName, latitude: i, longitude: j, projectile: BasicProjectile, timeBetweenShots: 0.35, waypoints: [
                {
                    latitude: i + 5 * dir_i * dir_j + Math.random() * 11 - 5,
                    longitude: j,
                    duration: Math.random() * 2 + 1,
                    easing: EasingFunctions.linear
                },
                {
                    latitude: i - 5 * dir_i * dir_j + Math.random() * 11 - 5,
                    longitude: j,
                    duration: Math.random() * 2 + 1,
                    easing: EasingFunctions.linear
                }
            ]});
            enemy.init();
            dir_i *= -1;
        }
        dir_j *= -1;
    }
    Enemy.updateAll(0);

    const powerUp1 = new LifePowerUp({parent: bodyName, latitude: 0, longitude: 170});
    const powerUp2 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: -100, effect: 15});
    const powerUp3 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: 80, effect: 15});
    powerUp1.init(); powerUp2.init(); powerUp3.init();
}

// Difficulté : Difficile
function UranusEnemyCreation(bodyName)
{
    for (let j = 0; j < 360; j += 6)
    {
        for (let i = -30; i <= 30; i += 10)
        {
            let enemy = new Enemy({parent: bodyName, latitude: i, longitude: j + 2, projectile: BasicProjectile, timeBetweenShots: 0.3, waypoints: [
                {
                    latitude: i + 2 + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                    longitude: j + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                    duration: Math.random() * 2 + 1,
                    easing: EasingFunctions.easeInOutQuad
                },
                {
                    latitude: i - 2 + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                    longitude: j + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                    duration: Math.random() * 2 + 1,
                    easing: EasingFunctions.easeInOutQuad
                }
            ]});
            enemy.init();
        }
    }
    Enemy.updateAll(0);

    const powerUp1 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: -100, effect: 15});
    const powerUp2 = new ShootSpeedPowerUp({parent: bodyName, latitude: 0, longitude: -80, effect: 15});
    powerUp1.init(); powerUp2.init();

    for (let i = 0; i < 15; i++)
    {
        const type = Math.floor(Math.random() * 4);
        let powerUp;
        switch (type)
        {
            case 0:
                powerUp = new LifePowerUp({parent: bodyName, latitude: Math.floor(Math.random() * 31) - 15, longitude: Math.floor(Math.random() * 361), effect: 2});
                break;
            case 1:
                powerUp = new InvincibilityPowerUp({parent: bodyName, latitude: Math.floor(Math.random() * 31) - 15, longitude: Math.floor(Math.random() * 361), effect: 10});
                break;
            case 2:
                powerUp = new ShootSpeedPowerUp({parent: bodyName, latitude: Math.floor(Math.random() * 31) - 15, longitude: Math.floor(Math.random() * 361), effect: 15});
                break;
            case 3:
                powerUp = new ShieldPowerUp({parent: bodyName, latitude: Math.floor(Math.random() * 31) - 15, longitude: Math.floor(Math.random() * 361), effect: 30});
                break;
        }
        powerUp.init();
    }
}

// Difficulté : Extrême
function SaturnEnemyCreation(bodyName) {
    for (let j = 0; j < 360; j += 6) {
        for (let i = -30; i <= 30; i += 10) {
            let enemy = new Enemy({
                parent: bodyName,
                latitude: i,
                longitude: j + 2,
                projectile: BasicProjectile,
                timeBetweenShots: 0.25,
                waypoints: [
                    {
                        latitude: i + 2 + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                        longitude: j + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                        duration: Math.random() * 2 + 1,
                        easing: EasingFunctions.easeInOutCubic
                    },
                    {
                        latitude: i - 2 + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                        longitude: j + ((Math.random() * 11) - (5 * Math.floor(Math.random() * 2 + 1))),
                        duration: Math.random() * 2 + 1,
                        easing: EasingFunctions.easeInOutCubic
                    }
                ]
            });
            enemy.init();
        }
    }
    Enemy.updateAll(0);

    for (let i = 0; i < 7; i++) {
        const type = Math.floor(Math.random() * 4);
        let powerUp;
        switch (type) {
            case 0:
                powerUp = new LifePowerUp({
                    parent: bodyName,
                    latitude: Math.floor(Math.random() * 31) - 15,
                    longitude: Math.floor(Math.random() * 361),
                    effect: 2
                });
                break;
            case 1:
                powerUp = new InvincibilityPowerUp({
                    parent: bodyName,
                    latitude: Math.floor(Math.random() * 31) - 15,
                    longitude: Math.floor(Math.random() * 361),
                    effect: 10
                });
                break;
            case 2:
                powerUp = new ShootSpeedPowerUp({
                    parent: bodyName,
                    latitude: Math.floor(Math.random() * 31) - 15,
                    longitude: Math.floor(Math.random() * 361),
                    effect: 15
                });
                break;
            case 3:
                powerUp = new ShieldPowerUp({
                    parent: bodyName,
                    latitude: Math.floor(Math.random() * 31) - 15,
                    longitude: Math.floor(Math.random() * 361),
                    effect: 30
                });
                break;
        }
        powerUp.init();
    }
}