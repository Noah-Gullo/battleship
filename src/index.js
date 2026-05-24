import "./styles.css";

export class Ship{
    #length;
    #hitCount;
    #sunk;
    constructor(length){
        this.#length = length;
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

    get hitCount(){
        return this.#hitCount;
    }

    get sunk(){
        return this.#sunk
    }
}
