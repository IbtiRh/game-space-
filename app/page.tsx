'use client'

import { useState } from 'react'
import Link from 'next/link'

const games = [
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Navigate through pipes with simple tap controls',
    icon: '🐦',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game - eat and grow',
    icon: '🐍',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory with card matching',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break bricks with your paddle',
    icon: '🧱',
    color: 'from-yellow-500 to-orange-500',
  },
]

export default function Home() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50" />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Game-space
              </h1>

            </div>
            <div className="flex gap-2 items-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2 text-slate-100">Play Now</h2>
          <p className="text-slate-400">Select a game to start playing</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              className="group relative"
            >
              {/* Neon glow effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${game.color} rounded-lg opacity-0 blur-xl group-hover:opacity-50 transition-opacity duration-300 -z-10`}
              />

              <div className="bg-slate-800/50 border border-purple-500/30 group-hover:border-purple-400/70 rounded-lg p-8 transition-all duration-300 backdrop-blur-sm">
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                  {game.title}
                </h3>
                <p className="text-sm text-slate-400 mt-3 group-hover:text-slate-300 transition-colors">
                  {game.description}
                </p>

                {/* Play button indicator */}
                <div className="mt-6 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-sm font-medium">Play Now</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/30 backdrop-blur-md mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">© 2025 IBTISSAM RHIRHA. Built with React & Next.js</p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-slate-400 hover:text-purple-400 transition-colors">About</a>
              <a href="#" className="text-xs text-slate-400 hover:text-purple-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
