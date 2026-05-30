import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

let playerTurn = true;
let activeGame = true;

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

export function renderHiddenGrid(computer){
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
        gridChildren[currMiss.x * 10 + currMiss.y].setAttribute("class", "miss");
        gridChildren[currMiss.x * 10 + currMiss.y].textContent = "o";
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

    const winnerText = document.createElement("p");
    winnerText.setAttribute("class", "winText");
    if(loser.isComputer){
        winnerText.textContent = "Player has won!";
    }else{
        winnerText.textContent = "Computer has won!";
    }

    content.appendChild(winnerText);
    activeGame = false;
}

const playerShips = [];
playerShips[0] = new Ship(false, 3, new Point(3, 7));
playerShips[1] = new Ship(true, 2, new Point(8, 5));
playerShips[2] = new Ship(false, 3, new Point(2, 2));
const player = new Player(false, new GameBoard(playerShips));

const computerShips = [];
computerShips[0] = new Ship(true, 2, new Point(0, 0));
const computer = new Player(true, new GameBoard(computerShips));

const content = document.getElementById("content");
const gridContainer = document.createElement("div");
gridContainer.setAttribute("id", "gridContainer");
content.appendChild(gridContainer);

const computerGrid = document.createElement("div");
computerGrid.setAttribute("id", "computerGrid");
const playerGrid = document.createElement("div");
playerGrid.setAttribute("id", "playerGrid");
playerGrid.setAttribute("class", "gridContainer");
computerGrid.setAttribute("class", "gridContainer");
gridContainer.appendChild(playerGrid);
gridContainer.appendChild(computerGrid);
const computerMoves = [];

populateComputerMoves();
renderPlayerGrid(player);
renderHiddenGrid(computer);