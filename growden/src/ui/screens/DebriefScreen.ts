/**
 * DebriefScreen — End-of-game results
 *
 * Shows final score, portfolio growth, SVG line chart, risk-profile
 * comparison ("what if you'd played as Zen?"), personalised learning
 * insights, score breakdown, and share button.
 */

import type { GameState } from '../../types'
import { EVENTS_MAP } from '../../data/events'
import { RISK_PROFILES, GAME_CONFIG } from '../../constants/config'
import { renderDonutChart, renderBeforeAfter } from '../enhancements/PortfolioViz'
import { renderAchievementsBadges, fireConfetti } from '../enhancements/Achievements'
import { gradientText, scoreGradient, formatPercent } from '../enhancements/Typography'
import { staggeredEntrance } from '../enhancements/MicroInteractions'

export class DebriefScreen {
  private container: HTMLElement
  private onRestart: () => void
  private onBattle: () => void

  constructor(container: HTMLElement, onRestart: () => void, onBattle: () => void) {
    this.container = container
    this.onRestart = onRestart
    this.onBattle = onBattle
  }

  render(
    state: GameState,
    finalBreakdown: Array<{ label: string; points: number }>,
    profileComparison?: Record<string, number>,
  ): void {
    const totalScore = state.score
    const startFlowers = GAME_CONFIG.STARTING_FLOWERS
    const flowerGrowthNum = (state.flowers - startFlowers) / startFlowers * 100
    const flowerGrowth = flowerGrowthNum.toFixed(1)
    const isPositive = state.flowers >= startFlowers

    // Performance rating
    let rating = '🌱 Seedling'
    let ratingDesc = 'You\'re just starting your investment journey.'
    if (totalScore > 200) { rating = '🌿 Growing'; ratingDesc = 'Good fundamentals. Keep learning!' }
    if (totalScore > 400) { rating = '🌳 Flourishing'; ratingDesc = 'Strong portfolio management skills!' }
    if (totalScore > 600) { rating = '🏆 Master Gardener'; ratingDesc = 'Outstanding! You understand investing deeply.' }

    // Score breakdown rows
    const breakdownRows = state.scoreBreakdown.slice(-10).map(item => `
      <div class="score-item">
        <span class="text-small">${item.label}</span>
        <span class="text-small" style="color: ${item.points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'}; font-weight: 600;">
          ${item.points >= 0 ? '+' : ''}${item.points}
        </span>
      </div>
    `).join('')

    this.container.innerHTML = `
      <div class="screen" style="overflow-y: auto;">
        <div style="max-width: 600px; width: 100%; padding: var(--space-2xl) 0;">

          <div class="text-center mb-xl stagger-item">
            <p class="text-caption text-muted mb-sm">GAME COMPLETE</p>
            <h1 class="text-hero-xl" style="color: var(--pf-petrol);">
              ${rating.split(' ')[0]}
            </h1>
            <h2 class="text-h2 mt-sm">${gradientText(rating.split(' ').slice(1).join(' '), scoreGradient(totalScore))}</h2>
            <p class="text-body text-muted mt-sm">${ratingDesc}</p>
          </div>

          <!-- Score -->
          <div class="score-panel mb-lg stagger-item">
            <div class="score-total">${gradientText(String(totalScore), scoreGradient(totalScore))}</div>
            <p class="text-caption text-muted text-center">TOTAL SCORE</p>

            <div style="display: flex; justify-content: center; gap: var(--space-xl); margin-top: var(--space-lg);">
              <div class="text-center">
                <div class="text-h3 num" style="color: ${isPositive ? 'var(--color-positive)' : 'var(--color-negative)'};">
                  ${formatPercent(flowerGrowthNum)}
                </div>
                <div class="text-caption text-muted">🌸 Growth</div>
              </div>
              <div class="text-center">
                <div class="text-h3 num">${state.eventsHistory.length}</div>
                <div class="text-caption text-muted">Events Survived</div>
              </div>
              <div class="text-center">
                <div class="text-h3 num">${state.currentLevel}</div>
                <div class="text-caption text-muted">Level Reached</div>
              </div>
            </div>
          </div>

          <!-- Before/After Portfolio Comparison -->
          <div class="card mb-lg stagger-item">
            <h3 class="text-h3 mb-md">🌸 Flower Result</h3>
            ${renderBeforeAfter(startFlowers, state.flowers)}
          </div>

          <!-- Portfolio Donut Chart -->
          <div class="card mb-lg stagger-item">
            <h3 class="text-h3 mb-md">Final Allocation</h3>
            ${renderDonutChart(state.portfolio)}
          </div>

          <!-- Portfolio Line Chart -->
          <div class="card mb-lg stagger-item">
            <h3 class="text-h3 mb-md">Portfolio Journey</h3>
            <div class="debrief-chart-container">
              ${this.renderLineChart(state)}
            </div>
          </div>

          <!-- Risk Profile Comparison -->
          ${profileComparison ? this.renderProfileComparison(state, profileComparison) : ''}

          <!-- Personalized Learning Summary -->
          <div class="card mb-lg" style="background: var(--pf-petrol); color: white;">
            <h3 class="text-h3 mb-md" style="color: var(--pf-yellow);">🌿 What You Learned</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-sm);">
              ${this.generateLearningInsights(state).map(i => `
                <li class="text-body" style="color: rgba(255,255,255,0.9);">✓ ${i}</li>
              `).join('')}
            </ul>
          </div>

          <!-- Score Breakdown -->
          <div class="card mb-lg">
            <h3 class="text-h3 mb-md">Score Breakdown</h3>
            <div class="score-breakdown">
              ${breakdownRows}
              ${finalBreakdown.map(item => `
                <div class="score-item" style="border-bottom-color: var(--pf-yellow);">
                  <span class="text-small" style="font-weight: 600;">${item.label}</span>
                  <span class="text-small" style="color: ${item.points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'}; font-weight: 700;">
                    ${item.points >= 0 ? '+' : ''}${item.points}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Achievements -->
          <div class="stagger-item">
            ${renderAchievementsBadges()}
          </div>

          <!-- Actions -->
          <div class="stagger-item" style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; margin-top: var(--space-lg);">
            <button class="btn btn-primary btn-large" id="btn-restart">Play Again 🌱</button>
            <button class="btn btn-secondary" id="btn-battle-end">⚡ Battle Mode</button>
            <button class="btn btn-secondary" id="btn-share">📋 Share Score</button>
          </div>
        </div>
      </div>
    `

    document.getElementById('btn-restart')?.addEventListener('click', this.onRestart)
    document.getElementById('btn-battle-end')?.addEventListener('click', this.onBattle)
    document.getElementById('btn-share')?.addEventListener('click', () => this.shareScore(state))

    // Staggered entrance for all cards
    staggeredEntrance('.stagger-item', 0.08)

    // Fire confetti for high scores
    if (totalScore > 500) {
      setTimeout(() => fireConfetti(), 600)
    }
  }

  /** SVG line chart showing flower value over time */
  private renderLineChart(state: GameState): string {
    const history = state.flowerHistory
    if (history.length < 2) return '<div class="text-small text-muted">Not enough data yet</div>'

    const W = 520
    const H = 140
    const PAD = { top: 10, right: 15, bottom: 25, left: 50 }
    const cw = W - PAD.left - PAD.right
    const ch = H - PAD.top - PAD.bottom

    const values = history.map(p => p.value)
    const min = Math.min(...values) * 0.98
    const max = Math.max(...values) * 1.02
    const range = max - min || 1

    const points = history.map((p, i) => {
      const x = PAD.left + (i / (history.length - 1)) * cw
      const y = PAD.top + ch - ((p.value - min) / range) * ch
      return { x, y, value: p.value, level: p.level }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

    // Gradient area under line
    const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${PAD.top + ch} L${points[0].x.toFixed(1)},${PAD.top + ch} Z`

    // Baseline at starting flower value
    const startVal = GAME_CONFIG.STARTING_FLOWERS
    const baseY = PAD.top + ch - ((startVal - min) / range) * ch

    // Y-axis labels
    const yLabels = [min, startVal, max].map(v => {
      const y = PAD.top + ch - ((v - min) / range) * ch
      return `<text x="${PAD.left - 5}" y="${y + 3}" text-anchor="end" fill="#999" font-size="9" font-family="Inter, sans-serif">${(v / 1000).toFixed(1)}k</text>`
    }).join('')

    // X-axis labels
    const xLabels = points.map(p =>
      `<text x="${p.x}" y="${H - 5}" text-anchor="middle" fill="#999" font-size="9" font-family="Inter, sans-serif">L${p.level}</text>`,
    ).join('')

    // Dots on each data point
    const dots = points.map(p => {
      const color = p.value >= startVal ? 'var(--color-positive)' : 'var(--color-negative)'
      return `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" stroke="white" stroke-width="1.5"/>`
    }).join('')

    const lineColor = state.flowers >= startVal ? 'var(--color-positive)' : 'var(--color-negative)'

    return `
      <svg viewBox="0 0 ${W} ${H}" class="debrief-line-chart">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <!-- Baseline -->
        <line x1="${PAD.left}" y1="${baseY}" x2="${W - PAD.right}" y2="${baseY}"
              stroke="#ccc" stroke-dasharray="4,3" stroke-width="1"/>
        <text x="${W - PAD.right + 2}" y="${baseY + 3}" fill="#bbb" font-size="8" font-family="Inter, sans-serif">start</text>
        <!-- Area -->
        <path d="${areaPath}" fill="url(#chartGrad)"/>
        <!-- Line -->
        <path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              class="debrief-chart-line"/>
        <!-- Dots -->
        ${dots}
        <!-- Axes labels -->
        ${yLabels}
        ${xLabels}
      </svg>
    `
  }

