import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

let playerTurn = true;

function renderPlayerGrid(player){
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
            point.addEventListener("click", async () => {
                if(playerTurn){
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
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);
    const point = new Point(randomX, randomY);
    if(!(player.gameBoard.getPoint(point) instanceof Point)){
        computerAttack();
    }
    receiveAttack(player, point);
    playerTurn = true;
    renderPlayerGrid(player);
}

function receiveAttack(player, point){
    const gameBoard = player.gameBoard;
    const board = gameBoard.board;

    let shipHit = gameBoard.receiveAttack(point);
    
    if(gameBoard.allShipsSunk()){
        gameOver();
    }

    if(shipHit && !playerTurn){
        computerAttack();
    }else if(!shipHit){
        playerTurn = !playerTurn;
    }

    if(!playerTurn){
        computerAttack();
    }
}

function gameOver(){
    console.log("GAME OVER");
}

const playerShips = [];
playerShips[0] = new Ship(false, 3, new Point(3, 7));
playerShips[1] = new Ship(true, 2, new Point(8, 5));
playerShips[2] = new Ship(false, 3, new Point(2, 2));
const player = new Player(false, new GameBoard(playerShips));

const computerShips = [];
computerShips[0] = new Ship(true, 4, new Point(3, 2));
computerShips[1] = new Ship(false, 2, new Point(5, 1));
computerShips[2] = new Ship(false, 3, new Point(6,7));
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

renderPlayerGrid(player);
renderHiddenGrid(computer);