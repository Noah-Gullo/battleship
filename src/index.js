import "./styles.css";

export class Ship{
    #length;
    #hitCount;
    #sunk;
    constructor(length){
        if(!new.target) throw new Error("Cannot call Ship constructor without 'new'");
        if(length < 1) throw new Error("Length must be greater than 0");
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
}
