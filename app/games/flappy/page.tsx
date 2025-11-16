'use client'

import { useEffect, useRef, useState } from 'react'

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Game variables
    let bird = { x: 50, y: canvas.height / 2, width: 20, height: 20, gravity: 0.5, velocity: 0 }
    let pipes: Array<{ x: number; topHeight: number }> = []
    let gameScore = 0
    let isGameOver = false

    const pipeWidth = 60
    const pipeGap = 120
    const pipeDistance = 200

    // Generate pipes
    const generatePipe = () => {
      const topHeight = Math.random() * (canvas.height - pipeGap - 50) + 25
      pipes.push({ x: canvas.width, topHeight })
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!gameStarted) {
          setGameStarted(true)
        } else if (isGameOver) {
          resetGame()
        } else {
          bird.velocity = -10
        }
      }
      if (e.key === 'Escape') {
        window.location.href = '/'
      }
    }

    // Mouse click
    const handleClick = () => {
      if (!gameStarted) {
        setGameStarted(true)
      } else if (isGameOver) {
        resetGame()
      } else {
        bird.velocity = -10
      }
    }

    const resetGame = () => {
      bird = { x: 50, y: canvas.height / 2, width: 20, height: 20, gravity: 0.5, velocity: 0 }
      pipes = []
      gameScore = 0
      isGameOver = false
      setGameOver(false)
      setScore(0)
      setGameStarted(true)
    }

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (gameStarted && !isGameOver) {
        // Apply gravity
        bird.velocity += bird.gravity
        bird.y += bird.velocity

        // Generate pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeDistance) {
          generatePipe()
        }

        // Draw and update pipes
        pipes.forEach((pipe, index) => {
          pipe.x -= 5

          // Draw pipe
          ctx.fillStyle = '#a78bfa'
          ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight)
          ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height)

          // Glow effect
          ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
          ctx.lineWidth = 2
          ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight)
          ctx.strokeRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height)

          // Check collision
          if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)
          ) {
            isGameOver = true
            setGameOver(true)
            setGameStarted(false)
          }

          // Score point
          if (pipe.x === bird.x) {
            gameScore++
            setScore(gameScore)
          }

          // Remove off-screen pipes
          if (pipe.x < -pipeWidth) {
            pipes.splice(index, 1)
          }
        })

        // Check boundaries
        if (bird.y < 0 || bird.y + bird.height > canvas.height) {
          isGameOver = true
          setGameOver(true)
          setGameStarted(false)
        }
      }

      // Draw bird
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2)
      ctx.fill()

      // Bird glow
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw UI
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 24px monospace'
      ctx.fillText(`Score: ${gameScore}`, 20, 40)

      if (!gameStarted && !isGameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = 'bold 32px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('FLAPPY BIRD', canvas.width / 2, canvas.height / 2 - 40)
        ctx.font = '16px monospace'
        ctx.fillText('Click or Press SPACE to start', canvas.width / 2, canvas.height / 2 + 20)
      }

      if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 32px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40)
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '20px monospace'
        ctx.fillText(`Final Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 20)
        ctx.font = '16px monospace'
        ctx.fillText('Click or Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60)
      }

      requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('click', handleClick)
    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('click', handleClick)
    }
  }, [gameStarted])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Flappy Bird
        </h1>
        <p className="text-slate-400 text-center mt-2">Navigate through the pipes!</p>
      </div>

      <div className="neon-glow rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-slate-900 cursor-pointer"
        />
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>Space or Click to {gameOver ? 'Restart' : gameStarted ? 'Flap' : 'Start'}</p>
        <p className="mt-2">Press ESC to return to menu</p>
      </div>
    </div>
  )
}
