import { Point, Ship, GameBoard, Player } from "../src/classes.js";

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

test("Invalid get Point", () => {
    const board = new GameBoard([]);
    expect(() => {board.getPoint(new Point(-1, 5))}).toThrow();
    expect(() => {board.getPoint(new Point(15, 5))}).toThrow();
    expect(() => {board.getPoint(new Point(5, -1))}).toThrow();
    expect(() => {board.getPoint(new Point(5, 15))}).toThrow();
})

test("Valid getPoint", () => {
    const ships = [];
    ships[0] = new Ship(true, 2, new Point(2, 8));
    ships[1] = new Ship(false, 3, new Point(7, 9));
    const board = new GameBoard(ships);
    board.receiveAttack(new Point(4, 3));
    
    expect(board.getPoint(new Point(0, 0))).toEqual(new Point(0,0));
    expect(board.getPoint(new Point(2, 8))).toEqual(ships[0]);
    expect(board.getPoint(new Point(3, 8))).toEqual(ships[0]);
    expect(board.getPoint(new Point(7, 9))).toEqual(ships[1]);
    expect(board.getPoint(new Point(4, 3))).toEqual("Miss");
})

test("Gameboard can place ships on valid points", () => {
    const ships = [];
    ships[0] = new Ship(true, 3, new Point(0,0));
    ships[1] = new Ship(false, 5, new Point(5,5));
    ships[2] = new Ship(false, 3, new Point(7,9));
    const board = new GameBoard(ships);
    expect(board.getPoint(new Point(0,0))).toEqual(ships[0]);
    expect(board.getPoint(new Point(0,1))).toEqual(ships[0]);
    expect(board.getPoint(new Point(0,2))).toEqual(ships[0]);
    expect(board.getPoint(new Point(5,5))).toEqual(ships[1]);
    expect(board.getPoint(new Point(6,5))).toEqual(ships[1]);
    expect(board.getPoint(new Point(7,5))).toEqual(ships[1]);
    expect(board.getPoint(new Point(7,9))).toEqual(ships[2]);
    expect(board.getPoint(new Point(8,9))).toEqual(ships[2]);
    expect(board.getPoint(new Point(9,9))).toEqual(ships[2]);
})

test("receiveAttack adds to missed correctly", () => {
    const board = new GameBoard([]);
    board.receiveAttack(new Point(0, 5));
    board.receiveAttack(new Point(0, 7));
    board.receiveAttack(new Point(9, 9));

    expect(board.missed).toStrictEqual([new Point(0, 5), new Point(6, 7), new Point(9, 9)]);
    expect(board.getPoint(new Point(0, 5))).toBe("Miss");
    expect(board.getPoint(new Point(0, 7))).toBe("Miss");
    expect(board.getPoint(new Point(9, 9))).toBe("Miss");
})

test("All ships sunk", () => {
    const ships = [];
    ships[0] = new Ship(true, 2, new Point(2,3));
    ships[1] = new Ship(false, 1, new Point(9,9));
    ships[2] = new Ship(true, 3, new Point(5,5));
    const board = new GameBoard(ships);
    expect(board.allShipsSunk()).toBe(false);
    board.receiveAttack(new Point(2, 3));
    board.receiveAttack(new Point(2, 4));
    expect(board.allShipsSunk()).toBe(false);
    board.receiveAttack(new Point(9, 9));
    expect(board.allShipsSunk()).toBe(false);
    board.receiveAttack(new Point(5, 5));
    board.receiveAttack(new Point(5, 6));
    board.receiveAttack(new Point(5, 7));
    expect(board.allShipsSunk()).toBe(true);
})

test("Invalid Player creation", () => {
    expect(() => {new Player(true, null)}).toThrow();
})

test("Valid Player creation", () => {
    const ships = [];
    ships[0] = new Ship(true, 2, new Point(2,3));
    ships[1] = new Ship(false, 1, new Point(9,9));
    ships[2] = new Ship(true, 3, new Point(5,5));
    const board = new GameBoard(ships);
    expect(new Player(board)).toMatchObject({gameBoard: board});
})