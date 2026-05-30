import { useState, useEffect } from 'react'
import { LEVELS, BADGES, SCRIPTURES } from '../data/gameData'
import HUD from './HUD'
import SceneComponent from './SceneComponent'
import ScriptureChallenge from './ScriptureChallenge'
import LevelComplete from './LevelComplete'
import WorldMap from './WorldMap'
import BadgesScreen from './BadgesScreen'

const MAX_LIVES = 3

export default function GameEngine({ character }) {
  const [screen, setScreen] = useState('map') // map | scene | scripture | levelcomplete | badges
  const [currentLevel, setCurrentLevel] = useState(null)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [scenePhase, setScenePhase] = useState('scene') // scene | scripture
  const [xp, setXp] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [completedLevels, setCompletedLevels] = useState([])
  const [levelXpEarned, setLevelXpEarned] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)

  const [stats, setStats] = useState({
    correctAnswers: 0,
    loveChoices: 0,
    givingChoices: 0,
    perfectLevel: false,
    levelsCompleted: 0,
    versesMemorised: 0,
    totalXp: 0,
  })

  // Compute earned badges
  const earnedBadges = BADGES.filter(b => b.condition(stats))

  const handleSelectLevel = (level) => {
    setCurrentLevel(level)
    setSceneIndex(0)
    setScenePhase('scene')
    setLevelXpEarned(0)
    setScreen('scene')
  }

  const handleSceneComplete = (earnedXp, wasGoodChoice) => {
    setXp(x => x + earnedXp)
    setLevelXpEarned(x => x + earnedXp)
    if (wasGoodChoice) {
      const scene = currentLevel.scenes[sceneIndex]
      // Track love/giving choices
      const scripture = SCRIPTURES.find(s => s.id === scene.scripture_challenge)
      if (scripture?.theme === 'Love') setStats(s => ({...s, loveChoices: s.loveChoices + 1}))
      if (scripture?.theme === 'Giving') setStats(s => ({...s, givingChoices: s.givingChoices + 1}))
    }
    // Move to scripture challenge
    setScenePhase('scripture')
    setScreen('scripture')
  }

  const handleScriptureComplete = (correct) => {
    if (correct) {
      const bonusXp = 50
      setXp(x => x + bonusXp)
      setLevelXpEarned(x => x + bonusXp)
      setStats(s => ({...s, correctAnswers: s.correctAnswers + 1, versesMemorised: s.versesMemorised + 1}))
    } else {
      setLives(l => Math.max(0, l - 1))
    }

    // Move to next scene or level complete
    const nextSceneIndex = sceneIndex + 1
    if (nextSceneIndex < currentLevel.scenes.length) {
      setSceneIndex(nextSceneIndex)
      setScenePhase('scene')
      setScreen('scene')
    } else {
      // Level complete!
      const newCompleted = [...completedLevels, currentLevel.id]
      setCompletedLevels(newCompleted)
      const levelBonus = currentLevel.xpReward
      setXp(x => x + levelBonus)
      setLevelXpEarned(x => x + levelBonus)
      const gameComplete = newCompleted.length === LEVELS.length
      setIsGameComplete(gameComplete)
      setStats(s => ({
        ...s,
        levelsCompleted: newCompleted.length,
        perfectLevel: lives === MAX_LIVES,
        totalXp: xp + levelBonus + levelXpEarned,
      }))
      setScreen('levelcomplete')
    }
  }

  const handleLevelCompleteNext = () => {
    if (isGameComplete) {
      setScreen('badges')
    } else {
      setScreen('map')
      setLives(MAX_LIVES) // Restore lives for next level
    }
  }

  const currentScene = currentLevel?.scenes[sceneIndex]

  return (
    <div className="relative">
      {/* HUD - shown during gameplay */}
      {(screen === 'scene' || screen === 'scripture') && currentLevel && (
        <HUD
          character={character}
          xp={xp}
          lives={lives}
          maxLives={MAX_LIVES}
          level={currentLevel}
          sceneIndex={sceneIndex * 2 + (scenePhase === 'scripture' ? 1 : 0)}
          totalScenes={currentLevel.scenes.length * 2}
        />
      )}

      {/* Screens */}
      <div className={(screen === 'scene' || screen === 'scripture') ? 'pt-20' : ''}>
        {screen === 'map' && (
          <WorldMap
            character={character}
            completedLevels={completedLevels}
            currentXp={xp}
            onSelectLevel={handleSelectLevel}
            badges={earnedBadges}
          />
        )}

        {screen === 'scene' && currentScene && (
          <SceneComponent
            scene={currentScene}
            level={currentLevel}
            character={character}
            onComplete={handleSceneComplete}
          />
        )}

        {screen === 'scripture' && currentScene && (
          <ScriptureChallenge
            scriptureId={currentScene.scripture_challenge}
            onComplete={handleScriptureComplete}
            character={character}
          />
        )}

        {screen === 'levelcomplete' && (
          <LevelComplete
            level={currentLevel}
            xpEarned={levelXpEarned}
            totalXp={xp}
            onNext={handleLevelCompleteNext}
            isGameComplete={isGameComplete}
          />
        )}

        {screen === 'badges' && (
          <BadgesScreen
            earnedBadges={earnedBadges}
            stats={{...stats, totalXp: xp}}
            onContinue={() => setScreen('map')}
          />
        )}
      </div>
    </div>
  )
}
