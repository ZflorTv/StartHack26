/**
 * EventScreen — Market event card overlay
 *
 * Shows the event headline, portfolio impact, per-plant effects,
 * and three action buttons (hold / rebalance / panic sell).
 * After the player acts, displays Flora's contextual hint bubble.
 */

import type { GameEvent, Amplitude, Portfolio } from '../../types'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { plantImg } from '../../utils/plantImage'
import { tickerAnimation, animateImpactNumber, renderSeverityMeter } from '../enhancements/ScreenTransitions'
import { wigglePlantChips, staggeredEntrance } from '../enhancements/MicroInteractions'
import { gsap } from 'gsap'

export class EventScreen {
  private container: HTMLElement
  private onContinue: (action: 'hold' | 'rebalance' | 'panic_sell') => void
  private overlay: HTMLElement | null = null
  private timerInterval: number | null = null
  private timerTimeout: number | null = null

  constructor(container: HTMLElement, onContinue: (action: 'hold' | 'rebalance' | 'panic_sell') => void) {
    this.container = container
    this.onContinue = onContinue
  }

  render(event: GameEvent, amplitude: Amplitude, portfolioChange: number, portfolio?: Portfolio): void {
    this.close()

    let amplitudeData = event.amplitudes?.[amplitude]
    if (event.twoPhase && event.phase1) {
      amplitudeData = event.phase1
    }
    if (!amplitudeData) return

    const changePercent = (portfolioChange * 100).toFixed(1)
    const isPositive = portfolioChange >= 0
    const changeColor = isPositive ? 'var(--color-positive)' : 'var(--color-negative)'
    const changeSign = isPositive ? '+' : ''

    // Build affected plants list (plants the player owns that are impacted)
    const affectedPlantsHtml = this.renderAffectedPlants(amplitudeData.effects, portfolio)

    this.overlay = document.createElement('div')
    this.overlay.className = 'event-overlay event-overlay-slide'
    this.overlay.id = 'event-overlay'
    this.overlay.innerHTML = `
      <div class="event-card event-card-slide event-card-enhanced">
        <div class="event-weather-icon">${amplitudeData.emoji}</div>

        <div class="badge ${isPositive ? 'badge-positive' : 'badge-negative'} mb-sm" style="margin: 0 auto var(--space-sm);">
          ${amplitudeData.label}
        </div>

        ${renderSeverityMeter(amplitude)}

        <h3 class="event-headline" id="event-headline">${amplitudeData.headline}</h3>

        <div class="event-impact">
          <div class="event-impact-number" id="event-impact-num" style="color: ${changeColor};">
            0.0%
          </div>
          <p class="event-impact-label">Portfolio impact</p>
        </div>

        ${affectedPlantsHtml}

        <div class="event-timer" id="event-timer">
          <svg class="event-timer-ring" viewBox="0 0 48 48">
            <circle class="event-timer-track" cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
            <circle class="event-timer-fill" id="timer-circle" cx="24" cy="24" r="20" fill="none" stroke="var(--pf-petrol, #1B4F6C)" stroke-width="3" stroke-dasharray="125.66" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 24 24)"/>
          </svg>
          <span class="event-timer-text" id="timer-text">15</span>
        </div>

        <div class="event-actions">
          <button class="event-action-btn event-action-hold" id="btn-hold">
            <span class="event-action-icon">🧘</span>
            <span class="event-action-title">Hold Steady</span>
            <span class="event-action-desc">Ride it out — patience is key</span>
            ${event.holdBonusPoints ? `<span class="event-action-bonus">+${event.holdBonusPoints} pts</span>` : ''}
          </button>
          <button class="event-action-btn event-action-rebalance" id="btn-rebalance">
            <span class="event-action-icon">⚖️</span>
            <span class="event-action-title">Rebalance</span>
            <span class="event-action-desc">Shift allocation to safety</span>
          </button>
          <button class="event-action-btn event-action-panic" id="btn-panic">
            <span class="event-action-icon">😱</span>
            <span class="event-action-title">Sell Everything</span>
            <span class="event-action-desc">Liquidate at 50% value</span>
            ${event.panicSellPenalty ? `<span class="event-action-penalty">−${event.panicSellPenalty} pts</span>` : ''}
          </button>
        </div>

        <p class="event-learning">${event.learning}</p>
      </div>
    `

    this.container.appendChild(this.overlay)

    // Animate headline with ticker effect
    const headlineEl = this.overlay.querySelector('#event-headline') as HTMLElement
    if (headlineEl) tickerAnimation(headlineEl)

    // Animate impact number counting up
    const impactEl = this.overlay.querySelector('#event-impact-num') as HTMLElement
    if (impactEl) animateImpactNumber(impactEl, portfolioChange * 100)

    // Stagger action buttons entrance
    staggeredEntrance('.event-action-btn', 0.1)

    // Wiggle affected plant chips in garden HUD
    if (portfolio) {
      const affectedIds = Object.keys(portfolio).filter(id => portfolio[id] > 0)
      wigglePlantChips(affectedIds)
    }

    // Wire actions
    this.overlay.querySelector('#btn-hold')?.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate(50) // gentle
      this.clearTimer()
      this.onContinue('hold')
    })
    this.overlay.querySelector('#btn-rebalance')?.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate([30, 30, 30]) // double tap
      this.clearTimer()
      this.onContinue('rebalance')
    })
    this.overlay.querySelector('#btn-panic')?.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]) // alarm pattern
      this.clearTimer()
      this.onContinue('panic_sell')
    })

    // Start countdown timer
    this.startTimer()
  }

  private startTimer(): void {
    this.clearTimer()
    let remaining = 15
    const totalDuration = 15
    const circumference = 125.66

    const circle = this.overlay?.querySelector('#timer-circle') as SVGCircleElement | null
    const text = this.overlay?.querySelector('#timer-text') as HTMLElement | null

    // Smooth GSAP tween for the circle
    if (circle) {
      gsap.to(circle, {
        attr: { 'stroke-dashoffset': circumference },
        duration: totalDuration,
        ease: 'linear',
      })
    }

    this.timerInterval = window.setInterval(() => {
      remaining--
      if (text) text.textContent = String(remaining)

      if (remaining <= 0) {
        this.clearTimer()
        this.onContinue('hold')
      }
    }, 1000)
  }

  private clearTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    if (this.timerTimeout !== null) {
      clearTimeout(this.timerTimeout)
      this.timerTimeout = null
    }
    // Kill any GSAP tweens on the timer circle
    const circle = this.overlay?.querySelector('#timer-circle') as SVGCircleElement | null
    if (circle) gsap.killTweensOf(circle)
  }

  /** Map plant category to the abstract effect key used in event data */
  private static CATEGORY_EFFECT_KEY: Record<string, string> = {
    equity: 'oak',
    bonds: 'bush',
    cash: 'grass',
    commodities: 'cactus',
    crypto: 'exotic',
  }

  private renderAffectedPlants(effects: Record<string, number>, portfolio?: Portfolio): string {
    if (!portfolio) return ''

    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    if (entries.length === 0) return ''

    const items = entries
      .map(([plantId]) => {
        const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
        if (!plant) return null

        // Bad plants may have their own ID as effect key; otherwise use category mapping
        const effectKey = effects[plantId] !== undefined
          ? plantId
          : EventScreen.CATEGORY_EFFECT_KEY[plant.category] || ''
        const effect = effects[effectKey] ?? 0

        const pct = (effect * 100).toFixed(0)
        const isUp = effect > 0.001
        const isDown = effect < -0.001
        const color = isUp ? 'var(--color-positive)' : isDown ? 'var(--color-negative)' : 'var(--text-muted)'
        const arrow = isUp ? '↑' : isDown ? '↓' : '—'
        const catColor = CATEGORY_COLORS[plant.category] || '#ccc'

        return `
          <div class="event-plant-effect" style="border-left: 3px solid ${catColor};">
            <span class="event-plant-emoji">${plantImg(plantId, plant.emoji, '20px')}</span>
            <span class="event-plant-name">${plant.name.split(' ')[0]}</span>
            <span class="event-plant-change" style="color: ${color};">${arrow} ${isUp ? '+' : ''}${pct}%</span>
          </div>
        `
      })
      .filter(Boolean)
      .join('')

    return `
      <div class="event-affected-label">Your garden</div>
      <div class="event-affected-plants">${items}</div>
    `
  }

  showFloraHint(hint: string, onDismiss?: () => void): void {
    // Remove existing event card content but keep the overlay backdrop
    if (this.overlay) {
      // Fade out event card, then show flora toast
      const card = this.overlay.querySelector('.event-card') as HTMLElement
      if (card) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
      }
    }

    // Create flora toast overlay (sits on top, garden visible through backdrop)
    setTimeout(() => {
      // Remove old event card
      if (this.overlay) {
        const card = this.overlay.querySelector('.event-card')
        card?.remove()
      }

      // Create flora bubble inside existing overlay
      if (!this.overlay) {
        this.overlay = document.createElement('div')
        this.overlay.className = 'event-overlay'
        this.overlay.id = 'event-overlay'
        this.container.appendChild(this.overlay)
      }

      const flora = document.createElement('div')
      flora.className = 'flora-toast'
      flora.innerHTML = `
        <div class="flora-toast-inner">
          <div class="flora-header">
            <div class="flora-avatar">🌿</div>
            <span class="flora-name">Flora says...</span>
          </div>
          <p class="flora-text">${hint}</p>
          <button class="btn btn-primary flora-continue-btn" id="btn-dismiss-flora">Continue</button>
        </div>
      `

      this.overlay.appendChild(flora)

      flora.querySelector('#btn-dismiss-flora')?.addEventListener('click', () => {
        // Animate out
        flora.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        flora.style.opacity = '0'
        flora.style.transform = 'translateY(30px)'

        if (this.overlay) {
          this.overlay.style.transition = 'opacity 0.3s ease'
          this.overlay.style.opacity = '0'
        }

        setTimeout(() => {
          this.close()
          if (onDismiss) onDismiss()
        }, 300)
      })
    }, 280)
  }

  private close(): void {
    this.clearTimer()
    this.overlay?.remove()
    this.overlay = null
  }

  destroy(): void {
    this.clearTimer()
    this.close()
    this.container.innerHTML = ''
  }
}
