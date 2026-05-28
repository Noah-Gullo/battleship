import { Point, Ship, GameBoard, Player } from "./classes.js";
import "./styles.css";

const playerShips = [];
playerShips[0] = new Ship(false, 3, new Point(3, 7));
playerShips[1] = new Ship(true, 2, new Point(6, 5));
playerShips[2] = new Ship(false, 3, new Point(0, 0));
const player1 = new Player(new GameBoard(playerShips));

const computerShips = randomShips();
computerShips[0] = new Ship(true, 4, new Point(3, 2));
computerShips[1] = new Ship(false, 2, new Point(5, 1));
computerShips[2] = new Ship(false, 1, new Point(9,9));
const computer = new Player(new GameBoard(computerShips));