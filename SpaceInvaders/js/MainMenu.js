function DisplayMainMenu()
{
    levelMenu.style.display = "none"
    mainMenu.style.display = "block"
    mainMenu.innerHTML = "<h1>Space Invaders</h1>"
    mainMenu.innerHTML += "<button onclick='DisplayLevelMenu()'>PLAY</button>"
    mainMenu.innerHTML += "<button>OPTIONS (soon)</button>"
}