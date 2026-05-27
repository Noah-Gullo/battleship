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
    #direction
    #length;
    #location;
    #hitCount;
    #sunk;
    constructor(direction, length, location){
        if(direction != "right" && direction != "down") throw new Error("Ship direction must be either 'down' or 'right'.");
        if(!new.target) throw new Error("Cannot call Ship constructor without 'new'.");
        if(length < 1) throw new Error("Length must be greater than 0.");
        if(!(location instanceof Point)) throw new Error("Location must be a Point instance.");
        this.#length = length;
        this.#location = location;
        this.#hitCount = 0;
        this.#sunk = false; 
        this.#direction = direction;
        this.#checkValidPlacement();
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

    #checkValidPlacement(){
        let end;

        if(this.#direction === "right"){
            end = new Point(this.#location.x + this.#length - 1, this.#location.y);
        }else if(this.#direction === "down"){
            end = new Point(this.#location.x, this.#location.y + this.#length - 1);
        }

        if(!this.#location.onGrid() || !end.onGrid()) throw new Error("Ship must be located on 10x10 grid starting at (0,0)."); 
    }

    get direction(){
        return this.#direction;
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
            if(ship.direction == "right"){
                for(let j = ship.location.x; j < ship.location.x + ship.length; j++){
                    this.#board[ship.location.y][j] = ship;  
                }
            }else if(ship.direction == "down"){
                for(let j = ship.location.y; j < ship.location.y + ship.length; j++){
                    this.#board[j][ship.location.x] = ship;  
                }
            }
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

    getCol(colNum){
        let arr = [];
        if(colNum < 0 || colNum > 9) throw new Error("Invalid column number");
        for(let i = 0; i < this.#board[0].length; i++){
            arr.push(this.#board[i][colNum]);
        }
        return arr;
    }

    getRow(rowNUm){
        let arr = [];
        if(rowNUm < 0 || row1 > 9) throw new Error("Invalid row number");
        for(let i = 0; i < this.#board[0].length; i++){
            arr.push(this.#board[rowNUm][i]);
        }
        return arr;
    }

    get ships(){
        return this.#ships;
    }

    get board(){
        return this.#board;
    }
}