import { LEVELS } from '../data/gameData'

export default function WorldMap({ character, completedLevels, currentXp, onSelectLevel, badges, difficulty }) {
  const currentLevel = completedLevels.length + 1
  const diffColors = { beginner: '#10b981', intermediate: '#f59e0b', expert: '#ef4444' }

  return (
    <div className="min-h-screen stars-bg px-6 py-10">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-display text-xs text-slate-500 uppercase tracking-widest">Your Journey</p>
            <h2 className="font-display font-bold text-2xl text-white">{character.displayName}'s Path</h2>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-xs font-bold px-2 py-1 rounded-full font-display"
                style={{background:`${diffColors[difficulty.id]}20`, color:diffColors[difficulty.id]}}>
                {difficulty.emoji} {difficulty.name}
              </span>
            </div>
            <p className="font-display font-bold text-2xl gold-text">{currentXp} XP</p>
          </div>
        </div>

        {/* Progress */}
        <div className="game-card p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{character.emoji}</span>
              <span className="font-display text-sm text-white">{character.displayName}</span>
            </div>
            <span className="font-display text-xs text-yellow-500">{completedLevels.length}/{LEVELS.length} Levels</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div className="xp-bar h-2 rounded-full transition-all duration-700"
              style={{width:`${(completedLevels.length / LEVELS.length) * 100}%`}} />
          </div>
          {badges.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {badges.map(b => <span key={b.id} title={b.name} className="text-xl">{b.emoji}</span>)}
            </div>
          )}
        </div>

        {/* Levels */}
        <div className="space-y-3 mb-8">
          {LEVELS.map((level) => {
            const isCompleted = completedLevels.includes(level.id)
            const isAvailable = level.id <= currentLevel
            const isCurrent = level.id === currentLevel && !isCompleted

            return (
              <button key={level.id}
                onClick={() => isAvailable && onSelectLevel(level)}
                disabled={!isAvailable}
                className={`w-full game-card p-5 flex items-center gap-4 text-left transition-all duration-300 ${isAvailable ? 'hover:-translate-y-1 hover:border-yellow-500/30 cursor-pointer' : 'opacity-30 cursor-not-allowed'} ${isCurrent ? 'anim-pulse-gold' : ''}`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{background: isCompleted ? 'rgba(16,185,129,0.15)' : `${level.color}15`, border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : level.color+'30'}`}}>
                  {isCompleted ? '✅' : !isAvailable ? '🔒' : level.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-xs uppercase tracking-widest" style={{color: level.color}}>
                      Level {level.id} · {level.location}
                    </p>
                    {isCurrent && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full font-bold">NOW</span>}
                    {isCompleted && <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full font-bold">DONE ✓</span>}
                  </div>
                  <p className="font-display font-bold text-white text-sm mb-1">{level.name}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{level.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-display text-xs text-slate-500 uppercase">XP</p>
                  <p className="font-display font-bold text-sm" style={{color: level.color}}>+{level.xpReward}</p>
                  {difficulty.id !== 'beginner' && (
                    <p className="text-xs" style={{color: diffColors[difficulty.id]}}>×{difficulty.id==='expert'?2:1.5}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="scripture-card">
          <p className="font-display text-xs text-slate-400 uppercase tracking-widest mb-3">Verse of the Day</p>
          <p className="text-white italic text-sm leading-relaxed mb-2">
            "But those who trust in the Lord will find new strength. They will soar high on wings like eagles."
          </p>
          <p className="text-yellow-500 text-xs font-display">— Isaiah 40:31 NLT</p>
        </div>
      </div>
    </div>
  )
}
