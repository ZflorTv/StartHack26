/** StatsScreen — In-game performance modal (score, chart, allocation, event history) */

import type { GameState } from '../../types'
import { EVENTS_MAP } from '../../data/events'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { GAME_CONFIG } from '../../constants/config'
import { plantImg } from '../../utils/plantImage'

export class StatsScreen {
  private container: HTMLElement
  private modal: HTMLElement | null = null
  private getState: () => Readonly<GameState>

  constructor(container: HTMLElement, getState: () => Readonly<GameState>) {
    this.container = container
    this.getState = getState
  }

  open(): void {
    this.close()
    this.modal = document.createElement('div')
    this.modal.className = 'codex-overlay'
    this.modal.id = 'stats-modal'
    this.container.appendChild(this.modal)
    this.render()
  }

  close(): void {
    this.modal?.remove()
    this.modal = null
  }

  private render(): void {
    if (!this.modal) return
    const state = this.getState()

    const flowerGrowth = ((state.flowers - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS * 100).toFixed(1)
    const isPositive = state.flowers >= GAME_CONFIG.STARTING_FLOWERS

    this.modal.innerHTML = `
      <div class="codex-panel stats-panel">
        <div class="codex-header">
          <h2 class="codex-title">Performance</h2>
          <button class="btn btn-small btn-secondary codex-close-btn" id="stats-close">Done</button>
        </div>

        <div class="codex-body">

          <!-- Summary cards -->
          <div class="stats-summary">
            <div class="stats-card">
              <div class="stats-card-value">${state.score}</div>
              <div class="stats-card-label">Score</div>
            </div>
            <div class="stats-card">
              <div class="stats-card-value" style="color: ${isPositive ? 'var(--color-positive)' : 'var(--color-negative)'};">
                ${isPositive ? '+' : ''}${flowerGrowth}%
              </div>
              <div class="stats-card-label">Growth</div>
            </div>
            <div class="stats-card">
              <div class="stats-card-value">${state.eventsHistory.length}</div>
              <div class="stats-card-label">Events</div>
            </div>
            <div class="stats-card">
              <div class="stats-card-value">🌸 ${state.flowers}</div>
              <div class="stats-card-label">Flowers</div>
            </div>
          </div>

          <!-- Portfolio chart -->
          <div class="stats-section">
            <h3 class="stats-section-title">Portfolio Journey</h3>
            <div class="stats-chart">
              ${this.renderChart(state)}
            </div>
          </div>

          <!-- Current allocation -->
          <div class="stats-section">
            <h3 class="stats-section-title">Current Allocation</h3>
            ${this.renderAllocation(state)}
          </div>

          <!-- Events history -->
          ${state.eventsHistory.length > 0 ? `
            <div class="stats-section">
              <h3 class="stats-section-title">Events History</h3>
              ${this.renderEventsHistory(state)}
            </div>
          ` : ''}

          <!-- Score breakdown -->
          ${state.scoreBreakdown.length > 0 ? `
            <div class="stats-section">
              <h3 class="stats-section-title">Score Breakdown</h3>
              ${this.renderScoreBreakdown(state)}
            </div>
          ` : ''}

        </div>
      </div>
    `

    this.modal.querySelector('#stats-close')?.addEventListener('click', () => this.close())
  }

  private renderChart(state: GameState): string {
    if (state.flowerHistory.length < 2) {
      return '<div class="stats-chart-empty">Play some events to see your flower chart</div>'
    }

    const values = state.flowerHistory.map(p => p.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const bars = state.flowerHistory.map(point => {
      const pct = ((point.value - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS) * 100
      const height = Math.max(8, ((point.value - min) / range) * 80)
      const color = pct >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'
      return `
        <div class="stats-chart-bar-wrapper">
          <div class="stats-chart-bar" style="height: ${height}px; background: ${color};"></div>
          <span class="stats-chart-label">L${point.level}</span>
        </div>
      `
    }).join('')

    return `<div class="stats-chart-bars">${bars}</div>`
  }

  private renderAllocation(state: GameState): string {
    const entries = Object.entries(state.portfolio).filter(([_, v]) => v > 0)
    const total = entries.reduce((s, [_, v]) => s + v, 0)

    if (entries.length === 0) {
      return '<div class="stats-empty">No plants in portfolio</div>'
    }

    // Group by category
    const byCategory: Record<string, Array<{ id: string; allocation: number; pct: number }>> = {}
    for (const [plantId, allocation] of entries) {
      const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
      const cat = plant?.category || 'unknown'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push({ id: plantId, allocation, pct: Math.round((allocation / total) * 100) })
    }

    return Object.entries(byCategory).map(([cat, plants]) => {
      const catColor = CATEGORY_COLORS[cat] || '#ccc'
      const catPct = plants.reduce((s, p) => s + p.pct, 0)
      const items = plants.map(p => {
        const plant = PLANTS_MAP[p.id] || BAD_PLANTS_MAP[p.id]
        return `
          <div class="stats-alloc-item">
            <span>${plantImg(p.id, plant?.emoji || '?', '20px')} ${plant?.name || p.id}</span>
            <span class="stats-alloc-pct">${p.pct}%</span>
          </div>
        `
      }).join('')

      return `
        <div class="stats-alloc-group">
          <div class="stats-alloc-header" style="border-left: 3px solid ${catColor};">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            <span class="stats-alloc-pct">${catPct}%</span>
          </div>
          ${items}
        </div>
      `
    }).join('')
  }

  private renderEventsHistory(state: GameState): string {
    return state.eventsHistory.map(result => {
      const event = EVENTS_MAP[result.eventId]
      const changePct = ((result.flowersAfter - result.flowersBefore) / result.flowersBefore * 100).toFixed(1)
      const isPos = result.flowersAfter >= result.flowersBefore
      const actionLabel = result.playerAction === 'hold' ? 'Held' :
                          result.playerAction === 'rebalance' ? 'Rebalanced' : 'Panic sold'
      const actionColor = result.playerAction === 'hold' ? 'var(--color-positive)' :
                          result.playerAction === 'rebalance' ? 'var(--color-warning)' : 'var(--color-negative)'

      return `
        <div class="stats-event-row">
          <div class="stats-event-left">
            <span class="stats-event-emoji">${event?.weatherEmoji || '?'}</span>
            <div>
              <div class="stats-event-name">${event?.name || result.eventId}</div>
              <div class="stats-event-meta">Level ${result.level} · ${result.amplitude}</div>
            </div>
          </div>
          <div class="stats-event-right">
            <div class="stats-event-change" style="color: ${isPos ? 'var(--color-positive)' : 'var(--color-negative)'};">
              ${isPos ? '+' : ''}${changePct}%
            </div>
            <div class="stats-event-action" style="color: ${actionColor};">${actionLabel}</div>
          </div>
        </div>
      `
    }).join('')
  }

  private renderScoreBreakdown(state: GameState): string {
    return state.scoreBreakdown.map(item => `
      <div class="stats-score-row">
        <span class="stats-score-label">${item.label}</span>
        <span class="stats-score-points" style="color: ${item.points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'};">
          ${item.points >= 0 ? '+' : ''}${item.points}
        </span>
      </div>
    `).join('')
  }
}
