import { Ship } from "../src/index.js";

test("Ship creation", () => {
    expect(new Ship(5)).toMatchObject({length: 5, hitCount: 0});
    expect(new Ship(3)).toMatchObject({length: 3, hitCount: 0});
})

test("Invalid ship creation", () => {
    expect(() => {Ship(5)}).toThrow();
    expect(() => {new Ship(-1)}).toThrow();
    expect(() => {new Ship(0)}).toThrow();
})

test("Ship hit increments hitCount", () => {
    const ship = new Ship(4);
    expect(ship.hitCount).toBe(0);
    ship.hit();
    expect(ship.hitCount).toBe(1);
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(3);
})

test("Ship correctly updates sunk status", () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})