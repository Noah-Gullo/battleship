import "./styles.css";

export class Point{
    #x;
    #y;
    constructor(x, y){
        this.#x = x;
        this.#y = y;
    }

    onGrid(){
        if(this.#x < 0 || this.#x > 9 || this.#y < 0 || this.#y > 9){
            return false;
        }
        return true;
    }
    
    equals(point){
        if(this.#x === point.x && this.#y === point.y) return true;
        return false;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }
}

export class Ship{
    #length;
    #location;
    #hitCount;
    #sunk;
    constructor(length, location){
        if(!new.target) throw new Error("Cannot call Ship constructor without 'new'");
        if(length < 1) throw new Error("Length must be greater than 0");
        if(!(location instanceof Point)) throw new Error("Location must be a Point instance.");
        if(!location.onGrid()) throw new Error("Ship must be located on 10x10 grid starting at (0,0)."); 
        this.#length = length;
        this.#location = location;
        this.#hitCount = 0;
        this.#sunk = false; 
    }
    
    hit(){
        this.#hitCount++;
        this.#sunk = this.isSunk();
    }

    isSunk(){
        if(this.#hitCount >= this.#length){
            return true;
        }
        return false;
    }

    get length(){
        return this.#length;
    }

    get location(){
        return this.#location;
    }
    
    get hitCount(){
        return this.#hitCount;
    }
}

export class GameBoard{
    #board
    #missed
    #ships
    constructor(ships){
        this.#board = [[],[],[],[],[],[],[],[],[],[]];
        this.createBoard();
        this.#missed = [];
        this.#ships = ships;
        this.placeShips();
    }

    createBoard(){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                this.#board[i].push(new Point(i, j));
            }
        }
    }

    placeShips(){
        for(let i = 0; i < this.#ships.length;i++){
            let ship = this.#ships[i];
            this.#board[ship.location.x][ship.location.y] = ship;
        }   
    }

    receiveAttack(point){
        if(!(point instanceof Point)) throw new Error("receiveAttack must receive a point as an argument.");
        for(let i = 0; i < this.#ships.length; i++){
            if(this.#ships[i].location(point)){
                this.#ships.hit();
                this.allShipsSunk();
                return;
            }
        }
    
        this.#missed.push(point);    
    }

    allShipsSunk(){
        for(let i = 0; i < this.#ships.length; i++){
            if(!this.#ships[i].isSunk){
                return false;
            }
        }

        return true;
    }

    get ships(){
        return this.#ships;
    }
}
const ships = [];
ships[0] = new Ship(5, new Point(0,0));
const board = new GameBoard(ships);
console.log(board);