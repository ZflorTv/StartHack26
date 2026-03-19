import { Container, Graphics, Application, Text, TextStyle } from 'pixi.js'
import { PlantSprite } from '../components/PlantSprite'
import type { Portfolio } from '../types'
import { PLANTS_MAP } from '../data/plants'
import { BAD_PLANTS_MAP } from '../data/badPlants'
import { COLORS } from '../constants/colors'

export class GardenScene extends Container {
  private app: Application
  private background: Graphics
  private platform: Graphics
  private plantLayer: Container
  private weatherLayer: Container
  private plants: PlantSprite[] = []
  private gardenWidth: number = 500
  private gardenHeight: number = 300

  constructor(app: Application) {
    super()
    this.app = app

    // Sky / background gradient
    this.background = new Graphics()
    this.addChild(this.background)

    // Isometric platform
    this.platform = new Graphics()
    this.addChild(this.platform)

    // Plant container
    this.plantLayer = new Container()
    this.addChild(this.plantLayer)

    // Weather overlay container
    this.weatherLayer = new Container()
    this.addChild(this.weatherLayer)

    this.drawBackground()
    this.drawPlatform()
    this.centerScene()

    // Handle resize
    this.app.renderer.on('resize', () => {
      this.centerScene()
      this.drawBackground()
    })
  }

  private drawBackground(): void {
    this.background.clear()
    const w = this.app.screen.width
    const h = this.app.screen.height

    // Sky gradient (top to bottom: light blue to warm beige)
    this.background.rect(0, 0, w, h)
    this.background.fill({ color: COLORS.background })

    // Horizon glow
    this.background.rect(0, h * 0.3, w, h * 0.15)
    this.background.fill({ color: COLORS.skyTop, alpha: 0.3 })
  }

  private drawPlatform(): void {
    this.platform.clear()

    // Isometric diamond platform
    const w = this.gardenWidth
    const h = this.gardenHeight

    // Main platform (isometric diamond)
    this.platform.moveTo(0, -h / 2)         // top
    this.platform.lineTo(w / 2, 0)          // right
    this.platform.lineTo(0, h / 2)          // bottom
    this.platform.lineTo(-w / 2, 0)         // left
    this.platform.closePath()
    this.platform.fill({ color: 0x8BC34A, alpha: 0.7 })
    this.platform.stroke({ color: 0x689F38, width: 2, alpha: 0.5 })

    // Platform depth (side faces for 3D effect)
    const depth = 20

    // Right face
    this.platform.moveTo(w / 2, 0)
    this.platform.lineTo(0, h / 2)
    this.platform.lineTo(0, h / 2 + depth)
    this.platform.lineTo(w / 2, depth)
    this.platform.closePath()
    this.platform.fill({ color: 0x689F38, alpha: 0.6 })

    // Left face
    this.platform.moveTo(-w / 2, 0)
    this.platform.lineTo(0, h / 2)
    this.platform.lineTo(0, h / 2 + depth)
    this.platform.lineTo(-w / 2, depth)
    this.platform.closePath()
    this.platform.fill({ color: 0x558B2F, alpha: 0.6 })

    // Grid lines on platform surface (isometric)
    for (let i = 1; i < 5; i++) {
      const t = i / 5
      // Horizontal iso lines
      const hx1 = -w / 2 * (1 - t)
      const hy1 = -h / 2 * t + h / 2 * (1 - t) * 0
      this.platform.moveTo(lerp(-w / 2, 0, t), lerp(0, -h / 2, t))
      this.platform.lineTo(lerp(0, w / 2, t), lerp(-h / 2, 0, t))
      this.platform.stroke({ color: 0x7CB342, width: 1, alpha: 0.2 })

      this.platform.moveTo(lerp(-w / 2, 0, t), lerp(0, h / 2, t))
      this.platform.lineTo(lerp(0, w / 2, t), lerp(h / 2, 0, t))
      this.platform.stroke({ color: 0x7CB342, width: 1, alpha: 0.2 })
    }
  }

  private centerScene(): void {
    this.platform.x = this.app.screen.width / 2
    this.platform.y = this.app.screen.height / 2 + 20
    this.plantLayer.x = this.platform.x
    this.plantLayer.y = this.platform.y
    this.weatherLayer.x = 0
    this.weatherLayer.y = 0
    this.background.x = 0
    this.background.y = 0
  }

