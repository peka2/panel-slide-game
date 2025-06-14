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

function solve(board: Board, size: number): Board[] | null {
  const goal = Array.from({ length: size * size }, (_, i) =>
    (i + 1) % (size * size)
  ).join(',')
  const start = board.join(',')
  if (start === goal) return [board]
  const queue: Board[] = [board]
  const visited = new Set<string>([start])
  const prev = new Map<string, string | null>()
  prev.set(start, null)

  while (queue.length) {
    const current = queue.shift()!
    const key = current.join(',')
    if (key === goal) {
      const path: Board[] = []
      let k: string | null = key
      while (k) {
        path.push(k.split(',').map(Number))
        k = prev.get(k) ?? null
      }
      return path.reverse()
    }

    const emptyIdx = current.indexOf(EMPTY)
    const row = Math.floor(emptyIdx / size)
    const col = emptyIdx % size
    const moves = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ]
    for (const [r, c] of moves) {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        const idx = r * size + c
        const next = [...current]
        next[emptyIdx] = next[idx]
        next[idx] = EMPTY
        const nextKey = next.join(',')
        if (!visited.has(nextKey)) {
          visited.add(nextKey)
          prev.set(nextKey, key)
          queue.push(next)
        }
      }
    }
  }
  return null
}

function App() {
  const [boardSize, setBoardSize] = useState(3)
  const [board, setBoard] = useState<Board>(() => shuffleBoard(3))
  const [won, setWon] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)
  const solveRef = useRef<number | null>(null)

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

  const autoSolve = () => {
    if (boardSize !== 3 || solveRef.current) return
    const path = solve(board, 3)
    if (!path) return
    let step = 1
    solveRef.current = window.setInterval(() => {
      setBoard(path[step])
      step++
      if (step >= path.length) {
        if (solveRef.current) {
          clearInterval(solveRef.current)
          solveRef.current = null
        }
      }
    }, 300)
  }

  const reset = () => {
    setWon(false)
    if (solveRef.current) {
      clearInterval(solveRef.current)
      solveRef.current = null
    }
    setBoard(shuffleBoard(boardSize))
    setStartTime(Date.now())
    setElapsed(0)
  }

  const changeSize = (size: number) => {
    setBoardSize(size)
    setWon(false)
    if (solveRef.current) {
      clearInterval(solveRef.current)
      solveRef.current = null
    }
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
      {boardSize === 3 && (
        <button
          onClick={autoSolve}
          className="mt-2 px-4 py-2 rounded bg-green-700 text-white"
        >
          Solve
        </button>
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
