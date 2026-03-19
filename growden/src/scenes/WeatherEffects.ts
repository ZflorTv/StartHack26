import { Container, Graphics, Application } from 'pixi.js'

interface Particle {
  graphic: Graphics
  vx: number
  vy: number
  life: number
  maxLife: number
}

export class WeatherEffects extends Container {
  private app: Application
  private particles: Particle[] = []
  private isActive: boolean = false
  private weatherType: string = 'calm'
  private tickerFn: (() => void) | null = null

  constructor(app: Application) {
    super()
    this.app = app
  }

  start(weatherType: string): void {
    this.stop()
    this.weatherType = weatherType
    this.isActive = true

    this.tickerFn = () => this.update()
    this.app.ticker.add(this.tickerFn)

    // Spawn initial particles
    this.spawnBatch()
  }

  stop(): void {
    this.isActive = false
    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn)
      this.tickerFn = null
    }
    // Clean up particles
    this.particles.forEach(p => p.graphic.destroy())
    this.particles = []
    this.removeChildren()
  }

  private spawnBatch(): void {
    const count = this.getParticleCount()
    for (let i = 0; i < count; i++) {
      this.spawnParticle()
    }
  }

  private getParticleCount(): number {
    switch (this.weatherType) {
      case 'rain': case 'acid_rain': return 40
      case 'storm': return 60
      case 'frost': return 25
      case 'sun': return 8
      case 'heat': return 12
      case 'lightning': return 3
      case 'fog': return 15
      case 'tornado': return 30
      case 'meteor': return 6
      case 'calm': return 5
      default: return 10
    }
  }

  private spawnParticle(): void {
    const g = new Graphics()
    const w = this.app.screen.width
    const h = this.app.screen.height
    let vx = 0, vy = 0, maxLife = 100

    switch (this.weatherType) {
      case 'rain':
      case 'acid_rain': {
        const isAcid = this.weatherType === 'acid_rain'
        const color = isAcid ? 0xAED581 : 0x7EA8C0
        g.moveTo(0, 0)
        g.lineTo(-2, 12)
        g.stroke({ color, width: 1.5, alpha: 0.6 })
        g.x = Math.random() * w
        g.y = -20 + Math.random() * -100
        vx = -1 + Math.random() * 0.5
        vy = 6 + Math.random() * 4
        maxLife = Math.floor(h / vy) + 10
        break
      }
      case 'storm': {
        g.moveTo(0, 0)
        g.lineTo(-3, 16)
        g.stroke({ color: 0x5C6BC0, width: 2, alpha: 0.7 })
        g.x = Math.random() * w
        g.y = -20 + Math.random() * -100
        vx = -3 + Math.random()
        vy = 8 + Math.random() * 6
        maxLife = Math.floor(h / vy) + 10
        break
      }
      case 'frost': {
        g.circle(0, 0, 2 + Math.random() * 3)
        g.fill({ color: 0xFFFFFF, alpha: 0.7 })
        g.x = Math.random() * w
        g.y = -10 + Math.random() * -50
        vx = -0.5 + Math.random()
        vy = 1 + Math.random() * 2
        maxLife = 200
        break
      }
      case 'sun': {
        const size = 3 + Math.random() * 5
        g.circle(0, 0, size)
        g.fill({ color: 0xFFD100, alpha: 0.15 + Math.random() * 0.15 })
        g.x = Math.random() * w
        g.y = Math.random() * h * 0.6
        vx = 0
        vy = -0.2
        maxLife = 150
        break
      }
      case 'heat': {
        // Rising heat shimmer
        g.rect(-8, 0, 16, 2)
        g.fill({ color: 0xF0B27A, alpha: 0.2 })
        g.x = Math.random() * w
        g.y = h - Math.random() * h * 0.3
        vx = Math.sin(Math.random() * Math.PI * 2) * 0.5
        vy = -1 - Math.random()
        maxLife = 120
        break
      }
      case 'lightning': {
        // Brief bright flash
        g.rect(0, 0, w, h)
        g.fill({ color: 0xFFFFFF, alpha: 0.6 })
        g.x = 0
        g.y = 0
        vx = 0
        vy = 0
        maxLife = 4  // very brief
        break
      }
      case 'fog': {
        const fogW = 80 + Math.random() * 120
        g.ellipse(0, 0, fogW, 20 + Math.random() * 15)
        g.fill({ color: 0xBDBDBD, alpha: 0.15 + Math.random() * 0.1 })
        g.x = -fogW + Math.random() * (w + fogW)
        g.y = h * 0.3 + Math.random() * h * 0.4
        vx = 0.3 + Math.random() * 0.5
        vy = 0
        maxLife = 300
        break
      }
      case 'tornado': {
        g.circle(0, 0, 2 + Math.random() * 3)
        g.fill({ color: 0x78909C, alpha: 0.5 })
        const angle = Math.random() * Math.PI * 2
        const radius = 20 + Math.random() * 80
        g.x = w / 2 + Math.cos(angle) * radius
        g.y = h / 2 + Math.sin(angle) * radius * 0.5
        vx = Math.cos(angle + Math.PI / 2) * 3
        vy = Math.sin(angle + Math.PI / 2) * 1.5 - 1
        maxLife = 80
        break
      }
      case 'meteor': {
        g.circle(0, 0, 3 + Math.random() * 4)
        g.fill({ color: 0xFF6F00, alpha: 0.8 })
        // Trail
        g.moveTo(0, 0)
        g.lineTo(8, -16)
        g.stroke({ color: 0xFFAB00, width: 2, alpha: 0.4 })
        g.x = Math.random() * w
        g.y = -20
        vx = -2 + Math.random() * -2
        vy = 4 + Math.random() * 6
        maxLife = 60
        break
      }
      default: {
        // Calm: gentle floating motes
        g.circle(0, 0, 1.5)
        g.fill({ color: 0xFFD100, alpha: 0.2 })
        g.x = Math.random() * w
        g.y = Math.random() * h
        vx = -0.2 + Math.random() * 0.4
        vy = -0.3 + Math.random() * 0.1
        maxLife = 200
      }
    }

    const particle: Particle = { graphic: g, vx, vy, life: 0, maxLife }
    this.particles.push(particle)
    this.addChild(g)
  }

  private update(): void {
    if (!this.isActive) return

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.graphic.x += p.vx
      p.graphic.y += p.vy
      p.life++

      // Fade out near end of life
      if (p.life > p.maxLife * 0.7) {
        p.graphic.alpha = 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3)
      }

      // Remove dead particles
      if (p.life >= p.maxLife || p.graphic.y > this.app.screen.height + 50) {
        p.graphic.destroy()
        this.particles.splice(i, 1)

        // Respawn if still active
        if (this.isActive) {
          this.spawnParticle()
        }
      }
    }
  }
}
