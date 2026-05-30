import { useState } from 'react'

export default function SceneComponent({ scene, level, character, onComplete }) {
  const [chosen, setChosen] = useState(null)
  const [phase, setPhase] = useState('story') // story | choice | outcome

  const handleChoice = (choice) => {
    setChosen(choice)
    setPhase('outcome')
  }

  const outcomeColors = {
    good: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7', icon: '✨' },
    bad: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#fca5a5', icon: '💭' },
    neutral: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fcd34d', icon: '🌱' },
  }

  return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">

        {/* Level + scene header */}
        <div className="flex items-center gap-3 mb-6 anim-fadeup">
          <div className="text-3xl">{level.emoji}</div>
          <div>
            <p className="font-display text-xs text-slate-500 uppercase tracking-widest">{level.location}</p>
            <h3 className="font-display font-bold text-white text-lg">{scene.title}</h3>
          </div>
        </div>

        {/* Character */}
        <div className="flex items-center gap-3 mb-5 anim-fadeup" style={{animationDelay:'0.1s', opacity:0}}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)'}}>
            {character.emoji}
          </div>
          <div className="game-card px-4 py-3 flex-1">
            <p className="text-xs text-yellow-500 font-display uppercase tracking-wider mb-0.5">{character.displayName}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{scene.narrative}</p>
          </div>
        </div>

        {/* Choices */}
        {phase !== 'outcome' && (
          <div className="space-y-3 mb-6 anim-fadeup" style={{animationDelay:'0.2s', opacity:0}}>
            <p className="font-display text-xs text-slate-500 uppercase tracking-widest mb-3">What do you do?</p>
            {scene.choices.map((choice, i) => (
              <button
                key={i}
                className="choice-btn flex items-center gap-3"
                onClick={() => handleChoice(choice)}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                  style={{background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', color:'#f59e0b'}}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm leading-relaxed">{choice.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Outcome */}
        {phase === 'outcome' && chosen && (
          <div className="anim-pop">
            <div className="rounded-2xl p-5 mb-5"
              style={{
                background: outcomeColors[chosen.outcome].bg,
                border: `1px solid ${outcomeColors[chosen.outcome].border}`,
              }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{outcomeColors[chosen.outcome].icon}</span>
                <div>
                  <p className="font-display font-bold text-sm mb-2" style={{color: outcomeColors[chosen.outcome].text}}>
                    {chosen.outcome === 'good' ? 'Great choice!' : chosen.outcome === 'neutral' ? 'A learning moment...' : 'Reflection time...'}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{chosen.response}</p>
                  {chosen.xp > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                        +{chosen.xp} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onComplete(chosen.xp, chosen.outcome === 'good')}
              className="w-full font-display font-bold py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95"
              style={{background:'linear-gradient(135deg, #f59e0b, #d97706)'}}
            >
              Face the Scripture Challenge ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
