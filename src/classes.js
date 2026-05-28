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
    #isDown
    #length;
    #location;
    #hitCount;
    #sunk;
    constructor(isDown, length, location){
        if(isDown != true && isDown != false) throw new Error("Ship isDown must be either 'true' or 'false'.");
        if(!new.target) throw new Error("Cannot call Ship constructor without 'new'.");
        if(length < 1) throw new Error("Length must be greater than 0.");
        if(!(location instanceof Point)) throw new Error("Location must be a Point instance.");
        this.#length = length;
        this.#location = location;
        this.#hitCount = 0;
        this.#sunk = false; 
        this.#isDown = isDown;
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

        if(this.#isDown === false){
            end = new Point(this.#location.x + this.#length - 1, this.#location.y);
        }else if(this.#isDown === true){
            end = new Point(this.#location.x, this.#location.y + this.#length - 1);
        }

        if(!this.#location.onGrid()) throw new Error("Ship start must be located on 10x10 grid starting at (0,0).")
        if(!end.onGrid()) throw new Error("Ship end must be located on 10x10 grid starting at (0,0)."); 
    }

    get isDown(){
        return this.#isDown;
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
            if(ship.isDown === false){
                for(let j = ship.location.x; j < ship.location.x + ship.length; j++){
                    this.#board[ship.location.y][j] = ship;  
                }
            }else if(ship.isDown === true){
                for(let j = ship.location.y; j < ship.location.y + ship.length; j++){
                    this.#board[j][ship.location.x] = ship;  
                }
            }
        }   
    }

    receiveAttack(point){
        if(!(point instanceof Point)) throw new Error("receiveAttack must receive a point as an argument.");
        if(point.x < 0 || point.x > 9  || point.y < 0 || point.y > 9) throw new Errror("Point passed is not in grid");
        if(this.getPoint(point) instanceof Ship){
            const ship = this.getPoint(point)
            ship.hit();
            this.allShipsSunk();
            return;
        }
        
        this.#board[point.y][point.x] = "Miss";
        this.#missed.push(point);    
    }

    allShipsSunk(){
        for(let i = 0; i < this.#ships.length; i++){
            if(!this.#ships[i].isSunk()){
                return false;
            }
        }

        return true;
    }

    getPoint(point){
        if(!(point instanceof Point)) throw new Error("getPoint expects a 'Point' argument");
        if(point.x < 0 || point.x > 9  || point.y < 0 || point.y > 9) throw new Errror("Point passed is not in grid");
        return this.#board[point.y][point.x];
    }

    get ships(){
        return this.#ships;
    }

    get board(){
        return this.#board;
    }

    get missed(){
        return this.#missed;
    }
}

export class Player{
    #gameBoard;
    constructor(gameBoard){
        if (!(gameBoard instanceof GameBoard)) throw new Error("Board argument must be a 'GameBoard'");
        this.#gameBoard = gameBoard;
    }

    get gameBoard(){
        return this.#gameBoard;
    }
}