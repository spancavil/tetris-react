import { BlockShape } from "./blockShape"
import { Block } from "./blocks"

export type ShapesObj = {
    [key in Block]: {
        shape: BlockShape
    }
}
