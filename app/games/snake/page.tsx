'use client'

import { useEffect, useRef, useState } from 'react'

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gridSize = 20
    const tileCount = canvas.width / gridSize

    let snake: Array<{ x: number; y: number }> = [{ x: 10, y: 10 }]
    let food = { x: 15, y: 15 }
    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }
    let gameScore = 0
    let isGameRunning = false

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      }
      // Ensure food doesn't spawn on snake
      if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          isGameRunning = !isGameRunning
          setGameStarted(!gameStarted)
          break
        case 'ArrowUp':
          if (direction.y === 0) nextDirection = { x: 0, y: -1 }
          break
        case 'ArrowDown':
          if (direction.y === 0) nextDirection = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
          if (direction.x === 0) nextDirection = { x: -1, y: 0 }
          break
        case 'ArrowRight':
          if (direction.x === 0) nextDirection = { x: 1, y: 0 }
          break
        case 'Escape':
          window.location.href = '/'
          break
      }
    }

    const gameLoop = () => {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)'
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gridSize, 0)
        ctx.lineTo(i * gridSize, canvas.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * gridSize)
        ctx.lineTo(canvas.width, i * gridSize)
        ctx.stroke()
      }

      if (isGameRunning) {
        direction = nextDirection

        // Move snake
        const head = snake[0]
        const newHead = { x: head.x + direction.x, y: head.y + direction.y }

        // Check collisions with walls
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
          isGameRunning = false
          setGameStarted(false)
          alert(`Game Over! Final Score: ${gameScore}`)
        }

        // Check collision with self
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          isGameRunning = false
          setGameStarted(false)
          alert(`Game Over! Final Score: ${gameScore}`)
        }

        snake.unshift(newHead)

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          gameScore += 10
          setScore(gameScore)
          generateFood()
        } else {
          snake.pop()
        }
      }

      // Draw food
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = 2
      ctx.strokeRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4)

      // Draw snake
      snake.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#10b981'
          ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2)
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'
          ctx.lineWidth = 2
          ctx.strokeRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2)
        } else {
          ctx.fillStyle = '#059669'
          ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2)
          ctx.strokeStyle = 'rgba(5, 150, 105, 0.5)'
          ctx.lineWidth = 1
          ctx.strokeRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2)
        }
      })

      // Draw UI
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(`Score: ${gameScore}`, 20, 30)

      if (!isGameRunning && gameStarted) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = 'bold 24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2)
        ctx.font = '14px monospace'
        ctx.fillText('Press SPACE to resume', canvas.width / 2, canvas.height / 2 + 30)
      }

      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#10b981'
        ctx.font = 'bold 28px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('SNAKE', canvas.width / 2, canvas.height / 2 - 40)
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '14px monospace'
        ctx.fillText('Use Arrow Keys to move', canvas.width / 2, canvas.height / 2 + 10)
        ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + 40)
      }

      requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStarted])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
          Snake
        </h1>
        <p className="text-slate-400 text-center mt-2">Eat food and grow longer!</p>
      </div>

      <div className="neon-glow-blue rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-slate-900"
        />
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>Arrow Keys to move • Space to start/pause</p>
        <p className="mt-2">Press ESC to return to menu</p>
      </div>
    </div>
  )
}