  updatePortfolio(portfolio: Portfolio): void {
    // Clear existing plants
    this.plantLayer.removeChildren()
    this.plants = []

    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    const total = entries.reduce((sum, [_, v]) => sum + v, 0)

    if (total === 0) return

    // Layout plants in isometric grid positions
    const positions = this.calculatePlantPositions(entries.length)

    entries.forEach(([plantId, allocation], index) => {
      // Look up plant data
      const plantData = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
      if (!plantData) return

      const pos = positions[index] || { x: 0, y: 0, scale: 0.8 }

      // Scale based on allocation weight
      const weight = allocation / total
      const sizeScale = 0.6 + weight * 1.2  // 0.6 to 1.8

      const plant = new PlantSprite(
        plantId,
        plantData.emoji,
        plantData.color,
        plantData.category,
        plantData.icon,
        { x: pos.x, y: pos.y, scale: pos.scale * sizeScale },
      )

      // Show allocation percentage as label
      const pct = Math.round(weight * 100)
      plant.setLabel(`${pct}%`)

      this.plants.push(plant)
      this.plantLayer.addChild(plant)
    })

    // Sort by Y for depth ordering
    this.plantLayer.children.sort((a, b) => a.y - b.y)
  }

  private calculatePlantPositions(count: number): Array<{ x: number; y: number; scale: number }> {
    const positions: Array<{ x: number; y: number; scale: number }> = []
    const w = this.gardenWidth * 0.35
    const h = this.gardenHeight * 0.35

    if (count === 1) {
      positions.push({ x: 0, y: -10, scale: 1.0 })
    } else if (count <= 3) {
      // Triangle layout
      const angles = count === 2 ? [-0.3, 0.3] : [-0.5, 0.5, 0]
      angles.forEach((angle, i) => {
        const row = i === angles.length - 1 && count === 3 ? 1 : 0
        positions.push({
          x: angle * w * 1.5,
          y: -h * 0.3 + row * h * 0.6,
          scale: row === 0 ? 0.85 : 1.0,
        })
      })
    } else {
      // Grid layout, isometric
      const cols = Math.ceil(Math.sqrt(count * 1.5))
      const rows = Math.ceil(count / cols)

      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols)
        const col = i % cols
        const colsInRow = row === rows - 1 ? count - row * cols : cols

        // Isometric offset
        const isoX = (col - (colsInRow - 1) / 2) * (w * 2 / cols)
        const isoY = (row - (rows - 1) / 2) * (h * 2 / rows)

        // Depth-based scale (back row smaller)
        const depthScale = 0.7 + (row / Math.max(1, rows - 1)) * 0.3

        positions.push({
          x: isoX + (row % 2 === 1 ? w / cols * 0.5 : 0),  // stagger odd rows
          y: isoY,
          scale: depthScale,
        })
      }
    }

    return positions
  }

  getPlants(): PlantSprite[] {
    return this.plants
  }

  getPlantById(plantId: string): PlantSprite | undefined {
    return this.plants.find(p => p.plantId === plantId)
  }

  // Set weather overlay color
  setWeatherBackground(weatherType: string): void {
    const weatherColors: Record<string, { color: number; alpha: number }> = {
      sun:       { color: 0xFFF9C4, alpha: 0.2 },
      rain:      { color: 0x7EA8C0, alpha: 0.3 },
      storm:     { color: 0x1C2833, alpha: 0.4 },
      frost:     { color: 0xD6EAF8, alpha: 0.3 },
      heat:      { color: 0xF0B27A, alpha: 0.3 },
      lightning: { color: 0x1A252F, alpha: 0.5 },
      fog:       { color: 0xBDBDBD, alpha: 0.4 },
      calm:      { color: 0xE8F4F8, alpha: 0.1 },
      tornado:   { color: 0x37474F, alpha: 0.4 },
      meteor:    { color: 0x1A237E, alpha: 0.3 },
      acid_rain: { color: 0xAED581, alpha: 0.2 },
    }

    this.weatherLayer.removeChildren()

    const wc = weatherColors[weatherType] || { color: COLORS.background, alpha: 0 }
    const overlay = new Graphics()
    overlay.rect(0, 0, this.app.screen.width, this.app.screen.height)
    overlay.fill({ color: wc.color, alpha: wc.alpha })
    this.weatherLayer.addChild(overlay)
  }

  clearWeather(): void {
    this.weatherLayer.removeChildren()
  }

  // Animate plant reactions to event effects
  animateEventEffects(effects: Record<string, number>): void {
    this.plants.forEach(plant => {
      const effect = effects[plant.plantId] ?? 0
      if (effect > 0.05) {
        plant.showGrowthEffect()
      } else if (effect < -0.05) {
        plant.showDamageEffect()
      }
    })
  }

  // Reset all plants to healthy state
  resetPlantStates(): void {
    this.plants.forEach(plant => plant.recover())
  }
}

// Helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}