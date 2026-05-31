import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

let playerTurn = true;
let activeGame = true;
let player = null;
let computer = null;
let playerShips = [];
const computerMoves = [];

function renderSetup(){
    const instructions = [
        "1. Place your ships randomly or drag and drop.",
        "2. Press start game once you have placed your ships", 
        "3. Click on the left/computer's grid to shoot.",
        "4. First to shoot all the ships wins!",
        "BLUE is an unknown space, RED is a hit, DARK BLUE is a miss",
    ];
    const content = document.getElementById("content");
    const instructionsDiv = document.createElement("div");
    instructionsDiv.setAttribute("id", "instructionsContainer");
    const subtitle = document.createElement("p");
    subtitle.textContent = "How to Play:";
    subtitle.setAttribute("id", "instructionsTitle");
    instructionsDiv.appendChild(subtitle);

    for(let i = 0; i < instructions.length; i++){
        const text = document.createElement("p");
        text.setAttribute("class", "instruction");
        text.textContent = instructions[i];
        instructionsDiv.appendChild(text);
    }

    const tempGrid = new GameBoard(playerShips);

    const randomizeButton = document.createElement("button");
    randomizeButton.setAttribute("id", "randomizeButton");
    randomizeButton.textContent = "Randomize Placement";
    randomizeButton.addEventListener("click", () =>{
        playerShips = generateRandomShips();
        renderPlaceGrid();
    })

    const startButton = document.createElement("button");
    startButton.setAttribute("id", "startButton");
    startButton.textContent = "Start Game";
    startButton.addEventListener("click", () =>{
        if(playerShips.length === 5){
            startGame();
        }
    })

    instructionsDiv.appendChild(startButton);
    instructionsDiv.appendChild(randomizeButton);
    content.appendChild(instructionsDiv);
}

function generateRandomShips(){
    const ships = [];
    const shipLengths = [5, 4, 3, 3, 2];
    const placed = [];
    const board = [];

    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            board.push(new Point(i, j));
        }
    }
    

    for(let i = 0; i < shipLengths.length; i++){
        try{
            const randomIndex = Math.floor(Math.random() * board.length); 
            const isDown = Math.random() < 0.5;
            const randomShip = new Ship(isDown, shipLengths[i], board[randomIndex]);
            const location = randomShip.location;
            for(let i = 0; i < placed.length; i++){
                const distance = Math.abs(placed[i].x - location.x) + Math.abs(placed[i].y - location.y);
                if(distance < shipLengths[i]){
                    throw new Error();
                }
            }
            ships.push(randomShip);
            placed.push(location);
        }catch(error){
            i--;
        }
    }
    return ships;
}

function renderPlaceGrid(){
    const previousGrid = document.getElementById("placeGrid");
    if(previousGrid != null){
        content.removeChild(previousGrid);
    }

    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("id", "gridContainer");
    const grid = document.createElement("div");
    grid.setAttribute("id", "placeGrid");
    
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            const point = document.createElement("div");
            point.setAttribute("class", "point");
            grid.appendChild(point);
        }
    }

    const gridChildren = grid.querySelectorAll("*");
    for(let i = 0; i < playerShips.length; i++){
        const ship = playerShips[i];
        const start = gridChildren[ship.location.x * 10 + ship.location.y];
        start.textContent = ship.length;
        start.setAttribute("class", "ship");
        if(ship.isDown){
            for(let j = 1; j < ship.length; j++){
                gridChildren[(ship.location.x * 10)+ ship.location.y + j].setAttribute("class", "ship");
                gridChildren[(ship.location.x * 10)+ ship.location.y + j].textContent = ship.length;
            }
        }else{
            for(let j = 1; j < ship.length; j++){
                gridChildren[ship.location.x  + j + ship.location.y].setAttribute("class", "ship");
                gridChildren[ship.location.x  + j + ship.location.y].textContent = ship.length;
            }
        }
    }

    content.appendChild(grid);
}

function populateComputerMoves(){
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            computerMoves.push(new Point(i, j));
        }
    }
}

function renderPlayerGrid(player){
    if(!activeGame){
        return;
    }

    const gameBoard = player.gameBoard;
    const board = gameBoard.board;
    let grid = document.getElementById("playerGrid");;

    while(grid.hasChildNodes()){
        grid.removeChild(grid.lastChild);
    }

    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            const point = document.createElement("div");

            if(board[i][j] instanceof Point){
                point.setAttribute("class", "point");
            }else if(board[i][j] instanceof Ship){
                point.setAttribute("class", "ship");
                point.textContent = (board[i][j].length - board[i][j].hitCount);
            }else if(board[i][j] == "Hit"){
                point.setAttribute("class", "hit");
            }else if(board[i][j] === "Miss"){
                point.setAttribute("class", "miss");
                point.textContent = "o";
            }  

            grid.appendChild(point);
        }
    }
}

