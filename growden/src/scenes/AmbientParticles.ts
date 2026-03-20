import { Container, Graphics, Application } from 'pixi.js'

interface AmbientParticle {
  graphic: Graphics
  vx: number
  vy: number
  baseX: number
  baseY: number
  life: number
  maxLife: number
  wobbleSpeed: number
  wobbleAmp: number
  type: 'leaf' | 'pollen' | 'sparkle'
}

/**
 * Subtle ambient particles (leaves, pollen, sparkles) floating over the garden.
 * Always running when the garden is visible — gives the scene life.
 */
export class AmbientParticles extends Container {
  private app: Application
  private particles: AmbientParticle[] = []
  private tickerFn: (() => void) | null = null
  private frame: number = 0

  constructor(app: Application) {
    super()
    this.app = app
  }

  start(): void {
    if (this.tickerFn) return // already running
    this.tickerFn = () => this.update()
    this.app.ticker.add(this.tickerFn)

    // Spawn initial batch
    for (let i = 0; i < 18; i++) {
      this.spawnParticle(true)
    }
  }

  stop(): void {
    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn)
      this.tickerFn = null
    }
    this.particles.forEach(p => p.graphic.destroy())
    this.particles = []
    this.removeChildren()
    this.frame = 0
  }

  private spawnParticle(randomAge: boolean = false): void {
    const w = this.app.screen.width
    const h = this.app.screen.height
    const g = new Graphics()

    // Pick a random type
    const rand = Math.random()
    let type: AmbientParticle['type']
    if (rand < 0.4) type = 'leaf'
    else if (rand < 0.8) type = 'pollen'
    else type = 'sparkle'

    let vx = 0, vy = 0, maxLife = 300

    switch (type) {
      case 'leaf': {
        // Small leaf shape — a tilted ellipse
        const size = 3 + Math.random() * 3
        const leafColors = [0x7CB342, 0x8BC34A, 0x689F38, 0xAED581, 0xC5E1A5]
        const color = leafColors[Math.floor(Math.random() * leafColors.length)]
        g.ellipse(0, 0, size, size * 0.5)
        g.fill({ color, alpha: 0.5 + Math.random() * 0.2 })
        g.rotation = Math.random() * Math.PI
        g.x = Math.random() * w
        g.y = -10 - Math.random() * 40
        vx = -0.15 + Math.random() * 0.3
        vy = 0.3 + Math.random() * 0.5
        maxLife = 350 + Math.random() * 150
        break
      }
      case 'pollen': {
        // Tiny floating dot
        const r = 1 + Math.random() * 1.5
        const pollenColors = [0xFFD100, 0xFFE082, 0xFFF9C4, 0xFFECB3]
        const color = pollenColors[Math.floor(Math.random() * pollenColors.length)]
        g.circle(0, 0, r)
        g.fill({ color, alpha: 0.4 + Math.random() * 0.25 })
        g.x = Math.random() * w
        g.y = h * 0.2 + Math.random() * h * 0.6
        vx = -0.1 + Math.random() * 0.2
        vy = -0.15 + Math.random() * 0.1
        maxLife = 400 + Math.random() * 200
        break
      }
      case 'sparkle': {
        // Brief glint
        const r = 1 + Math.random() * 1.5
        g.circle(0, 0, r)
        g.fill({ color: 0xFFFFFF, alpha: 0.6 })
        g.x = w * 0.1 + Math.random() * w * 0.8
        g.y = h * 0.1 + Math.random() * h * 0.5
        vx = 0
        vy = 0
        maxLife = 60 + Math.random() * 60
        break
      }
    }

    const particle: AmbientParticle = {
      graphic: g,
      vx,
      vy,
      baseX: g.x,
      baseY: g.y,
      life: randomAge ? Math.floor(Math.random() * maxLife * 0.6) : 0,
      maxLife,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmp: 8 + Math.random() * 15,
      type,
    }

    this.particles.push(particle)
    this.addChild(g)
  }

  private update(): void {
    this.frame++

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life++

      // Movement
      p.baseX += p.vx
      p.baseY += p.vy

      // Wobble (sine drift for leaves/pollen)
      if (p.type === 'leaf' || p.type === 'pollen') {
        p.graphic.x = p.baseX + Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp
        p.graphic.y = p.baseY
      }

      // Leaves slowly rotate
      if (p.type === 'leaf') {
        p.graphic.rotation += 0.005
      }

      // Sparkles pulse alpha
      if (p.type === 'sparkle') {
        const t = p.life / p.maxLife
        p.graphic.alpha = Math.sin(t * Math.PI) * 0.6
      }

      // Fade in/out for leaves and pollen
      if (p.type !== 'sparkle') {
        const fadeIn = Math.min(1, p.life / 30)
        const fadeOut = p.life > p.maxLife * 0.75
          ? 1 - (p.life - p.maxLife * 0.75) / (p.maxLife * 0.25)
          : 1
        p.graphic.alpha = fadeIn * fadeOut * (p.type === 'leaf' ? 0.6 : 0.5)
      }

      // Remove dead particles
      if (p.life >= p.maxLife || p.baseY > this.app.screen.height + 30) {
        p.graphic.destroy()
        this.particles.splice(i, 1)
        this.spawnParticle()
      }
    }
  }
}
