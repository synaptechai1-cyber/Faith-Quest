import { useState } from 'react'
import { LEVELS, BADGES, SCRIPTURES } from '../data/gameData'
import HUD from './HUD'
import SceneComponent from './SceneComponent'
import ScriptureChallenge from './ScriptureChallenge'
import LevelComplete from './LevelComplete'
import WorldMap from './WorldMap'
import BadgesScreen from './BadgesScreen'
import RunnerGame from './RunnerGame'

const MAX_LIVES = 3

export default function GameEngine({ character, difficulty }) {
  const [screen, setScreen] = useState('map')
  const [currentLevel, setCurrentLevel] = useState(null)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [scenePhase, setScenePhase] = useState('scene')
  const [xp, setXp] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [completedLevels, setCompletedLevels] = useState([])
  const [levelXpEarned, setLevelXpEarned] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [runnerHighScore, setRunnerHighScore] = useState(0)

  const xpMultiplier = difficulty.id === 'expert' ? 2 : difficulty.id === 'intermediate' ? 1.5 : 1

  const [stats, setStats] = useState({
    correctAnswers: 0, loveChoices: 0, givingChoices: 0,
    perfectLevel: false, levelsCompleted: 0, versesMemorised: 0,
    totalXp: 0, runnerHighScore: 0, expertCompleted: false,
  })

  const earnedBadges = BADGES.filter(b => b.condition(stats))

  const handleSelectLevel = (level) => {
    setCurrentLevel(level)
    setSceneIndex(0)
    setScenePhase('scene')
    setLevelXpEarned(0)
    setScreen('scene')
  }

  const handleSceneComplete = (earnedXp, wasGoodChoice) => {
    const scaled = Math.round(earnedXp * xpMultiplier)
    setXp(x => x + scaled)
    setLevelXpEarned(x => x + scaled)
    if (wasGoodChoice) {
      const scene = currentLevel.scenes[sceneIndex]
      const scripture = SCRIPTURES.find(s => s.id === scene.scripture_challenge)
      if (scripture?.theme === 'Love') setStats(s => ({...s, loveChoices: s.loveChoices+1}))
      if (scripture?.theme === 'Giving') setStats(s => ({...s, givingChoices: s.givingChoices+1}))
    }
    setScreen('scripture')
  }

  const handleScriptureComplete = (correct) => {
    const bonusXp = correct ? Math.round((difficulty.id==='expert'?100:difficulty.id==='intermediate'?75:50) * xpMultiplier) : 0
    if (correct) {
      setXp(x => x + bonusXp)
      setLevelXpEarned(x => x + bonusXp)
      setStats(s => ({...s, correctAnswers: s.correctAnswers+1, versesMemorised: s.versesMemorised+1}))
    } else {
      setLives(l => Math.max(0, l-1))
    }

    const nextIdx = sceneIndex + 1
    if (nextIdx < currentLevel.scenes.length) {
      setSceneIndex(nextIdx)
      setScenePhase('scene')
      setScreen('scene')
    } else {
      const levelBonus = Math.round(currentLevel.xpReward * xpMultiplier)
      setXp(x => x + levelBonus)
      setLevelXpEarned(x => x + levelBonus)
      const newCompleted = [...completedLevels, currentLevel.id]
      setCompletedLevels(newCompleted)
      const gameComplete = newCompleted.length === LEVELS.length
      setIsGameComplete(gameComplete)
      setStats(s => ({
        ...s,
        levelsCompleted: newCompleted.length,
        perfectLevel: lives === MAX_LIVES,
        totalXp: xp + levelBonus + levelXpEarned,
        expertCompleted: difficulty.id === 'expert' ? true : s.expertCompleted,
      }))
      setScreen('levelcomplete')
    }
  }

  const handleLevelCompleteNext = () => {
    // After level complete → runner game!
    setScreen('runner')
  }

  const handleRunnerComplete = (score) => {
    const newHigh = Math.max(runnerHighScore, score)
    setRunnerHighScore(newHigh)
    const bonusXp = Math.min(Math.floor(score / 10) * 5, 200)
    setXp(x => x + bonusXp)
    setStats(s => ({...s, runnerHighScore: newHigh}))
    if (isGameComplete) setScreen('badges')
    else { setScreen('map'); setLives(MAX_LIVES) }
  }

  const currentScene = currentLevel?.scenes[sceneIndex]

  return (
    <div className="relative">
      {(screen === 'scene' || screen === 'scripture') && currentLevel && (
        <HUD character={character} xp={xp} lives={lives} maxLives={MAX_LIVES}
          level={currentLevel} difficulty={difficulty}
          sceneIndex={sceneIndex * 2 + (scenePhase === 'scripture' ? 1 : 0)}
          totalScenes={currentLevel.scenes.length * 2} />
      )}

      <div className={(screen === 'scene' || screen === 'scripture') ? 'pt-20' : ''}>
        {screen === 'map' && (
          <WorldMap character={character} completedLevels={completedLevels}
            currentXp={xp} onSelectLevel={handleSelectLevel}
            badges={earnedBadges} difficulty={difficulty} />
        )}
        {screen === 'scene' && currentScene && (
          <SceneComponent scene={currentScene} level={currentLevel}
            character={character} onComplete={handleSceneComplete} />
        )}
        {screen === 'scripture' && currentScene && (
          <ScriptureChallenge scriptureId={currentScene.scripture_challenge}
            difficulty={difficulty} onComplete={handleScriptureComplete}
            character={character} />
        )}
        {screen === 'levelcomplete' && (
          <LevelComplete level={currentLevel} xpEarned={levelXpEarned}
            totalXp={xp} onNext={handleLevelCompleteNext}
            isGameComplete={isGameComplete} difficulty={difficulty} />
        )}
        {screen === 'runner' && (
          <RunnerGame character={character} levelId={currentLevel?.id}
            onComplete={handleRunnerComplete} />
        )}
        {screen === 'badges' && (
          <BadgesScreen earnedBadges={earnedBadges}
            stats={{...stats, totalXp: xp}}
            onContinue={() => setScreen('map')} />
        )}
      </div>
    </div>
  )
}
