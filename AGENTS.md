# Agent Guidelines

This repository contains a React + TypeScript implementation of a sliding puzzle game. The main features include:

- Board size selector allowing 3×3 or 4×4 layouts. The default is 3×3.
- The puzzle board is generated with a solvable shuffle.
- Tiles move when clicked if adjacent to the empty space. Movement logic uses functional state updates to avoid stale state issues.
- A BFS solver is available only for 3×3 boards and is triggered via a "Solve" button. The solution path is animated.
- A timer tracks elapsed play time, resetting on board size changes or game restarts. The timer stops once the puzzle is solved.
- Tailwind CSS powers the styling and animations (e.g., bounce and pulse effects).
- Linting uses ESLint and building uses Vite.

## Instructions for Codex

- Run `npm run lint` and `npm run build` after changes.
- Update this `AGENTS.md` whenever you modify game logic, UI behavior, or project configuration so it stays in sync with the implementation.
