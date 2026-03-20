/** Risk profile selection screen — Zen / Meadow / Jungle garden styles */

import type { RiskProfile } from '../../types'
import { RISK_PROFILES } from '../../constants/config'
import { staggeredEntrance } from '../enhancements/MicroInteractions'
import gsap from 'gsap'

export class RiskProfileScreen {
  private container: HTMLElement
  private onSelect: (profile: RiskProfile) => void

  constructor(container: HTMLElement, onSelect: (profile: RiskProfile) => void) {
    this.container = container
    this.onSelect = onSelect
  }

  render(): void {
    const profiles = Object.entries(RISK_PROFILES).map(([key, profile]) => `
      <div class="card card-hover risk-card stagger-item" data-profile="${key}" style="cursor: pointer;">
        <div class="risk-card-icon">${profile.emoji}</div>
        <div class="risk-card-title text-display" style="color: ${profile.color};">${profile.name}</div>
        <div class="risk-card-desc">${profile.description}</div>
        <div style="margin-top: var(--space-md);">
          <div class="text-caption text-muted mb-sm">Suggested mix</div>
          <div class="portfolio-bar" style="height: 8px;">
            ${this.renderAllocationBar(profile.suggestedAllocation)}
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            ${Object.entries(profile.suggestedAllocation)
              .filter(([_, v]) => v > 0)
              .map(([cat, v]) => `<span class="text-small text-muted num">${cat} ${v}%</span>`)
              .join('')}
          </div>
        </div>
      </div>
    `).join('')

    this.container.innerHTML = `
      <div class="screen" style="overflow-y: auto;">
        <div style="text-align: center; max-width: 900px; width: 100%; padding: var(--space-lg) 0;">
          <p class="text-caption text-muted mb-sm">STEP 1</p>
          <h2 class="text-h1 text-display mb-sm" style="color: var(--pf-petrol);">Choose Your Gardening Style</h2>
          <p class="text-body text-muted mb-lg">This determines your risk profile and starting portfolio mix.</p>

          <div class="risk-cards">
            ${profiles}
          </div>
        </div>
      </div>
    `

    // Staggered card entrance
    staggeredEntrance('.stagger-item', 0.12)

    // Attach click handlers
    this.container.querySelectorAll('.risk-card').forEach(card => {
      card.addEventListener('click', () => {
        const profile = card.getAttribute('data-profile') as RiskProfile
        // Visual selection with scale animation
        this.container.querySelectorAll('.risk-card').forEach(c => {
          c.classList.remove('card-selected')
          gsap.to(c, { scale: 0.95, opacity: 0.5, duration: 0.3 })
        })
        card.classList.add('card-selected')
        gsap.to(card, { scale: 1.02, opacity: 1, duration: 0.3, ease: 'back.out(2)' })
        // Delay to show selection
        setTimeout(() => this.onSelect(profile), 500)
      })
    })
  }

  private renderAllocationBar(allocation: Record<string, number>): string {
    const colors: Record<string, string> = {
      equity: '#4CAF50',
      bonds: '#2196F3',
      cash: '#9E9E9E',
      commodities: '#FFD100',
      crypto: '#9C27B0',
    }
    return Object.entries(allocation)
      .filter(([_, v]) => v > 0)
      .map(([cat, v]) =>
        `<div class="portfolio-bar-segment" style="width: ${v}%; background: ${colors[cat] || '#ccc'};"></div>`
      )
      .join('')
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
