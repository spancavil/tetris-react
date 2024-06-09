import Board from "./components/Board"
import Button from "./components/Button"
import UpcomingBlocks from "./components/UpcomingBlocks"
import { useTetris } from "./hooks/useTetris"

function App() {
    const {board, startGame, isPlaying, score, upcomingBlocks} = useTetris()
    return (
        <div className="app">
            <h1>Tetris</h1>
            <div className="board-container">
              <Board currentBoard={board} />
              <div className="controls">
                <div className="score">
                  <h2>Score: {score}</h2>
                </div>
                {isPlaying ? 
                  <UpcomingBlocks upcomingBlocks={upcomingBlocks}/>
                : (
                  <Button onClick={startGame} title="Start game"/>
                )}
              </div>
            </div>
        </div>
    )
}

export default App
