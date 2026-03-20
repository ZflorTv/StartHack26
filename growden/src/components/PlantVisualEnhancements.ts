/**
 * PlantVisualEnhancements — 10 elegant visual systems for plants
 *
 * 1. Growth Stage Progression   — Plants evolve visually across levels
 * 2. Animated Idle Personalities — Category-specific idle motions
 * 3. Health Glow Aura            — Radial glow reflects performance
 * 4. Size-Based Allocation Tiers — Stepped visual tiers (small/med/large/hero)
 * 5. Seasonal Palette Shifts      — Tint evolves with level (spring→winter)
 * 6. Particle Rewards on Growth   — Sparkle burst from plant on positive events
 * 7. Pot/Planter Style by Weight  — Visual pot tier based on allocation
 * 8. Damage Scars That Heal       — Visible damage fades over levels
 * 9. Unlock Reveal Animation      — Glowing seed → full plant on first place
 * 10. Category Border Accents     — Colored accent ring per asset class
 */

import { Graphics, Container } from 'pixi.js'
import { gsap } from 'gsap'

// ─── Category colors (hex) ───
const CATEGORY_HEX: Record<string, number> = {
  equity:      0x4CAF50,
  bonds:       0x2196F3,
  cash:        0x9E9E9E,
  commodities: 0xFFD100,
  crypto:      0x9C27B0,
}

// ─── 1. Growth Stage Progression ───

export type GrowthStage = 'seed' | 'sprout' | 'young' | 'mature' | 'blooming'

/** Derive growth stage from current game level */
export function getGrowthStage(level: number): GrowthStage {
  if (level <= 1) return 'seed'
  if (level <= 3) return 'sprout'
  if (level <= 5) return 'young'
  if (level <= 8) return 'mature'
  return 'blooming'
}

/** Scale multiplier per growth stage — plants get bigger as they mature */
export function getGrowthScaleMultiplier(stage: GrowthStage): number {
  switch (stage) {
    case 'seed':     return 0.65
    case 'sprout':   return 0.78
    case 'young':    return 0.90
    case 'mature':   return 1.00
    case 'blooming': return 1.08
  }
}

/** Alpha offset for growth stage — seeds are slightly translucent */
export function getGrowthAlpha(stage: GrowthStage): number {
  switch (stage) {
    case 'seed':     return 0.7
    case 'sprout':   return 0.82
    case 'young':    return 0.92
    case 'mature':   return 1.0
    case 'blooming': return 1.0
  }
}

/**
 * Draw decorative growth accents around a plant at higher stages.
 * Returns a Graphics child to add to the plant container.
 */
export function drawGrowthAccents(stage: GrowthStage, color: number): Graphics {
  const g = new Graphics()
  if (stage === 'mature' || stage === 'blooming') {
    // Small leaf buds around the base
    const count = stage === 'blooming' ? 5 : 3
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      const r = stage === 'blooming' ? 28 : 22
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r - 10
      const size = stage === 'blooming' ? 4 : 3
      g.ellipse(x, y, size, size * 0.6)
      g.fill({ color, alpha: 0.35 })
    }
  }
  if (stage === 'blooming') {
    // Tiny sparkle dots — "flowers" on the canopy
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4 + Math.PI / 4
      const x = Math.cos(angle) * 16
      const y = Math.sin(angle) * 12 - 22
      g.circle(x, y, 2)
      g.fill({ color: 0xFFFFFF, alpha: 0.6 })
    }
  }
  return g
}


// ─── 2. Animated Idle Personalities ───

export interface IdleConfig {
  swayAmount: number     // degrees
  swayDuration: number   // seconds
  breatheScale: number   // 1.0 = none, 1.03 = subtle
  breatheDuration: number
  wobbleX: number        // px horizontal drift
}

