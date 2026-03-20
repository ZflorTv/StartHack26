/* ── PLANT DETAIL DRAWER ──
 * Slide-up drawer shown when tapping a plant on the island.
 * Shows real financial statistics, historical performance, and event sensitivity.
 */

import { gsap } from 'gsap'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import { CATEGORY_COLORS } from '../../constants/colors'
import { plantImg } from '../../utils/plantImage'
import type { Plant, BadPlant } from '../../types'

/** Real-world financial reference data per realWorldEquivalent / subCategory */
const REAL_STATS: Record<string, {
  ticker: string
  benchmark: string
  annualReturn5y: string
  annualReturn10y: string
  ytd: string
  maxDrawdown: string
  sharpe: string
  dividend?: string
  marketCap?: string
  expenseRatio?: string
  description: string
}> = {
  // EQUITY
  'Tech Stocks': {
    ticker: 'QQQ / NASDAQ-100',
    benchmark: 'NASDAQ Composite',
    annualReturn5y: '+18.4%',
    annualReturn10y: '+16.2%',
    ytd: '+12.8%',
    maxDrawdown: '-33% (2022)',
    sharpe: '0.82',
    description: 'US tech stocks have been the strongest growth engine of the last decade, led by mega-caps like Apple, Microsoft, and NVIDIA. High returns come with sharp corrections.',
  },
  'Healthcare Stocks': {
    ticker: 'XLV / S&P Health Care',
    benchmark: 'S&P 500 Healthcare',
    annualReturn5y: '+9.1%',
    annualReturn10y: '+11.3%',
    ytd: '+4.2%',
    maxDrawdown: '-15% (2022)',
    sharpe: '0.71',
    dividend: '~1.5%',
    description: 'Healthcare is a defensive sector — people need medicine regardless of the economy. Aging populations drive long-term structural demand.',
  },
  'Energy Stocks': {
    ticker: 'XLE / S&P Energy',
    benchmark: 'S&P 500 Energy',
    annualReturn5y: '+14.6%',
    annualReturn10y: '+4.8%',
    ytd: '-1.2%',
    maxDrawdown: '-62% (2020)',
    sharpe: '0.45',
    dividend: '~3.2%',
    description: 'Energy stocks are highly cyclical. They surged post-COVID but crashed during the 2020 oil price war. Oil prices drive everything.',
  },
  'Financial Stocks': {
    ticker: 'XLF / S&P Financials',
    benchmark: 'S&P 500 Financials',
    annualReturn5y: '+10.2%',
    annualReturn10y: '+10.8%',
    ytd: '+6.1%',
    maxDrawdown: '-24% (2020)',
    sharpe: '0.58',
    dividend: '~1.8%',
    description: 'Banks profit from higher interest rates through wider lending margins. They suffer during recessions when loan defaults spike.',
  },
  // BONDS
  'US Treasury Bonds': {
    ticker: 'TLT / iShares 20+ Year Treasury',
    benchmark: 'Bloomberg US Treasury Index',
    annualReturn5y: '-4.2%',
    annualReturn10y: '+0.8%',
    ytd: '-2.1%',
    maxDrawdown: '-48% (2020-2023)',
    sharpe: '-0.12',
    dividend: '~4.3%',
    description: 'Treasuries are the safest bonds in the world but suffered historic losses during 2022-2023 rate hikes. They rally when the Fed cuts rates.',
  },
  'Investment-Grade Corporate Bonds': {
    ticker: 'LQD / iShares IG Corp Bond',
    benchmark: 'Bloomberg US Corp Bond Index',
    annualReturn5y: '-0.5%',
    annualReturn10y: '+2.1%',
    ytd: '+0.8%',
    maxDrawdown: '-22% (2022)',
    sharpe: '0.15',
    dividend: '~4.8%',
    description: 'IG corporate bonds pay more than Treasuries in exchange for taking credit risk. Companies like Apple and Microsoft issue these.',
  },
  'High-Yield Corporate Bonds': {
    ticker: 'HYG / iShares High Yield Corp',
    benchmark: 'Bloomberg US HY Index',
    annualReturn5y: '+3.2%',
    annualReturn10y: '+3.8%',
    ytd: '+2.1%',
    maxDrawdown: '-20% (2020)',
    sharpe: '0.38',
    dividend: '~6.5%',
    description: 'High-yield bonds (aka "junk bonds") offer higher coupon payments but carry significant default risk during recessions.',
  },
  'Emerging Market Bonds': {
    ticker: 'EMB / iShares J.P. Morgan EM Bond',
    benchmark: 'J.P. Morgan EMBI Global',
    annualReturn5y: '+0.8%',
    annualReturn10y: '+1.5%',
    ytd: '+1.9%',
    maxDrawdown: '-25% (2022)',
    sharpe: '0.10',
    dividend: '~5.2%',
    description: 'EM bonds offer higher yields but carry currency risk and political instability. When the US dollar strengthens, EM debt gets crushed.',
  },
  // CASH
  'US Dollar Cash': {
    ticker: 'DXY (Dollar Index)',
    benchmark: 'US Dollar Index',
    annualReturn5y: '+1.8%',
    annualReturn10y: '+1.2%',
    ytd: '-3.4%',
    maxDrawdown: '-13% (2020)',
    sharpe: '0.22',
    description: 'Cash earns the risk-free rate — currently ~4.5% in money market funds. It loses purchasing power to inflation over time but is the ultimate safe haven.',
  },
  'Swiss Franc Cash': {
    ticker: 'USD/CHF',
    benchmark: 'Swiss Franc Index',
    annualReturn5y: '+2.4%',
    annualReturn10y: '+1.6%',
    ytd: '+5.2%',
    maxDrawdown: '-8% (2022)',
    sharpe: '0.35',
    description: 'The Swiss franc is one of the world\'s most stable currencies. Switzerland\'s political neutrality and banking tradition make CHF a crisis safe-haven.',
  },
  'Euro Cash': {
    ticker: 'EUR/USD',
    benchmark: 'Euro Index',
    annualReturn5y: '-0.8%',
    annualReturn10y: '-1.2%',
    ytd: '+4.1%',
    maxDrawdown: '-14% (2022)',
    sharpe: '0.05',
    description: 'The euro is the second most-held reserve currency globally. ECB monetary policy and eurozone economic health drive its value.',
  },
  'Japanese Yen Cash': {
    ticker: 'USD/JPY',
    benchmark: 'Yen Index',
    annualReturn5y: '-5.8%',
    annualReturn10y: '-2.1%',
    ytd: '+4.6%',
    maxDrawdown: '-34% (2021-2024)',
    sharpe: '-0.15',
    description: 'The yen is a classic "crisis currency" — it surges during market panics as carry trades unwind. Japan\'s ultra-low rates make it a funding currency.',
  },
  // COMMODITIES
  'Gold': {
    ticker: 'GLD / XAUUSD',
    benchmark: 'Gold Spot Price',
    annualReturn5y: '+12.8%',
    annualReturn10y: '+8.6%',
    ytd: '+14.2%',
    maxDrawdown: '-18% (2022)',
    sharpe: '0.65',
    description: 'Gold is the ultimate store of value — it has held purchasing power for 5,000 years. Central bank buying and geopolitical fear drive prices.',
  },
  'Crude Oil': {
    ticker: 'CL / WTI Crude',
    benchmark: 'WTI Crude Oil Futures',
    annualReturn5y: '+8.4%',
    annualReturn10y: '+2.1%',
    ytd: '-5.8%',
    maxDrawdown: '-72% (2020)',
    sharpe: '0.25',
    description: 'Oil prices are driven by OPEC supply decisions, global demand, and geopolitical tensions. Extreme volatility — prices went negative in April 2020.',
  },
  'Agricultural Commodities (Wheat)': {
    ticker: 'WEAT / Wheat Futures',
    benchmark: 'Chicago SRW Wheat',
    annualReturn5y: '+2.5%',
    annualReturn10y: '-1.8%',
    ytd: '-8.4%',
    maxDrawdown: '-45% (2023)',
    sharpe: '0.08',
    description: 'Wheat prices spike during supply shocks — war, drought, and export bans. The Russia-Ukraine war sent wheat to all-time highs in 2022.',
  },
  'Industrial Metals (Copper)': {
    ticker: 'COPX / Copper Futures',
    benchmark: 'LME Copper Spot',
    annualReturn5y: '+11.2%',
    annualReturn10y: '+5.4%',
    ytd: '+8.1%',
    maxDrawdown: '-28% (2022)',
    sharpe: '0.48',
    description: 'Copper is called "Dr. Copper" because its price predicts economic health. Green energy and EVs are driving structural demand growth.',
  },
  // CRYPTO
  'Bitcoin (BTC)': {
    ticker: 'BTC-USD',
    benchmark: 'Bitcoin',
    annualReturn5y: '+58.2%',
    annualReturn10y: '+72.4%',
    ytd: '+2.8%',
    maxDrawdown: '-77% (2022)',
    sharpe: '0.92',
    marketCap: '~$1.3T',
    description: 'Bitcoin is the original cryptocurrency and largest by market cap. It halves its issuance every ~4 years, creating cyclical bull runs.',
  },
  'Ethereum (ETH)': {
    ticker: 'ETH-USD',
    benchmark: 'Ethereum',
    annualReturn5y: '+42.6%',
    annualReturn10y: 'N/A (launched 2015)',
    ytd: '-18.5%',
    maxDrawdown: '-82% (2022)',
    sharpe: '0.78',
    marketCap: '~$310B',
    description: 'Ethereum powers smart contracts and DeFi. Its transition to Proof of Stake made it deflationary. Second largest crypto by market cap.',
  },
  'Solana (SOL)': {
    ticker: 'SOL-USD',
    benchmark: 'Solana',
    annualReturn5y: '+120%',
    annualReturn10y: 'N/A (launched 2020)',
    ytd: '-32.4%',
    maxDrawdown: '-96% (2022)',
    sharpe: '0.65',
    marketCap: '~$75B',
    description: 'Solana is the fastest major blockchain — ~400ms block times. It crashed 96% during the FTX collapse but staged a dramatic comeback in 2023-24.',
  },
  'Stablecoins (USDC/USDT)': {
    ticker: 'USDC / USDT',
    benchmark: '$1.00 peg',
    annualReturn5y: '~4.5% (via lending)',
    annualReturn10y: 'N/A',
    ytd: '0%',
    maxDrawdown: '-8% (USDC depeg, Mar 2023)',
    sharpe: 'N/A',
    marketCap: '~$185B combined',
    description: 'Stablecoins maintain a 1:1 peg to the US dollar. They\'re used as crypto "cash" for trading and earning yield via DeFi lending protocols.',
  },
}

