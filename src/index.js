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
