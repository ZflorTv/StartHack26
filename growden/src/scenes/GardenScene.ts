/**
 * GardenScene — Main PixiJS scene
 *
 * Renders the floating island with sky background, plant sprites,
 * ambient particles, and weather overlays. Handles plant tap → drawer
 * and drag-to-rebalance interactions.
 *
 * Container hierarchy:
 *   GardenScene
 *   ├── skySprite          (full-viewport background image)
 *   ├── islandGroup        (animated as one unit — bob + tilt)
 *   │   ├── islandSprite   (the island PNG)
 *   │   └── plantLayer     (PlantSprite children)
 *   ├── ambientParticles   (leaves, pollen, sparkles)
 *   └── weatherLayer       (atmospheric overlays during events)
 */

import { Container, Graphics, Sprite, Assets, Application, FederatedPointerEvent } from 'pixi.js'
import { gsap } from 'gsap'
import { PlantSprite } from '../components/PlantSprite'
import { PlantDrawer } from '../ui/components/PlantDrawer'
import { AmbientParticles } from './AmbientParticles'
import type { Portfolio } from '../types'
import { PLANTS_MAP } from '../data/plants'
import { BAD_PLANTS_MAP } from '../data/badPlants'
import { isDarkMode, onThemeChange } from '../ui/enhancements/DarkMode'

/** Sky tint + atmospheric overlay per weather type */
const WEATHER_SKY: Record<string, { tint: number; overlay: number; overlayAlpha: number }> = {
  sun:       { tint: 0xFFF8E0, overlay: 0xFFF9C4, overlayAlpha: 0.08 },
  calm:      { tint: 0xF0F4FF, overlay: 0xE8F4F8, overlayAlpha: 0.05 },
  rain:      { tint: 0x8899AA, overlay: 0x5577AA, overlayAlpha: 0.18 },
  storm:     { tint: 0x556677, overlay: 0x1C2833, overlayAlpha: 0.28 },
  frost:     { tint: 0xCCDDFF, overlay: 0xD6EAF8, overlayAlpha: 0.14 },
  heat:      { tint: 0xFFBB77, overlay: 0xF0B27A, overlayAlpha: 0.14 },
  lightning: { tint: 0x445566, overlay: 0x1A252F, overlayAlpha: 0.28 },
  fog:       { tint: 0xBBCCDD, overlay: 0xBDBDBD, overlayAlpha: 0.32 },
  tornado:   { tint: 0x667766, overlay: 0x37474F, overlayAlpha: 0.28 },
  meteor:    { tint: 0x334477, overlay: 0x1A237E, overlayAlpha: 0.18 },
  acid_rain: { tint: 0x99BB88, overlay: 0xAED581, overlayAlpha: 0.14 },
}

/** Floating animation config */
const FLOAT_AMPLITUDE = 8     // px bob distance
const FLOAT_DURATION = 3.5    // seconds per full cycle
const TILT_AMOUNT = 0.008     // radians (~0.5°)
const TILT_DURATION = 5       // slower than bob for organic feel
export class GardenScene extends Container {
  private app: Application
  private skySprite: Sprite
  private skyLoaded: boolean = false
  private skyTint = { r: 255, g: 255, b: 255 }
  private islandGroup: Container       // holds island + plants, animated as one
  private islandSprite: Sprite
  private plantLayer: Container
  private ambientParticles: AmbientParticles
  private weatherLayer: Container
  private plants: PlantSprite[] = []

  // Float animation state
  private floatOffset = { y: 0 }
  private floatTween: gsap.core.Tween | null = null
  private tiltTween: gsap.core.Tween | null = null

  // The island image's green top surface area (relative to sprite center)
  private islandScale: number = 1
  private topSurfaceWidth: number = 380
  private topSurfaceHeight: number = 140
  private topSurfaceOffsetY: number = -80

  // Base positions (before float offset)
  private baseCy: number = 0

  // Plant detail drawer (slide-up panel on tap)
  private drawer: PlantDrawer
  private currentPortfolio: Portfolio = {}

  // Current game level (for growth stages, seasons, damage healing)
  private currentLevel: number = 1
  // Track which plants have already been seen (for unlock reveal)
  private knownPlantIds: Set<string> = new Set()