/** Event sensitivity labels */
const EVENT_LABELS: Record<string, string> = {
  bull_market: 'Bull Market',
  market_crash: 'Market Crash',
  fed_rate_hike: 'Rate Hike',
  fed_rate_cut: 'Rate Cut',
  inflation_shock: 'Inflation',
  geopolitical_shock: 'Geopolitical',
  calm_year: 'Calm Year',
  earnings_beat: 'Earnings Beat',
  unemployment_spike: 'Unemployment',
  oil_crisis: 'Oil Crisis',
  recession: 'Recession',
  sector_mania_up: 'Sector Boom',
  sector_mania_down: 'Sector Bust',
  tariff_crisis: 'Tariff War',
  high_volatility: 'High Volatility',
}

const VOLATILITY_LABELS: Record<string, { label: string; color: string }> = {
  very_low: { label: 'Very Low', color: 'var(--color-positive)' },
  low: { label: 'Low', color: 'var(--color-positive)' },
  low_medium: { label: 'Low-Med', color: '#7CB342' },
  medium: { label: 'Medium', color: 'var(--color-warning)' },
  high: { label: 'High', color: '#E8623C' },
  very_high: { label: 'Very High', color: 'var(--color-negative)' },
  extreme: { label: 'Extreme', color: '#9B1B30' },
}

