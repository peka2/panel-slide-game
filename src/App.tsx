import { useState, useEffect } from 'react'
import './index.css'

const BOARD_SIZE = 4
const EMPTY = 0

type Board = number[]

function isSolvable(board: Board) {
  let inversions = 0
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] && board[j] && board[i] > board[j]) inversions++
    }
  }
  const rowFromBottom = BOARD_SIZE - Math.floor(board.indexOf(EMPTY) / BOARD_SIZE)
  if (BOARD_SIZE % 2 === 1) {
    return inversions % 2 === 0
  }
  return (inversions + rowFromBottom) % 2 === 0
}

function shuffleBoard(): Board {
  const arr = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i)
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (!isSolvable(arr) || isSolved(arr))
  return arr
}

function isSolved(board: Board) {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false
  }
  return true
}

function App() {
  const [board, setBoard] = useState<Board>(() => shuffleBoard())
  const [won, setWon] = useState(false)

  useEffect(() => {
    if (isSolved(board)) setWon(true)
  }, [board])

  const move = (index: number) => {
    const emptyIndex = board.indexOf(EMPTY)
    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE
    const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
    const emptyCol = emptyIndex % BOARD_SIZE
    const distance = Math.abs(row - emptyRow) + Math.abs(col - emptyCol)
    if (distance === 1) {
      const newBoard = [...board]
      newBoard[emptyIndex] = board[index]
      newBoard[index] = EMPTY
      setBoard(newBoard)
    }
  }

  const reset = () => {
    setWon(false)
    setBoard(shuffleBoard())
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Sliding Puzzle</h1>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 4rem)` }}
      >
        {board.map((value, idx) => (
          <button
            key={idx}
            onClick={() => move(idx)}
            className={
              value === EMPTY
                ? 'w-16 h-16 border border-gray-300 bg-gray-200'
                : 'w-16 h-16 flex items-center justify-center bg-blue-500 text-white font-semibold rounded'
            }
          >
            {value !== EMPTY && value}
          </button>
        ))}
      </div>
      {won && <div className="text-green-600 font-semibold">You solved it!</div>}
      <button
        onClick={reset}
        className="mt-2 px-4 py-2 rounded bg-gray-800 text-white"
      >
        Restart
      </button>
    </div>
  )
}

export default App
