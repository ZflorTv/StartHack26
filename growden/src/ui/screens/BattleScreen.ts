/**
 * BattleScreen — Standalone portfolio challenge
 *
 * Picks a random event, lets the player build a portfolio via sliders,
 * then scores it using ScoringEngine (risk reliability + profitability + ESG).
 */

import type { RiskProfile, Portfolio, Amplitude } from '../../types'
import { PLANTS_MAP } from '../../data/plants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { plantImg } from '../../utils/plantImage'
import { ScoringEngine, type BattleScore } from '../../engine/ScoringEngine'
import { EVENTS_MAP } from '../../data/events'

export class BattleScreen {
  private container: HTMLElement
  private onBack: () => void
  private portfolio: Portfolio = {}
  private readonly modalId = 'battle-results-modal'

  constructor(container: HTMLElement, onBack: () => void) {
    this.container = container
    this.onBack = onBack
  }

  render(): void {
    // Use the real-world-inspired oil shock scenario for battle mode.
    const eventId = 'oil_crisis'
    const event = EVENTS_MAP[eventId]
    const amplitude: Amplitude = 'moderate'
    const amplitudeData = event.amplitudes?.[amplitude]

    if (!amplitudeData) return

    // Available plants for allocation
    const plants = Object.values(PLANTS_MAP).filter(p => p.unlocksAtLevel <= 5)

    const plantSliders = plants.map(p => `
      <div class="slider-container" style="margin-bottom: var(--space-sm);">
        <div class="slider-label">
          <span class="text-small">${plantImg(p.id, p.emoji, '20px')} ${p.name.split(' ')[0]}</span>
          <span class="text-small text-muted" id="val-${p.id}">0%</span>
        </div>
        <input type="range" class="slider-track" id="slider-${p.id}"
               data-plant="${p.id}" min="0" max="50" value="0" step="5">
      </div>
    `).join('')

    this.container.innerHTML = `
      <div class="screen screen-battle" style="background: rgba(240,237,230,0.97);">
        <div style="max-width: 700px; width: 100%; padding: var(--space-xl) 0;">

          <nav class="nav" style="position: relative; margin-bottom: var(--space-lg); border-radius: var(--radius-lg);">
            <div class="nav-logo">⚡ Battle Mode</div>
            <button class="btn btn-small btn-secondary" id="btn-back-battle">← Back</button>
          </nav>

          <!-- News Card -->
          <div class="card mb-lg battle-news-card">
            <div class="battle-news-masthead">THE WALL STREET JOURNAL</div>
            <div class="battle-news-meta">SIMULATION EDITION · MARKET ALERT</div>

            <h2 class="text-h2 mb-sm" style="color: var(--text-primary);">OPEC+ Surprise Cut Sends Oil to Multi-Year High</h2>

            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
              <span style="font-size: 28px;">${amplitudeData.emoji}</span>
              <span class="badge badge-warning">${amplitudeData.label}</span>
              <span class="text-small" style="font-weight: 600; color: var(--pf-petrol);">${event.name}</span>
            </div>

            <p class="text-small text-muted" style="line-height: 1.6; margin: 0;">
              A surprise OPEC+ production cut sent oil prices surging to their highest level since 2023. Energy stocks rallied while airline and consumer discretionary sectors came under pressure. Economists warned the shock could re-ignite inflationary pressures just as central banks had begun to pause tightening.
            </p>
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
        </div>
      </div>
    `

    const battleScreenEl = this.container.querySelector('.screen-battle') as HTMLElement | null
    if (battleScreenEl) battleScreenEl.scrollTop = 0

    // Event handlers
    document.getElementById('btn-back-battle')?.addEventListener('click', this.onBack)

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
      const baselineProfile = 'meadow'
      const score = ScoringEngine.scoreBattle(
        this.portfolio,
        baselineProfile,
        amplitudeData.effects,
        amplitude,
      )
      this.showResultsModal(score, event.learning)
    })
  }

  private showResultsModal(score: BattleScore, learning: string): void {
    const existing = document.getElementById(this.modalId)
    if (existing) existing.remove()

    const percentile = this.getPercentile(score.total)
    const beatPercent = Math.max(1, Math.min(99, Math.round(percentile)))
    const topPercent = 100 - beatPercent
    const shareText = this.buildShareText(score, beatPercent, topPercent)
    const strengths = this.getStrengths(score)
    const weaknesses = this.getWeaknesses(score)
    const gnomeSpeech = this.getGnomeSpeech(score.total)

    const modalMarkup = `
      <div class="battle-modal-overlay" id="${this.modalId}">
        <div class="battle-modal-panel">
          <div class="battle-modal-header">
            <h3 class="text-h3">Battle Results</h3>
            <button class="btn btn-secondary btn-small" id="btn-close-results">Close</button>
          </div>

          <section class="battle-section">
            ${this.renderBellCurve(score.total, beatPercent)}
          </section>

          <section class="battle-section">
            <h4 class="text-h3 mb-md">KPI Breakdown</h4>
            <div class="battle-kpi-grid">
              ${this.renderKpiCard('risk', 'Risk Reliability', score.riskReliability, 'How stable is your portfolio under stress scenarios', 'Score compares your mix to stable-allocation benchmarks under stress.')}
              ${this.renderKpiCard('profit', 'Profitability', score.profitability, 'Expected annual return of your allocation', 'Profitability is derived from weighted expected event return of selected plants.')}
              ${this.renderKpiCard('sharpe', 'Return/Risk Ratio', score.returnRiskRatio, 'Reward per unit of risk taken', 'Sharpe-like ratio = expected return divided by expected volatility (with safety floor).', true)}
              ${this.renderKpiCard('esg', 'ESG Score', score.esgScore, 'Environmental, social & governance alignment', 'ESG starts at 100 and applies penalties for high-impact or speculative allocations.')}
            </div>
          </section>

          <section class="battle-section">
            <h4 class="text-h3 mb-md">🏆 Today's Leaderboard</h4>
            <div class="battle-leaderboard">
              ${this.renderLeaderboardRows()}
            </div>
          </section>

          <section class="battle-section">
            <h4 class="text-h3 mb-md">Share Your Score</h4>
            <div class="battle-share-preview">
              <p class="text-small" style="font-weight: 700;">🌱 Flora Daily Challenge — Day 42</p>
              <p class="text-small">My Battle Score: ${score.total}/100 (Top ${topPercent}%)</p>
              <p class="text-small">Risk: ${score.riskReliability} | Profit: ${score.profitability} | Return/Risk: ${score.returnRiskRatio} | ESG: ${score.esgScore}</p>
            </div>
            <button class="btn btn-primary mt-md" id="btn-share-score"> Share Score</button>
          </section>

          <section class="battle-section">
            <div class="gnome-wrap">
              <div class="gnome-speech">${gnomeSpeech}</div>
              <div class="gnome-character">
                <img src="/assets/flora-gnome.png" alt="Flora gnome mascot" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="gnome-fallback">🌿</div>
              </div>
            </div>

            <div class="feedback-grid mt-md">
              <div class="feedback-block feedback-good">
                <h5>What you did well</h5>
                ${strengths.map(item => `<div class="feedback-item">✅ ${item}</div>`).join('')}
              </div>

              <div class="feedback-block feedback-warn">
                <h5>Where to improve</h5>
                ${weaknesses.map(item => `<div class="feedback-item">⚠️ ${item}</div>`).join('')}
              </div>

              <div class="feedback-block feedback-info">
                <h5>Today's lesson</h5>
                <div class="feedback-item">💡 ${learning}</div>
              </div>
            </div>
          </section>

          <div class="battle-modal-actions">
            <button class="btn btn-secondary" id="btn-close-results-2">Back To Battle</button>
            <button class="btn btn-primary" id="btn-new-battle">New Challenge ⚡</button>
          </div>
        </div>
      </div>
    `

    this.container.insertAdjacentHTML('beforeend', modalMarkup)

    const modal = document.getElementById(this.modalId)
    if (!modal) return

    modal.querySelectorAll('.kpi-info-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = (btn as HTMLElement).closest('.battle-kpi-card')
        if (card) card.classList.toggle('kpi-tooltip-open')
      })
    })

    const closeModal = () => modal.remove()
    document.getElementById('btn-close-results')?.addEventListener('click', closeModal)
    document.getElementById('btn-close-results-2')?.addEventListener('click', closeModal)

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal()
    })

    document.getElementById('btn-new-battle')?.addEventListener('click', () => {
      closeModal()
      this.portfolio = {}
      this.render()
    })

    document.getElementById('btn-share-score')?.addEventListener('click', async () => {
      await this.shareScore(shareText)
    })

    this.fireConfettiBurst()
  }

  private renderBellCurve(score: number, beatPercent: number): string {
    const width = 620
    const height = 220
    const left = 40
    const right = 580
    const baseline = 165
    const curveHeight = 95
    const zoneWidth = (right - left) / 4
    const markerX = left + ((right - left) * Math.max(0, Math.min(100, score))) / 100

    const points: string[] = []
    for (let x = 0; x <= 100; x += 2) {
      const pdf = this.normalPdf(x, 50, 15)
      const peak = this.normalPdf(50, 50, 15)
      const normalized = pdf / peak
      const px = left + ((right - left) * x) / 100
      const py = baseline - normalized * curveHeight
      points.push(`${px},${py}`)
    }

    const polyline = points.join(' ')

    return `
      <div class="battle-score-header">
        <div class="battle-score-total">${score}</div>
        <p class="text-caption text-muted">TODAY'S BATTLE SCORE</p>
      </div>

      <svg viewBox="0 0 ${width} ${height}" class="battle-curve-svg" aria-label="Battle score distribution">
        <rect x="${left}" y="${baseline - 10}" width="${zoneWidth}" height="14" fill="#FFB3B3" />
        <rect x="${left + zoneWidth}" y="${baseline - 10}" width="${zoneWidth * 2}" height="14" fill="#FFE082" />
        <rect x="${left + zoneWidth * 3}" y="${baseline - 10}" width="${zoneWidth}" height="14" fill="#A5D6A7" />

        <polyline fill="none" stroke="#1B4F6C" stroke-width="4" points="${polyline}" />

        <line x1="${markerX}" y1="${baseline + 12}" x2="${markerX}" y2="58" stroke="#E8623C" stroke-width="3" />
        <polygon points="${markerX - 7},58 ${markerX + 7},58 ${markerX},45" fill="#E8623C" />

        <text x="${left}" y="${baseline + 28}" font-size="11" fill="#8A8A9A">0</text>
        <text x="${left + (right - left) / 2 - 8}" y="${baseline + 28}" font-size="11" fill="#8A8A9A">50</text>
        <text x="${right - 12}" y="${baseline + 28}" font-size="11" fill="#8A8A9A">100</text>
      </svg>

      <p class="battle-percentile">You beat ${beatPercent}% of today's players</p>
    `
  }

  private renderKpiCard(
    key: string,
    label: string,
    value: number,
    description: string,
    formula: string,
    highlight: boolean = false,
  ): string {
    const clamped = Math.max(0, Math.min(100, value))
    const color = key === 'profit' ? '#4CAF50' : key === 'sharpe' ? '#FFD700' : key === 'esg' ? '#2A6F96' : '#2196F3'
    const radius = 22
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - clamped / 100)
    const interpretation = this.getKpiInterpretation(key, clamped)

    return `
      <div class="battle-kpi-card ${highlight ? 'battle-kpi-card-highlight' : ''}">
        <div class="battle-kpi-top">
          <div>
            <div class="battle-kpi-label">${label}</div>
            <div class="text-small text-muted">${description}</div>
          </div>
          <button class="kpi-info-btn" aria-label="How this KPI is calculated">?</button>
          <div class="kpi-tooltip">${formula}</div>
        </div>

        <div class="battle-kpi-ring-wrap">
          <svg viewBox="0 0 60 60" class="battle-kpi-ring">
            <circle cx="30" cy="30" r="${radius}" class="battle-kpi-ring-bg"></circle>
            <circle
              cx="30"
              cy="30"
              r="${radius}"
              class="battle-kpi-ring-fg"
              stroke="${color}"
              style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"
            ></circle>
          </svg>
          <div class="battle-kpi-value">${clamped}</div>
        </div>

        <div class="battle-kpi-interpret">${interpretation}</div>
      </div>
    `
  }

  private renderLeaderboardRows(): string {
    const rows = [
      { rank: 1, name: 'Maestro Codus', score: 91 },
      { rank: 2, name: 'Mark Zuck', score: 87 },
      { rank: 3, name: 'Frank Ribery', score: 82 },
      { rank: 4, name: 'Arnaud Butty', score: 76 },
      { rank: 5, name: 'Killian Huber', score: 71 },
      { rank: 6, name: 'Aris Tsikouras', score: 68 },
      { rank: 7, name: '[YOU] Paul Ludmann', score: 55 },
      { rank: 8, name: 'Python Menace', score: 49 },
      { rank: 9, name: 'Christobale Colombus', score: 41 },
      { rank: 10, name: 'Paul Codio', score: 33 },
    ]

    return rows.map((entry, index) => {
      const initials = this.getInitials(entry.name)
      const rankClass = entry.rank <= 3 ? `leaderboard-rank-${entry.rank}` : ''
      const crown = entry.rank === 1 ? ' 👑' : ''
      const youBadge = entry.rank === 7 ? '<span class="badge battle-you-badge">YOU</span>' : ''
      const rowClass = entry.rank === 7 ? 'battle-leader-row battle-leader-row-you' : 'battle-leader-row'

      return `
        <div class="${rowClass}" style="animation-delay: ${index * 50}ms;">
          <div class="battle-rank-badge ${rankClass}">${entry.rank}${crown}</div>
          <div class="battle-avatar">${initials}</div>
          <div class="battle-leader-name">${entry.name} ${youBadge}</div>
          <div class="battle-score-pill">${entry.score}</div>
        </div>
      `
    }).join('')
  }

  private getInitials(name: string): string {
    const cleaned = name.replace('[YOU]', '').replace('[anonymous]', 'AN').trim()
    if (cleaned === 'AN') return 'AN'
    return cleaned
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
  }

  private getKpiInterpretation(metric: string, value: number): string {
    if (metric === 'risk') {
      if (value < 40) return 'Fragile under stress, volatility too concentrated.'
      if (value < 70) return 'Moderately resilient with room to diversify.'
      return 'Low volatility profile with solid downside resilience.'
    }
    if (metric === 'profit') {
      if (value < 40) return 'Expected return is weak for this scenario.'
      if (value < 70) return 'Balanced upside with moderate growth potential.'
      return 'Strong upside potential from your selected assets.'
    }
    if (metric === 'sharpe') {
      if (value < 40) return 'Risk taken is not sufficiently rewarded.'
      if (value < 70) return 'Decent reward per unit of risk.'
      return 'Excellent risk-adjusted performance profile.'
    }

    if (value < 40) return 'Weak ESG alignment. Consider cleaner allocations.'
    if (value < 70) return 'Reasonable ESG balance with some risk areas.'
    return 'Strong sustainability alignment across portfolio.'
  }

  private getStrengths(score: BattleScore): string[] {
    const strengths: string[] = []
    if (score.riskReliability > 60) strengths.push('Your diversification improves stress resilience.')
    if (score.profitability > 60) strengths.push('You captured strong upside potential in this scenario.')
    if (score.returnRiskRatio > 60) strengths.push('Your return/risk balance is efficient and well-judged.')
    if (score.esgScore > 60) strengths.push('Your ESG alignment remains robust without sacrificing structure.')
    return strengths.length > 0 ? strengths.slice(0, 2) : ['Your allocation stayed active and scenario-aware.']
  }

  private getWeaknesses(score: BattleScore): string[] {
    const weaknesses: string[] = []
    if (score.riskReliability < 40) weaknesses.push('Portfolio stability is low under adverse shocks.')
    if (score.profitability < 40) weaknesses.push('Expected return is below the event opportunity set.')
    if (score.returnRiskRatio < 40) weaknesses.push('Too much risk for the level of expected reward.')
    if (score.esgScore < 40) weaknesses.push('ESG exposure is weak and can be improved quickly.')
    return weaknesses.length > 0 ? weaknesses.slice(0, 2) : ['Main risks are controlled; keep refining weight sizing.']
  }

  private getGnomeSpeech(totalScore: number): string {
    if (totalScore < 40) return 'Hmm... your risk management needs work! 🌿'
    if (totalScore <= 65) return 'Solid allocation! Your ESG choices shine 🌱'
    if (totalScore <= 80) return 'Impressive diversification, almost perfect! 🍃'
    return "Outstanding! You're a sustainable investing master! 🌳"
  }

  private getPercentile(score: number): number {
    const cdf = this.normalCdf(score, 50, 15)
    return cdf * 100
  }

  private normalPdf(x: number, mean: number, std: number): number {
    const z = (x - mean) / std
    return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI))
  }

  private normalCdf(x: number, mean: number, std: number): number {
    const z = (x - mean) / (std * Math.sqrt(2))
    return 0.5 * (1 + this.erf(z))
  }

  private erf(x: number): number {
    const sign = x < 0 ? -1 : 1
    const absX = Math.abs(x)

    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const t = 1 / (1 + p * absX)
    const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX)
    return sign * y
  }

  private buildShareText(score: BattleScore, beatPercent: number, topPercent: number): string {
    const gameUrl = window.location.href
    return [
      '🌱 Flora Daily Challenge — Day 42',
      `My Battle Score: ${score.total}/100 (Top ${topPercent}%)`,
      `Risk: ${score.riskReliability} | 💰 Profit: ${score.profitability} | ⚖️ Return/Risk: ${score.returnRiskRatio} | 🌱 ESG: ${score.esgScore}`,
      `You beat ${beatPercent}% of today's players`,
      `Play at: ${gameUrl}`,
    ].join('\n')
  }

  private async shareScore(shareText: string): Promise<void> {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Flora Daily Challenge',
          text: shareText,
        })
        return
      }
    } catch {
      // Continue to clipboard fallback if share is canceled or unavailable.
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        this.showToast('Copied to clipboard!')
        return
      }

      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      this.showToast('Copied to clipboard!')
    } catch {
      this.showToast('Unable to copy right now.')
    }
  }

  private showToast(message: string): void {
    const toast = document.createElement('div')
    toast.className = 'battle-toast'
    toast.textContent = message
    document.body.appendChild(toast)

    requestAnimationFrame(() => {
      toast.classList.add('battle-toast-show')
    })

    setTimeout(() => {
      toast.classList.remove('battle-toast-show')
      setTimeout(() => toast.remove(), 260)
    }, 2000)
  }

  private fireConfettiBurst(): void {
    const duration = 3000
    const end = Date.now() + duration

    const timer = window.setInterval(() => {
      const now = Date.now()
      if (now > end) {
        window.clearInterval(timer)
        return
      }

      confetti({
        particleCount: 18,
        startVelocity: 42,
        spread: 55,
        ticks: 120,
        origin: { x: 0, y: 1 },
        colors: ['#FFD700', '#4CAF50', '#2196F3', '#FF5722'],
      })

      confetti({
        particleCount: 18,
        startVelocity: 42,
        spread: 55,
        ticks: 120,
        origin: { x: 1, y: 1 },
        colors: ['#FFD700', '#4CAF50', '#2196F3', '#FF5722'],
      })
    }, 180)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