const RISK_LABELS: Record<string, { label: string; color: string }> = {
  very_low: { label: 'Very Low', color: 'var(--color-positive)' },
  low: { label: 'Low', color: 'var(--color-positive)' },
  low_medium: { label: 'Low-Medium', color: '#7CB342' },
  medium: { label: 'Medium', color: 'var(--color-warning)' },
  high: { label: 'High', color: '#E8623C' },
  very_high: { label: 'Very High', color: 'var(--color-negative)' },
}

export class PlantDrawer {
  private overlay: HTMLElement
  private drawer: HTMLElement
  private isOpen = false
  private openedAt = 0

  constructor() {
    // Backdrop overlay
    this.overlay = document.createElement('div')
    this.overlay.className = 'plant-drawer-overlay'
    this.overlay.style.display = 'none'
    document.body.appendChild(this.overlay)

    // Drawer panel
    this.drawer = document.createElement('div')
    this.drawer.className = 'plant-drawer'
    document.body.appendChild(this.drawer)

    // Stop clicks inside the drawer from closing it
    this.drawer.addEventListener('pointerdown', (e) => e.stopPropagation())
    // Close on overlay tap (with guard to prevent instant close from the same tap that opened it)
    this.overlay.addEventListener('pointerdown', () => {
      if (Date.now() - this.openedAt > 200) this.close()
    })

    // Swipe-down to dismiss
    let touchStartY = 0
    let touchCurrentY = 0
    let isDragging = false

    this.drawer.addEventListener('touchstart', (e) => {
      // Only track if at scroll top (so scrollable content still works)
      const content = this.drawer.querySelector('.drawer-content') as HTMLElement
      if (content && content.scrollTop > 0) return
      touchStartY = e.touches[0].clientY
      isDragging = true
    }, { passive: true })

    this.drawer.addEventListener('touchmove', (e) => {
      if (!isDragging) return
      touchCurrentY = e.touches[0].clientY
      const deltaY = touchCurrentY - touchStartY
      if (deltaY > 0) {
        // Dragging down — move drawer with finger (with resistance)
        const resistance = 0.6
        this.drawer.style.transform = `translateY(${deltaY * resistance}px)`
      }
    }, { passive: true })

    this.drawer.addEventListener('touchend', () => {
      if (!isDragging) return
      isDragging = false
      const deltaY = touchCurrentY - touchStartY
      if (deltaY > 80) {
        // Dismiss threshold reached
        this.close()
      } else {
        // Snap back
        gsap.to(this.drawer, { y: '0%', duration: 0.25, ease: 'power2.out' })
      }
      touchStartY = 0
      touchCurrentY = 0
    })
  }

