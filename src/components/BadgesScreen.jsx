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
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Correct', value: stats.correctAnswers, emoji: '✅' },
            { label: 'Total XP', value: stats.totalXp, emoji: '⭐' },
            { label: 'Levels Done', value: stats.levelsCompleted, emoji: '🏆' },
            { label: 'Runner Best', value: stats.runnerHighScore, emoji: '🎮' },
          ].map((s, i) => (
            <div key={i} className="game-card p-3 text-center">
              <div className="text-xl mb-1">{s.emoji}</div>
              <p className="font-display font-bold text-xl text-white">{s.value}</p>
              <p className="font-display text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {BADGES.map(badge => {
            const earned = earnedBadges.find(b => b.id === badge.id)
            return (
              <div key={badge.id}
                className={`game-card p-4 flex items-start gap-3 transition-all ${earned ? 'border-yellow-500/20' : 'opacity-40'}`}>
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

        {/* Completion verse */}
        <div className="scripture-card mb-6">
          <p className="text-xs text-slate-500 font-display uppercase tracking-widest mb-2">You have run the race</p>
          <p className="text-white italic text-sm leading-relaxed">
            "I have fought the good fight, I have finished the race, and I have remained faithful."
          </p>
          <p className="text-yellow-500 text-xs font-display mt-2">— 2 Timothy 4:7 NLT</p>
        </div>

        <button onClick={onContinue}
          className="w-full font-display font-bold py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95"
          style={{background:'linear-gradient(135deg, #f59e0b, #d97706)'}}>
          Continue Journey →
        </button>
      </div>
    </div>
  )
}