/** Category-specific idle animation configs — tuned for organic feel */
export function getIdlePersonality(category: string): IdleConfig {
  switch (category) {
    case 'equity': // Trees: slow, heavy, wind-in-canopy sway
      return { swayAmount: 1.4, swayDuration: 4.5, breatheScale: 1.0, breatheDuration: 0, wobbleX: 0 }
    case 'bonds': // Bushes: gentle breathing (expand/contract), barely sway
      return { swayAmount: 0.3, swayDuration: 5.0, breatheScale: 1.02, breatheDuration: 3.2, wobbleX: 0 }
    case 'cash': // Grass: fast horizontal ripple, like wind through blades
      return { swayAmount: 0.5, swayDuration: 1.6, breatheScale: 1.0, breatheDuration: 0, wobbleX: 2.0 }
    case 'commodities': // Cacti: nearly still, very slow micro-pulse (desert heat shimmer)
      return { swayAmount: 0.15, swayDuration: 6.0, breatheScale: 1.008, breatheDuration: 4.0, wobbleX: 0 }
    case 'crypto': // Orchids: delicate sway + subtle scale pulse (exotic shimmer)
      return { swayAmount: 0.9, swayDuration: 2.2, breatheScale: 1.02, breatheDuration: 1.8, wobbleX: 0 }
    default:
      return { swayAmount: 1.0, swayDuration: 3.5, breatheScale: 1.0, breatheDuration: 0, wobbleX: 0 }
  }
}

/**
 * Start category-specific idle animation on a container.
 * Returns an array of tweens to kill on cleanup.
 */
export function startIdlePersonality(
  target: Container,
  category: string,
  baseScale: number,
): gsap.core.Tween[] {
  const config = getIdlePersonality(category)
  const tweens: gsap.core.Tween[] = []

  // Sway rotation
  tweens.push(gsap.to(target, {
    rotation: (config.swayAmount * Math.PI) / 180,
    duration: config.swayDuration / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: Math.random() * 2,
  }))

  // Breathing scale (bonds, cacti, crypto)
  if (config.breatheScale > 1.0 && config.breatheDuration > 0) {
    tweens.push(gsap.to(target.scale, {
      x: baseScale * config.breatheScale,
      y: baseScale * config.breatheScale,
      duration: config.breatheDuration / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 1.5,
    }))
  }

  // Horizontal wobble (grass ripple) — use pixi pivot to avoid position drift
  if (config.wobbleX > 0) {
    tweens.push(gsap.to(target.pivot, {
      x: -config.wobbleX,
      duration: config.swayDuration / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }))
  }

  return tweens
}


// ─── 3. Health Glow Aura ───

export type HealthStatus = 'thriving' | 'neutral' | 'struggling'

export function getHealthStatus(recentChange: number): HealthStatus {
  if (recentChange > 0.02) return 'thriving'
  if (recentChange < -0.02) return 'struggling'
  return 'neutral'
}

/** Draw a soft radial glow behind a plant based on health */
export function drawHealthAura(health: HealthStatus): Graphics {
  const g = new Graphics()
  const colors: Record<HealthStatus, number> = {
    thriving:   0x27AE60,
    neutral:    0xF39C12,
    struggling: 0xE74C3C,
  }
  const alphas: Record<HealthStatus, number> = {
    thriving:   0.18,
    neutral:    0.08,
    struggling: 0.15,
  }
  // Outer glow
  g.circle(0, -15, 48)
  g.fill({ color: colors[health], alpha: alphas[health] * 0.4 })
  // Inner glow
  g.circle(0, -15, 30)
  g.fill({ color: colors[health], alpha: alphas[health] })

  return g
}

/** Animate health aura transition */
export function animateHealthAura(aura: Graphics, health: HealthStatus, duration = 0.6): void {
  const targetAlpha = health === 'neutral' ? 0.3 : 0.8
  gsap.to(aura, { alpha: targetAlpha, duration, ease: 'power2.out' })
}


// ─── 4. Size-Based Allocation Tiers ───

export type AllocationTier = 'small' | 'medium' | 'large' | 'hero'

