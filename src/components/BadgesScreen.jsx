import { BADGES } from '../data/gameData'

export default function BadgesScreen({ earnedBadges, stats, onContinue }) {
  return (
    <div className="min-h-screen stars-bg px-6 py-10">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏅</div>
          <h2 className="font-display font-bold text-3xl gold-text mb-1">Your Badges</h2>
          <p className="text-slate-400 text-sm">{earnedBadges.length} of {BADGES.length} earned</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Correct', value: stats.correctAnswers, emoji: '✅' },
            { label: 'XP Earned', value: stats.totalXp, emoji: '⭐' },
            { label: 'Levels', value: stats.levelsCompleted, emoji: '🏆' },
          ].map((s, i) => (
            <div key={i} className="game-card p-3 text-center">
              <div className="text-xl mb-1">{s.emoji}</div>
              <p className="font-display font-bold text-xl text-white">{s.value}</p>
              <p className="font-display text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* All badges */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {BADGES.map(badge => {
            const earned = earnedBadges.find(b => b.id === badge.id)
            return (
              <div key={badge.id} className={`game-card p-4 flex items-start gap-3 transition-all ${earned ? 'border-yellow-500/20' : 'opacity-40'}`}>
                <span className="text-2xl">{badge.emoji}</span>
                <div>
                  <p className={`font-display font-bold text-sm ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{badge.desc}</p>
                  {earned && <p className="text-xs text-yellow-500 mt-1 font-bold">✓ Earned!</p>}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onContinue}
          className="w-full font-display font-bold py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95"
          style={{background:'linear-gradient(135deg, #f59e0b, #d97706)'}}
        >
          Continue Journey →
        </button>
      </div>
    </div>
  )
}