  // Drag-to-rebalance
  private dragTarget: PlantSprite | null = null
  private dragStartY: number = 0
  private dragStartAllocation: number = 0
  private dragActive: boolean = false
  private readonly DRAG_THRESHOLD: number = 10
  private onPortfolioRebalance: ((portfolio: Portfolio) => void) | null = null

  constructor(app: Application) {
    super()
    this.app = app

    // Sky background image
    this.skySprite = new Sprite()
    this.skySprite.anchor.set(0, 0)
    this.addChild(this.skySprite)

    Assets.load('./assets/garden/Sky_normal.jpg').then((texture) => {
      this.skySprite.texture = texture
      this.skyLoaded = true
      this.fitSky()
      this.applySkyDarkMode(isDarkMode())
    })

    // Sync sky brightness with dark mode toggle
    onThemeChange((dark) => this.applySkyDarkMode(dark))

    // Island group: contains island sprite + plants, animated together
    this.islandGroup = new Container()
    this.addChild(this.islandGroup)

    // Island sprite
    this.islandSprite = new Sprite()
    this.islandSprite.anchor.set(0.5, 0.5)
    this.islandGroup.addChild(this.islandSprite)

    Assets.load('./assets/garden/island.png').then((texture) => {
      this.islandSprite.texture = texture
      this.scaleIsland()
      this.centerScene()
      this.startFloatAnimation()
    })

    // Plant container (inside island group so it moves with the island)
    this.plantLayer = new Container()
    this.islandGroup.addChild(this.plantLayer)

    // Ambient floating particles
    this.ambientParticles = new AmbientParticles(app)
    this.addChild(this.ambientParticles)

    // Weather overlay container
    this.weatherLayer = new Container()
    this.addChild(this.weatherLayer)

    this.drawer = new PlantDrawer()

    this.fitSky()
    this.scaleIsland()
    this.centerScene()

    // Handle resize
    this.app.renderer.on('resize', () => {
      this.fitSky()
      this.scaleIsland()
      this.centerScene()
    })

    // Global pointer up to end drag
    this.app.stage.eventMode = 'static'
    this.app.stage.on('pointerup', () => this.endDrag())
    this.app.stage.on('pointerupoutside', () => this.endDrag())
    this.app.stage.on('pointermove', (e: FederatedPointerEvent) => this.onDragMove(e))
  }

  /** Register callback for when user drags to rebalance */
  setRebalanceCallback(cb: (portfolio: Portfolio) => void): void {
    this.onPortfolioRebalance = cb
  }

