import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinner } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { resetGameStorage, saveGameStorage } from './logic/storage'

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFormStorage = window.localStorage.getItem('turn')
    return turnFormStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null) // null es que no hay ganador y false que hay un empate

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const checkEndGame = (newBoard) => {
    // Revisamos si hay empate cuando no hay mas espacios vacios en el tablero
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    // No actualizamos la posicion si ya tiene algo
    if (board[index] || winner) return

    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar de turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Guardar partida
    saveGameStorage({
      board: newBoard,
      turn
    })

    // Revisar si hay ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      // alert(`El ganador es ${newWinner}`);
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // EMPATE
    }
  }

  return (
    <main className='board'>
      <h1>Tres en raya</h1>
      <button onClick={resetGame}>Empezar de nuevo</button>
      <section className='game'>
        {board.map((_, index) => {
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
            >
              {board[index]}
            </Square>
          )
        })}
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
