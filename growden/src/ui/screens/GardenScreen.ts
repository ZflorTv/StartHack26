/**
 * GardenScreen — Main gameplay HUD
 *
 * Renders the top nav bar (level, flowers, score, drift meter), bottom
 * HUD (plant chips, portfolio bar, shop/event buttons), plant popover,
 * shop modal, and new-plant-unlock modal.
 */

import type { Portfolio, GameState, RiskProfile } from '../../types'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { RISK_PROFILES, GAME_CONFIG } from '../../constants/config'
import { plantImg } from '../../utils/plantImage'
import { CodexScreen } from './CodexScreen'
import { StatsScreen } from './StatsScreen'
import { darkModeToggleHtml, toggleDarkMode } from '../enhancements/DarkMode'
import { getHoldStreak } from '../enhancements/Achievements'
import { formatNumber } from '../enhancements/Typography'
import gsap from 'gsap'

export class GardenScreen {
  private container: HTMLElement
  private onNextEvent: () => void
  private onOpenShop: () => void
  private onTutorial: () => void
  private onHome: () => void
  private onSuspenseStart?: () => void
  private codex: CodexScreen
  private stats: StatsScreen
  private lastPortfolioValue: number = 10000

  constructor(
    container: HTMLElement,
    callbacks: {
      onNextEvent: () => void
      onOpenShop: () => void
      onTutorial: () => void
      onHome: () => void
      onSuspenseStart?: () => void
    },
    getState: () => Readonly<GameState>,
  ) {
    this.container = container
    this.onNextEvent = callbacks.onNextEvent
    this.onOpenShop = callbacks.onOpenShop
    this.onTutorial = callbacks.onTutorial
    this.onHome = callbacks.onHome
    this.onSuspenseStart = callbacks.onSuspenseStart
    this.codex = new CodexScreen(container)
    this.stats = new StatsScreen(container, getState)
  }

