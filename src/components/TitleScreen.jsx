import { useEffect, useState } from 'react'

export default function TitleScreen({ onStart }) {
  const [stars, setStars] = useState([])

  useEffect(() => {
    setStars(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
    })))
  }, [])

  return (
    <div className="min-h-screen stars-bg flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Stars */}
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          animationDelay: `${s.delay}s`,
        }} />
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{background:'radial-gradient(circle, #f59e0b, transparent)'}} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-15"
        style={{background:'radial-gradient(circle, #6366f1, transparent)'}} />

      <div className="relative z-10 text-center max-w-lg">
        {/* Cross icon */}
        <div className="anim-float mb-6 inline-block">
          <div className="text-7xl anim-pop" style={{filter:'drop-shadow(0 0 30px rgba(245,158,11,0.8))'}}>✝️</div>
        </div>

        {/* Title */}
        <h1 className="font-decorative font-bold text-5xl sm:text-6xl gold-text mb-2 anim-fadeup" style={{animationDelay:'0.2s', opacity:0}}>
          FAITH
        </h1>
        <h1 className="font-decorative font-bold text-5xl sm:text-6xl text-white mb-4 anim-fadeup" style={{animationDelay:'0.3s', opacity:0}}>
          QUEST
        </h1>

        {/* Tagline */}
        <p className="text-slate-400 text-sm sm:text-base mb-2 anim-fadeup font-display tracking-widest uppercase" style={{animationDelay:'0.4s', opacity:0}}>
          A Bible Adventure
        </p>
        <p className="text-slate-500 text-xs mb-10 anim-fadeup tracking-wider" style={{animationDelay:'0.5s', opacity:0}}>
          NLT Translation · 5 Levels · 30+ Scriptures
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 anim-fadeup" style={{animationDelay:'0.6s', opacity:0}}>
          {['📖 Scripture Memory', '⚔️ Life Challenges', '🏆 Earn Badges', '✨ Level Up'].map(f => (
            <span key={f} className="game-card text-xs px-3 py-1.5 text-slate-300">{f}</span>
          ))}
        </div>

        {/* Start button */}
        <div className="anim-fadeup" style={{animationDelay:'0.7s', opacity:0}}>
          <button
            onClick={onStart}
            className="anim-pulse-gold font-display font-bold text-lg px-10 py-4 rounded-2xl text-slate-900 uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95"
            style={{background:'linear-gradient(135deg, #f59e0b, #d97706)'}}
          >
            Begin Your Journey
          </button>
        </div>

        <p className="text-slate-600 text-xs mt-6 anim-fadeup" style={{animationDelay:'0.8s', opacity:0}}>
          Walk by faith, not by sight — 2 Corinthians 5:7
        </p>
      </div>
    </div>
  )
}