export function getAllocationTier(allocationPercent: number): AllocationTier {
  if (allocationPercent >= 40) return 'hero'
  if (allocationPercent >= 20) return 'large'
  if (allocationPercent >= 10) return 'medium'
  return 'small'
}

/** Minimum tap target size (px) per tier — mobile-friendly */
export function getMinTapSize(tier: AllocationTier): number {
  switch (tier) {
    case 'small':  return 44
    case 'medium': return 52
    case 'large':  return 60
    case 'hero':   return 72
  }
}


// ─── 5. Seasonal Palette Shifts ───

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export function getSeason(level: number): Season {
  if (level <= 3) return 'spring'
  if (level <= 6) return 'summer'
  if (level <= 9) return 'autumn'
  return 'winter'
}

/** Tint multiplier per season — applied to the plant image */
export function getSeasonTint(season: Season): number {
  switch (season) {
    case 'spring': return 0xE8FFE8   // fresh green tint
    case 'summer': return 0xFFFFFF   // full natural color
    case 'autumn': return 0xFFE8CC   // warm amber tint
    case 'winter': return 0xD8E8FF   // cool frost tint
  }
}

/** Animate season transition on a sprite */
export function animateSeasonShift(
  target: { tint: number },
  season: Season,
  duration = 1.2,
): void {
  const tint = getSeasonTint(season)
  const r = (tint >> 16) & 0xFF
  const g = (tint >> 8) & 0xFF
  const b = tint & 0xFF
  const proxy = {
    r: (target.tint >> 16) & 0xFF,
    g: (target.tint >> 8) & 0xFF,
    b: target.tint & 0xFF,
  }
  gsap.to(proxy, {
    r, g, b,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      target.tint =
        (Math.round(proxy.r) << 16) |
        (Math.round(proxy.g) << 8) |
        Math.round(proxy.b)
    },
  })
}


// ─── 6. Particle Rewards on Growth ───

/**
 * Emit upward sparkle/leaf particles from a plant's position.
 * Runs inside a PixiJS Container (the garden scene).
 */
export function emitGrowthParticles(
  parent: Container,
  x: number,
  y: number,
  color: number,
  count = 6,
): void {
  for (let i = 0; i < count; i++) {
    const g = new Graphics()
    const isSparkle = Math.random() > 0.5
    if (isSparkle) {
      g.circle(0, 0, 1.5 + Math.random() * 1.5)
      g.fill({ color: 0xFFFFFF, alpha: 0.8 })
    } else {
      const leafSize = 2.5 + Math.random() * 2
      g.ellipse(0, 0, leafSize, leafSize * 0.5)
      g.fill({ color, alpha: 0.6 })
      g.rotation = Math.random() * Math.PI
    }
    g.x = x + (Math.random() - 0.5) * 20
    g.y = y - 10
    parent.addChild(g)

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2  // mostly upward
    const dist = 25 + Math.random() * 35

    gsap.to(g, {
      x: g.x + Math.cos(angle) * dist,
      y: g.y + Math.sin(angle) * dist,
      alpha: 0,
      rotation: g.rotation + (Math.random() - 0.5) * 2,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      delay: i * 0.04,
      onComplete: () => {
        g.destroy()
      },
    })
  }
}

/** Emit damage particles (red/brown, downward drift) */
export function emitDamageParticles(
  parent: Container,
  x: number,
  y: number,
  count = 4,
): void {
  for (let i = 0; i < count; i++) {
    const g = new Graphics()
    const colors = [0xE74C3C, 0x8B4513, 0xA0522D]
    const c = colors[Math.floor(Math.random() * colors.length)]
    const size = 2 + Math.random() * 2
    g.ellipse(0, 0, size, size * 0.4)
    g.fill({ color: c, alpha: 0.5 })
    g.rotation = Math.random() * Math.PI
    g.x = x + (Math.random() - 0.5) * 16
    g.y = y - 15
    parent.addChild(g)

    gsap.to(g, {
      x: g.x + (Math.random() - 0.5) * 20,
      y: g.y + 20 + Math.random() * 15,
      alpha: 0,
      rotation: g.rotation + Math.random() * 3,
      duration: 0.5 + Math.random() * 0.3,
      ease: 'power1.out',
      delay: i * 0.05,
      onComplete: () => g.destroy(),
    })
  }
}


