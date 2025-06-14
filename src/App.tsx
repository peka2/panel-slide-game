import { useState, useEffect, useRef } from 'react'
import './index.css'

const EMPTY = 0

type Board = number[]

function isSolvable(board: Board, size: number) {
  let inversions = 0
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] && board[j] && board[i] > board[j]) inversions++
    }
  }
  const rowFromBottom = size - Math.floor(board.indexOf(EMPTY) / size)
  if (size % 2 === 1) {
    return inversions % 2 === 0
  }
  return (inversions + rowFromBottom) % 2 === 0
}

function shuffleBoard(size: number): Board {
  const arr = Array.from({ length: size * size }, (_, i) => i)
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (!isSolvable(arr, size) || isSolved(arr))
  return arr
}

function isSolved(board: Board) {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false
  }
  return true
}

function App() {
  const [boardSize, setBoardSize] = useState(4)
  const [board, setBoard] = useState<Board>(() => shuffleBoard(4))
  const [won, setWon] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (isSolved(board)) {
      setWon(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [board])

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTime])

  const move = (index: number) => {
    setBoard((prev) => {
      const emptyIndex = prev.indexOf(EMPTY)
      const row = Math.floor(index / boardSize)
      const col = index % boardSize
      const emptyRow = Math.floor(emptyIndex / boardSize)
      const emptyCol = emptyIndex % boardSize
      const distance = Math.abs(row - emptyRow) + Math.abs(col - emptyCol)
      if (distance === 1) {
        const newBoard = [...prev]
        newBoard[emptyIndex] = prev[index]
        newBoard[index] = EMPTY
        return newBoard
      }
      return prev
    })
  }

  const reset = () => {
    setWon(false)
    setBoard(shuffleBoard(boardSize))
    setStartTime(Date.now())
    setElapsed(0)
  }

  const changeSize = (size: number) => {
    setBoardSize(size)
    setWon(false)
    setBoard(shuffleBoard(size))
    setStartTime(Date.now())
    setElapsed(0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Sliding Puzzle</h1>
      <div className="flex items-center gap-2">
        <label htmlFor="size" className="font-medium">Board Size:</label>
        <select
          id="size"
          value={boardSize}
          onChange={(e) => changeSize(parseInt(e.target.value))}
          className="p-1 border rounded"
        >
          <option value={3}>3 x 3</option>
          <option value={4}>4 x 4</option>
        </select>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${boardSize}, 4rem)` }}
      >
        {board.map((value, idx) => (
          <button
            key={idx}
            onClick={() => move(idx)}
            className={
              value === EMPTY
                ? 'w-16 h-16 border border-gray-300 bg-gray-200'
                : 'w-16 h-16 flex items-center justify-center bg-blue-500 text-white font-semibold rounded transition-transform duration-300 hover:scale-105 active:scale-95 active:animate-bounce'
            }
          >
            {value !== EMPTY && value}
          </button>
        ))}
      </div>
      <div className="text-lg font-bold">Time: {Math.floor(elapsed / 1000)}s</div>
      {won && (
        <div className="text-green-600 font-semibold animate-pulse">
          You solved it!
        </div>
      )}
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
