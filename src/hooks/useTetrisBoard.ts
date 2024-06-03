import { Dispatch, useReducer } from "react"
import { Block, BoardShape, EmptyCell } from "../types"
import { BlockShape } from "../types/blockShape"
import { SHAPES } from "../enums/shapes"
import { ACTION } from "../enums/actions"
import { BoardSize } from "../enums/boardSize"

export type BoardState = {
    board: BoardShape
    droppingRow: number
    droppingColumn: number
    droppingBlock: Block
    droppingShape: BlockShape
}

type Action = {
    type: ACTION
    newBoard?: BoardShape,
    newBlock?: Block,
    isPressingLeft?: boolean,
    isPressingRight?: boolean,
    isRotating?: boolean,
}

export function getRandomBlock(): Block {
    const blockValues = Object.values(Block)
    return blockValues[Math.floor(Math.random() * blockValues.length)] as Block
}

//Reducer define the logic
function boardReducer(state: BoardState, action: Action): BoardState {
    let newState = { ...state }
    switch (action.type) {
        case ACTION.START:
            const firstBlock = getRandomBlock()
            return {
                board: getEmptyBoard(),
                droppingRow: 0,
                droppingColumn: 3,
                droppingBlock: firstBlock,
                droppingShape: SHAPES[firstBlock].shape,
            }
        case ACTION.DROP:
            newState.droppingRow += 1
            break;
        case ACTION.COMMIT:
            return {
                board: [
                    ...getEmptyBoard(BoardSize.TALL - action.newBoard!.length),
                    ...action.newBoard!,
                ],
                droppingRow: 0,
                droppingColumn: 3,
                droppingBlock: action.newBlock as Block,
                droppingShape: SHAPES[action.newBlock as Block].shape,
            }
        case ACTION.MOVE:
            const rotatedShape = action.isRotating ? rotateBlock(newState.droppingShape): newState.droppingShape
            let columnOffset = action.isPressingLeft ? -1 : 0
            columnOffset = action.isPressingRight ? 1 : columnOffset

            if (!hasCollisions(newState.board, rotatedShape, newState.droppingRow, newState.droppingColumn + columnOffset)) {
                newState.droppingColumn += columnOffset
                newState.droppingShape = rotatedShape
            }
            break;
        default:
            const unhandledType = action.type
            throw new Error(`Unhandled action type: ${unhandledType}`)
    }
    return newState
}

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
    const [boardState, dispatchBoardState] = useReducer(
        //Reducer
        boardReducer,
        //Initial state
        {
            board: [],
            droppingRow: 0,
            droppingColumn: 0,
            droppingBlock: Block.I, //It's the same any block
            droppingShape: SHAPES.I.shape, //It's the same any shape
        },
        //Init function
        (emptyState) => {
            const state = {
                ...emptyState,
                board: getEmptyBoard(),
            }
            return state
        }
    )

    return [boardState, dispatchBoardState]
}

//Empty board
export function getEmptyBoard(height = BoardSize.TALL): BoardShape {
    const board = Array(height)
        .fill(null)
        .map(() => Array(BoardSize.WIDE).fill(EmptyCell.Empty))
    return board
}

export function hasCollisions(
    board: BoardShape,
    currentShape: BlockShape,
    row: number,
    column: number
): boolean {
    
    let hasCollisions = false
    currentShape
        .filter((shapeRow) => shapeRow.some((isSet) => isSet))
        .forEach((shapeRow: boolean[], rowIndex: number) => {
            shapeRow.forEach((isSet: boolean, colIndex: number) => {
                if (
                    isSet &&
                    (row + rowIndex >= board.length ||
                        column + colIndex >= board[0].length ||
                        column + colIndex < 0 ||
                        board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
                ) {
                    hasCollisions = true
                }
            })
        })

    return hasCollisions
}

function rotateBlock (shape: BlockShape): BlockShape {
    const rows = shape.length
    const columns = shape[0].length

    const rotated = Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(false))
    
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            rotated[column][rows - 1 - row] = shape[row][column]
        }
    }

    return rotated
}
