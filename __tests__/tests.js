import { Ship } from "../src/index.js";

test("Ship creation", () => {
    expect(new Ship(5)).toMatchObject({length: 5, hitCount: 0, sunk: false});
})