  show(plantId: string, allocation: number, totalAllocation: number): void {
    const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
    if (!plant) return

    if (this.isOpen) {
      this.close()
      setTimeout(() => this.show(plantId, allocation, totalAllocation), 250)
      return
    }

    const pct = totalAllocation > 0 ? Math.round((allocation / totalAllocation) * 100) : 0
    const catColor = CATEGORY_COLORS[plant.category] || '#ccc'
    const isBad = 'isBadPlant' in plant
    const stats = REAL_STATS[plant.realWorldEquivalent]
    const vol = VOLATILITY_LABELS[plant.volatility] || { label: plant.volatility, color: '#999' }
    const risk = RISK_LABELS[plant.riskLevel] || { label: plant.riskLevel, color: '#999' }

    // Build event sensitivity bars (sorted by absolute impact)
    const effects = Object.entries(plant.baseEffects)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 8)

    const maxEffect = Math.max(...effects.map(([_, v]) => Math.abs(v)), 0.01)

    const sensitivityBars = effects.map(([event, value]) => {
      const label = EVENT_LABELS[event] || event.replace(/_/g, ' ')
      const pctVal = (value * 100).toFixed(0)
      const isPos = value >= 0
      const barWidth = Math.round((Math.abs(value) / maxEffect) * 100)
      return `
        <div class="drawer-sensitivity-row">
          <span class="drawer-sensitivity-label">${label}</span>
          <div class="drawer-sensitivity-bar-track">
            <div class="drawer-sensitivity-bar ${isPos ? 'bar-positive' : 'bar-negative'}"
                 style="width: ${barWidth}%;"></div>
          </div>
          <span class="drawer-sensitivity-value" style="color: ${isPos ? 'var(--color-positive)' : 'var(--color-negative)'};">
            ${isPos ? '+' : ''}${pctVal}%
          </span>
        </div>`
    }).join('')

    // Build real stats section
    const statsHtml = stats ? `
      <div class="drawer-section">
        <div class="drawer-section-title">Real-World Performance</div>
        <div class="drawer-stats-grid">
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">Ticker</div>
            <div class="drawer-stat-value" style="font-size: 12px;">${stats.ticker}</div>
          </div>
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">5Y Annual Return</div>
            <div class="drawer-stat-value" style="color: ${stats.annualReturn5y.startsWith('-') ? 'var(--color-negative)' : 'var(--color-positive)'};">${stats.annualReturn5y}</div>
          </div>
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">10Y Annual Return</div>
            <div class="drawer-stat-value" style="color: ${stats.annualReturn10y.startsWith('-') ? 'var(--color-negative)' : 'var(--color-positive)'};">${stats.annualReturn10y}</div>
          </div>
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">YTD</div>
            <div class="drawer-stat-value" style="color: ${stats.ytd.startsWith('-') ? 'var(--color-negative)' : 'var(--color-positive)'};">${stats.ytd}</div>
          </div>
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">Max Drawdown</div>
            <div class="drawer-stat-value" style="color: var(--color-negative);">${stats.maxDrawdown}</div>
          </div>
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">Sharpe Ratio</div>
            <div class="drawer-stat-value">${stats.sharpe}</div>
          </div>
          ${stats.dividend ? `
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">Dividend Yield</div>
            <div class="drawer-stat-value" style="color: var(--color-positive);">${stats.dividend}</div>
          </div>` : ''}
          ${stats.marketCap ? `
          <div class="drawer-stat-card">
            <div class="drawer-stat-label">Market Cap</div>
            <div class="drawer-stat-value">${stats.marketCap}</div>
          </div>` : ''}
        </div>
        <p class="drawer-description">${stats.description}</p>
        <p class="drawer-disclaimer">Source: Yahoo Finance, Bloomberg. Data approximate, for educational purposes only.</p>
      </div>` : ''

