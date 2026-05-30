export default function HUD({ character, xp, lives, maxLives, level, sceneIndex, totalScenes, difficulty }) {
  const xpForNextLevel = level.id * 200
  const xpPercent = Math.min((xp / xpForNextLevel) * 100, 100)
  const diffColors = { beginner: '#10b981', intermediate: '#f59e0b', expert: '#ef4444' }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      style={{background:'rgba(10,6,22,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)'}}>
          {character.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs text-yellow-500 truncate">{character.displayName}</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{background:`${diffColors[difficulty.id]}20`, color:diffColors[difficulty.id], fontSize:'9px'}}>
                {difficulty.emoji} {difficulty.name.toUpperCase()}
              </span>
            </div>
            <span className="font-display text-xs text-slate-400">{xp} XP</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div className="xp-bar h-1.5 rounded-full transition-all duration-700" style={{width:`${xpPercent}%`}} />
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {Array.from({length: maxLives}).map((_, i) => (
            <span key={i} className={`heart ${i >= lives ? 'lost' : ''}`}>❤️</span>
          ))}
        </div>
        <div className="level-badge flex-shrink-0 w-9 h-9 text-sm">{level.id}</div>
      </div>
      <div className="max-w-lg mx-auto flex items-center justify-center gap-2 mt-2">
        {Array.from({length: totalScenes}).map((_, i) => (
          <div key={i} className={`step-dot ${i < sceneIndex ? 'done' : i === sceneIndex ? 'active' : 'pending'}`} />
        ))}
      </div>
    </div>
  )
}
