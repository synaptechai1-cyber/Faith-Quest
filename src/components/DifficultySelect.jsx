import { DIFFICULTY_MODES } from '../data/gameData'

export default function DifficultySelect({ onSelect }) {
  return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">⚔️</div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Choose Your Challenge</h2>
          <p className="text-slate-400 text-sm">How well do you know your Bible?</p>
        </div>

        <div className="space-y-4">
          {Object.values(DIFFICULTY_MODES).map((mode, i) => (
            <button
              key={mode.id}
              onClick={() => onSelect(mode)}
              className="w-full game-card p-6 flex items-center gap-5 text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{'--hover-border': mode.color}}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{background:`${mode.color}15`, border:`1px solid ${mode.color}30`}}>
                {mode.emoji}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-xl text-white">{mode.name}</h3>
                  {mode.id === 'expert' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(239,68,68,0.15)', color:'#ef4444'}}>HARD</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{mode.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  {mode.id === 'beginner' && <span className="text-xs text-green-400">✓ Options from all books</span>}
                  {mode.id === 'intermediate' && <span className="text-xs text-yellow-400">✓ All options in same book</span>}
                  {mode.id === 'expert' && <span className="text-xs text-red-400">✓ No verse shown — identify cold!</span>}
                </div>
              </div>

              {/* Arrow */}
              <div className="text-slate-600 group-hover:text-white transition-colors text-xl">→</div>
            </button>
          ))}
        </div>

        <div className="scripture-card mt-8">
          <p className="text-xs text-slate-500 font-display uppercase tracking-widest mb-2">Remember</p>
          <p className="text-white italic text-sm">"Your word I have hidden in my heart, that I might not sin against You."</p>
          <p className="text-yellow-500 text-xs font-display mt-1">— Psalm 119:11</p>
        </div>
      </div>
    </div>
  )
}
