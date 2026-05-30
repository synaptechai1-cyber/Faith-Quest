import { useEffect, useRef, useState, useCallback } from 'react'

const W = 480
const H = 260
const GROUND = H - 50
const GRAVITY = 0.6
const JUMP_FORCE = -13
const SPEED_START = 4
const SPEED_MAX = 10

// Obstacle types
const OBSTACLES = [
  { w: 24, h: 40, color: '#ef4444', label: '😈', name: 'Temptation' },
  { w: 20, h: 50, color: '#7c3aed', label: '💀', name: 'Fear' },
  { w: 30, h: 35, color: '#dc2626', label: '🐍', name: 'Deception' },
  { w: 22, h: 45, color: '#b91c1c', label: '💔', name: 'Doubt' },
]

// Collectibles
const COLLECTIBLES = [
  { color: '#f59e0b', label: '📜', name: 'Scroll', points: 10 },
  { color: '#fcd34d', label: '⭐', name: 'Star', points: 25 },
  { color: '#fff', label: '✝️', name: 'Cross', points: 50 },
]

function drawRoundedRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
}

export default function RunnerGame({ character, levelId, onComplete }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    player: { x: 80, y: GROUND, vy: 0, onGround: true, w: 28, h: 36, jumping: false },
    obstacles: [],
    collectibles: [],
    particles: [],
    clouds: [
      { x: 100, y: 40, w: 60 }, { x: 280, y: 25, w: 80 },
      { x: 420, y: 50, w: 50 }, { x: 600, y: 35, w: 70 },
    ],
    stars: Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*(H-80),size:Math.random()*2+0.5,twinkle:Math.random()*Math.PI*2})),
    score: 0,
    distance: 0,
    speed: SPEED_START,
    frame: 0,
    gameOver: false,
    started: false,
    collected: 0,
    bgX: 0,
    groundX: 0,
    playerFrame: 0,
    doubleJumpUsed: false,
  })
  const [displayScore, setDisplayScore] = useState(0)
  const [displayMsg, setDisplayMsg] = useState('')
  const [gameState, setGameState] = useState('ready') // ready | playing | dead
  const animRef = useRef(null)
  const lastTimeRef = useRef(0)

  const jump = useCallback(() => {
    const s = stateRef.current
    if (s.gameOver) return
    if (!s.started) { s.started = true; setGameState('playing'); return }
    if (s.player.onGround) {
      s.player.vy = JUMP_FORCE
      s.player.onGround = false
      s.player.jumping = true
      s.doubleJumpUsed = false
    } else if (!s.doubleJumpUsed) {
      s.player.vy = JUMP_FORCE * 0.85
      s.doubleJumpUsed = true
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() } }
    const onTouch = (e) => { e.preventDefault(); jump() }
    window.addEventListener('keydown', onKey)
    const canvas = canvasRef.current
    if (canvas) canvas.addEventListener('touchstart', onTouch, {passive:false})
    return () => {
      window.removeEventListener('keydown', onKey)
      if (canvas) canvas.removeEventListener('touchstart', onTouch)
    }
  }, [jump])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const spawnObstacle = () => {
      const s = stateRef.current
      const t = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)]
      s.obstacles.push({ x: W + 20, y: GROUND - t.h + 36, w: t.w, h: t.h, color: t.color, label: t.label, name: t.name })
    }

    const spawnCollectible = () => {
      const s = stateRef.current
      const t = COLLECTIBLES[Math.floor(Math.random() * COLLECTIBLES.length)]
      const heights = [GROUND - 30, GROUND - 70, GROUND - 110]
      s.collectibles.push({ x: W + 20, y: heights[Math.floor(Math.random()*heights.length)], color: t.color, label: t.label, name: t.name, points: t.points, w: 24, h: 24 })
    }

    const addParticle = (x, y, color, count=8) => {
      const s = stateRef.current
      for (let i=0;i<count;i++) {
        const angle = (Math.PI*2/count)*i + Math.random()*0.5
        s.particles.push({x,y,vx:Math.cos(angle)*(2+Math.random()*3),vy:Math.sin(angle)*(2+Math.random()*3),life:1,color,size:3+Math.random()*4})
      }
    }

    const gameLoop = (time) => {
      const dt = Math.min((time - lastTimeRef.current)/16, 3)
      lastTimeRef.current = time
      const s = stateRef.current

      if (!s.started || s.gameOver) {
        drawFrame(ctx, s)
        animRef.current = requestAnimationFrame(gameLoop)
        return
      }

      s.frame++
      s.playerFrame = Math.floor(s.frame / 6) % 4

      // Speed up
      s.speed = Math.min(SPEED_START + s.distance / 800, SPEED_MAX)
      s.distance += s.speed * dt
      s.score = Math.floor(s.distance / 10) + s.collected * 5
      s.bgX = (s.bgX - s.speed * 0.3 * dt) % W
      s.groundX = (s.groundX - s.speed * dt) % 60

      // Twinkle stars
      s.stars.forEach(st => { st.twinkle += 0.05 })

      // Clouds
      s.clouds.forEach(c => { c.x -= s.speed * 0.2 * dt; if (c.x < -100) c.x = W + 50 })

      // Player physics
      const p = s.player
      if (!p.onGround) {
        p.vy += GRAVITY * dt
        p.y += p.vy * dt
        if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; p.onGround = true; p.jumping = false }
      }

      // Spawn
      const spawnInterval = Math.max(60, 120 - s.distance/50)
      if (s.frame % Math.floor(spawnInterval) === 0) spawnObstacle()
      if (s.frame % 90 === 45) spawnCollectible()

      // Move obstacles
      s.obstacles.forEach(o => { o.x -= s.speed * dt })
      s.obstacles = s.obstacles.filter(o => o.x > -50)

      // Move collectibles
      s.collectibles.forEach(c => { c.x -= s.speed * dt; c.float = Math.sin(s.frame*0.1)*4 })
      s.collectibles = s.collectibles.filter(c => c.x > -50)

      // Collision - obstacles
      for (let o of s.obstacles) {
        if (p.x + p.w - 8 > o.x + 4 && p.x + 8 < o.x + o.w - 4 && p.y + p.h - 4 > o.y + 4 && p.y + 4 < o.y + o.h - 4) {
          addParticle(p.x, p.y, '#ef4444', 12)
          s.gameOver = true
          setGameState('dead')
          setDisplayScore(s.score)
          break
        }
      }

      // Collision - collectibles
      s.collectibles = s.collectibles.filter(c => {
        if (p.x + p.w - 6 > c.x && p.x + 6 < c.x + c.w && p.y + p.h - 6 > c.y + (c.float||0) && p.y < c.y + c.h + (c.float||0)) {
          addParticle(c.x + 12, c.y + 12, c.color, 6)
          s.collected += c.points
          s.score = Math.floor(s.distance/10) + s.collected*5
          setDisplayMsg('+' + c.points + ' ' + c.name + '!')
          setTimeout(() => setDisplayMsg(''), 1000)
          return false
        }
        return true
      })

      // Particles
      s.particles.forEach(pt => { pt.x+=pt.vx*dt; pt.y+=pt.vy*dt; pt.vy+=0.2*dt; pt.life-=0.04*dt; pt.size*=0.97 })
      s.particles = s.particles.filter(pt => pt.life > 0)

      setDisplayScore(s.score)
      drawFrame(ctx, s)
      animRef.current = requestAnimationFrame(gameLoop)
    }

    const drawFrame = (ctx, s) => {
      // Sky gradient
      const sky = ctx.createLinearGradient(0,0,0,H)
      sky.addColorStop(0,'#0a0616')
      sky.addColorStop(0.6,'#0d0820')
      sky.addColorStop(1,'#1a0a2e')
      ctx.fillStyle = sky
      ctx.fillRect(0,0,W,H)

      // Grid lines
      ctx.strokeStyle = 'rgba(99,102,241,0.06)'
      ctx.lineWidth = 1
      for (let x=0;x<W;x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y=0;y<H;y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

      // Stars
      s.stars.forEach(st => {
        const a = 0.3 + 0.5*Math.abs(Math.sin(st.twinkle))
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI*2); ctx.fill()
      })

      // City silhouette
      ctx.fillStyle = 'rgba(20,10,40,0.8)'
      const buildings = [[0,80,40,120],[40,100,30,100],[70,70,50,130],[120,90,35,110],[155,60,45,140],[200,85,30,115],[230,75,40,125],[270,95,25,105],[295,65,50,135],[345,80,35,120],[380,90,40,110],[420,70,45,130],[465,85,15,115]]
      buildings.forEach(([x,y,w,h]) => {
        ctx.fillRect(x + (s.bgX % W), y, w-2, h)
        ctx.fillRect(x + (s.bgX % W) - W, y, w-2, h)
        // Windows
        ctx.fillStyle = 'rgba(245,158,11,0.3)'
        for (let wy=y+10; wy<y+h-10; wy+=15) {
          for (let wx=x+(s.bgX%W)+5; wx<x+(s.bgX%W)+w-5; wx+=12) {
            if (Math.random() > 0.4) ctx.fillRect(wx, wy, 6, 8)
          }
        }
        ctx.fillStyle = 'rgba(20,10,40,0.8)'
      })

      // Clouds
      s.clouds.forEach(c => {
        ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w, 15, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(c.x-15, c.y+5, c.w*0.6, 12, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(c.x+15, c.y+5, c.w*0.5, 10, 0, 0, Math.PI*2); ctx.fill()
      })

      // Ground
      const grd = ctx.createLinearGradient(0,GROUND+36,0,H)
      grd.addColorStop(0,'#2d1b4e')
      grd.addColorStop(1,'#1a0a2e')
      ctx.fillStyle = grd
      ctx.fillRect(0, GROUND+36, W, H - GROUND - 36)

      // Ground line
      ctx.strokeStyle = 'rgba(245,158,11,0.4)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(0, GROUND+36); ctx.lineTo(W, GROUND+36); ctx.stroke()

      // Ground tiles
      ctx.strokeStyle = 'rgba(245,158,11,0.1)'
      ctx.lineWidth = 1
      for (let x = s.groundX; x < W; x+=60) {
        ctx.beginPath(); ctx.moveTo(x, GROUND+36); ctx.lineTo(x, H); ctx.stroke()
      }

      // Collectibles
      s.collectibles.forEach(c => {
        const fy = c.y + (c.float||0)
        // Glow
        const glow = ctx.createRadialGradient(c.x+12, fy+12, 0, c.x+12, fy+12, 20)
        glow.addColorStop(0, c.color.replace(')',',0.3)').replace('rgb','rgba') || 'rgba(245,158,11,0.3)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow; ctx.fillRect(c.x-8, fy-8, 40, 40)
        ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.fillText(c.label, c.x+12, fy+16)
      })

      // Obstacles
      s.obstacles.forEach(o => {
        drawRoundedRect(ctx, o.x, o.y, o.w, o.h, 6, o.color + '33')
        ctx.strokeStyle = o.color; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.roundRect?.(o.x, o.y, o.w, o.h, 6)
        ctx.stroke()
        ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.fillText(o.label, o.x+o.w/2, o.y+o.h/2+6)
      })

      // Player
      const p = s.player
      const bounce = p.onGround ? Math.abs(Math.sin(s.playerFrame * Math.PI / 2)) * 3 : 0
      const squish = p.onGround ? 1 + bounce*0.05 : 1 - Math.abs(p.vy)*0.01
      const stretch = p.onGround ? 1 - bounce*0.05 : 1 + Math.abs(p.vy)*0.02

      ctx.save()
      ctx.translate(p.x + p.w/2, p.y + p.h)
      ctx.scale(squish, stretch)

      // Body glow
      const pg = ctx.createRadialGradient(0,-p.h/2,0,0,-p.h/2,p.w)
      pg.addColorStop(0,'rgba(245,158,11,0.3)')
      pg.addColorStop(1,'transparent')
      ctx.fillStyle = pg; ctx.fillRect(-p.w, -p.h-5, p.w*2, p.h+10)

      // Character body
      drawRoundedRect(ctx, -p.w/2, -p.h, p.w, p.h, 8, '#f59e0b')
      // Head
      ctx.fillStyle = character.gender === 'female' ? '#f0a070' : '#d4845a'
      ctx.beginPath(); ctx.arc(0, -p.h-8, 10, 0, Math.PI*2); ctx.fill()
      // Eyes
      ctx.fillStyle = 'white'
      ctx.beginPath(); ctx.arc(-4, -p.h-9, 2.5, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(4, -p.h-9, 2.5, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle = '#1a0a2e'
      ctx.beginPath(); ctx.arc(-4, -p.h-9, 1.2, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(4, -p.h-9, 1.2, 0, Math.PI*2); ctx.fill()
      // Cross on body
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fillRect(-2, -p.h+6, 4, 12)
      ctx.fillRect(-6, -p.h+10, 12, 4)
      // Cape/legs
      if (p.onGround) {
        const legOffset = Math.sin(s.frame*0.3)*6
        ctx.fillStyle = '#7c3aed'
        ctx.fillRect(-p.w/2+2, -4, 8, 12+legOffset)
        ctx.fillRect(p.w/2-10, -4, 8, 12-legOffset)
      }
      ctx.restore()

      // Particles
      s.particles.forEach(pt => {
        ctx.globalAlpha = pt.life
        ctx.fillStyle = pt.color
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 1
      })

      // Score
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      drawRoundedRect(ctx, 8, 8, 120, 30, 8, 'rgba(0,0,0,0.4)')
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 13px "Cinzel", serif'
      ctx.textAlign = 'left'
      ctx.fillText(`⭐ ${s.score}`, 18, 28)

      // Speed indicator
      drawRoundedRect(ctx, W-90, 8, 80, 30, 8, 'rgba(0,0,0,0.4)')
      ctx.fillStyle = s.speed > 7 ? '#ef4444' : s.speed > 5.5 ? '#f59e0b' : '#10b981'
      ctx.textAlign = 'right'
      ctx.fillText(`⚡ x${s.speed.toFixed(1)}`, W-14, 28)

      // Ready screen
      if (!s.started) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(0,0,W,H)
        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 22px "Cinzel Decorative", serif'
        ctx.textAlign = 'center'
        ctx.fillText('FAITH RUNNER', W/2, H/2 - 30)
        ctx.font = '13px "Nunito", sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.fillText('Collect scrolls ✦ Avoid temptations', W/2, H/2)
        ctx.fillStyle = '#fcd34d'
        ctx.font = 'bold 14px "Cinzel", serif'
        const pulse = 0.7 + 0.3*Math.abs(Math.sin(Date.now()*0.003))
        ctx.globalAlpha = pulse
        ctx.fillText('TAP / PRESS SPACE TO START', W/2, H/2 + 35)
        ctx.globalAlpha = 1
        ctx.font = '11px "Nunito", sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.fillText('Tap again to double jump!', W/2, H/2 + 60)
      }

      // Death screen
      if (s.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'
        ctx.fillRect(0,0,W,H)
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 20px "Cinzel", serif'
        ctx.textAlign = 'center'
        ctx.fillText('OVERCOME BY TEMPTATION', W/2, H/2 - 35)
        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 28px "Cinzel", serif'
        ctx.fillText(`Score: ${s.score}`, W/2, H/2 + 5)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = '12px "Nunito", sans-serif'
        ctx.fillText('"Put on the full armor of God" — Ephesians 6:11', W/2, H/2 + 35)
      }
    }

    animRef.current = requestAnimationFrame(gameLoop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [character])

  const handleRestart = () => {
    const s = stateRef.current
    Object.assign(s, {
      player: { x: 80, y: GROUND, vy: 0, onGround: true, w: 28, h: 36, jumping: false },
      obstacles: [], collectibles: [], particles: [],
      score: 0, distance: 0, speed: SPEED_START, frame: 0,
      gameOver: false, started: false, collected: 0, bgX: 0, groundX: 0,
      playerFrame: 0, doubleJumpUsed: false,
    })
    setGameState('ready')
    setDisplayScore(0)
  }

  return (
    <div className="min-h-screen stars-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 game-card px-4 py-2 mb-3">
            <span className="text-yellow-400 text-sm">🎮</span>
            <span className="font-display text-xs text-yellow-400 uppercase tracking-widest">Bonus Stage · Faith Runner</span>
          </div>
          <p className="text-slate-400 text-xs">Collect scrolls & avoid temptations to earn bonus XP!</p>
        </div>

        {/* Score display */}
        <div className="flex items-center justify-between mb-3">
          <div className="game-card px-4 py-2">
            <span className="font-display text-sm text-yellow-400">⭐ {displayScore}</span>
          </div>
          {displayMsg && (
            <div className="anim-pop game-card px-4 py-2">
              <span className="font-display text-xs text-green-400">{displayMsg}</span>
            </div>
          )}
          <div className="game-card px-4 py-2">
            <span className="font-display text-xs text-slate-400 uppercase tracking-wider">
              {gameState === 'ready' ? 'Ready!' : gameState === 'playing' ? 'Running!' : 'Game Over'}
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative rounded-2xl overflow-hidden" style={{border:'1px solid rgba(245,158,11,0.2)', boxShadow:'0 0 40px rgba(245,158,11,0.1)'}}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={jump}
            className="w-full cursor-pointer"
            style={{display:'block', maxHeight:'280px'}}
          />
        </div>

        {/* Controls hint */}
        <div className="flex items-center justify-center gap-4 mt-3 mb-5">
          <span className="text-xs text-slate-500">📱 Tap to jump</span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-500">⌨️ Spacebar</span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-500">Double tap = double jump!</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {gameState === 'dead' && (
            <button onClick={handleRestart}
              className="flex-1 font-display font-bold py-3 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95 text-sm"
              style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)'}}>
              🔄 Try Again
            </button>
          )}
          <button onClick={() => onComplete(displayScore)}
            className="flex-1 font-display font-bold py-3 rounded-2xl uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95 text-sm"
            style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>
            {gameState === 'dead' ? '✓ Continue Journey' : 'Skip →'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-3 font-display">
          "Run with endurance the race God has set before us." — Hebrews 12:1
        </p>
      </div>
    </div>
  )
}
