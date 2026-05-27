import { Point, Ship, GameBoard } from "../src/index.js";

test("Ship creation", () => {
    expect(new Ship(false, 5, new Point(0,0))).toMatchObject({length: 5, hitCount: 0, location: new Point(0,0)});
    expect(new Ship(true, 3, new Point(2,3))).toMatchObject({length: 3, hitCount: 0, location: new Point(2,3)});
})

test("Invalid ship creation", () => {
    expect(() => {Ship(5, new Point(0,0))}).toThrow();
    expect(() => {new Ship(true, -1, new Point(0,0))}).toThrow();
    expect(() => {new Ship(false, 0, new Point(0,0))}).toThrow();
    expect(() => {new Ship(true, 5, new Point(-1,4))}).toThrow();
    expect(() => {new Ship(false, 5, new Point(10,4))}).toThrow();
    expect(() => {new Ship(false, 5, new Point(2,-1))}).toThrow();
    expect(() => {new Ship(true, 5, new Point(2,10))}).toThrow();
})

test("Ship hit increments hitCount", () => {
    const ship = new Ship(false, 4, new Point(0,0));
    expect(ship.hitCount).toBe(0);
    ship.hit();
    expect(ship.hitCount).toBe(1);
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(3);
})

test("Ship correctly updates sunk status", () => {
    const ship = new Ship(false, 3, new Point(0,0));
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})

test("Valid points on the grid", () => {
    expect(new Point(0,0).onGrid()).toBe(true);
    expect(new Point(9,0).onGrid()).toBe(true);
    expect(new Point(0,9).onGrid()).toBe(true);
    expect(new Point(9,9).onGrid()).toBe(true);

    expect(new Point(5,3).onGrid()).toBe(true);
    expect(new Point(2,8).onGrid()).toBe(true);
    expect(new Point(7,4).onGrid()).toBe(true);
})

test("Invalid points on the grid", () => {
    expect(new Point(-1,5).onGrid()).toBe(false);
    expect(new Point(10,5).onGrid()).toBe(false);
    expect(new Point(5,-1).onGrid()).toBe(false);
    expect(new Point(5,-10).onGrid()).toBe(false);
    expect(new Point(-1,-5).onGrid()).toBe(false);
    expect(new Point(10,10).onGrid()).toBe(false);
})

test("Point equality", () => {
    const p1 = new Point(0, 1);
    expect(p1.equals(new Point(0,1))).toBe(true);
    expect(p1.equals(new Point(1,0))).toBe(false);

    const p2 = new Point(-1, 100);
    expect(p2.equals(new Point(-1,100))).toBe(true);

    const p3 = new Point(5, 3);
    expect(p3.equals(new Point(5,3))).toBe(true);
})

test("Gameboard creation", () => {
    const ships = [];
    ships[0] = new Ship(true, 5, new Point(0, 3));
    ships[1] = new Ship(false, 2, new Point(0,0));
    expect(new GameBoard(ships)).toMatchObject({ships: ships});
})

test("Invalid getCol/getRow", () => {
    const board = new GameBoard([]);
    expect(() => {board.getCol(-1)}).toThrow();
    expect(() => {board.getCol(10)}).toThrow();
    expect(() => {board.getRow(-1)}).toThrow();
    expect(() => {board.getRow(10)}).toThrow();
})

test("Valid getCol/getRow", () => {
    const ships = [];
    ships[0] = new Ship(true, 2, new Point(2, 8));
    ships[1] = new Ship(false, 3, new Point(7, 9));
    const board = new GameBoard(ships);
    const col = [new Point(0, 8), new Point(1, 8), new Point(2, 8), new Point(3, 8), new Point(4, 8), new Point(5, 8),
                 new Point(6, 8), new Point(7, 8), ships[0], ships[0]];
    const row = [new Point(9, 0), new Point(9, 1), ships[0], new Point(9, 3), new Point(9, 4), 
                 new Point(9, 5), new Point(9, 6), ships[1], ships[1], ships[1]];
    
    expect(board.getCol(2)).toStrictEqual(col);
    expect(board.getRow(9)).toStrictEqual(row);
})

test("Gameboard can place ships on valid points", () => {
    const ships = [];
    ships[0] = new Ship(true, 3, new Point(0,0));
    ships[1] = new Ship(false, 5, new Point(5,5));
    ships[2] = new Ship(false, 3, new Point(7,9));
    const col0 = [ships[0], ships[0], ships[0], new Point(0,3), new Point(0, 4), new Point(0,5), new Point(0,6), 
                  new Point(0,7), new Point(0,8), new Point(0, 9)];
    const row5 = [new Point(5,0), new Point(5, 1), new Point(5, 2), new Point(5, 3), new Point(5, 4), ships[1], ships[1], 
                  ships[1], ships[1], ships[1]];
    const row9 = [new Point(9,0), new Point(9,1), new Point(9,2), new Point(9,3), new Point(9,4), new Point(9,5), new Point(9,6),
                  ships[2], ships[2], ships[2]];
    const board = new GameBoard(ships);
    expect(board.getCol(0)).toStrictEqual(col0);
    expect(board.getRow(5)).toStrictEqual(row5);
    expect(board.getRow(9)).toStrictEqual(row9);
})