  render(data: {
    level: number
    maxLevel: number
    flowers: number
    score: number
    portfolio: Portfolio
    playerName: string
    riskProfile: RiskProfile | null
    flowerHistory?: Array<{level: number, value: number}>
  }): void {
    const flowerChange = data.flowers - GAME_CONFIG.STARTING_FLOWERS
    const changePercent = ((flowerChange / GAME_CONFIG.STARTING_FLOWERS) * 100).toFixed(1)
    const isPositive = flowerChange >= 0

    // Calculate portfolio drift from declared risk profile
    const driftHtml = this.renderDriftMeter(data.portfolio, data.riskProfile)

    // Build streak display
    const streak = getHoldStreak()
    const streakHtml = streak >= 2
      ? `<span class="streak-counter"><span class="streak-flame">🔥</span> ${streak}</span>`
      : ''

    this.container.innerHTML = `
      <!-- Nav Bar -->
      <nav class="nav">
        <div class="nav-logo">
          <a id="btn-home" class="nav-home-link"><img src="/assets/1LOGO.png" alt="Growden" class="nav-logo-img"> <span class="text-display" style="font-size: 17px;">Growden</span></a>
          <span class="nav-mode">LEVEL ${data.level}/${data.maxLevel}</span>
          <button class="btn-codex" id="btn-codex" title="Codex">📖</button>
          <button class="btn-codex" id="btn-stats" title="Performance">📊</button>
          ${darkModeToggleHtml()}
        </div>
        <div class="nav-stats">
          ${driftHtml}
          <div class="nav-stat">
            <span class="nav-stat-value">
              🌸 <span class="num portfolio-odometer" id="flowers-value">${formatNumber(data.flowers)}</span>
              <span class="portfolio-change" id="flowers-change" style="color: ${isPositive ? 'var(--color-positive)' : 'var(--color-negative)'}; font-size: 10px; margin-left: 4px;">
                ${isPositive ? '+' : ''}${changePercent}%
              </span>
            </span>
            ${data.flowerHistory && data.flowerHistory.length > 1 ? this.renderSparkline(data.flowerHistory, data.flowers) : ''}
            <span class="nav-stat-label">Flowers</span>
          </div>
          <div class="nav-stat">
            <span class="nav-stat-value"><span class="num" id="score-value">${data.score}</span> ${streakHtml}</span>
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

    // Animate flower odometer if value changed
    const odoEl = document.getElementById('flowers-value')
    if (odoEl && data.flowers !== this.lastPortfolioValue) {
      const start = this.lastPortfolioValue
      const end = data.flowers
      const obj = { val: start }
      gsap.to(obj, {
        val: end,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          odoEl.textContent = formatNumber(Math.round(obj.val))
        },
      })
      this.lastPortfolioValue = end
    }

    document.getElementById('btn-next-event')?.addEventListener('click', () => {
      const btn = document.getElementById('btn-next-event') as HTMLButtonElement
      if (!btn || btn.classList.contains('trembling')) return
      btn.classList.add('trembling')
      btn.disabled = true
      btn.textContent = '⛅ Incoming...'

      // ── Full 8-step suspense sequence (~2s) ──
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(btn, { x: 0 })
          btn.classList.remove('trembling')
          // Remove suspense overlay + countdown
          document.getElementById('suspense-dim')?.remove()
          document.getElementById('countdown-dots')?.remove()
          this.onNextEvent()
        },
      })

      // 1) Button tremble — shake for 1.2s
      tl.to(btn, {
        x: 3,
        duration: 0.05,
        repeat: 23,
        yoyo: true,
        ease: 'power1.inOut',
      }, 0)

      // 2) Screen dim — darken garden over 0.8s
      const dimOverlay = document.createElement('div')
      dimOverlay.id = 'suspense-dim'
      dimOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0);z-index:5;pointer-events:none;transition:none;'
      document.getElementById('ui-layer')?.appendChild(dimOverlay)
      tl.to(dimOverlay, { backgroundColor: 'rgba(0,0,0,0.35)', duration: 0.8, ease: 'power2.in' }, 0)

      // 3) Heartbeat pulse — portfolio value scale pulse
      const portfolioEl = document.getElementById('portfolio-value')
      if (portfolioEl) {
        tl.to(portfolioEl, { scale: 1.15, duration: 0.25, ease: 'power2.out' }, 0.2)
        tl.to(portfolioEl, { scale: 1, duration: 0.2, ease: 'power2.in' }, 0.45)
        tl.to(portfolioEl, { scale: 1.1, duration: 0.2, ease: 'power2.out' }, 0.7)
        tl.to(portfolioEl, { scale: 1, duration: 0.15, ease: 'power2.in' }, 0.9)
      }

      // 4) Vibration (mobile only)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200])
      }

      // 5 & 6) Plant sway + sky tint — delegate to UIManager via callback
      if (this.onSuspenseStart) {
        this.onSuspenseStart()
      }

      // 7) Quick blackout flash at t=1.4s (100ms)
      tl.to(dimOverlay, { backgroundColor: 'rgba(0,0,0,0.85)', duration: 0.05 }, 1.4)
      tl.to(dimOverlay, { backgroundColor: 'rgba(0,0,0,0.2)', duration: 0.1 }, 1.45)

      // 8) Countdown dots ". . ." appearing under button
      const dots = document.createElement('div')
      dots.id = 'countdown-dots'
      dots.style.cssText = 'position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:18px;letter-spacing:6px;color:var(--text-primary,#fff);white-space:nowrap;'
      btn.style.position = 'relative'
      btn.appendChild(dots)
      const dotChars = ['.', ' .', ' .']
      dotChars.forEach((dot, i) => {
        tl.call(() => { dots.textContent = (dots.textContent || '') + dot }, [], 0.3 + i * 0.35)
      })
    })
    document.getElementById('btn-home')?.addEventListener('click', () => this.onHome())
    document.getElementById('btn-shop')?.addEventListener('click', this.onOpenShop)
    document.getElementById('btn-codex')?.addEventListener('click', () => this.codex.open())
    document.getElementById('btn-stats')?.addEventListener('click', () => this.stats.open())
    document.getElementById('btn-dark-mode')?.addEventListener('click', () => {
      toggleDarkMode()
      // Re-render to update toggle icon
      this.render(data)
    })

    // Plant chip click → show info popover
    this.container.querySelectorAll('.garden-plant-chip[data-plant-id]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement
        const plantId = el.getAttribute('data-plant-id')!
        const allocation = Number(el.getAttribute('data-allocation') || 0)
        const total = Number(el.getAttribute('data-total') || 0)
        this.showPlantPopover(plantId, allocation, total, el)
      })
    })
  }

  private showPlantPopover(plantId: string, allocation: number, total: number, anchor: HTMLElement): void {
    // Remove existing popover
    document.getElementById('plant-popover')?.remove()

    const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
    if (!plant) return

    const pct = total > 0 ? Math.round((allocation / total) * 100) : 0
    const catColor = CATEGORY_COLORS[plant.category] || '#ccc'
    const isBad = 'isBadPlant' in plant

    const popover = document.createElement('div')
    popover.id = 'plant-popover'
    popover.className = 'plant-popover'
    popover.innerHTML = `
      <div class="plant-popover-header" style="border-left: 4px solid ${catColor}; padding-left: var(--space-sm);">
        ${plantImg(plantId, plant.emoji, '40px')}
        <div>
          <div style="font-weight: 700; font-size: 14px;">${plant.category}${isBad ? ' (risky)' : ''} — ${plant.realWorldEquivalent}</div>
          <div style="font-size: 12px; color: var(--color-muted);">${plant.name}</div>
        </div>
      </div>
      <div class="plant-popover-stats">
        <div class="plant-popover-stat">
          <span style="color: var(--color-muted); font-size: 11px;">Allocation</span>
          <span style="font-weight: 700;">${pct}%</span>
        </div>
        <div class="plant-popover-stat">
          <span style="color: var(--color-muted); font-size: 11px;">Risk</span>
          <span style="font-weight: 700;">${plant.riskLevel}</span>
        </div>
        <div class="plant-popover-stat">
          <span style="color: var(--color-muted); font-size: 11px;">Volatility</span>
          <span style="font-weight: 700;">${plant.volatility}</span>
        </div>
      </div>
      <div style="font-size: 12px; color: var(--color-muted); font-style: italic; margin-top: var(--space-sm);">
        ${plant.floraInsight}
      </div>
    `

    // Position above the chip
    const rect = anchor.getBoundingClientRect()
    popover.style.position = 'fixed'
    popover.style.bottom = `${window.innerHeight - rect.top + 8}px`
    popover.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 280))}px`
    popover.style.width = '260px'

    document.getElementById('ui-layer')!.appendChild(popover)

    // Dismiss on tap outside
    const dismiss = (e: Event) => {
      if (!popover.contains(e.target as Node)) {
        popover.remove()
        document.removeEventListener('pointerdown', dismiss)
      }
    }
    // Delay listener so the current tap doesn't immediately dismiss
    requestAnimationFrame(() => {
      document.addEventListener('pointerdown', dismiss)
    })
  }

