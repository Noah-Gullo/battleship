import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

function renderGrid(player){
    const board = player.gameBoard.board;
    let grid;
    if(player.isComputer){
        grid = document.getElementById("computerGrid");
    }else{
        grid = document.getElementById("playerGrid");
    }

    while(grid.hasChildNodes()){
        grid.removeChild(grid.lastChild);
    }

    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            const point = document.createElement("div");
            if(board[i][j] instanceof Point){
                point.setAttribute("class", "point");
                point.addEventListener("click", () => {
                    board[i][j] = "Miss";
                    renderGrid(player);
                })
            }else if(board[i][j] instanceof Ship){
                point.setAttribute("class", "ship");
                point.addEventListener("click", () => {
                    recieveAttack(new Point(i,j), player.gameBoard);
                    board[i][j] = "Hit";
                    renderGrid(player);
                })
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

function recieveAttack(point, gameBoard){
    const board = gameBoard.board;
    const place = board[point.x][point.y];
    if(place instanceof Ship){
        console.log(place.hitCount);
        place.hit();
        console.log(place.hitCount);
    }
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

renderGrid(player);
renderGrid(computer);