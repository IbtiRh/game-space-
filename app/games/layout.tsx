'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50" />
      </div>

      {/* Header with back button */}
      <header className="relative z-10 border-b border-purple-500/30 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors"
          >
            <span>←</span>
            <span className="text-sm font-medium">Back to Games</span>
          </Link>
          <div className="text-xs text-slate-400">Press ESC to return home</div>
        </div>
      </header>

      {/* Game content */}
      {children}
    </div>
  )
}
