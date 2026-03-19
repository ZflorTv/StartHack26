import type { GameState, ScoreEvent } from '../../types'

export class DebriefScreen {
  private container: HTMLElement
  private onRestart: () => void
  private onBattle: () => void

  constructor(container: HTMLElement, onRestart: () => void, onBattle: () => void) {
    this.container = container
    this.onRestart = onRestart
    this.onBattle = onBattle
  }

  render(state: GameState, finalBreakdown: Array<{ label: string; points: number }>): void {
    const totalScore = state.score
    const portfolioGrowth = ((state.portfolioValue - 10000) / 10000 * 100).toFixed(1)
    const isPositive = state.portfolioValue >= 10000

    // Performance rating
    let rating = '🌱 Seedling'
    let ratingDesc = 'You\'re just starting your investment journey.'
    if (totalScore > 200) { rating = '🌿 Growing'; ratingDesc = 'Good fundamentals. Keep learning!' }
    if (totalScore > 400) { rating = '🌳 Flourishing'; ratingDesc = 'Strong portfolio management skills!' }
    if (totalScore > 600) { rating = '🏆 Master Gardener'; ratingDesc = 'Outstanding! You understand investing deeply.' }

    // Chart: simple ASCII-style portfolio history
    const chartBars = state.portfolioHistory.map((point, i) => {
      const pct = ((point.value - 10000) / 10000) * 100
      const height = Math.max(5, Math.min(80, 40 + pct))
      const color = pct >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'
      return `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
          <div style="width: 100%; height: ${height}px; background: ${color}; border-radius: 4px 4px 0 0; min-width: 20px;"></div>
          <span class="text-small text-muted" style="font-size: 10px;">L${point.level}</span>
        </div>
      `
    }).join('')

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
      <div class="screen" style="background: rgba(240,237,230,0.97); overflow-y: auto;">
        <div style="max-width: 600px; width: 100%; padding: var(--space-2xl) 0;">

          <div class="text-center mb-xl">
            <p class="text-caption text-muted mb-sm">GAME COMPLETE</p>
            <h1 class="text-hero" style="color: var(--pf-petrol);">
              ${rating.split(' ')[0]}
            </h1>
            <h2 class="text-h2 mt-sm" style="color: var(--pf-petrol);">${rating.split(' ').slice(1).join(' ')}</h2>
            <p class="text-body text-muted mt-sm">${ratingDesc}</p>
          </div>

          <!-- Score -->
          <div class="score-panel mb-lg">
            <div class="score-total">${totalScore}</div>
            <p class="text-caption text-muted text-center">TOTAL SCORE</p>

            <div style="display: flex; justify-content: center; gap: var(--space-xl); margin-top: var(--space-lg);">
              <div class="text-center">
                <div class="text-h3" style="color: ${isPositive ? 'var(--color-positive)' : 'var(--color-negative)'};">
                  ${isPositive ? '+' : ''}${portfolioGrowth}%
                </div>
                <div class="text-caption text-muted">Portfolio</div>
              </div>
              <div class="text-center">
                <div class="text-h3">${state.eventsHistory.length}</div>
                <div class="text-caption text-muted">Events Survived</div>
              </div>
              <div class="text-center">
                <div class="text-h3">${state.currentLevel}</div>
                <div class="text-caption text-muted">Level Reached</div>
              </div>
            </div>
          </div>

          <!-- Portfolio Chart -->
          <div class="card mb-lg">
            <h3 class="text-h3 mb-md">Portfolio Journey</h3>
            <div style="display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: var(--space-sm) 0;">
              ${chartBars}
            </div>
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

          <!-- Key Lessons -->
          <div class="card mb-lg" style="background: var(--pf-petrol); color: white;">
            <h3 class="text-h3 mb-md" style="color: var(--pf-yellow);">🌿 Key Lessons</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-sm);">
              <li class="text-body" style="color: rgba(255,255,255,0.9);">✓ Diversification protects against any single storm</li>
              <li class="text-body" style="color: rgba(255,255,255,0.9);">✓ Patience beats panic — holding through volatility is rewarded</li>
              <li class="text-body" style="color: rgba(255,255,255,0.9);">✓ Different assets react differently to the same event</li>
              <li class="text-body" style="color: rgba(255,255,255,0.9);">✓ High returns always come with high risk</li>
            </ul>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: var(--space-md); justify-content: center;">
            <button class="btn btn-primary btn-large" id="btn-restart">Play Again 🌱</button>
            <button class="btn btn-secondary" id="btn-battle-end">⚡ Try Battle Mode</button>
          </div>
        </div>
      </div>
    `

    document.getElementById('btn-restart')?.addEventListener('click', this.onRestart)
    document.getElementById('btn-battle-end')?.addEventListener('click', this.onBattle)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
