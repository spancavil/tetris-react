import { ShapesObj } from "../types/shapeObj"

//Each block has a shape
export const SHAPES: ShapesObj = {
    I: {
        shape: [
            [false, false, false, false],
            [false, false, false, false],
            [true, true, true, true],
            [false, false, false, false],
        ],
    },
    J: {
        shape: [
            [false, false, false],
            [false, false, true],
            [true, true, true],
        ],
    },
    L: {
        shape: [
            [false, false, false],
            [true, false, false],
            [true, true, true],
        ],
    },
    O: {
        shape: [
            [true, true],
            [true, true],
        ],
    },
    S: {
        shape: [
            [false, false, false],
            [false, true, true],
            [true, true, false],
        ],
    },
    T: {
        shape: [
            [false, false, false],
            [false, true, false],
            [true, true, true],
        ],
    },
    Z: {
        shape: [
            [false, false, false],
            [true, true, false],
            [false, true, true],
        ],
    },
}