    // Special attributes
    const specialTags: string[] = []
    if (plant.rebound) specialTags.push('🔄 Rebounds after crashes')
    if ((plant as any).safeHaven) specialTags.push('🛡️ Safe-haven asset')
    if ((plant as any).inflationRisk) specialTags.push('📉 Loses value to inflation')
    if ((plant as any).couponYield) specialTags.push(`💰 Coupon: ${(plant as any).couponYield}%`)
    if ((plant as any).creditRating) specialTags.push(`📊 Rating: ${(plant as any).creditRating}`)
    if ((plant as any).dividendYield) specialTags.push('💵 Pays dividends')
    if ((plant as any).currencyRisk) specialTags.push('💱 Currency risk')
    if ((plant as any).economicIndicator) specialTags.push('🔬 Economic indicator')
    if ((plant as any).essentialGood) specialTags.push('🛒 Essential good')
    if ((plant as any).leverageMultiplier) specialTags.push(`⚡ ${(plant as any).leverageMultiplier}x leverage`)
    if (isBad) specialTags.push('⚠️ Risky / Bad plant')

    const tagsHtml = specialTags.length > 0 ? `
      <div class="drawer-tags">
        ${specialTags.map(t => `<span class="drawer-tag">${t}</span>`).join('')}
      </div>` : ''

    this.drawer.innerHTML = `
      <div class="drawer-handle"></div>
      <div class="drawer-content">
        <!-- Header -->
        <div class="drawer-header" style="border-left: 4px solid ${catColor};">
          <div class="drawer-plant-icon">${plantImg(plantId, plant.emoji, '48px')}</div>
          <div class="drawer-header-info">
            <div class="drawer-equiv">${plant.realWorldEquivalent}</div>
            <div class="drawer-name">${plant.emoji} ${plant.name}</div>
            <div class="drawer-category" style="color: ${catColor};">${plant.category.toUpperCase()}${plant.subCategory ? ` · ${plant.subCategory}` : ''}</div>
          </div>
          <button class="drawer-close-btn" id="drawer-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Quick stats row -->
        <div class="drawer-quick-stats">
          <div class="drawer-quick-stat">
            <span class="drawer-quick-label">Allocation</span>
            <span class="drawer-quick-value">${pct}%</span>
          </div>
          <div class="drawer-quick-stat">
            <span class="drawer-quick-label">Risk</span>
            <span class="drawer-quick-value" style="color: ${risk.color};">${risk.label}</span>
          </div>
          <div class="drawer-quick-stat">
            <span class="drawer-quick-label">Volatility</span>
            <span class="drawer-quick-value" style="color: ${vol.color};">${vol.label}</span>
          </div>
        </div>

        ${tagsHtml}

        <!-- Flora insight -->
        <div class="drawer-insight">
          <span class="drawer-insight-icon">🌿</span>
          <p>${plant.floraInsight}</p>
        </div>

        ${statsHtml}

        <!-- Event Sensitivity -->
        <div class="drawer-section">
          <div class="drawer-section-title">Event Sensitivity</div>
          <p class="drawer-section-sub">How this asset reacts to in-game events (based on real market behaviour)</p>
          <div class="drawer-sensitivity-list">
            ${sensitivityBars}
          </div>
        </div>
      </div>
    `

    // Wire close button
    this.drawer.querySelector('#drawer-close')?.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
      this.close()
    })

    // Make drawer handle more visible as a grab indicator
    const handle = this.drawer.querySelector('.drawer-handle') as HTMLElement
    if (handle) handle.style.cursor = 'grab'

    // Show
    this.openedAt = Date.now()
    this.overlay.style.display = 'block'
    gsap.fromTo(this.overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(this.drawer,
      { y: '100%' },
      { y: '0%', duration: 0.35, ease: 'power3.out' },
    )
    this.isOpen = true
  }

  close(): void {
    if (!this.isOpen) return
    this.isOpen = false
    gsap.to(this.overlay, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
      this.overlay.style.display = 'none'
    }})
    gsap.to(this.drawer, { y: '100%', duration: 0.25, ease: 'power2.in' })
  }

  destroy(): void {
    this.overlay.remove()
    this.drawer.remove()
  }
}
