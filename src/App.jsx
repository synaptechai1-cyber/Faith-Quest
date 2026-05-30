import { useState } from 'react'
import TitleScreen from './components/TitleScreen'
import CharacterSelect from './components/CharacterSelect'
import DifficultySelect from './components/DifficultySelect'
import GameEngine from './components/GameEngine'

export default function App() {
  const [screen, setScreen] = useState('title')
  const [character, setCharacter] = useState(null)
  const [difficulty, setDifficulty] = useState(null)

  return (
    <div className="min-h-screen">
      {screen === 'title' && <TitleScreen onStart={() => setScreen('character')} />}
      {screen === 'character' && (
        <CharacterSelect onSelect={(char) => { setCharacter(char); setScreen('difficulty') }} />
      )}
      {screen === 'difficulty' && (
        <DifficultySelect onSelect={(diff) => { setDifficulty(diff); setScreen('game') }} />
      )}
      {screen === 'game' && character && difficulty && (
        <GameEngine character={character} difficulty={difficulty} />
      )}
    </div>
  )
}
