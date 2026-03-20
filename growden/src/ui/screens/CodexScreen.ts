/** CodexScreen — Encyclopedia modal with two tabs: Plants (by unlock level) and Events (by category) */

import type { Plant, BadPlant, GameEvent } from '../../types'
import { PLANTS } from '../../data/plants'
import { BAD_PLANTS } from '../../data/badPlants'
import { GAME_EVENTS } from '../../data/events'
import { CATEGORY_COLORS } from '../../constants/colors'
import { plantImg } from '../../utils/plantImage'

type CodexTab = 'plants' | 'events'

export class CodexScreen {
  private container: HTMLElement
  private modal: HTMLElement | null = null
  private activeTab: CodexTab = 'plants'

  constructor(container: HTMLElement) {
    this.container = container
  }

  open(): void {
    this.close()
    this.modal = document.createElement('div')
    this.modal.className = 'codex-overlay'
    this.modal.id = 'codex-modal'
    this.container.appendChild(this.modal)
    this.render()
  }

  close(): void {
    this.modal?.remove()
    this.modal = null
  }

  private render(): void {
    if (!this.modal) return

    this.modal.innerHTML = `
      <div class="codex-panel">
        <div class="codex-header">
          <h2 class="codex-title">Codex</h2>
          <button class="btn btn-small btn-secondary codex-close-btn" id="codex-close">Done</button>
        </div>

        <div class="codex-tabs">
          <button class="codex-tab ${this.activeTab === 'plants' ? 'codex-tab-active' : ''}" data-tab="plants">
            Plants
          </button>
          <button class="codex-tab ${this.activeTab === 'events' ? 'codex-tab-active' : ''}" data-tab="events">
            Events
          </button>
        </div>

        <div class="codex-body" id="codex-body">
          ${this.activeTab === 'plants' ? this.renderPlants() : this.renderEvents()}
        </div>
      </div>
    `

    // Tab switching
    this.modal.querySelectorAll('.codex-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = (tab as HTMLElement).dataset.tab as CodexTab
        this.render()
      })
    })

    // Close
    this.modal.querySelector('#codex-close')?.addEventListener('click', () => this.close())

    // Expandable event amplitudes
    this.modal.querySelectorAll('.codex-event-card[data-expand]').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('codex-event-expanded')
      })
    })
  }

  // ── Plants Tab ──────────────────────────────────────────────────────────

  private renderPlants(): string {
    const allPlants: (Plant | BadPlant)[] = [...PLANTS, ...BAD_PLANTS]
    allPlants.sort((a, b) => a.unlocksAtLevel - b.unlocksAtLevel)

    // Group by unlock level
    const byLevel: Record<number, (Plant | BadPlant)[]> = {}
    for (const p of allPlants) {
      if (!byLevel[p.unlocksAtLevel]) byLevel[p.unlocksAtLevel] = []
      byLevel[p.unlocksAtLevel].push(p)
    }

    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b)

    return levels.map(level => {
      const plants = byLevel[level]

      const items = plants.map(p => {
        const isBad = 'isBadPlant' in p
        const catColor = CATEGORY_COLORS[p.category] || '#ccc'
        return `
          <div class="codex-plant-card">
            <div class="codex-plant-icon" style="background: ${p.color}20;">
              ${plantImg(p.id, p.emoji, '44px')}
            </div>
            <div class="codex-plant-body">
              <div class="codex-plant-equiv">${p.subCategory} — ${p.realWorldEquivalent}</div>
              <div class="codex-plant-name">
                ${p.name}
                ${isBad ? '<span class="codex-badge-risky">Risky</span>' : ''}
                <span class="codex-plant-cat" style="background: ${catColor}20; color: ${catColor};">${p.category}</span>
              </div>
              <div class="codex-plant-tags">
                <span class="shop-tag" data-level="${p.riskLevel}">Risk: ${p.riskLevel}</span>
                <span class="shop-tag" data-level="${p.volatility}">Vol: ${p.volatility}</span>
                ${p.rebound ? '<span class="shop-tag" data-level="low">Rebounds</span>' : ''}
              </div>
              <div class="codex-plant-insight">${p.floraInsight}</div>
            </div>
          </div>
        `
      }).join('')

      return `
        <div class="codex-category">
          <div class="codex-category-header" style="border-left: 3px solid var(--pf-petrol);">
            Level ${level}
            <span class="codex-category-count">${plants.length}</span>
          </div>
          ${items}
        </div>
      `
    }).join('')
  }

  // ── Events Tab ──────────────────────────────────────────────────────────

  private renderEvents(): string {
    // Group by category
    const categoryOrder = ['CORPORATE', 'MACRO', 'CENTRAL BANKING', 'COMMODITIES', 'GEOPOLITICAL', 'TRADE', 'MARKET STRUCTURE']
    const grouped: Record<string, GameEvent[]> = {}
    for (const e of GAME_EVENTS) {
      if (!grouped[e.category]) grouped[e.category] = []
      grouped[e.category].push(e)
    }

    return categoryOrder
      .filter(cat => grouped[cat]?.length > 0)
      .map(cat => {
        const items = grouped[cat].map(e => this.renderEventCard(e)).join('')
        return `
          <div class="codex-category">
            <div class="codex-category-header" style="border-left: 3px solid var(--pf-petrol-light);">
              ${cat}
              <span class="codex-category-count">${grouped[cat].length}</span>
            </div>
            ${items}
          </div>
        `
      }).join('')
  }

  private renderEventCard(e: GameEvent): string {
    const levelsStr = e.appearsAtLevels.join(', ')

    let amplitudesHtml = ''
    if (e.twoPhase && e.phase1 && e.phase2) {
      amplitudesHtml = `
        <div class="codex-event-amplitudes">
          ${this.renderPhase('Phase 1', e.phase1)}
          ${this.renderPhase('Phase 2', e.phase2)}
        </div>
      `
    } else if (e.amplitudes) {
      amplitudesHtml = `
        <div class="codex-event-amplitudes">
          ${this.renderAmplitude('Light', e.amplitudes.light)}
          ${this.renderAmplitude('Moderate', e.amplitudes.moderate)}
          ${this.renderAmplitude('Severe', e.amplitudes.severe)}
        </div>
      `
    }

    const specialTags: string[] = []
    if (e.penaltyForOvertrading) specialTags.push('Overtrading penalty')
    if (e.panicSellPenalty) specialTags.push(`Panic sell: ${e.panicSellPenalty} pts`)
    if (e.holdBonusPoints) specialTags.push(`Hold bonus: +${e.holdBonusPoints} pts`)
    if (e.twoPhase) specialTags.push('Two-phase event')
    if (e.unlocksPlant) specialTags.push(`Unlocks: ${e.unlocksPlant}`)

    return `
      <div class="codex-event-card" data-expand>
        <div class="codex-event-header">
          <span class="codex-event-weather">${e.weatherEmoji}</span>
          <div class="codex-event-info">
            <div class="codex-event-name">${e.name}${e.variant ? ` (${e.variant})` : ''}</div>
            <div class="codex-event-levels">Levels: ${levelsStr}</div>
          </div>
          <span class="codex-event-chevron">&#9662;</span>
        </div>
        <div class="codex-event-learning">${e.learning}</div>
        ${specialTags.length > 0 ? `
          <div class="codex-event-special">
            ${specialTags.map(t => `<span class="codex-event-special-tag">${t}</span>`).join('')}
          </div>
        ` : ''}
        <div class="codex-event-hint">
          <span class="codex-hint-icon">🌿</span> ${e.floraHint}
        </div>
        ${amplitudesHtml}
      </div>
    `
  }

  private renderAmplitude(label: string, data: { label: string; emoji: string; headline: string; effects: Record<string, number> }): string {
    const effectEntries = Object.entries(data.effects)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val]) => {
        const pct = (val * 100).toFixed(0)
        const color = val > 0 ? 'var(--color-positive)' : val < 0 ? 'var(--color-negative)' : 'var(--text-muted)'
        return `<span class="codex-effect" style="color: ${color};">${key}: ${val > 0 ? '+' : ''}${pct}%</span>`
      })
      .join('')

    return `
      <div class="codex-amplitude">
        <div class="codex-amplitude-label">${data.emoji} ${label} — ${data.label}</div>
        <div class="codex-amplitude-headline">${data.headline}</div>
        <div class="codex-effects">${effectEntries}</div>
      </div>
    `
  }

  private renderPhase(label: string, data: { label: string; emoji: string; headline: string; effects: Record<string, number> }): string {
    return this.renderAmplitude(label, data)
  }
}
