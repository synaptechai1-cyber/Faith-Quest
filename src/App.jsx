import { useState } from 'react'
import TitleScreen from './components/TitleScreen'
import CharacterSelect from './components/CharacterSelect'
import GameEngine from './components/GameEngine'

export default function App() {
  const [screen, setScreen] = useState('title') // title | character | game
  const [character, setCharacter] = useState(null)

  const handleCharacterSelect = (char) => {
    setCharacter(char)
    setScreen('game')
  }

  return (
    <div className="min-h-screen">
      {screen === 'title' && <TitleScreen onStart={() => setScreen('character')} />}
      {screen === 'character' && <CharacterSelect onSelect={handleCharacterSelect} />}
      {screen === 'game' && character && <GameEngine character={character} />}
    </div>
  )
}
