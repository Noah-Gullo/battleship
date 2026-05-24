import { Point, Ship } from "../src/index.js";

test("Ship creation", () => {
    expect(new Ship(5, new Point(0,0))).toMatchObject({length: 5, hitCount: 0, location: new Point(0,0)});
    expect(new Ship(3, new Point(2,3))).toMatchObject({length: 3, hitCount: 0, location: new Point(2,3)});
})

test("Invalid ship creation", () => {
    expect(() => {Ship(5, new Point(0,0))}).toThrow();
    expect(() => {new Ship(-1, new Point(0,0))}).toThrow();
    expect(() => {new Ship(0, new Point(0,0))}).toThrow();
    expect(() => {new Ship(5, new Point(-1,4))}).toThrow();
    expect(() => {new Ship(5, new Point(10,4))}).toThrow();
    expect(() => {new Ship(5, new Point(2,-1))}).toThrow();
    expect(() => {new Ship(5, new Point(2,10))}).toThrow();
})

test("Ship hit increments hitCount", () => {
    const ship = new Ship(4, new Point(0,0));
    expect(ship.hitCount).toBe(0);
    ship.hit();
    expect(ship.hitCount).toBe(1);
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(3);
})

test("Ship correctly updates sunk status", () => {
    const ship = new Ship(3, new Point(0,0));
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