  /** Darken or restore the sky sprite based on dark mode */
  private applySkyDarkMode(dark: boolean): void {
    const target = dark
      ? { r: 30, g: 35, b: 55 }   // dark navy tint
      : { r: 255, g: 255, b: 255 } // neutral (no tint)
    gsap.to(this.skyTint, {
      r: target.r, g: target.g, b: target.b,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        this.skySprite.tint =
          (Math.round(this.skyTint.r) << 16) |
          (Math.round(this.skyTint.g) << 8) |
          Math.round(this.skyTint.b)
      },
    })
  }

  /** Scale sky image to cover the full viewport */
  private fitSky(): void {
    if (!this.skyLoaded) return
    const w = this.app.screen.width
    const h = this.app.screen.height
    const tex = this.skySprite.texture
    const scaleX = w / tex.width
    const scaleY = h / tex.height
    const scale = Math.max(scaleX, scaleY)
    this.skySprite.scale.set(scale)
    this.skySprite.x = (w - tex.width * scale) / 2
    this.skySprite.y = (h - tex.height * scale) / 2
  }

  /** Scale the island sprite to fit nicely in the viewport */
  private scaleIsland(): void {
    const maxW = Math.min(this.app.screen.width * 0.7, 500)
    const tex = this.islandSprite.texture
    const naturalW = tex.width || 500
    this.islandScale = maxW / naturalW
    this.islandSprite.scale.set(this.islandScale)

    // Recalculate the plant surface area based on island scale
    // Tighter bounds to keep plants firmly on the green grass
    this.topSurfaceWidth = naturalW * 0.48 * this.islandScale
    this.topSurfaceHeight = (tex.height || 500) * 0.14 * this.islandScale
    // The green top center is above the sprite center (island top ≈ 30% from top of image)
    this.topSurfaceOffsetY = -(tex.height || 500) * 0.22 * this.islandScale
  }

  private centerScene(): void {
    const cx = this.app.screen.width / 2
    const cy = this.app.screen.height / 2 + 30
    this.baseCy = cy

    this.islandGroup.x = cx
    this.islandGroup.y = cy

    // Plant layer is inside islandGroup, positioned at the grass surface offset
    this.plantLayer.x = 0
    this.plantLayer.y = this.topSurfaceOffsetY
    this.weatherLayer.x = 0
    this.weatherLayer.y = 0
  }

  /** Start the floating bob and tilt animations */
  private startFloatAnimation(): void {
    if (this.floatTween) this.floatTween.kill()
    if (this.tiltTween) this.tiltTween.kill()

    // Floating bob — entire island group (island + plants) moves up and down
    this.floatTween = gsap.to(this.floatOffset, {
      y: FLOAT_AMPLITUDE,
      duration: FLOAT_DURATION / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        this.islandGroup.y = this.baseCy + this.floatOffset.y
      },
    })

    // Subtle tilt — gentle rotation
    this.tiltTween = gsap.to(this.islandGroup, {
      rotation: TILT_AMOUNT,
      duration: TILT_DURATION / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.2,
    })
  }

  /** Set the current game level — updates growth stages, seasons, damage healing */
  setLevel(level: number): void {
    this.currentLevel = level
    this.plants.forEach(plant => plant.updateLevel(level))
  }

  updatePortfolio(portfolio: Portfolio): void {
    // Start ambient particles if not already running
    this.ambientParticles.start()

    // Kill existing plant tweens
    this.plants.forEach(p => p.destroy())
    this.plantLayer.removeChildren()
    this.plants = []
    this.currentPortfolio = { ...portfolio }

    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    const total = entries.reduce((sum, [_, v]) => sum + v, 0)

    if (total === 0) return

    const positions = this.calculatePlantPositions(entries.length)

    entries.forEach(([plantId, allocation], index) => {
      const plantData = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
      if (!plantData) return

      const pos = positions[index] || { x: 0, y: 0, scale: 0.8 }
      const weight = allocation / total
      const allocationPercent = Math.round(weight * 100)
      const sizeScale = 0.8 + weight * 0.4

      // Check if this plant is newly unlocked (first time appearing)
      const isNewPlant = !this.knownPlantIds.has(plantId)

      // ─── Depth perspective: back plants slightly smaller ───
      const halfH = this.topSurfaceHeight * 0.45
      const depthNorm = Math.max(0, Math.min(1, (pos.y + halfH) / (2 * halfH)))
      const depthScale = 0.88 + depthNorm * 0.12   // back: 0.88x, front: 1.0x

      const plant = new PlantSprite(
        plantId,
        plantData.emoji,
        plantData.color,
        plantData.category,
        { x: pos.x, y: pos.y, scale: pos.scale * sizeScale * depthScale },
        plantData.realWorldEquivalent,
        this.currentLevel,
        allocationPercent,
        isNewPlant,
      )

      // Mark as known
      this.knownPlantIds.add(plantId)

      const pct = Math.round(weight * 100)
      plant.setLabel(`${pct}%`)

      // Tap/click → open detail drawer (only if not dragging)
      plant.on('pointertap', () => {
        if (this.dragActive) return
        plant.playBounce()
        this.drawer.show(plantId, allocation, total)
      })

      // Drag start (for rebalancing)
      plant.on('pointerdown', (e: FederatedPointerEvent) => {
        this.startDrag(plant, plantId, allocation, e)
      })

      this.plants.push(plant)
      this.plantLayer.addChild(plant)

      // ─── 9. Trigger unlock reveal for newly placed plants ───
      if (isNewPlant) {
        plant.playUnlockRevealAnimation(this.plantLayer)
      }
    })

    // Sort by Y for depth ordering
    this.plantLayer.children.sort((a, b) => a.y - b.y)
  }

  // --- Drag-to-rebalance ---

  private startDrag(plant: PlantSprite, _plantId: string, allocation: number, e: FederatedPointerEvent): void {
    this.dragTarget = plant
    this.dragStartY = e.global.y
    this.dragStartAllocation = allocation
    this.dragActive = false
  }

  private onDragMove(e: FederatedPointerEvent): void {
    if (!this.dragTarget) return

    const deltaY = this.dragStartY - e.global.y

    if (!this.dragActive) {
      if (Math.abs(deltaY) < this.DRAG_THRESHOLD) return
      this.dragActive = true
      this.dragTarget.setDragging(true)
    }

    const sensitivity = 0.3
    const deltaAllocation = Math.round(deltaY * sensitivity)
    const newAllocation = Math.max(0, Math.min(100, this.dragStartAllocation + deltaAllocation))

    const plantId = this.dragTarget.plantId
    const total = Object.values(this.currentPortfolio).reduce((s, v) => s + v, 0)

    if (total > 0) {
      const oldAlloc = this.currentPortfolio[plantId] || 0
      const diff = newAllocation - oldAlloc
      if (diff === 0) return

      const newPortfolio = { ...this.currentPortfolio }
      newPortfolio[plantId] = newAllocation

      const otherEntries = Object.entries(newPortfolio).filter(([id, v]) => id !== plantId && v > 0)
      const otherTotal = otherEntries.reduce((s, [_, v]) => s + v, 0)

      if (otherTotal > 0) {
        otherEntries.forEach(([id, v]) => {
          const share = v / otherTotal
          newPortfolio[id] = Math.max(0, Math.round(v - diff * share))
        })
      }

      Object.keys(newPortfolio).forEach(id => {
        if (newPortfolio[id] <= 0) delete newPortfolio[id]
      })

      this.currentPortfolio = newPortfolio

      const newTotal = Object.values(newPortfolio).reduce((s, v) => s + v, 0)
      this.plants.forEach(p => {
        const alloc = newPortfolio[p.plantId] || 0
        const weight = newTotal > 0 ? alloc / newTotal : 0
        const pct = Math.round(weight * 100)
        p.setLabel(`${pct}%`)
      })

      const dragPct = newTotal > 0 ? Math.round(newAllocation / newTotal * 100) : 0
      this.dragTarget.setLabel(`${dragPct}%`)
    }
  }

  private endDrag(): void {
    if (!this.dragTarget) return
    const wasDragging = this.dragActive

    if (this.dragActive) {
      this.dragTarget.setDragging(false)
    }
    this.dragTarget = null
    this.dragActive = false

    if (wasDragging && this.onPortfolioRebalance) {
      this.onPortfolioRebalance({ ...this.currentPortfolio })
    }
  }

  /**
   * Responsive plant placement.
   * - Screen-adaptive: scale factor derived from actual island size on screen
   * - Density-adaptive: more plants → each proportionally smaller
   * - Symmetric hand-tuned layouts for 1-4, golden-angle spiral for 5+
   * - Elliptical clamp keeps everything on the grass
   */
  private calculatePlantPositions(count: number): Array<{ x: number; y: number; scale: number }> {
    const hw = this.topSurfaceWidth * 0.45
    const hh = this.topSurfaceHeight * 0.45

    // Responsive base scale: adapts to island size on screen
    const screenFactor = Math.min(1.0, Math.max(0.4, this.islandScale / 0.55))
    // Density factor: more plants → each slightly smaller
    const densityFactor = Math.min(1.0, 1.6 / Math.sqrt(Math.max(1, count)))
    const base = screenFactor * densityFactor

    const positions: Array<{ x: number; y: number; scale: number }> = []

    if (count === 1) {
      positions.push({ x: 0, y: 0, scale: base })
    } else if (count === 2) {
      positions.push({ x: -hw * 0.45, y: 0, scale: base })
      positions.push({ x: hw * 0.45, y: 0, scale: base })
    } else if (count === 3) {
      positions.push({ x: -hw * 0.42, y: -hh * 0.25, scale: base })
      positions.push({ x: hw * 0.42, y: -hh * 0.25, scale: base })
      positions.push({ x: 0, y: hh * 0.38, scale: base })
    } else if (count === 4) {
      positions.push({ x: -hw * 0.4, y: -hh * 0.32, scale: base })
      positions.push({ x: hw * 0.4, y: -hh * 0.32, scale: base })
      positions.push({ x: -hw * 0.25, y: hh * 0.38, scale: base })
      positions.push({ x: hw * 0.25, y: hh * 0.38, scale: base })
    } else {
      // Golden-angle spiral: organic, evenly distributed for any count
      const goldenAngle = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < count; i++) {
        const theta = i * goldenAngle
        const r = Math.sqrt((i + 0.5) / count) * 0.82
        const x = r * Math.cos(theta) * hw
        const y = r * Math.sin(theta) * hh
        const depthScale = base * (1.0 - r * 0.12)
        positions.push({ x, y, scale: depthScale })
      }
    }

    // Elliptical clamp: pull any position that overflows back onto the grass edge
    for (const pos of positions) {
      const ex = pos.x / hw
      const ey = pos.y / hh
      const dist = ex * ex + ey * ey
      if (dist > 1) {
        const s = 1 / Math.sqrt(dist)
        pos.x *= s
        pos.y *= s
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

  /** Tint the sky image and add an atmospheric overlay for the current weather */
  setWeatherBackground(weatherType: string): void {
    const config = WEATHER_SKY[weatherType] || { tint: 0xFFFFFF, overlay: 0x000000, overlayAlpha: 0 }

    // Smooth RGB tint transition on the sky sprite
    const targetR = (config.tint >> 16) & 0xFF
    const targetG = (config.tint >> 8) & 0xFF
    const targetB = config.tint & 0xFF

    gsap.to(this.skyTint, {
      r: targetR, g: targetG, b: targetB,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        this.skySprite.tint =
          (Math.round(this.skyTint.r) << 16) |
          (Math.round(this.skyTint.g) << 8) |
          Math.round(this.skyTint.b)
      },
    })

    // Atmospheric overlay on top of everything
    this.weatherLayer.removeChildren()
    const overlay = new Graphics()
    overlay.rect(0, 0, this.app.screen.width, this.app.screen.height)
    overlay.fill({ color: config.overlay, alpha: config.overlayAlpha })
    overlay.alpha = 0
    this.weatherLayer.addChild(overlay)
    gsap.to(overlay, { alpha: 1, duration: 0.8, ease: 'power2.out' })
  }

  clearWeather(): void {
    // Smoothly reset sky tint back to neutral
    gsap.to(this.skyTint, {
      r: 255, g: 255, b: 255,
      duration: 0.6,
      ease: 'power2.in',
      onUpdate: () => {
        this.skySprite.tint =
          (Math.round(this.skyTint.r) << 16) |
          (Math.round(this.skyTint.g) << 8) |
          Math.round(this.skyTint.b)
      },
    })

    // Fade out overlays
    const children = [...this.weatherLayer.children]
    children.forEach(child => {
      gsap.to(child, {
        alpha: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => child.destroy(),
      })
    })
    this.ambientParticles.stop()
  }

  // Animate plant reactions to event effects (with level for damage scars)
  animateEventEffects(effects: Record<string, number>): void {
    this.plants.forEach(plant => {
      const effect = effects[plant.plantId] ?? 0
      if (effect > 0.05) {
        plant.showGrowthEffect()
      } else if (effect < -0.05) {
        plant.showDamageEffect(this.currentLevel)
      }
    })
  }

  /** Update allocation-dependent visuals (pot tier, accent width) after rebalance */
  updateAllocationVisuals(portfolio: Portfolio): void {
    const total = Object.values(portfolio).reduce((s, v) => s + v, 0)
    if (total <= 0) return
    this.plants.forEach(plant => {
      const alloc = portfolio[plant.plantId] || 0
      const pct = Math.round((alloc / total) * 100)
      plant.updateAllocationVisuals(pct)
    })
  }

  // Reset all plants to healthy state
  resetPlantStates(): void {
    this.plants.forEach(plant => plant.recover())
  }

  /** Reset known plants (e.g., on new game) */
  resetKnownPlants(): void {
    this.knownPlantIds.clear()
  }
}
