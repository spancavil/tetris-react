import { BoardShape } from "../types"
import Cell from "./Cell"

type Props = {
    currentBoard: BoardShape
}

const Board = ({ currentBoard }: Props) => {
    return (
        <div className="board">
            {currentBoard.map((row, rowIndex) => {
                return (
                    <div className="row" key={`${rowIndex}`}>
                        {row.map((cell, colIndex) => (
                            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

export default Board
