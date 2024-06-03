import { useCallback, useEffect, useState } from "react"
import { getRandomBlock, hasCollisions, useTetrisBoard } from "./useTetrisBoard"
import { TickSpeed } from "../enums/tickSpeed"
import { useInterval } from "./useInterval"
import { ACTION } from "../enums/actions"
import { Block, BoardShape, EmptyCell } from "../types"
import { BlockShape } from "../types/blockShape"
import { BoardSize } from "../enums/boardSize"
import { SHAPES } from "../enums/shapes"

export function useTetris() {
    const [score, setScore] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null)
    const [isCommitting, setIsCommitting] = useState(false)
    const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([])

    const [
        { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
        dispatchBoardState,
    ] = useTetrisBoard()

    useEffect(()=> {

        if (!isPlaying) {
            return
        }
        let isPressingLeft = false
        let isPressingRight = false
        let moveIntervalId: number | undefined

        const updateMovementInterval = () => {
            clearInterval(moveIntervalId)
            dispatchBoardState({
                type: ACTION.MOVE,
                isPressingLeft,
                isPressingRight
            })
            moveIntervalId = setInterval(()=> {
                dispatchBoardState({
                    type: ACTION.MOVE,
                    isPressingLeft,
                    isPressingRight
                })
            }, 150)
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return

            if (event.key === 'ArrowDown') {
                console.log("down");
                
                setTickSpeed(TickSpeed.Fast)
            }
            if (event.key === 'ArrowUp') {
                dispatchBoardState({
                    type: ACTION.MOVE,
                    isRotating: true,
                })
            }
            if (event.key === 'ArrowLeft') {
                isPressingLeft = true
                updateMovementInterval()
            }
            if (event.key === 'ArrowRight') {
                isPressingRight = true
                updateMovementInterval()
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown') {
              setTickSpeed(TickSpeed.Normal);
            }
      
            if (event.key === 'ArrowLeft') {
              isPressingLeft = false;
              updateMovementInterval()
            }
      
            if (event.key === 'ArrowRight') {
              isPressingRight = false;
              updateMovementInterval()
            }
          };

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
            clearInterval(moveIntervalId)
            setTickSpeed(TickSpeed.Normal)
        }
    }, [isPlaying])

    //This function is memoized as well as gameTick
    const startGame = useCallback(() => {
        const startingBlocks = [
            getRandomBlock(),
            getRandomBlock(),
            getRandomBlock()
        ]
        setUpcomingBlocks(startingBlocks)
        setIsPlaying(true)
        setTickSpeed(TickSpeed.Normal)
        dispatchBoardState({type: ACTION.START})
    }, [dispatchBoardState])
    
    const commitPosition = useCallback(()=> {
        if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)){
            setIsCommitting(false)
            setTickSpeed(TickSpeed.Normal)
            return
        }
        const newBoard = structuredClone(board) as BoardShape

        AddShapeToBoard(
            newBoard,
            droppingBlock,
            droppingShape,
            droppingRow,
            droppingColumn
        )

        //Clear fullfilled line
        let linesCleared = 0
        for (let row = BoardSize.TALL - 1; row >= 0; row--) {
            if (newBoard[row].every(entry => entry !== EmptyCell.Empty)) {
                linesCleared++
                newBoard.splice(row, 1)
            }
        }

        //New upcoming block
        const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[]
        const newBlock = newUpcomingBlocks.pop() as Block
        newUpcomingBlocks.unshift(getRandomBlock())

        if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)){
            setIsPlaying(false)
            setTickSpeed(null)
        } else {
            setTickSpeed(TickSpeed.Normal)
        }
        setScore(prevScore => prevScore + getPoints(linesCleared))
        setUpcomingBlocks(newUpcomingBlocks)
        dispatchBoardState({type: ACTION.COMMIT, newBoard, newBlock})
        setIsCommitting(false)

    }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape])    

    useInterval(()=> {
        if (!isPlaying) return
        gameTick();
    }, tickSpeed)

    /**
     * This function "gameTick" will be memoized, 
     *unless the function dispatchBoardState changes. This will prevent unnneccesary rerenders
    */
    const gameTick = useCallback(()=> {
        if (isCommitting) {
            console.log("committing");            
            commitPosition()
        }
        else if (
            hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn )
        ) {
            console.log("Has collisions..");            
            setTickSpeed(TickSpeed.Sliding)
            setIsCommitting(true)
        } else {
            dispatchBoardState({type: ACTION.DROP})
        }
    }, [dispatchBoardState, board, droppingShape, droppingRow, droppingColumn, isCommitting, commitPosition])

    /**
     * In this case a new reference of "gameTick" is created on every render.
    */
    /* const gameTick = () => {
        dispatchBoardState({type: ACTION.DROP})
    } */

    /**
     * renderedBoard clones an object into a new variable 
     */
    const renderedBoard = structuredClone(board) as BoardShape
    if (isPlaying) {
        AddShapeToBoard(
            renderedBoard,
            droppingBlock,
            droppingShape,
            droppingRow,
            droppingColumn
        )
    }

    function AddShapeToBoard(
        board: BoardShape,
        droppingBlock: Block,
        droppingShape: BlockShape,
        droppingRow: number,
        droppingColumn: number,
    ) {
        droppingShape
        .filter(row => row.some((isSet)=> isSet))
        .forEach((row: boolean[], rowIndex: number) => {
            row.forEach((isSet: boolean, colIndex:number) => {
                // console.log(board);                
                // console.log({rowPlusRowIndex:droppingRow+rowIndex})
                // console.log({columnPlusColIndex: droppingColumn+colIndex})
                if (isSet) {
                    board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock
                }
            })
        })
    }

    return {
        board: renderedBoard,
        startGame,
        isPlaying,
        score,
        upcomingBlocks
    }
}

function getPoints(linesCleared: number): number {
    switch (linesCleared) {
        case 0:
            return 0
        case 1:
            return 100;
        case 2:
            return 300
        case 3:
            return 500
        case 4:
            return 800
        default:
            throw new Error ('Unexpected number of lines cleared.')
    }
}
