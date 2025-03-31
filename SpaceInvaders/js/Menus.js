function DisplayMainMenu()
{
    if (rendererAdded) { document.body.removeChild(renderer.domElement); rendererAdded = false; }

    levelMenu.style.display = "none"
    deathMenu.style.display = "none"
    winMenu.style.display = "none"
    hud.style.display = "none"
    mainMenu.style.display = "flex"
    mainMenu.innerHTML = "<h1>Space Invaders</h1>"
    mainMenu.innerHTML += "<button onclick='DisplayLevelMenu()'>PLAY</button>"
    mainMenu.innerHTML += "<button>OPTIONS (soon)</button>"
    mainMenu.innerHTML += "<button onclick='window.location.href=\"classicSpaceInvaders.html\"'>Classic Space Invaders</button>"
}

function DisplayLevelMenu()
{
    audioLoader.load(
        'Audio/Vigil.mp3',
        function (buffer) {
            menuSound.setBuffer(buffer);
            menuSound.setLoop(true);
            menuSound.setVolume(1);
            menuSound.play();
        },
    );

    mainMenu.style.display = "none"
    deathMenu.style.display = "none"
    winMenu.style.display = "none"
    hud.style.display = "none"
    levelMenu.style.display = "flex"
    levelMenu.innerHTML = "<h1>SELECT LEVEL</h1>"
    levelMenu.innerHTML += "<button onclick='LoadMoon()' class='tutorial'>TUTORIAL</button>"
    levelMenu.innerHTML += "<button onclick='LoadMercury()' class='easy'>SAVE MERCURY</button>"
    levelMenu.innerHTML += "<button onclick='LoadVenus()' class='easy'>SAVE VENUS</button>"
    levelMenu.innerHTML += "<button onclick='LoadMars()' class='medium'>SAVE MARS</button>"
    levelMenu.innerHTML += "<button onclick='LoadEarth()' class='medium'>SAVE EARTH</button>"
    levelMenu.innerHTML += "<button onclick='LoadUranus()' class='hard'>SAVE URANUS</button>"
    levelMenu.innerHTML += "<button onclick='LoadSaturn()' class='extreme'>SAVE SATURN</button>"

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    if (!rendererAdded) { document.body.appendChild(renderer.domElement); rendererAdded = true; }
}

function DisplayDeathMenu()
{
    mainMenu.style.display = "none"
    levelMenu.style.display = "none"
    winMenu.style.display = "none"
    hud.style.display = "none"
    deathMenu.style.display = "flex"
    deathMenu.innerHTML = "<h1>YOU DIED</h1>"
    deathMenu.innerHTML += "<button onclick='currentLevel()'>RETRY</button>"
    deathMenu.innerHTML += "<button onclick='DisplayLevelMenu()'>SELECT LEVEL</button>"
    deathMenu.innerHTML += "<button onclick='DisplayMainMenu()'>MAIN MENU</button>"

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    crossfade(levelSound, menuSound, 3, EasingFunctions.easeOutCubic);
}

function DisplayWinMenu()
{
    mainMenu.style.display = "none"
    levelMenu.style.display = "none"
    deathMenu.style.display = "none"
    hud.style.display = "none"
    winMenu.style.display = "flex"

    winMenu.innerHTML = "<h1>YOU WON</h1>"
    winMenu.innerHTML += "<button onclick='currentLevel()'>PLAY AGAIN</button>"
    winMenu.innerHTML += "<button onclick='DisplayLevelMenu()'>SELECT LEVEL</button>"
    winMenu.innerHTML += "<button onclick='DisplayMainMenu()'>MAIN MENU</button>"

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    crossfade(levelSound, menuSound, 3, EasingFunctions.easeOutCubic);
}