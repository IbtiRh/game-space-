'use client'

import { useEffect, useRef, useState } from 'react'

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let paddle = { x: canvas.width / 2 - 40, y: canvas.height - 30, width: 80, height: 15 }
    let ball = { x: canvas.width / 2, y: canvas.height - 50, radius: 8, velocityX: 4, velocityY: -4 }
    let bricks: Array<{ x: number; y: number; width: number; height: number; active: boolean }> = []
    let gameScore = 0
    let isGameRunning = false
    let mouseX = canvas.width / 2

    const brickRows = 4
    const brickCols = 8
    const brickWidth = canvas.width / brickCols - 2
    const brickHeight = 20

    // Create bricks
    const createBricks = () => {
      bricks = []
      for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickCols; col++) {
          bricks.push({
            x: col * (brickWidth + 2) + 1,
            y: 40 + row * (brickHeight + 2),
            width: brickWidth,
            height: brickHeight,
            active: true,
          })
        }
      }
    }
    createBricks()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        isGameRunning = !isGameRunning
        setGameStarted(isGameRunning)
      }
      if (e.key === 'Escape') {
        window.location.href = '/'
      }
    }

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update paddle position
      paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width))

      if (isGameRunning) {
        // Update ball
        ball.x += ball.velocityX
        ball.y += ball.velocityY

        // Ball collision with walls
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          ball.velocityX = -ball.velocityX
          ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x))
        }

        if (ball.y - ball.radius < 0) {
          ball.velocityY = -ball.velocityY
        }

        // Ball collision with paddle
        if (
          ball.y + ball.radius > paddle.y &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width
        ) {
          ball.velocityY = -ball.velocityY
          ball.y = paddle.y - ball.radius
          const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)
          ball.velocityX = hitPos * 6
        }

        // Ball collision with bricks
        bricks.forEach((brick) => {
          if (!brick.active) return

          if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
          ) {
            brick.active = false
            gameScore += 10
            setScore(gameScore)
            ball.velocityY = -ball.velocityY
          }
        })

        // Game over
        if (ball.y > canvas.height) {
          isGameRunning = false
          setGameStarted(false)
          alert(`Game Over! Final Score: ${gameScore}`)
        }
      }

      // Draw bricks
      bricks.forEach((brick) => {
        if (brick.active) {
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'
          ctx.lineWidth = 1
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
        }
      })

      // Draw paddle
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)'
      ctx.lineWidth = 2
      ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)

      // Draw ball
      ctx.fillStyle = '#ec4899'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw UI
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(`Score: ${gameScore}`, 20, 30)

      if (!isGameRunning && !gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 28px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('BREAKOUT', canvas.width / 2, canvas.height / 2 - 40)
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '14px monospace'
        ctx.fillText('Move mouse to control paddle', canvas.width / 2, canvas.height / 2 + 10)
        ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2 + 40)
      } else if (!isGameRunning) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = 'bold 24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2)
      }

      requestAnimationFrame(gameLoop)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    gameLoop()

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStarted])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          Breakout
        </h1>
        <p className="text-slate-400 text-center mt-2">Break all the bricks!</p>
      </div>

      <div className="neon-glow rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-slate-900 cursor-none"
        />
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>Move mouse to control paddle • Space to start/pause</p>
        <p className="mt-2">Press ESC to return to menu</p>
      </div>
    </div>
  )
}
