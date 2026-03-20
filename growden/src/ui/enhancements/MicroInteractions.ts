/**
 * MicroInteractions — GSAP-powered button presses, rolling number counters,
 * particle bursts, and wiggle effects for plant chips.
 */

import gsap from 'gsap'

/** Haptic-style button press: scale down on press, bounce back on release */
export function initButtonPressEffects(): void {
  document.addEventListener('pointerdown', (e) => {
    const btn = (e.target as HTMLElement).closest('.btn, .event-action-btn, .profile-btn') as HTMLElement
    if (!btn) return
    gsap.to(btn, { scale: 0.95, duration: 0.1, ease: 'power2.out' })
  }, true)

  document.addEventListener('pointerup', () => {
    document.querySelectorAll('.btn, .event-action-btn, .profile-btn').forEach(btn => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'back.out(3)' })
    })
  }, true)

  document.addEventListener('pointerleave', () => {
    document.querySelectorAll('.btn, .event-action-btn, .profile-btn').forEach(btn => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' })
    })
  }, true)
}

/** Animated rolling number counter (odometer effect) */
export function animateNumber(
  el: HTMLElement,
  target: number,
  duration = 0.6,
  prefix = '',
  suffix = '',
  decimals = 0,
): void {
  const current = parseFloat(el.textContent?.replace(/[^0-9.\-]/g, '') || '0')
  const obj = { val: current }
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`
    },
  })
}

/** Flower particle burst on earn */
export function flowerBurst(x: number, y: number, count = 8): void {
  const container = document.getElementById('toast-layer') || document.body
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.className = 'flower-particle'
    particle.textContent = '🌸'
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 16px;
      pointer-events: none;
      z-index: 9999;
    `
    container.appendChild(particle)

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const dist = 40 + Math.random() * 60

    gsap.to(particle, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      opacity: 0,
      scale: 0.3,
      duration: 0.7 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    })
  }
}

/** Score change flash + float animation */
export function scoreFlash(el: HTMLElement, points: number): void {
  const color = points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'
  const sign = points >= 0 ? '+' : ''

  const floater = document.createElement('div')
  floater.className = 'score-floater'
  floater.textContent = `${sign}${points}`
  floater.style.cssText = `
    position: absolute;
    color: ${color};
    font-weight: 800;
    font-size: 18px;
    pointer-events: none;
    z-index: 9999;
    text-shadow: 0 1px 3px rgba(0,0,0,0.15);
    font-variant-numeric: tabular-nums;
  `

  const rect = el.getBoundingClientRect()
  floater.style.left = `${rect.left + rect.width / 2}px`
  floater.style.top = `${rect.top}px`
  document.getElementById('toast-layer')?.appendChild(floater)

  gsap.fromTo(floater,
    { y: 0, opacity: 1, scale: 0.5 },
    {
      y: -40,
      opacity: 0,
      scale: 1.2,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => floater.remove(),
    },
  )

  // Flash the element itself
  gsap.fromTo(el, { color }, { color: 'inherit', duration: 0.6, ease: 'power1.out' })
}

/** Wiggle plant chips when affected by events */
export function wigglePlantChips(affectedPlantIds: string[]): void {
  affectedPlantIds.forEach(id => {
    const chip = document.querySelector(`.garden-plant-chip[data-plant-id="${id}"]`) as HTMLElement
    if (!chip) return
    gsap.fromTo(chip,
      { x: 0 },
      {
        x: 4,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => { gsap.set(chip, { x: 0 }) },
      },
    )
  })
}

/** Portfolio value color flash on change */
export function portfolioValueFlash(el: HTMLElement, isPositive: boolean): void {
  const flashColor = isPositive ? '#1E8C4E' : '#D63B2F'
  gsap.fromTo(el,
    { backgroundColor: `${flashColor}15`, borderRadius: '6px', padding: '2px 6px' },
    { backgroundColor: 'transparent', duration: 1.2, ease: 'power2.out' },
  )
}

/** Staggered card entrance animation */
export function staggeredEntrance(selector: string, delay = 0.06): void {
  const elements = document.querySelectorAll(selector)
  gsap.fromTo(elements,
    { opacity: 0, y: 20, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      stagger: delay,
      ease: 'back.out(1.5)',
    },
  )
}