// ─── 7. Pot/Planter Style by Weight ───

/**
 * Draw a decorative pot/planter beneath the plant based on allocation tier.
 * Returns a Graphics object positioned at the plant's base.
 */
export function drawPotForTier(tier: AllocationTier, categoryColor: number): Graphics {
  const g = new Graphics()
  const potColors: Record<AllocationTier, number> = {
    small:  0xB0896E,  // simple clay
    medium: 0x8D6E53,  // terracotta
    large:  0x5D4037,  // dark ceramic
    hero:   0xD4A843,  // golden
  }
  const potColor = potColors[tier]

  switch (tier) {
    case 'small': {
      // Simple trapezoid pot
      g.moveTo(-10, 0)
      g.lineTo(-8, -10)
      g.lineTo(8, -10)
      g.lineTo(10, 0)
      g.closePath()
      g.fill({ color: potColor, alpha: 0.7 })
      // Rim
      g.roundRect(-9, -12, 18, 3, 1)
      g.fill({ color: potColor, alpha: 0.85 })
      break
    }
    case 'medium': {
      // Rounded terracotta planter
      g.moveTo(-13, 0)
      g.lineTo(-11, -13)
      g.lineTo(11, -13)
      g.lineTo(13, 0)
      g.closePath()
      g.fill({ color: potColor, alpha: 0.75 })
      // Decorative rim
      g.roundRect(-12, -15, 24, 3, 1.5)
      g.fill({ color: potColor, alpha: 0.9 })
      // Subtle band
      g.rect(-10, -8, 20, 2)
      g.fill({ color: 0xFFFFFF, alpha: 0.1 })
      break
    }
    case 'large': {
      // Ornate ceramic planter with category accent
      g.moveTo(-16, 0)
      g.lineTo(-13, -16)
      g.lineTo(13, -16)
      g.lineTo(16, 0)
      g.closePath()
      g.fill({ color: potColor, alpha: 0.8 })
      // Thick decorative rim
      g.roundRect(-14, -18, 28, 4, 2)
      g.fill({ color: potColor, alpha: 0.95 })
      // Category color accent band
      g.rect(-12, -10, 24, 2.5)
      g.fill({ color: categoryColor, alpha: 0.35 })
      break
    }
    case 'hero': {
      // Golden ornate planter
      g.moveTo(-19, 0)
      g.lineTo(-15, -18)
      g.lineTo(15, -18)
      g.lineTo(19, 0)
      g.closePath()
      g.fill({ color: potColor, alpha: 0.85 })
      // Double rim
      g.roundRect(-16, -20, 32, 4, 2)
      g.fill({ color: potColor, alpha: 0.95 })
      g.roundRect(-17, -22, 34, 3, 1.5)
      g.fill({ color: 0xFFD700, alpha: 0.5 })
      // Category accent band
      g.rect(-14, -11, 28, 3)
      g.fill({ color: categoryColor, alpha: 0.4 })
      // Gem detail at center
      g.circle(0, -12, 2.5)
      g.fill({ color: categoryColor, alpha: 0.7 })
      break
    }
  }
  return g
}


// ─── 8. Damage Scars That Heal ───

export interface DamageScar {
  intensity: number  // 0.0 (healed) to 1.0 (fresh)
  levelApplied: number
}

/**
 * Draw damage overlay on a plant — brown patches, drooping tint.
 * Intensity fades: full at application level, halved each level after.
 */
