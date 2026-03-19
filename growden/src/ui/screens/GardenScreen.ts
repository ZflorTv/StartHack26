import type { Portfolio } from '../../types'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import { CATEGORY_COLORS } from '../../constants/colors'

export class GardenScreen {
  private container: HTMLElement
  private onNextEvent: () => void
  private onOpenShop: () => void
  private onTutorial: () => void

  constructor(
    container: HTMLElement,
    callbacks: {
      onNextEvent: () => void
      onOpenShop: () => void
      onTutorial: () => void
    }
  ) {
    this.container = container
    this.onNextEvent = callbacks.onNextEvent
    this.onOpenShop = callbacks.onOpenShop
    this.onTutorial = callbacks.onTutorial
  }

  render(data: {
    level: number
    maxLevel: number
    flowers: number
    score: number
    portfolioValue: number
    portfolio: Portfolio
    playerName: string
  }): void {
    const portfolioChange = data.portfolioValue - 10000
    const changePercent = ((portfolioChange / 10000) * 100).toFixed(1)
    const isPositive = portfolioChange >= 0

    this.container.innerHTML = `
      <!-- Nav Bar -->
      <nav class="nav">
        <div class="nav-logo">
          🌱 Growden
          <span class="nav-mode">LEVEL ${data.level}/${data.maxLevel}</span>
        </div>
        <div class="nav-stats">
          <div class="nav-stat">
            <span class="nav-stat-value">🌸 ${data.flowers}</span>
            <span class="nav-stat-label">Flowers</span>
          </div>
          <div class="nav-stat">
            <span class="nav-stat-value" style="color: ${isPositive ? 'var(--color-positive)' : 'var(--color-negative)'};">
              ${isPositive ? '+' : ''}${changePercent}%
            </span>
            <span class="nav-stat-label">Portfolio</span>
          </div>
          <div class="nav-stat">
            <span class="nav-stat-value">${data.score}</span>
            <span class="nav-stat-label">Score</span>
          </div>
        </div>
      </nav>

      <!-- Bottom HUD -->
      <div class="garden-hud">
        <div class="garden-hud-inner">
          <div class="garden-plants-bar">
            ${this.renderPlantChips(data.portfolio)}
          </div>
          <div style="display: flex; gap: var(--space-sm);">
            <button class="btn btn-secondary btn-small" id="btn-shop">🌸 Shop</button>
            <button class="btn btn-primary btn-small" id="btn-next-event">⛅ Next Event</button>
          </div>
        </div>

        <!-- Portfolio allocation bar -->
        <div style="margin-top: var(--space-sm);">
          ${this.renderPortfolioBar(data.portfolio)}
        </div>
      </div>
    `

    document.getElementById('btn-next-event')?.addEventListener('click', this.onNextEvent)
    document.getElementById('btn-shop')?.addEventListener('click', this.onOpenShop)
  }

  private renderPlantChips(portfolio: Portfolio): string {
    return Object.entries(portfolio)
      .filter(([_, v]) => v > 0)
      .map(([plantId, allocation]) => {
        const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
        if (!plant) return ''
        const catColor = CATEGORY_COLORS[plant.category] || '#ccc'
        return `
          <div class="garden-plant-chip" style="border-left: 3px solid ${catColor};">
            ${plant.emoji} ${plant.name} <span class="text-muted">${allocation}%</span>
          </div>
        `
      })
      .join('')
  }

  private renderPortfolioBar(portfolio: Portfolio): string {
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    if (total === 0) return '<div class="portfolio-bar"></div>'

    const segments = Object.entries(portfolio)
      .filter(([_, v]) => v > 0)
      .map(([plantId, allocation]) => {
        const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
        const color = plant ? CATEGORY_COLORS[plant.category] || '#ccc' : '#ccc'
        const pct = (allocation / total) * 100
        return `<div class="portfolio-bar-segment" style="width: ${pct}%; background: ${color};" title="${plant?.name || plantId}: ${Math.round(pct)}%"></div>`
      })
      .join('')

    return `<div class="portfolio-bar">${segments}</div>`
  }

  showShopModal(
    availablePlants: Array<{ id: string; name: string; emoji: string; category: string; color: string; cost: number }>,
    flowers: number,
    onBuy: (plantId: string) => void,
    onClose: () => void,
  ): void {
    const plantCards = availablePlants.map(p => {
      const canAfford = flowers >= p.cost
      return `
        <div class="plant-card ${canAfford ? '' : 'text-muted'}" data-plant-id="${p.id}" style="${canAfford ? '' : 'opacity: 0.5;'}">
          <div class="plant-icon" style="background: ${p.color}20;">
            ${p.emoji}
          </div>
          <div class="plant-info">
            <div class="plant-name">${p.name}</div>
            <div class="plant-desc">${p.category}</div>
          </div>
          <button class="btn btn-small ${canAfford ? 'btn-primary' : 'btn-secondary'}"
                  ${canAfford ? '' : 'disabled'}
                  data-buy="${p.id}">
            🌸 ${p.cost}
          </button>
        </div>
      `
    }).join('')

    const modal = document.createElement('div')
    modal.className = 'event-overlay'
    modal.id = 'shop-modal'
    modal.innerHTML = `
      <div class="event-card" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
        <h2 class="text-h2 mb-sm">🌸 Plant Shop</h2>
        <p class="text-body text-muted mb-lg">Flowers available: <strong>${flowers}</strong></p>

        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${plantCards}
        </div>

        <button class="btn btn-secondary mt-lg w-full" id="btn-close-shop">Close</button>
      </div>
    `

    this.container.appendChild(modal)

    // Buy handlers
    modal.querySelectorAll('[data-buy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plantId = (e.currentTarget as HTMLElement).getAttribute('data-buy')!
        onBuy(plantId)
        modal.remove()
      })
    })

    document.getElementById('btn-close-shop')?.addEventListener('click', () => {
      onClose()
      modal.remove()
    })
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
