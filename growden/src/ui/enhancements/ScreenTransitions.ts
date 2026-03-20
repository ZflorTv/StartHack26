/**
 * ScreenTransitions — Enhanced transitions between screens.
 * Staggered content entry, weather morphing, FLIP-style animations.
 */

import gsap from 'gsap'

/** Full-screen weather takeover before event card */
export function weatherTakeover(weatherEmoji: string, onComplete: () => void): void {
  const overlay = document.createElement('div')
  overlay.className = 'weather-takeover'
  overlay.innerHTML = `
    <div class="weather-takeover-icon">${weatherEmoji}</div>
    <div class="weather-takeover-flash"></div>
  `
  document.getElementById('ui-layer')!.appendChild(overlay)

  const icon = overlay.querySelector('.weather-takeover-icon') as HTMLElement
  const flash = overlay.querySelector('.weather-takeover-flash') as HTMLElement

  // Icon zoom in
  gsap.fromTo(icon,
    { scale: 0, opacity: 0, rotation: -20 },
    { scale: 1.5, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
  )

  // Flash effect
  gsap.fromTo(flash,
    { opacity: 0 },
    { opacity: 0.3, duration: 0.15, yoyo: true, repeat: 1 },
  )

  // Fade out and callback
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.4,
    delay: 0.8,
    onComplete: () => {
      overlay.remove()
      onComplete()
    },
  })
}

/** Breaking news ticker animation for event headlines */
export function tickerAnimation(el: HTMLElement): void {
  const text = el.textContent || ''
  el.textContent = ''
  el.style.overflow = 'hidden'

  // Type out character by character
  let i = 0
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i]
      i++
    } else {
      clearInterval(interval)
    }
  }, 25)
}

/** Impact number counting up/down dramatically */
export function animateImpactNumber(el: HTMLElement, targetValue: number, isPercent = true): void {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: targetValue,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: () => {
      const sign = obj.val >= 0 ? '+' : ''
      el.textContent = `${sign}${obj.val.toFixed(1)}${isPercent ? '%' : ''}`
    },
  })

  // Scale pulse
  gsap.fromTo(el,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
  )
}

/** Severity meter thermometer visual */
export function renderSeverityMeter(amplitude: 'light' | 'moderate' | 'severe'): string {
  const levels = { light: 33, moderate: 66, severe: 100 }
  const colors = { light: 'var(--color-warning)', moderate: '#E8623C', severe: 'var(--color-negative)' }
  const fill = levels[amplitude]
  const color = colors[amplitude]

  return `
    <div class="severity-meter">
      <div class="severity-meter-track">
        <div class="severity-meter-fill" style="width: ${fill}%; background: ${color};"></div>
      </div>
      <span class="severity-meter-label" style="color: ${color};">${amplitude.toUpperCase()}</span>
    </div>
  `
}

/** Stagger cards appearing one by one */
export function staggerCards(containerSelector: string, cardSelector: string): void {
  const container = document.querySelector(containerSelector)
  if (!container) return

  const cards = container.querySelectorAll(cardSelector)
  gsap.fromTo(cards,
    { opacity: 0, y: 30, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    },
  )
}

/** Enhanced level transition with weather morphing */
export function enhancedLevelTransition(
  level: number,
  onComplete: () => void,
): void {
  const overlay = document.createElement('div')
  overlay.className = 'level-transition-overlay level-transition-enhanced'
  overlay.innerHTML = `
    <div class="level-transition-content">
      <div class="level-transition-icon">📅</div>
      <div class="level-transition-year">Year ${level}</div>
      <div class="level-transition-sub">Time passes...</div>
      <div class="level-transition-streak" id="streak-display"></div>
    </div>
  `
  document.getElementById('ui-layer')!.appendChild(overlay)

  const content = overlay.querySelector('.level-transition-content') as HTMLElement
  const icon = overlay.querySelector('.level-transition-icon') as HTMLElement

  // Enhanced entrance
  gsap.fromTo(content,
    { scale: 0.6, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' },
  )

  // Pulsing icon
  gsap.to(icon, {
    scale: 1.15,
    duration: 0.5,
    repeat: 2,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // Auto-dismiss
  setTimeout(() => {
    gsap.to(overlay, {
      opacity: 0,
      scale: 1.1,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        overlay.remove()
        onComplete()
      },
    })
  }, 1200)
}