export function drawDamageOverlay(intensity: number): Graphics {
  const g = new Graphics()
  if (intensity <= 0.05) return g

  // Brown patches
  const patchCount = Math.ceil(intensity * 4)
  for (let i = 0; i < patchCount; i++) {
    const angle = (Math.PI * 2 * i) / patchCount + Math.random() * 0.5
    const r = 12 + Math.random() * 10
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r - 18
    const size = 3 + intensity * 4
    g.ellipse(x, y, size, size * 0.6)
    g.fill({ color: 0x8B4513, alpha: intensity * 0.3 })
  }

  // Slight droop overlay
  g.rect(-20, -35, 40, 25)
  g.fill({ color: 0x5D4037, alpha: intensity * 0.08 })

  return g
}

/** Calculate damage intensity for current level given when damage was applied */
export function getDamageIntensity(scar: DamageScar, currentLevel: number): number {
  const levelsSince = currentLevel - scar.levelApplied
  if (levelsSince <= 0) return scar.intensity
  // Halve intensity each level
  return scar.intensity * Math.pow(0.5, levelsSince)
}


// ─── 9. Unlock Reveal Animation ───

/**
 * Play a dramatic reveal animation for a newly unlocked plant.
 * Shows a glowing seed that bursts into the full plant.
 */
export function playUnlockReveal(
  target: Container,
  baseScale: number,
  color: number,
  parent: Container,
): void {
  // Start invisible and tiny
  target.scale.set(0)
  target.alpha = 0

  // Create glow seed
  const seed = new Graphics()
  seed.circle(0, 0, 8)
  seed.fill({ color: 0xFFD700, alpha: 0.8 })
  seed.x = target.x
  seed.y = target.y - 15
  parent.addChild(seed)

  // Glow ring expanding outward
  const ring = new Graphics()
  ring.circle(0, 0, 5)
  ring.stroke({ color: 0xFFFFFF, width: 2, alpha: 0.6 })
  ring.x = target.x
  ring.y = target.y - 15
  ring.alpha = 0
  parent.addChild(ring)

  const tl = gsap.timeline()

  // Phase 1: Seed appears and pulses
  tl.to(seed, {
    alpha: 1,
    duration: 0.3,
    ease: 'power2.out',
  })
  tl.to(seed.scale, {
    x: 1.3, y: 1.3,
    duration: 0.25,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 2,
  }, '<')

  // Phase 2: Ring expands
  tl.to(ring, { alpha: 0.8, duration: 0.15 })
  tl.to(ring.scale, {
    x: 5, y: 5,
    duration: 0.4,
    ease: 'power2.out',
  }, '<')
  tl.to(ring, { alpha: 0, duration: 0.3 }, '-=0.15')

  // Phase 3: Seed shrinks, plant grows
  tl.to(seed, {
    alpha: 0,
    duration: 0.2,
    onComplete: () => seed.destroy(),
  })
  tl.to(target, { alpha: 1, duration: 0.25 }, '<')
  tl.to(target.scale, {
    x: baseScale,
    y: baseScale,
    duration: 0.6,
    ease: 'elastic.out(1, 0.45)',
  }, '<')

  // Phase 4: Celebration particles
  tl.call(() => {
    emitGrowthParticles(parent, target.x, target.y - 15, color, 8)
    ring.destroy()
  })
}


// ─── 10. Category Border Accents ───

/**
 * Draw a subtle colored accent stripe beneath the plant.
 * Acts as a visual category indicator — especially useful on small screens.
 */
export function drawCategoryAccent(category: string, width = 24): Graphics {
  const g = new Graphics()
  const color = CATEGORY_HEX[category] || 0x999999

  // Main accent bar
  g.roundRect(-width / 2, 0, width, 3, 1.5)
  g.fill({ color, alpha: 0.55 })

  // Soft glow underneath
  g.roundRect(-width / 2 - 2, 1, width + 4, 4, 2)
  g.fill({ color, alpha: 0.12 })

  return g
}

/**
 * Get accent width scaled by allocation tier — hero plants get wider accents.
 */
export function getAccentWidth(tier: AllocationTier): number {
  switch (tier) {
    case 'small':  return 18
    case 'medium': return 24
    case 'large':  return 30
    case 'hero':   return 38
  }
}