function renderHiddenGrid(computer){
    if(!activeGame){
        return;
    }

    const gameBoard = computer.gameBoard;
    const board = gameBoard.board;
    const grid = document.getElementById("computerGrid");
    while(grid.hasChildNodes()){
        grid.removeChild(grid.lastChild);
    }

    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            const point = document.createElement("div");
            point.setAttribute("class", "point");
            point.addEventListener("click", () => {
                if(playerTurn && point.getAttribute("class", "point") === "point"){
                    receiveAttack(computer, new Point(i, j));
                    renderHiddenGrid(computer);
                }
            })
            grid.appendChild(point);
        }
    }

    const missed = gameBoard.missed;
    const gridChildren = grid.querySelectorAll("*");
    for(let i = 0; i < missed.length; i++){
        const currMiss = missed[i];
        const missDiv = gridChildren[currMiss.x * 10 + currMiss.y];
        missDiv.setAttribute("class", "miss");
        missDiv.textContent = "o";
    }

    const hitArray = gameBoard.hits;
    for(let i = 0; i < hitArray.length; i++){
        const currHit = hitArray[i];
        gridChildren[currHit.x * 10 + currHit.y].setAttribute("class", "hit");
    }

}

function computerAttack(){
    const randomIndex = Math.floor(Math.random() * computerMoves.length);
    const randomAttack = computerMoves[randomIndex];
    computerMoves.splice(randomIndex, 1);
    receiveAttack(player, randomAttack);
    playerTurn = true;
    renderPlayerGrid(player);
}

function receiveAttack(player, point){
    const gameBoard = player.gameBoard;
    const board = gameBoard.board;

    let shipHit = gameBoard.receiveAttack(point);
    
    if(gameBoard.allShipsSunk()){
        gameOver(player);
        return;
    }

    if(shipHit && !playerTurn){
        computerAttack();
    }else if(shipHit && playerTurn){
        playerTurn = true;
    }
    else if(!shipHit){
        playerTurn = !playerTurn;
    }

    if(!playerTurn){
        computerAttack();
    }
}

function gameOver(loser){
    const gridContainer = document.getElementById("gridContainer");
    content.removeChild(gridContainer);

    const winElements = document.createElement("div");
    winElements.setAttribute("id", "winElements");
    const winnerText = document.createElement("p");
    winnerText.setAttribute("id", "winText");
    if(loser.isComputer){
        winnerText.textContent = "Player has won!";
    }else{
        winnerText.textContent = "Computer has won!";
    }

    player.gameBoard.hits = [];
    player.gameBoard.missed = [];
    computer.gameBoard.hits = [];
    computer.gameBoard.hits = [];

    const replayButton = document.createElement("button");
    replayButton.setAttribute("id", "replayButton");
    replayButton.textContent = "Replay";
    replayButton.addEventListener("click", () => {
        startGame();
    })

    const replaceButton = document.createElement("button");
    replaceButton.setAttribute("id", "replaceButton");
    replaceButton.textContent = "Replace";
    replaceButton.addEventListener("click", () => {
        setupGame();
    })

    winElements.appendChild(winnerText);
    winElements.appendChild(replayButton);
    winElements.appendChild(replaceButton);
    content.appendChild(winElements);
    activeGame = false;
}

function startGame(){
    console.log("START GAME CALLED WITH: ")
    console.log(playerShips);
    player = new Player(false, new GameBoard(playerShips));

    const computerShips = generateRandomShips();
    computer = new Player(true, new GameBoard(computerShips));

    const content = document.getElementById("content");
    
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild);
    }

    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("id", "gridContainer");
    content.appendChild(gridContainer);

    const computerGrid = document.createElement("div");
    computerGrid.setAttribute("id", "computerGrid");
    computerGrid.setAttribute("class", "gridContainer");

    const playerGrid = document.createElement("div");
    playerGrid.setAttribute("id", "playerGrid");
    playerGrid.setAttribute("class", "gridContainer");

    gridContainer.appendChild(playerGrid);
    gridContainer.appendChild(computerGrid);

    activeGame = true;
    populateComputerMoves();
    renderPlayerGrid(player);
    renderHiddenGrid(computer);
}

function setupGame(){
    const content = document.getElementById("content");
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild);
    }
    renderSetup();
    renderPlaceGrid();
}

setupGame();