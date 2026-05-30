import { useState } from 'react'

const CHARACTERS = [
  {
    id: 'aisha',
    name: 'Aisha',
    gender: 'female',
    emoji: '👩🏾',
    description: 'A young professional navigating faith in the corporate world',
    trait: 'Compassionate · Bold · Determined',
    color: '#ec4899',
  },
  {
    id: 'zak',
    name: 'Zakhe',
    gender: 'male',
    emoji: '👨🏾',
    description: 'A young man building his future while staying rooted in his faith',
    trait: 'Courageous · Loyal · Wise',
    color: '#6366f1',
  },
]

export default function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [name, setName] = useState('')

  const handleStart = () => {
    if (!selected) return
    onSelect({ ...selected, displayName: name.trim() || selected.name })
  }

  return (
    <div className="min-h-screen stars-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-display text-yellow-500 tracking-widest uppercase mb-2">Step 1 of 1</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Choose Your Champion</h2>
          <p className="text-slate-400 text-sm">Who will walk this faith journey?</p>
        </div>

        {/* Characters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {CHARACTERS.map(char => (
            <button
              key={char.id}
              onClick={() => { setSelected(char); setName('') }}
              className={`game-card p-5 text-center transition-all duration-300 hover:-translate-y-1 ${selected?.id === char.id ? 'anim-pulse-gold' : ''}`}
              style={selected?.id === char.id ? {borderColor: char.color, borderWidth: 2} : {}}
            >
              <div className="text-5xl mb-3">{char.emoji}</div>
              <h3 className="font-display font-bold text-white text-lg mb-1">{char.name}</h3>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">{char.description}</p>
              <p className="text-xs font-medium" style={{color: char.color}}>{char.trait}</p>
              {selected?.id === char.id && (
                <div className="mt-3 text-yellow-400 text-sm font-bold">✓ Selected</div>
              )}
            </button>
          ))}
        </div>

        {/* Custom name */}
        {selected && (
          <div className="game-card p-5 mb-6 anim-slidedin">
            <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2 font-display">
              Give your champion a name (optional)
            </label>
            <input
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 font-body text-sm"
              placeholder={`e.g. ${selected.name} or your own name...`}
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
            />
          </div>
        )}

        {/* Begin */}
        <button
          onClick={handleStart}
          disabled={!selected}
          className="w-full font-display font-bold text-base py-4 rounded-2xl uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: selected ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.1)',
            color: selected ? '#1a0a2e' : '#64748b',
          }}
        >
          {selected ? `Begin with ${name || selected.name} →` : 'Select a Champion First'}
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">
          "Before I formed you in the womb I knew you" — Jeremiah 1:5
        </p>
      </div>
    </div>
  )
}
