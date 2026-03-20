/**
 * PlantSprite — Interactive plant on the island
 *
 * Clean visual pipeline (bottom → top):
 *   1. Ground shadow   — soft elliptical shadow for grounding
 *   2. Grass tuft      — procedural grass blades at plant base
 *   3. Glow ring       — hover/tap feedback (hidden by default)
 *   4. Plant image     — the PNG asset (anchor per category)
 *   5. Label           — allocation %
 *   6. Hover label     — stock name on pointer-over
 *
 * Stripped: pots, category accents, health auras, growth accents, damage overlay.
 * These added visual clutter and made plants look "pasted on".
 */

import { Container, Graphics, Sprite, Assets, Text, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import type { PlantState } from '../types'
import { PLANT_IMAGE_MAP } from '../utils/plantImage'
import { isDarkMode, onThemeChange } from '../ui/enhancements/DarkMode'
import {
  type GrowthStage,
  type Season,
  getGrowthStage,
  getGrowthScaleMultiplier,
  getGrowthAlpha,
  startIdlePersonality,
  getSeasonTint,
  animateSeasonShift,
  emitGrowthParticles,
  emitDamageParticles,
  playUnlockReveal,
} from './PlantVisualEnhancements'

/** Target display size for plant sprites (pixels, before position scale) */
const PLANT_DISPLAY_SIZE = 170

/** Per-category anchor points — trees anchor at feet, grass at center, etc. */
const CATEGORY_ANCHORS: Record<string, { x: number; y: number }> = {
  equity:      { x: 0.5, y: 0.92 },  // trees: anchor near trunk base
  bonds:       { x: 0.5, y: 0.88 },  // bushes: slightly above ground
  cash:        { x: 0.5, y: 0.70 },  // grass: anchor near center mass
  commodities: { x: 0.5, y: 0.95 },  // cacti: anchor at base
  crypto:      { x: 0.5, y: 0.85 },  // orchids: stem base
}

/** Per-category display size multipliers — grass is smaller, trees taller */
const CATEGORY_SIZE_MULT: Record<string, number> = {
  equity:      1.15,  // trees: slightly larger
  bonds:       1.0,   // bushes: standard
  cash:        0.85,  // grass: smaller, low to ground
  commodities: 0.95,  // cacti: slightly smaller
  crypto:      1.05,  // orchids: slightly larger
}

/** Shadow parameters per category */
const CATEGORY_SHADOW: Record<string, { rx: number; ry: number; offsetY: number }> = {
  equity:      { rx: 22, ry: 6, offsetY: 4 },   // wide shadow for trees
  bonds:       { rx: 18, ry: 5, offsetY: 3 },   // medium for bushes
  cash:        { rx: 14, ry: 4, offsetY: 2 },   // small for grass
  commodities: { rx: 16, ry: 5, offsetY: 3 },   // medium for cacti
  crypto:      { rx: 15, ry: 4, offsetY: 3 },   // medium for orchids
}

export class PlantSprite extends Container {
  public plantId: string
  public assetCategory: string
  private groundShadow: Graphics
  private grassTuft: Graphics
  private plantImage: Sprite
  private glowRing: Graphics
  private labelText: Text
  private hoverLabel: Text
  private currentState: PlantState = 'healthy'
  private plantColor: number
  private baseScale: number = 1
  private idleTweens: gsap.core.Tween[] = []
  private isDragging: boolean = false
  private static dragHintShown: boolean = false

  // Enhancement state (simplified)
  private currentStage: GrowthStage = 'seed'
  private currentSeason: Season = 'spring'
  private isNewlyUnlocked: boolean = false

  constructor(
    plantId: string,
    emoji: string,
    color: string,
    category: string,
    position: { x: number; y: number; scale: number },
    stockName: string = '',
    level: number = 1,
    _allocationPercent: number = 10,
    isNewPlant: boolean = false,
  ) {
    super()
    this.plantId = plantId
    this.assetCategory = category
    this.plantColor = parseInt(color.replace('#', ''), 16)
    this.isNewlyUnlocked = isNewPlant
    this.currentStage = getGrowthStage(level)
    this.currentSeason = level <= 3 ? 'spring' : level <= 6 ? 'summer' : level <= 9 ? 'autumn' : 'winter'

    // ─── 1. Ground shadow (bottom layer) ───
    const shadow = CATEGORY_SHADOW[category] || CATEGORY_SHADOW.bonds
    this.groundShadow = new Graphics()
    this.groundShadow.ellipse(0, shadow.offsetY, shadow.rx, shadow.ry)
    this.groundShadow.fill({ color: 0x000000, alpha: 0.18 })
    this.groundShadow.filters = [] // blur handled by soft ellipse shape
    this.addChild(this.groundShadow)

    // ─── 2. Grass tuft at base ───
    this.grassTuft = this.createGrassTuft(category)
    this.addChild(this.grassTuft)

    // ─── 3. Glow ring (hover feedback, hidden by default) ───
    this.glowRing = new Graphics()
    this.glowRing.alpha = 0
    this.addChild(this.glowRing)
    this.drawGlowRing()

    // ─── 4. Plant image sprite ───
    const anchor = CATEGORY_ANCHORS[category] || { x: 0.5, y: 0.85 }
    this.plantImage = new Sprite()
    this.plantImage.anchor.set(anchor.x, anchor.y)
    this.addChild(this.plantImage)

    // Growth stage affects size
    const growthScale = getGrowthScaleMultiplier(this.currentStage)
    const growthAlpha = getGrowthAlpha(this.currentStage)
    const catSize = CATEGORY_SIZE_MULT[category] || 1.0

    // Load the PNG
    const imageFile = PLANT_IMAGE_MAP[plantId]
    if (imageFile) {
      Assets.load(`./assets/plants/${imageFile}`).then((texture) => {
        this.plantImage.texture = texture
        const maxDim = Math.max(texture.width, texture.height)
        const imgScale = (PLANT_DISPLAY_SIZE * growthScale * catSize) / maxDim
        this.plantImage.scale.set(imgScale)
        this.plantImage.alpha = this.getAlphaForState() * growthAlpha
        // Seasonal tint
        this.plantImage.tint = getSeasonTint(this.currentSeason)
      })
    } else {
      const emojiText = new Text({
        text: emoji,
        style: new TextStyle({ fontSize: 32 * growthScale, align: 'center' }),
      })
      emojiText.anchor.set(0.5, 0.5)
      emojiText.y = -20
      this.addChild(emojiText)
    }

    // ─── 5. Label below (allocation %) ───
    const dark = isDarkMode()
    this.labelText = new Text({
      text: '',
      style: new TextStyle({
        fontSize: 10,
        fill: dark ? 0xCCCCCC : 0x666666,
        align: 'center',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
      }),
    })
    this.labelText.anchor.set(0.5, 0)
    this.labelText.y = 12
    this.labelText.visible = false
    this.addChild(this.labelText)

    // ─── 6. Hover label (stock name) ───
    this.hoverLabel = new Text({
      text: stockName,
      style: new TextStyle({
        fontSize: 11,
        fill: dark ? 0xB0D4E8 : 0x1B4F6C,
        align: 'center',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        dropShadow: {
          color: dark ? 0x000000 : 0xFFFFFF,
          blur: 4,
          distance: 0,
          alpha: 0.9,
        },
      }),
    })
    this.hoverLabel.anchor.set(0.5, 1)
    this.hoverLabel.y = -50
    this.hoverLabel.alpha = 0
    this.addChild(this.hoverLabel)

    // Update label colors on theme change
    onThemeChange((d) => {
      this.labelText.style.fill = d ? 0xCCCCCC : 0x666666
      this.hoverLabel.style.fill = d ? 0xB0D4E8 : 0x1B4F6C
      this.hoverLabel.style.dropShadow = {
        color: d ? 0x000000 : 0xFFFFFF,
        blur: 4, distance: 0, alpha: 0.9, angle: 0,
      }
    })

    // Position
    this.x = position.x
    this.y = position.y
    this.baseScale = position.scale
    this.scale.set(position.scale)

    // Make interactive
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.setupInteractions()

    // Category-specific idle animation
    this.startIdleAnimation()

    // Unlock reveal OR standard sprout
    if (this.isNewlyUnlocked) {
      this.scale.set(0)
      this.alpha = 0
    } else {
      this.playSproutAnimation()
    }
  }

  /** Create procedural grass blades at the plant base for natural grounding */
  private createGrassTuft(category: string): Graphics {
    const g = new Graphics()
    // Fewer/no grass for cacti (desert), more for cash (grass category)
    const bladeCount = category === 'commodities' ? 3 : category === 'cash' ? 8 : 5
    const spread = category === 'cash' ? 16 : 12
    const maxHeight = category === 'cash' ? 8 : 6

    for (let i = 0; i < bladeCount; i++) {
      const x = (Math.random() - 0.5) * spread * 2
      const height = maxHeight * (0.5 + Math.random() * 0.5)
      const lean = (Math.random() - 0.5) * 4
      const green = 0x4A8C3F + Math.floor(Math.random() * 0x202020)

      g.moveTo(x, 2)
      g.lineTo(x + lean, 2 - height)
      g.lineTo(x + 1.2, 2)
      g.closePath()
      g.fill({ color: green, alpha: 0.45 + Math.random() * 0.2 })
    }
    return g
  }

  private drawGlowRing(): void {
    this.glowRing.clear()
    this.glowRing.circle(0, -15, 40)
    this.glowRing.fill({ color: this.plantColor, alpha: 0.25 })
  }

  private getAlphaForState(): number {
    switch (this.currentState) {
      case 'healthy': return 1.0
      case 'growing': return 1.0
      case 'damaged': return 0.6
      case 'wilted': return 0.35
      default: return 1.0
    }
  }

  /** Show a pulsing arrow hint above the plant to indicate drag-to-rebalance */
  private showDragHint(): void {
    const hint = new Text({
      text: '↕',
      style: new TextStyle({
        fontSize: 20,
        fill: 0xAAAAAA,
        align: 'center',
      }),
    })
    hint.anchor.set(0.5, 0.5)
    hint.y = -70
    hint.alpha = 0
    this.addChild(hint)

    gsap.fromTo(hint,
      { alpha: 0, y: -65 },
      { alpha: 0.8, y: -75, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 5 },
    )
    gsap.to(hint, {
      alpha: 0,
      delay: 3,
      duration: 0.3,
      onComplete: () => { hint.destroy() },
    })
  }

  private setupInteractions(): void {
    this.on('pointerdown', () => {
      if (!PlantSprite.dragHintShown) {
        PlantSprite.dragHintShown = true
        this.showDragHint()
      }
    })

    this.on('pointerover', () => {
      if (this.isDragging) return
      gsap.to(this.scale, {
        x: this.baseScale * 1.15,
        y: this.baseScale * 1.15,
        duration: 0.25,
        ease: 'back.out(2)',
      })
      gsap.to(this.glowRing, {
        alpha: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.killTweensOf(this.hoverLabel)
      gsap.fromTo(this.hoverLabel,
        { alpha: 0, y: -42 },
        { alpha: 1, y: -50, duration: 0.3, ease: 'power3.out' },
      )
    })

    this.on('pointerout', () => {
      if (this.isDragging) return
      gsap.to(this.scale, {
        x: this.baseScale,
        y: this.baseScale,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(this.glowRing, {
        alpha: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.killTweensOf(this.hoverLabel)
      gsap.to(this.hoverLabel, {
        alpha: 0, y: -45,
        duration: 0.2, ease: 'power2.in',
      })
    })
  }

  // --- Public animation methods ---

  playSproutAnimation(): void {
    const finalScale = this.baseScale
    this.scale.set(0)
    this.alpha = 0
    gsap.to(this, {
      alpha: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
    gsap.to(this.scale, {
      x: finalScale,
      y: finalScale,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
      delay: Math.random() * 0.3,
    })
  }

  /** Trigger unlock reveal animation (called by GardenScene) */
  playUnlockRevealAnimation(parentContainer: Container): void {
    playUnlockReveal(this, this.baseScale, this.plantColor, parentContainer)
  }

  /** Category-specific idle personality */
  startIdleAnimation(): void {
    this.stopIdleAnimation()
    this.idleTweens = startIdlePersonality(this, this.assetCategory, this.baseScale)
  }

  stopIdleAnimation(): void {
    this.idleTweens.forEach(t => t.kill())
    this.idleTweens = []
    gsap.to(this, { rotation: 0, duration: 0.3 })
  }

  setState(state: PlantState): void {
    this.currentState = state
    this.plantImage.alpha = this.getAlphaForState() * getGrowthAlpha(this.currentStage)
  }

  getState(): PlantState {
    return this.currentState
  }

  setLabel(text: string): void {
    this.labelText.text = text
    this.labelText.visible = text.length > 0
  }

  /** Growth effect with particle rewards */
  showGrowthEffect(): void {
    this.setState('growing')
    gsap.to(this.scale, {
      x: this.baseScale * 1.25,
      y: this.baseScale * 1.25,
      duration: 0.35,
      ease: 'back.out(3)',
      yoyo: true,
      repeat: 1,
    })
    // Green glow flash
    this.glowRing.clear()
    this.glowRing.circle(0, -15, 45)
    this.glowRing.fill({ color: 0x27AE60, alpha: 0.35 })
    gsap.fromTo(this.glowRing, { alpha: 0 }, {
      alpha: 1,
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.drawGlowRing()
        this.glowRing.alpha = 0
      },
    })
    // Particle burst
    if (this.parent) {
      emitGrowthParticles(this.parent, this.x, this.y, this.plantColor, 6)
    }
  }

  /** Damage effect with particles */
  showDamageEffect(_currentLevel: number = 1): void {
    this.setState('damaged')
    const originalX = this.x
    gsap.to(this, {
      x: originalX + 6,
      duration: 0.06,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onComplete: () => { this.x = originalX },
    })
    // Red glow flash
    this.glowRing.clear()
    this.glowRing.circle(0, -15, 45)
    this.glowRing.fill({ color: 0xE74C3C, alpha: 0.35 })
    gsap.fromTo(this.glowRing, { alpha: 0 }, {
      alpha: 1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.drawGlowRing()
        this.glowRing.alpha = 0
      },
    })
    // Damage particles
    if (this.parent) {
      emitDamageParticles(this.parent, this.x, this.y, 4)
    }
  }

  /** Update growth stage and season when level changes */
  updateLevel(level: number): void {
    const newStage = getGrowthStage(level)
    const newSeason: Season = level <= 3 ? 'spring' : level <= 6 ? 'summer' : level <= 9 ? 'autumn' : 'winter'
    const catSize = CATEGORY_SIZE_MULT[this.assetCategory] || 1.0

    if (newStage !== this.currentStage) {
      this.currentStage = newStage

      // Animate growth scale change
      const growthMult = getGrowthScaleMultiplier(newStage)
      const imageFile = PLANT_IMAGE_MAP[this.plantId]
      if (imageFile && this.plantImage.texture) {
        const maxDim = Math.max(this.plantImage.texture.width, this.plantImage.texture.height)
        const newImgScale = (PLANT_DISPLAY_SIZE * growthMult * catSize) / maxDim
        gsap.to(this.plantImage.scale, {
          x: newImgScale,
          y: newImgScale,
          duration: 0.8,
          ease: 'elastic.out(1, 0.6)',
        })
      }
      this.plantImage.alpha = this.getAlphaForState() * getGrowthAlpha(newStage)
    }

    if (newSeason !== this.currentSeason) {
      this.currentSeason = newSeason
      animateSeasonShift(this.plantImage, newSeason, 1.5)
    }
  }

  /** Update allocation-dependent visuals (kept minimal — no pots/accents) */
  updateAllocationVisuals(_allocationPercent: number): void {
    // Stripped: pots, accents, tiers. Plants breathe without clutter.
  }

  recover(): void {
    this.setState('healthy')
    gsap.to(this.scale, {
      x: this.baseScale,
      y: this.baseScale,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
    })
  }

  animateScaleChange(newBaseScale: number): void {
    this.baseScale = newBaseScale
    gsap.to(this.scale, {
      x: newBaseScale,
      y: newBaseScale,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
    })
  }

  playBounce(): void {
    gsap.to(this.scale, {
      x: this.baseScale * 1.2,
      y: this.baseScale * 0.85,
      duration: 0.12,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to(this.scale, {
          x: this.baseScale,
          y: this.baseScale,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)',
        })
      },
    })
  }

  setDragging(dragging: boolean): void {
    this.isDragging = dragging
    if (dragging) {
      this.stopIdleAnimation()
      gsap.to(this.scale, {
        x: this.baseScale * 1.2,
        y: this.baseScale * 1.2,
        duration: 0.2,
        ease: 'back.out(2)',
      })
      gsap.to(this, { alpha: 0.85, duration: 0.2 })
    } else {
      gsap.to(this.scale, {
        x: this.baseScale,
        y: this.baseScale,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
      })
      gsap.to(this, { alpha: 1, duration: 0.2 })
      this.startIdleAnimation()
    }
  }

  getBaseScale(): number {
    return this.baseScale
  }

  destroy(): void {
    this.idleTweens.forEach(t => t.kill())
    this.idleTweens = []
    gsap.killTweensOf(this)
    gsap.killTweensOf(this.scale)
    gsap.killTweensOf(this.glowRing)
    gsap.killTweensOf(this.hoverLabel)
    gsap.killTweensOf(this.plantImage)
    gsap.killTweensOf(this.plantImage.scale)
    super.destroy({ children: true })
  }
}