  /** Risk profile comparison section */
  private renderProfileComparison(state: GameState, comparison: Record<string, number>): string {
    const playerProfile = state.riskProfile
    const profileEntries = Object.entries(RISK_PROFILES).map(([id, profile]) => {
      const value = comparison[id] || GAME_CONFIG.STARTING_FLOWERS
      const growth = ((value - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS * 100).toFixed(1)
      const isPos = value >= GAME_CONFIG.STARTING_FLOWERS
      const isCurrent = id === playerProfile
      return `
        <div class="profile-compare-row ${isCurrent ? 'profile-compare-current' : ''}">
          <div class="profile-compare-name">
            ${profile.emoji} ${profile.name}
            ${isCurrent ? '<span class="profile-compare-you">YOU</span>' : ''}
          </div>
          <div class="profile-compare-value" style="color: ${isPos ? 'var(--color-positive)' : 'var(--color-negative)'};">
            ${isPos ? '+' : ''}${growth}%
          </div>
          <div class="profile-compare-bar">
            <div class="profile-compare-bar-fill" style="width: ${Math.min(100, Math.max(5, 50 + parseFloat(growth)))}%; background: ${profile.color};"></div>
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="card mb-lg">
        <h3 class="text-h3 mb-md">How Other Profiles Would Have Done</h3>
        <p class="text-small text-muted mb-md">Same events, different risk profiles</p>
        <div class="profile-compare-list">${profileEntries}</div>
      </div>
    `
  }

  /** Generate personalized learning insights from gameplay */
  private generateLearningInsights(state: GameState): string[] {
    const insights: string[] = []

    // Panic sell analysis
    const panicCount = state.eventsHistory.filter(e => e.playerAction === 'panic_sell').length
    const holdCount = state.eventsHistory.filter(e => e.playerAction === 'hold').length

    if (panicCount >= 2) {
      insights.push('You panic sold multiple times — historically, markets recover from crashes within 1-3 years. Patience pays off.')
    } else if (panicCount === 1) {
      insights.push('You panic sold once — next time, consider that short-term losses often reverse. Selling locks in the loss.')
    } else if (holdCount === state.eventsHistory.length && holdCount > 0) {
      insights.push('You held through every event — discipline is the #1 predictor of long-term investing success.')
    }

    // Diversification
    const portfolio = state.portfolio
    const cats = new Set<string>()
    for (const [plantId, alloc] of Object.entries(portfolio)) {
      if (alloc > 0) {
        const plant = (EVENTS_MAP as any)[plantId] // won't match, use direct check below
        cats.add(plantId) // rough check
      }
    }
    const totalAlloc = Object.values(portfolio).reduce((s, v) => s + v, 0)
    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    if (entries.length >= 4) {
      insights.push('Diversification across multiple assets reduced your risk — no single event could destroy your portfolio.')
    } else if (entries.length <= 2 && entries.length > 0) {
      insights.push('Your portfolio was concentrated in few assets. More diversification would have smoothed out volatility.')
    }

    // Portfolio performance
    const growth = (state.flowers - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS * 100
    if (growth > 20) {
      insights.push(`Your flowers grew ${growth.toFixed(0)}% — strong returns come from staying invested through volatile times.`)
    } else if (growth < -10) {
      insights.push(`Your flowers fell ${Math.abs(growth).toFixed(0)}% — review which asset classes caused the biggest losses and rebalance next time.`)
    } else if (growth >= 0) {
      insights.push('Preserving capital during volatile markets is an achievement in itself — not losing is the first rule of investing.')
    }

    // Event-specific insights
    const eventTypes = new Set(state.eventsHistory.map(e => e.eventId))
    if (eventTypes.has('fed_rate_hike') || eventTypes.has('fed_rate_cut')) {
      insights.push('Interest rate changes affect bonds and equities differently — bonds lose value when rates rise, but gain when rates fall.')
    }
    if (eventTypes.has('geopolitical_shock') || eventTypes.has('tariff_crisis')) {
      insights.push('Geopolitical events create short-term panic — but markets are resilient and historically recover.')
    }

    // Cap at 5 insights
    return insights.slice(0, 5)
  }

  /** Copy score summary to clipboard */
  private shareScore(state: GameState): void {
    const growth = ((state.flowers - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS * 100).toFixed(1)
    const text = [
      `🌱 Growden — Wealth Manager Arena`,
      `Score: ${state.score} pts`,
      `🌸 Growth: ${Number(growth) >= 0 ? '+' : ''}${growth}%`,
      `Events survived: ${state.eventsHistory.length}`,
      `Level: ${state.currentLevel}`,
      `Can you beat my score? 🌿`,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('btn-share')
      if (btn) {
        btn.textContent = '✅ Copied!'
        setTimeout(() => { btn.textContent = '📋 Share Score' }, 2000)
      }
    }).catch(() => {
      // Fallback: select text
      const btn = document.getElementById('btn-share')
      if (btn) btn.textContent = '❌ Copy failed'
    })
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
