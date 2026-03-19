import type { RiskProfile } from '../../types'
import { RISK_PROFILES } from '../../constants/config'

export class RiskProfileScreen {
  private container: HTMLElement
  private onSelect: (profile: RiskProfile) => void

  constructor(container: HTMLElement, onSelect: (profile: RiskProfile) => void) {
    this.container = container
    this.onSelect = onSelect
  }

  render(): void {
    const profiles = Object.entries(RISK_PROFILES).map(([key, profile]) => `
      <div class="card card-hover risk-card" data-profile="${key}" style="cursor: pointer;">
        <div class="risk-card-icon">${profile.emoji}</div>
        <div class="risk-card-title" style="color: ${profile.color};">${profile.name}</div>
        <div class="risk-card-desc">${profile.description}</div>
        <div style="margin-top: var(--space-md);">
          <div class="text-caption text-muted mb-sm">Suggested mix</div>
          <div class="portfolio-bar" style="height: 8px;">
            ${this.renderAllocationBar(profile.suggestedAllocation)}
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            ${Object.entries(profile.suggestedAllocation)
              .filter(([_, v]) => v > 0)
              .map(([cat, v]) => `<span class="text-small text-muted">${cat} ${v}%</span>`)
              .join('')}
          </div>
        </div>
      </div>
    `).join('')

    this.container.innerHTML = `
      <div class="screen" style="background: rgba(240,237,230,0.95);">
        <div style="text-align: center; max-width: 900px; width: 100%;">
          <p class="text-caption text-muted mb-sm">STEP 1</p>
          <h2 class="text-h1 mb-sm" style="color: var(--pf-petrol);">Choose Your Gardening Style</h2>
          <p class="text-body text-muted mb-lg">This determines your risk profile and starting portfolio mix.</p>

          <div class="risk-cards">
            ${profiles}
          </div>
        </div>
      </div>
    `

    // Attach click handlers
    this.container.querySelectorAll('.risk-card').forEach(card => {
      card.addEventListener('click', () => {
        const profile = card.getAttribute('data-profile') as RiskProfile
        // Visual selection
        this.container.querySelectorAll('.risk-card').forEach(c => c.classList.remove('card-selected'))
        card.classList.add('card-selected')
        // Delay to show selection
        setTimeout(() => this.onSelect(profile), 400)
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
