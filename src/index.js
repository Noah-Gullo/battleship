import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

function renderGrid(board){
    const gridContainer = document.getElementById("gridContainer");
    const grid = document.createElement("div");
    grid.setAttribute("class", "grid");

    for(let i = 0; i < board[0].length; i++){
        for(let j = 0; j < board[0].length; j++){
            const place = document.createElement("div");
            if(board[i][j] instanceof Point){
                place.setAttribute("class", "point");
            }else if(board[i][j] instanceof Ship){
                place.setAttribute("class", "ship");
            }else if(board[i][j] === "Miss"){
                place.setAttribute("class", "miss");
            }   
            grid.appendChild(place);
        }
    }
    gridContainer.append(grid);
}

const playerShips = [];
playerShips[0] = new Ship(false, 3, new Point(3, 7));
playerShips[1] = new Ship(true, 2, new Point(6, 5));
playerShips[2] = new Ship(false, 3, new Point(0, 0));
const player = new Player(new GameBoard(playerShips));

const computerShips = [];
computerShips[0] = new Ship(true, 4, new Point(3, 2));
computerShips[1] = new Ship(false, 2, new Point(5, 1));
computerShips[2] = new Ship(false, 1, new Point(9,9));
const computer = new Player(new GameBoard(computerShips));

const content = document.getElementById("content");
const gridContainer = document.createElement("div");
gridContainer.setAttribute("id", "gridContainer");
content.appendChild(gridContainer);
renderGrid(player.gameBoard.board);
renderGrid(computer.gameBoard.board);