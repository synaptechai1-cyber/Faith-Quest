import { useEffect, useState } from 'react'
import { LEVELS } from '../data/gameData'

export default function LevelComplete({ level, xpEarned, totalXp, onNext, isGameComplete }) {
  const [show, setShow] = useState(false)
  const nextLevel = LEVELS.find(l => l.id === level.id + 1)

  useEffect(() => {
    setTimeout(() => setShow(true), 300)
  }, [])

  return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-6 py-12">
      <div className={`max-w-lg w-full text-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Trophy */}
        <div className="anim-float inline-block mb-6">
          <div className="text-7xl" style={{filter:'drop-shadow(0 0 30px rgba(245,158,11,0.8))'}}>
            {isGameComplete ? '👑' : '🏆'}
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-display font-black text-4xl sm:text-5xl gold-text mb-2">
          {isGameComplete ? 'Faith Champion!' : 'Level Complete!'}
        </h2>
        <p className="font-display text-lg text-white mb-1">{level.name}</p>
        <p className="text-slate-400 text-sm mb-8">
          {isGameComplete
            ? "You've completed all 5 levels of Faith Quest. Your faith has grown through every trial!"
            : "You've overcome the challenges of this chapter. Your faith is growing stronger."}
        </p>

        {/* XP earned */}
        <div className="game-card-gold p-6 mb-6 anim-pop">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-xs text-slate-400 uppercase tracking-widest mb-1">XP Earned</p>
              <p className="font-display font-bold text-3xl text-yellow-400">+{xpEarned}</p>
            </div>
            <div>
              <p className="font-display text-xs text-slate-400 uppercase tracking-widest mb-1">Total XP</p>
              <p className="font-display font-bold text-3xl text-white">{totalXp}</p>
            </div>
          </div>
        </div>

        {/* Scripture reminder */}
        {!isGameComplete && nextLevel && (
          <div className="game-card p-4 mb-6 text-left">
            <p className="font-display text-xs text-yellow-500 uppercase tracking-widest mb-2">Next Chapter</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{nextLevel.emoji}</span>
              <div>
                <p className="font-display font-bold text-white">{nextLevel.name}</p>
                <p className="text-xs text-slate-400">{nextLevel.location} · {nextLevel.description.slice(0, 60)}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Verse of encouragement */}
        <div className="scripture-card mb-8 text-left">
          <p className="text-xs text-slate-500 font-display uppercase tracking-widest mb-2">A Word for You</p>
          <p className="text-white text-sm italic leading-relaxed">
            "No, despite all these things, overwhelming victory is ours through Christ, who loved us."
          </p>
          <p className="text-yellow-500 text-xs font-display mt-2">— Romans 8:37 NLT</p>
        </div>

        <button
          onClick={onNext}
          className="w-full font-display font-bold text-lg py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95 anim-pulse-gold"
          style={{background:'linear-gradient(135deg, #f59e0b, #d97706)'}}
        >
          {isGameComplete ? 'View Your Badges 👑' : `Enter ${nextLevel?.name || 'Next Level'} →`}
        </button>
      </div>
    </div>
  )
}
