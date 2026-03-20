/** Landing screen — title, start/quick-start/battle buttons, leaderboard, and achievements */

import { getLeaderboard } from '../../utils/leaderboard'
import { renderAchievementsBadges } from '../enhancements/Achievements'
import { darkModeToggleHtml, toggleDarkMode } from '../enhancements/DarkMode'
import { staggeredEntrance } from '../enhancements/MicroInteractions'

export class LandingScreen {
  private container: HTMLElement
  private onStart: () => void
  private onBattle: () => void
  private onQuickStart: () => void

  constructor(container: HTMLElement, onStart: () => void, onBattle: () => void, onQuickStart: () => void) {
    this.container = container
    this.onStart = onStart
    this.onBattle = onBattle
    this.onQuickStart = onQuickStart
  }

  render(): void {
    const board = getLeaderboard()
    const leaderboardHtml = board.length > 0 ? `
      <div class="landing-leaderboard">
        <h3 class="text-h3 mb-sm" style="color: var(--pf-petrol);">Leaderboard</h3>
        <div class="leaderboard-list">
          ${board.slice(0, 5).map((e, i) => `
            <div class="leaderboard-row stagger-item">
              <span class="leaderboard-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
              <span class="leaderboard-profile">${e.profile}</span>
              <span class="leaderboard-score num">${e.score} pts</span>
              <span class="leaderboard-growth num" style="color: ${e.portfolioGrowth >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'};">
                ${e.portfolioGrowth >= 0 ? '+' : ''}${e.portfolioGrowth}%
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''

    this.container.innerHTML = `
      <div class="screen" style="background: linear-gradient(180deg, rgba(240,244,246,0.95) 0%, rgba(245,245,243,0.97) 100%);">
        <div style="text-align: center; max-width: 480px;">
          <div style="position: absolute; top: 16px; right: 16px;">
            ${darkModeToggleHtml()}
          </div>

          <p class="text-caption text-muted mb-md" style="letter-spacing: 0.12em;">PostFinance &middot; Wealth Manager Arena</p>
          <h1 class="text-hero-xl mb-md" style="color: var(--pf-petrol);">
            <img src="/assets/1LOGO.png" alt="Growden" class="landing-logo-img"> <span class="text-display">Growden</span>
          </h1>
          <p class="text-body" style="color: var(--text-secondary); max-width: 360px; margin: 0 auto var(--space-xl); line-height: 1.6;">
            Grow your knowledge. Grow your wealth.<br>
            Learn investing by building a garden.
          </p>

          <div style="display: flex; flex-direction: column; gap: var(--space-sm); align-items: center; max-width: 280px; margin: 0 auto;">
            <button class="btn btn-primary btn-large w-full stagger-item" id="btn-start">
              Start Growing
            </button>
            <button class="btn btn-secondary w-full stagger-item" id="btn-quick-start">
              Quick Start
            </button>
            <button class="btn btn-secondary w-full stagger-item" id="btn-battle">
              Battle Mode
            </button>
          </div>

          <div class="stagger-item" style="margin-top: var(--space-2xl); display: flex; gap: var(--space-xl); justify-content: center;">
            <div class="text-center">
              <div style="font-size: 22px; margin-bottom: 4px;">🌳</div>
              <div class="text-caption text-muted">Assets</div>
            </div>
            <div class="text-center">
              <div style="font-size: 22px; margin-bottom: 4px;">⛈️</div>
              <div class="text-caption text-muted">Events</div>
            </div>
            <div class="text-center">
              <div style="font-size: 22px; margin-bottom: 4px;">📈</div>
              <div class="text-caption text-muted">Investing</div>
            </div>
          </div>

          ${leaderboardHtml}

          <!-- Achievements -->
          <div class="stagger-item">
            ${renderAchievementsBadges()}
          </div>
        </div>
      </div>
    `

    document.getElementById('btn-start')?.addEventListener('click', this.onStart)
    document.getElementById('btn-battle')?.addEventListener('click', this.onBattle)
    document.getElementById('btn-quick-start')?.addEventListener('click', this.onQuickStart)
    document.getElementById('btn-dark-mode')?.addEventListener('click', () => {
      toggleDarkMode()
      this.render()
    })

    // Staggered entrance animation
    staggeredEntrance('.stagger-item', 0.07)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
