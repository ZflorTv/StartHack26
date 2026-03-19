import type { RiskProfile, Portfolio, Amplitude } from '../../types'
import { PLANTS_MAP } from '../../data/plants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { ScoringEngine, type BattleScore } from '../../engine/ScoringEngine'
import { EVENTS_MAP } from '../../data/events'

export class BattleScreen {
  private container: HTMLElement
  private onBack: () => void
  private portfolio: Portfolio = {}
  private selectedProfile: RiskProfile = 'meadow'

  constructor(container: HTMLElement, onBack: () => void) {
    this.container = container
    this.onBack = onBack
  }

  render(): void {
    // Pick a random event for the challenge
    const eventIds = ['geopolitical_shock', 'fed_rate_hike', 'oil_crisis', 'high_volatility', 'inflation_shock', 'tariff_crisis']
    const eventId = eventIds[Math.floor(Math.random() * eventIds.length)]
    const event = EVENTS_MAP[eventId]
    const amplitudes: Amplitude[] = ['light', 'moderate', 'severe']
    const amplitude = amplitudes[Math.floor(Math.random() * amplitudes.length)]
    const amplitudeData = event.amplitudes?.[amplitude]

    if (!amplitudeData) return

    // Available plants for allocation
    const plants = Object.values(PLANTS_MAP).filter(p => p.unlocksAtLevel <= 5)

    const plantSliders = plants.map(p => `
      <div class="slider-container" style="margin-bottom: var(--space-sm);">
        <div class="slider-label">
          <span class="text-small">${p.emoji} ${p.name.split(' ')[0]}</span>
          <span class="text-small text-muted" id="val-${p.id}">0%</span>
        </div>
        <input type="range" class="slider-track" id="slider-${p.id}"
               data-plant="${p.id}" min="0" max="50" value="0" step="5">
      </div>
    `).join('')

    this.container.innerHTML = `
      <div class="screen" style="background: rgba(240,237,230,0.97); overflow-y: auto;">
        <div style="max-width: 700px; width: 100%; padding: var(--space-xl) 0;">

          <nav class="nav" style="position: relative; margin-bottom: var(--space-lg); border-radius: var(--radius-lg);">
            <div class="nav-logo">⚡ Battle Mode</div>
            <button class="btn btn-small btn-secondary" id="btn-back-battle">← Back</button>
          </nav>

          <!-- Headline -->
          <div class="card mb-lg" style="background: var(--pf-petrol); color: white; text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-md);">${amplitudeData.emoji}</div>
            <h2 class="text-h2" style="color: var(--pf-yellow); margin-bottom: var(--space-sm);">${event.name}</h2>
            <p class="text-body" style="color: rgba(255,255,255,0.9);">${amplitudeData.headline}</p>
            <div class="badge badge-warning mt-md" style="margin: var(--space-md) auto 0;">${amplitudeData.label}</div>
          </div>

          <!-- Risk Profile Select -->
          <div class="card mb-lg">
            <h3 class="text-h3 mb-md">Your Risk Profile</h3>
            <div style="display: flex; gap: var(--space-sm);">
              <button class="btn btn-small btn-secondary profile-btn" data-profile="zen">🧘 Zen</button>
              <button class="btn btn-small btn-primary profile-btn" data-profile="meadow">🌿 Meadow</button>
              <button class="btn btn-small btn-secondary profile-btn" data-profile="jungle">🌴 Jungle</button>
            </div>
          </div>

          <!-- Portfolio Builder -->
          <div class="card mb-lg">
            <h3 class="text-h3 mb-md">Build Your Portfolio</h3>
            <p class="text-small text-muted mb-md">Allocate up to 100% across assets. How will you weather this event?</p>
            <div id="total-allocation" class="badge badge-neutral mb-md">Total: 0%</div>
            ${plantSliders}
          </div>

          <button class="btn btn-primary btn-large w-full" id="btn-submit-battle" disabled>
            Submit Portfolio
          </button>

          <!-- Results (hidden initially) -->
          <div id="battle-results" style="display: none;"></div>
        </div>
      </div>
    `

    // Event handlers
    document.getElementById('btn-back-battle')?.addEventListener('click', this.onBack)

    // Profile selection
    this.container.querySelectorAll('.profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedProfile = (e.currentTarget as HTMLElement).getAttribute('data-profile') as RiskProfile
        this.container.querySelectorAll('.profile-btn').forEach(b => {
          b.classList.remove('btn-primary')
          b.classList.add('btn-secondary')
        })
        ;(e.currentTarget as HTMLElement).classList.remove('btn-secondary')
        ;(e.currentTarget as HTMLElement).classList.add('btn-primary')
      })
    })

    // Slider handlers
    this.container.querySelectorAll('.slider-track').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement
        const plantId = input.getAttribute('data-plant')!
        const value = parseInt(input.value)
        this.portfolio[plantId] = value

        const label = document.getElementById(`val-${plantId}`)
        if (label) label.textContent = `${value}%`

        // Update total
        const total = Object.values(this.portfolio).reduce((sum, v) => sum + v, 0)
        const totalEl = document.getElementById('total-allocation')
        if (totalEl) {
          totalEl.textContent = `Total: ${total}%`
          totalEl.className = `badge ${total === 100 ? 'badge-positive' : total > 100 ? 'badge-negative' : 'badge-neutral'} mb-md`
        }

        // Enable submit if total is valid
        const submitBtn = document.getElementById('btn-submit-battle') as HTMLButtonElement
        if (submitBtn) submitBtn.disabled = total < 50 || total > 100
      })
    })

    // Submit
    document.getElementById('btn-submit-battle')?.addEventListener('click', () => {
      const score = ScoringEngine.scoreBattle(
        this.portfolio,
        this.selectedProfile,
        amplitudeData.effects,
        amplitude,
      )
      this.showResults(score, event.learning)
    })
  }

  private showResults(score: BattleScore, learning: string): void {
    const resultsEl = document.getElementById('battle-results')
    if (!resultsEl) return

    resultsEl.style.display = 'block'
    resultsEl.innerHTML = `
      <div class="score-panel mt-lg">
        <div class="score-total">${score.total}</div>
        <p class="text-caption text-muted text-center mb-lg">BATTLE SCORE</p>

        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <div>
            <div class="flex justify-between mb-sm">
              <span class="text-small">🎯 Risk Reliability</span>
              <span class="text-small" style="font-weight: 700;">${score.riskReliability}/100</span>
            </div>
            <div class="portfolio-bar">
              <div class="portfolio-bar-segment" style="width: ${score.riskReliability}%; background: var(--pf-light-blue);"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-sm">
              <span class="text-small">💰 Profitability</span>
              <span class="text-small" style="font-weight: 700;">${score.profitability}/100</span>
            </div>
            <div class="portfolio-bar">
              <div class="portfolio-bar-segment" style="width: ${score.profitability}%; background: var(--color-positive);"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-sm">
              <span class="text-small">🌿 ESG Score</span>
              <span class="text-small" style="font-weight: 700;">${score.esgScore}/100</span>
            </div>
            <div class="portfolio-bar">
              <div class="portfolio-bar-segment" style="width: ${score.esgScore}%; background: var(--pf-yellow);"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flora-bubble mt-lg" style="position: relative; transform: none; left: auto; bottom: auto; max-width: 100%;">
        <div class="flora-header">
          <div class="flora-avatar">🌿</div>
          <span class="flora-name">Flora</span>
        </div>
        <p class="flora-text">${learning}</p>
      </div>

      <button class="btn btn-primary btn-large w-full mt-lg" id="btn-new-battle">New Challenge ⚡</button>
    `

    document.getElementById('btn-new-battle')?.addEventListener('click', () => {
      this.portfolio = {}
      this.render()
    })

    // Scroll to results
    resultsEl.scrollIntoView({ behavior: 'smooth' })
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
