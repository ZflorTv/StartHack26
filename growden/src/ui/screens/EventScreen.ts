import type { GameEvent, Amplitude } from '../../types'

export class EventScreen {
  private container: HTMLElement
  private onContinue: (action: 'hold' | 'rebalance' | 'panic_sell') => void

  constructor(container: HTMLElement, onContinue: (action: 'hold' | 'rebalance' | 'panic_sell') => void) {
    this.container = container
    this.onContinue = onContinue
  }

  render(event: GameEvent, amplitude: Amplitude, portfolioChange: number): void {
    const isPhase2 = false  // TODO: handle two-phase events
    let amplitudeData = event.amplitudes?.[amplitude]

    if (event.twoPhase && event.phase1) {
      amplitudeData = event.phase1
    }

    if (!amplitudeData) return

    const changePercent = (portfolioChange * 100).toFixed(1)
    const isPositive = portfolioChange >= 0
    const changeColor = isPositive ? 'var(--color-positive)' : 'var(--color-negative)'
    const changeSign = isPositive ? '+' : ''

    this.container.innerHTML = `
      <div class="event-overlay">
        <div class="event-card">
          <div class="event-weather-icon">${amplitudeData.emoji}</div>

          <div class="badge ${isPositive ? 'badge-positive' : 'badge-negative'} mb-sm" style="margin: 0 auto var(--space-sm);">
            ${amplitudeData.label}
          </div>

          <h3 class="event-headline">${amplitudeData.headline}</h3>

          <div style="font-size: 28px; font-weight: 800; color: ${changeColor}; margin: var(--space-md) 0;">
            ${changeSign}${changePercent}%
          </div>
          <p class="text-small text-muted mb-lg">Portfolio impact</p>

          <div style="display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-lg);">
            <button class="btn btn-primary" id="btn-hold">
              🧘 Hold Steady
            </button>
            <button class="btn btn-secondary" id="btn-rebalance">
              ⚖️ Rebalance
            </button>
            <button class="btn btn-danger btn-small" id="btn-panic">
              😱 Sell Everything
            </button>
          </div>

          <p class="text-small text-muted">${event.learning}</p>
        </div>
      </div>
    `

    document.getElementById('btn-hold')?.addEventListener('click', () => this.onContinue('hold'))
    document.getElementById('btn-rebalance')?.addEventListener('click', () => this.onContinue('rebalance'))
    document.getElementById('btn-panic')?.addEventListener('click', () => this.onContinue('panic_sell'))
  }

  showFloraHint(hint: string): void {
    // Add Flora bubble below the event card
    const existing = document.getElementById('flora-hint')
    if (existing) existing.remove()

    const flora = document.createElement('div')
    flora.id = 'flora-hint'
    flora.className = 'flora-bubble'
    flora.innerHTML = `
      <div class="flora-header">
        <div class="flora-avatar">🌿</div>
        <span class="flora-name">Flora</span>
      </div>
      <p class="flora-text">${hint}</p>
      <button class="btn btn-small btn-secondary mt-md" id="btn-dismiss-flora" style="width: 100%;">Got it</button>
    `

    this.container.appendChild(flora)
    document.getElementById('btn-dismiss-flora')?.addEventListener('click', () => flora.remove())
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
