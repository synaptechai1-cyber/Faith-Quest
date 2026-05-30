import { useState, useEffect } from 'react'
import { SCRIPTURES } from '../data/gameData'

function generateOptions(correct, allScriptures) {
  const wrong = allScriptures
    .filter(s => s.id !== correct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(s => s.ref)
  const options = [...wrong, correct.ref].sort(() => Math.random() - 0.5)
  return options
}

export default function ScriptureChallenge({ scriptureId, onComplete, character }) {
  const scripture = SCRIPTURES.find(s => s.id === scriptureId)
  const [options] = useState(() => generateOptions(scripture, SCRIPTURES))
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [phase, setPhase] = useState('read') // read | challenge | result
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (!timerActive || revealed) return
    if (timeLeft <= 0) {
      setRevealed(true)
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive, revealed])

  const handleSelect = (opt) => {
    if (revealed) return
    setSelected(opt)
    setRevealed(true)
    setTimerActive(false)
  }

  const isCorrect = selected === scripture.ref
  const themeColors = {
    Faith: '#f59e0b', Strength: '#6366f1', Love: '#ec4899',
    Giving: '#10b981', Courage: '#0ea5e9', Wisdom: '#8b5cf6'
  }
  const color = themeColors[scripture.theme] || '#f59e0b'

  if (phase === 'read') return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full anim-fadeup">
        {/* Theme badge */}
        <div className="flex justify-center mb-6">
          <span className="font-display text-xs uppercase tracking-widest px-4 py-2 rounded-full border"
            style={{color, borderColor: color, background: `${color}15`}}>
            📖 Scripture Challenge · {scripture.theme}
          </span>
        </div>

        {/* Scripture card */}
        <div className="scripture-card mb-6">
          <p className="text-xs text-slate-400 font-display uppercase tracking-widest mb-4">Read and remember this verse</p>
          <blockquote className="text-white text-lg sm:text-xl leading-relaxed font-body italic mb-6">
            "{scripture.verse}"
          </blockquote>
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-sm" style={{color}}>— {scripture.ref}</p>
            <span className="text-xs text-slate-500 font-display uppercase tracking-wide">{scripture.theme}</span>
          </div>
        </div>

        {/* Character reaction */}
        <div className="game-card p-4 flex items-start gap-3 mb-8">
          <span className="text-2xl flex-shrink-0">{character.emoji}</span>
          <p className="text-sm text-slate-300 italic">
            "{character.displayName} reads the verse carefully, committing it to memory..."
          </p>
        </div>

        <button
          onClick={() => { setPhase('challenge'); setTimerActive(true) }}
          className="w-full font-display font-bold py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95"
          style={{background: `linear-gradient(135deg, ${color}, ${color}cc)`}}
        >
          I'm Ready — Test Me ⚔️
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen stars-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full anim-fadeup">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-display text-xs uppercase tracking-widest text-slate-400">Where is this verse found?</span>
          {!revealed && (
            <div className={`font-display font-bold text-sm px-3 py-1 rounded-full ${timeLeft <= 10 ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
              ⏱ {timeLeft}s
            </div>
          )}
        </div>

        {/* Verse to identify */}
        <div className="scripture-card mb-6">
          <p className="text-xs text-slate-400 font-display uppercase tracking-widest mb-3">Find this verse:</p>
          <blockquote className="text-white text-base sm:text-lg leading-relaxed font-body italic">
            "{scripture.verse}"
          </blockquote>
        </div>

        {/* Timer bar */}
        {!revealed && (
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-6">
            <div className="h-1.5 rounded-full transition-all duration-1000"
              style={{width: `${(timeLeft/30)*100}%`, background: timeLeft > 10 ? color : '#ef4444'}} />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((opt, i) => {
            let cls = 'scripture-option'
            if (revealed) {
              if (opt === scripture.ref) cls += ' correct'
              else if (opt === selected && opt !== scripture.ref) cls += ' wrong'
              else cls += ' reveal'
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={revealed}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs text-slate-500 w-5">{String.fromCharCode(65+i)}.</span>
                  <span>{opt}</span>
                  {revealed && opt === scripture.ref && <span className="ml-auto">✅</span>}
                  {revealed && opt === selected && opt !== scripture.ref && <span className="ml-auto">❌</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Result */}
        {revealed && (
          <div className={`game-card p-5 mb-5 anim-pop ${isCorrect ? 'border-green-500/30' : 'border-red-500/20'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{isCorrect ? '🎉' : '📖'}</span>
              <div>
                <p className={`font-display font-bold text-sm mb-1 ${isCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isCorrect ? 'Correct! Well done!' : timeLeft <= 0 ? "Time's up — but now you know it!" : 'Not quite — but this is how we learn!'}
                </p>
                <p className="text-xs text-slate-400">
                  <span className="font-bold text-white">{scripture.ref}</span> — {scripture.theme}
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">"{scripture.verse.slice(0, 80)}..."</p>
              </div>
            </div>
          </div>
        )}

        {revealed && (
          <button
            onClick={() => onComplete(isCorrect)}
            className="w-full font-display font-bold py-4 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95"
            style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}
          >
            {isCorrect ? 'Continue Journey +XP ✨' : 'Continue — I\'ll Remember It 📖'}
          </button>
        )}
      </div>
    </div>
  )
}