  private renderPlantChips(portfolio: Portfolio): string {
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    return Object.entries(portfolio)
      .filter(([_, v]) => v > 0)
      .map(([plantId, allocation]) => {
        const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
        if (!plant) return ''
        const catColor = CATEGORY_COLORS[plant.category] || '#ccc'
        const pct = total > 0 ? Math.round((allocation / total) * 100) : 0
        return `
          <div class="garden-plant-chip" style="border-left: 3px solid ${catColor}; cursor: pointer;"
               data-plant-id="${plantId}" data-allocation="${allocation}" data-total="${total}">
            ${plantImg(plantId, plant.emoji, '20px')} ${plant.name.split(' ')[0]} <span class="text-muted">${pct}%</span>
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
        const name = plant?.name || plantId
        const rounded = Math.round(pct)
        return `<div class="portfolio-bar-segment" style="width: ${pct}%; background: ${color};" title="${name}: ${rounded}%"><span class="portfolio-bar-label">${name} ${rounded}%</span></div>`
      })
      .join('')

    return `<div class="portfolio-bar">${segments}</div>`
  }

  showShopModal(
    availablePlants: Array<{
      id: string; name: string; emoji: string; category: string; color: string; cost: number; sellValue: number
      riskLevel: string; volatility: string; floraInsight: string; realWorldEquivalent: string
    }>,
    flowers: number,
    portfolio: Portfolio,
    onBuy: (plantId: string) => number,    // returns updated flowers
    onSell: (plantId: string) => number,  // returns updated flowers
    onClose: () => void,
  ): void {
    let currentFlowers = flowers
    const currentPortfolio = { ...portfolio }
    let compareMode = false

    const modal = document.createElement('div')
    modal.className = 'event-overlay'
    modal.id = 'shop-modal'
    this.container.appendChild(modal)

    const renderShop = () => {
      const categories = ['equity', 'bonds', 'cash', 'commodities', 'crypto']
      const grouped: Record<string, typeof availablePlants> = {}
      for (const cat of categories) grouped[cat] = []
      for (const p of availablePlants) {
        if (grouped[p.category]) grouped[p.category].push(p)
      }

      const plantCards = categories
        .filter(cat => grouped[cat].length > 0)
        .map(cat => {
          const catColor = CATEGORY_COLORS[cat] || '#ccc'
          const items = grouped[cat].map(p => {
            const owned = currentPortfolio[p.id] || 0
            const totalAlloc = Object.values(currentPortfolio).reduce((s, v) => s + v, 0)
            const pct = totalAlloc > 0 ? Math.round((owned / totalAlloc) * 100) : 0
            const canBuy = currentFlowers >= p.cost
            const canSell = owned > 0
            return `
              <div class="shop-item ${!canBuy && !canSell ? 'shop-item-disabled' : ''}" data-plant-id="${p.id}">
                <div class="shop-item-main">
                  <div class="shop-item-icon" style="background: ${p.color}20;">
                    ${plantImg(p.id, p.emoji, '36px')}
                  </div>
                  <div class="shop-item-info">
                    <div class="shop-item-meta">${p.realWorldEquivalent}</div>
                    <div class="shop-item-name">${p.name}${owned > 0 ? ` <span class="shop-owned-badge">${pct}%</span>` : ''}</div>
                    <div class="shop-item-tags">
                      <span class="shop-tag" data-level="${p.riskLevel}">Risk: ${p.riskLevel}</span>
                      <span class="shop-tag" data-level="${p.volatility}">Vol: ${p.volatility}</span>
                      <span class="shop-tag shop-tag-price">🌸 ${p.cost}</span>
                    </div>
                  </div>
                </div>
                <div class="shop-item-buttons">
                  <button class="btn btn-small btn-sell shop-sell-btn"
                          data-sell="${p.id}" ${canSell ? '' : 'disabled'}
                          title="Sell for ${p.sellValue} flowers">
                    −${p.sellValue}
                  </button>
                  <button class="btn btn-small ${canBuy ? 'btn-primary' : 'btn-secondary'} shop-buy-btn"
                          data-buy="${p.id}" ${canBuy ? '' : 'disabled'}>
                    🌸 ${p.cost}
                  </button>
                </div>
              </div>
            `
          }).join('')

          return `
            <div class="shop-category">
              <div class="shop-category-header" style="border-left: 3px solid ${catColor};">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
              </div>
              ${items}
            </div>
          `
        }).join('')

      modal.innerHTML = `
        <div class="shop-modal-card">
          <div class="shop-header">
            <h2 class="shop-title">Plant Shop</h2>
            <div class="shop-flowers" id="shop-flowers">🌸 ${currentFlowers}</div>
            <button class="btn btn-secondary btn-small" id="btn-compare-toggle">📊 Compare</button>
          </div>

          <div class="shop-list" id="shop-list">
            ${plantCards}
          </div>
          <div id="shop-compare-container" style="display: none;">
            ${this.renderComparisonTable(availablePlants, currentPortfolio)}
          </div>

          <button class="btn btn-primary shop-close-btn" id="btn-close-shop">Done</button>
        </div>
      `

      // Wire buy buttons
      modal.querySelectorAll('[data-buy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const plantId = (e.currentTarget as HTMLElement).getAttribute('data-buy')!
          currentFlowers = onBuy(plantId)
          currentPortfolio[plantId] = (currentPortfolio[plantId] || 0) + 10
          this.updateShopItem(modal, plantId, currentFlowers, currentPortfolio, availablePlants)
        })
      })

      // Wire sell buttons
      modal.querySelectorAll('[data-sell]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const plantId = (e.currentTarget as HTMLElement).getAttribute('data-sell')!
          if ((currentPortfolio[plantId] || 0) > 0) {
            currentFlowers = onSell(plantId)
            currentPortfolio[plantId] -= 10
            if (currentPortfolio[plantId] <= 0) delete currentPortfolio[plantId]
            this.updateShopItem(modal, plantId, currentFlowers, currentPortfolio, availablePlants)
          }
        })
      })

      // Close button
      document.getElementById('btn-close-shop')?.addEventListener('click', () => {
        onClose()
        modal.remove()
      })

      // Compare toggle
      document.getElementById('btn-compare-toggle')?.addEventListener('click', () => {
        compareMode = !compareMode
        const shopList = document.getElementById('shop-list')
        const compareContainer = document.getElementById('shop-compare-container')
        const toggleBtn = document.getElementById('btn-compare-toggle')
        if (shopList && compareContainer && toggleBtn) {
          if (compareMode) {
            shopList.style.display = 'none'
            compareContainer.innerHTML = this.renderComparisonTable(availablePlants, currentPortfolio)
            compareContainer.style.display = 'block'
            toggleBtn.textContent = '🃏 Cards'
          } else {
            shopList.style.display = ''
            compareContainer.style.display = 'none'
            toggleBtn.textContent = '📊 Compare'
          }
        }
      })
    }

    renderShop()
  }

  /** Update shop in-place after a buy or sell — no full re-render, just targeted changes */
  private updateShopItem(
    modal: HTMLElement,
    changedPlantId: string,
    flowers: number,
    portfolio: Record<string, number>,
    allPlants: Array<{ id: string; cost: number }>,
  ): void {
    // Update flower count
    const flowersEl = modal.querySelector('#shop-flowers')
    if (flowersEl) flowersEl.textContent = `🌸 ${flowers}`

    const totalAlloc = Object.values(portfolio).reduce((s, v) => s + v, 0)

    // Update badges on ALL items (percentages shift when any item changes)
    allPlants.forEach(p => {
      const row = modal.querySelector(`.shop-item[data-plant-id="${p.id}"]`) as HTMLElement | null
      if (!row) return
      const owned = portfolio[p.id] || 0
      const pct = totalAlloc > 0 ? Math.round((owned / totalAlloc) * 100) : 0
      const nameEl = row.querySelector('.shop-item-name')
      if (nameEl) {
        const badge = nameEl.querySelector('.shop-owned-badge')
        if (owned > 0) {
          if (badge) {
            badge.textContent = `${pct}%`
          } else {
            nameEl.insertAdjacentHTML('beforeend', ` <span class="shop-owned-badge">${pct}%</span>`)
          }
        } else if (badge) {
          badge.remove()
        }
      }
    })

    // Bounce animation on the changed row only
    const changedRow = modal.querySelector(`.shop-item[data-plant-id="${changedPlantId}"]`) as HTMLElement | null
    if (changedRow) {
      changedRow.classList.remove('shop-item-bounce')
      void changedRow.offsetWidth
      changedRow.classList.add('shop-item-bounce')
    }

    // Update buy + sell button states on ALL items
    allPlants.forEach(p => {
      const row = modal.querySelector(`.shop-item[data-plant-id="${p.id}"]`) as HTMLElement | null
      if (!row) return

      const buyBtn = row.querySelector('[data-buy]') as HTMLButtonElement | null
      const sellBtn = row.querySelector('[data-sell]') as HTMLButtonElement | null
      const canBuy = flowers >= p.cost
      const canSell = (portfolio[p.id] || 0) > 0

      if (buyBtn) {
        buyBtn.disabled = !canBuy
        buyBtn.classList.toggle('btn-primary', canBuy)
        buyBtn.classList.toggle('btn-secondary', !canBuy)
      }
      if (sellBtn) {
        sellBtn.disabled = !canSell
      }

      // Grey out entire row only if can't buy AND can't sell
      row.classList.toggle('shop-item-disabled', !canBuy && !canSell)
    })
  }

  showNewPlantsModal(
    plants: Array<{
      id: string; name: string; emoji: string; category: string; color: string; cost: number
      riskLevel: string; volatility: string; floraInsight: string; realWorldEquivalent: string
    }>,
    level: number,
    onContinue: () => void,
  ): void {
    const plantCards = plants.map(p => {
      const catColor = CATEGORY_COLORS[p.category] || '#ccc'
      return `
        <div class="unlock-plant-card">
          <div class="unlock-plant-icon" style="background: ${p.color}20;">
            ${plantImg(p.id, p.emoji, '44px')}
          </div>
          <div class="unlock-plant-body">
            <div class="unlock-plant-equiv" style="color: ${catColor};">${p.category} — ${p.realWorldEquivalent}</div>
            <div class="unlock-plant-name">${p.name}</div>
            <div class="unlock-plant-stats">
              <span class="shop-tag" data-level="${p.riskLevel}">Risk: ${p.riskLevel}</span>
              <span class="shop-tag" data-level="${p.volatility}">Vol: ${p.volatility}</span>
              <span class="shop-tag shop-tag-price">🌸 ${p.cost}</span>
            </div>
            <div class="unlock-plant-insight">${p.floraInsight}</div>
          </div>
        </div>
      `
    }).join('')

    const modal = document.createElement('div')
    modal.className = 'event-overlay'
    modal.id = 'unlock-modal'
    modal.innerHTML = `
      <div class="unlock-modal-card">
        <div class="unlock-header">
          <div class="unlock-level-badge">Level ${level}</div>
          <h2 class="unlock-title">New Plants Unlocked!</h2>
          <p class="unlock-subtitle">${plants.length} new ${plants.length === 1 ? 'plant is' : 'plants are'} now available in the shop</p>
        </div>

        <div class="unlock-list">
          ${plantCards}
        </div>

        <button class="btn btn-primary unlock-continue-btn" id="btn-unlock-continue">Let's Grow!</button>
      </div>
    `

    this.container.appendChild(modal)

    document.getElementById('btn-unlock-continue')?.addEventListener('click', () => {
      modal.remove()
      onContinue()
    })
  }

  /** Drift meter: how far the player's allocation has drifted from their declared risk profile */
  private renderDriftMeter(portfolio: Portfolio, riskProfile: RiskProfile | null): string {
    if (!riskProfile) return ''

    const target = RISK_PROFILES[riskProfile].suggestedAllocation
    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    const total = entries.reduce((s, [_, v]) => s + v, 0)
    if (total === 0) return ''

    // Sum allocation per category
    const actual: Record<string, number> = {}
    for (const [plantId, alloc] of entries) {
      const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
      if (!plant) continue
      actual[plant.category] = (actual[plant.category] || 0) + (alloc / total) * 100
    }

    // Calculate drift (sum of absolute differences / 2, max = 100)
    const allCats = new Set([...Object.keys(target), ...Object.keys(actual)])
    let drift = 0
    for (const cat of allCats) {
      drift += Math.abs((actual[cat] || 0) - (target[cat] || 0))
    }
    drift = Math.min(100, Math.round(drift / 2))

    const color = drift <= 15 ? 'var(--color-positive)' : drift <= 35 ? 'var(--color-warning)' : 'var(--color-negative)'
    const label = drift <= 15 ? 'On track' : drift <= 35 ? 'Drifting' : 'Off plan'

    return `
      <div class="nav-stat drift-meter" title="Portfolio drift from ${RISK_PROFILES[riskProfile].name} profile">
        <span class="nav-stat-value" style="color: ${color}; font-size: 11px;">${label}</span>
        <div class="drift-bar">
          <div class="drift-bar-fill" style="width: ${100 - drift}%; background: ${color};"></div>
        </div>
        <span class="nav-stat-label">Drift</span>
      </div>
    `
  }

  private formatOdometer(value: number): string {
    return Math.round(value).toLocaleString('en-US')
  }

  private renderSparkline(portfolioHistory: Array<{level: number, value: number}>, currentValue: number): string {
    const values = [...portfolioHistory.map(h => h.value), currentValue]
    const count = values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const points = values.map((v, i) => {
      const x = i * (50 / (count - 1))
      const y = 20 - ((v - min) / range) * 20
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    const isNegative = values[values.length - 1] < values[0]
    const strokeColor = isNegative ? 'var(--color-negative)' : 'var(--color-positive)'

    return `<svg class="sparkline" width="50" height="20" viewBox="0 0 50 20"><polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  }

  flashPlantChipEffects(effects: Record<string, number>): void {
    this.container.querySelectorAll('.garden-plant-chip[data-plant-id]').forEach(chip => {
      const el = chip as HTMLElement
      const plantId = el.getAttribute('data-plant-id')!
      const effect = effects[plantId]
      if (effect === undefined || Math.abs(effect) < 0.01) return

      const isPositive = effect >= 0
      const color = isPositive ? 'var(--color-positive)' : 'var(--color-negative)'

      // Create effect label
      const span = document.createElement('span')
      span.textContent = `${isPositive ? '+' : ''}${effect.toFixed(1)}%`
      span.style.cssText = `color: ${color}; font-size: 10px; font-weight: 700; margin-left: 4px; display: inline-block;`
      el.appendChild(span)

      gsap.fromTo(span, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 })
      gsap.to(span, { opacity: 0, delay: 2, duration: 0.4, onComplete: () => span.remove() })

      // Flash chip background
      const bgColor = isPositive ? 'rgba(76, 175, 80, 0.25)' : 'rgba(244, 67, 54, 0.25)'
      gsap.fromTo(el, { backgroundColor: bgColor }, { backgroundColor: 'transparent', duration: 1 })
    })
  }

  showLastEventBanner(eventName: string, action: string, impactPercent: number): void {
    // Remove existing banner
    document.getElementById('last-event-banner')?.remove()

    const banner = document.createElement('div')
    banner.className = 'last-event-banner'
    banner.id = 'last-event-banner'
    banner.innerHTML = `
      <span class="last-event-icon">📰</span>
      <span class="last-event-text"><strong>${eventName}</strong> — You chose to <em>${action.replace('_', ' ')}</em></span>
      <span class="last-event-impact" style="color: ${impactPercent >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'};">
        ${impactPercent >= 0 ? '+' : ''}${impactPercent.toFixed(1)}%
      </span>
    `
    banner.style.cssText = 'position: fixed; top: 58px; left: 0; width: 100%; z-index: 40; display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--bg-card, #1a1a2e); border-bottom: 1px solid var(--border-color, #333); cursor: pointer;'

    document.getElementById('ui-layer')?.appendChild(banner)

    // Animate entry
    gsap.fromTo(banner, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      gsap.to(banner, { opacity: 0, y: -20, duration: 0.3, onComplete: () => banner.remove() })
    }, 5000)

    // Dismiss on click
    banner.addEventListener('click', () => {
      clearTimeout(dismissTimer)
      gsap.to(banner, { opacity: 0, y: -20, duration: 0.3, onComplete: () => banner.remove() })
    })
  }

  private renderComparisonTable(
    plants: Array<{
      id: string; name: string; emoji: string; category: string;
      riskLevel: string; volatility: string; cost: number; sellValue: number
    }>,
    portfolio: Portfolio,
  ): string {
    return `
      <div class="shop-compare-table">
        <table>
          <thead>
            <tr>
              <th>Plant</th>
              <th>Category</th>
              <th>Risk</th>
              <th>Vol</th>
              <th>Cost</th>
              <th>Sell</th>
              <th>Owned</th>
            </tr>
          </thead>
          <tbody>
            ${plants.map(p => {
              const owned = portfolio[p.id] || 0
              const totalAlloc = Object.values(portfolio).reduce((s, v) => s + v, 0)
              const pct = totalAlloc > 0 ? Math.round((owned / totalAlloc) * 100) : 0
              return `<tr>
                <td>${p.emoji} ${p.name.split(' ')[0]}</td>
                <td><span style="color: ${CATEGORY_COLORS[p.category] || '#ccc'}">${p.category}</span></td>
                <td>${p.riskLevel}</td>
                <td>${p.volatility}</td>
                <td>🌸${p.cost}</td>
                <td>${p.sellValue}</td>
                <td>${owned > 0 ? pct + '%' : '—'}</td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
