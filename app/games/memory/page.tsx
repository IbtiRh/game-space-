'use client'

import { useEffect, useState } from 'react'

interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  const symbols = ['🌟', '🎮', '🎯', '🎪', '🎨', '🎭', '🎬', '🎤']

  useEffect(() => {
    // Initialize game
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
  }, [])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      const isMatch = cards[first].value === cards[second].value

      if (isMatch) {
        setMatched([...matched, first, second])
      }

      setMoves(moves + 1)

      setTimeout(() => {
        setFlipped([])
      }, 500)
    }
  }, [flipped])

  const handleCardClick = (id: number) => {
    if (flipped.includes(id) || matched.includes(id)) return
    if (flipped.length === 2) return

    setFlipped([...flipped, id])
  }

  const resetGame = () => {
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
  }

  const isGameWon = matched.length === cards.length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = '/'
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Memory Match
        </h1>
        <p className="text-slate-400 mt-2">Find matching pairs!</p>
      </div>

      <div className="mb-8 flex gap-8 justify-center">
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-6 py-3">
          <p className="text-slate-400 text-sm">Moves</p>
          <p className="text-2xl font-bold text-purple-400">{moves}</p>
        </div>
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-6 py-3">
          <p className="text-slate-400 text-sm">Matched</p>
          <p className="text-2xl font-bold text-pink-400">{matched.length / 2}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-20 h-20 rounded-lg font-bold text-2xl transition-all duration-200 transform hover:scale-105 ${
              flipped.includes(card.id) || matched.includes(card.id)
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                : 'bg-slate-700 hover:bg-slate-600 border border-purple-500/30'
            } ${matched.includes(card.id) ? 'opacity-100 cursor-default' : 'cursor-pointer'}`}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? card.value : '?'}
          </button>
        ))}
      </div>

      {isGameWon && (
        <div className="text-center">
          <p className="text-xl font-bold text-green-400 mb-4">🎉 You Won! 🎉</p>
          <p className="text-slate-400 mb-4">Completed in {moves} moves</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Play Again
          </button>
        </div>
      )}

      {!isGameWon && (
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 border border-purple-500/30 rounded-lg text-slate-300 font-medium transition-all"
        >
          Reset Game
        </button>
      )}

      <p className="mt-8 text-slate-400 text-sm">Press ESC to return to menu</p>
    </div>
  )
}
