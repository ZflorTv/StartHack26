/**
 * GameStateManager — Central game state and event bus
 *
 * Holds the single source of truth for portfolio, score, level,
 * flowers (the unified in-game currency), and event history.
 * Emits named events so UI and engine layers can react to changes.
 *
 * Flowers serve as both the investment value AND the spending currency.
 * Market events multiply the flower balance; buying plants deducts from it.
 */

import type { GameState, RiskProfile, Portfolio, ScreenName, ScoreEvent, EventResult, Amplitude } from '../types'
import { GAME_CONFIG, RISK_PROFILES } from '../constants/config'

type GameEventHandler = (data?: any) => void

export class GameStateManager {
  private state: GameState
  private listeners: Map<string, GameEventHandler[]> = new Map()

  constructor() {
    this.state = this.createInitialState()
  }

  private createInitialState(): GameState {
    return {
      riskProfile: null,
      portfolio: {},
      currentLevel: 1,
      maxLevel: GAME_CONFIG.MAX_LEVEL,
      flowers: GAME_CONFIG.STARTING_FLOWERS,
      flowerHistory: [{ level: 0, value: GAME_CONFIG.STARTING_FLOWERS }],
      score: 0,
      scoreBreakdown: [],
      unlockedPlants: [],
      playerName: 'Player',
      currentScreen: 'landing',
      tutorialStep: 0,
      tutorialCompleted: false,
      eventsHistory: [],
    }
  }

  // Event system
  on(event: string, handler: GameEventHandler): void {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event)!.push(handler)
  }

  off(event: string, handler: GameEventHandler): void {
    const handlers = this.listeners.get(event)
    if (handlers) {
      const idx = handlers.indexOf(handler)
      if (idx !== -1) handlers.splice(idx, 1)
    }
  }

  emit(event: string, data?: any): void {
    const handlers = this.listeners.get(event)
    if (handlers) handlers.forEach(h => h(data))
  }

  // Getters
  getState(): Readonly<GameState> { return this.state }
  getPortfolio(): Readonly<Portfolio> { return this.state.portfolio }
  getCurrentLevel(): number { return this.state.currentLevel }
  getFlowers(): number { return this.state.flowers }
  getScore(): number { return this.state.score }
  getRiskProfile(): RiskProfile | null { return this.state.riskProfile }
  getCurrentScreen(): ScreenName { return this.state.currentScreen }

  // Actions
  setScreen(screen: ScreenName): void {
    this.state.currentScreen = screen
    this.emit('screenChange', screen)
  }

  setRiskProfile(profile: RiskProfile): void {
    this.state.riskProfile = profile
    const suggested = RISK_PROFILES[profile].suggestedAllocation
    this.state.portfolio = { ...suggested }
    this.emit('riskProfileSet', profile)
  }

  setPlayerName(name: string): void {
    this.state.playerName = name
  }

  setPortfolio(portfolio: Portfolio): void {
    this.state.portfolio = { ...portfolio }
    this.emit('portfolioChanged', this.state.portfolio)
  }

  updatePortfolioAllocation(plantId: string, amount: number): void {
    this.state.portfolio[plantId] = Math.max(0, amount)
    if (this.state.portfolio[plantId] === 0) {
      delete this.state.portfolio[plantId]
    }
    this.emit('portfolioChanged', this.state.portfolio)
  }

  buyPlant(plantId: string, cost: number): boolean {
    if (this.state.flowers < cost) return false
    this.state.flowers -= cost
    if (!this.state.portfolio[plantId]) {
      this.state.portfolio[plantId] = 0
    }
    this.state.portfolio[plantId] += 10
    this.emit('plantBought', { plantId, cost })
    this.emit('flowersChanged', this.state.flowers)
    this.emit('portfolioChanged', this.state.portfolio)
    return true
  }

  sellPlant(plantId: string, refund: number): void {
    if (this.state.portfolio[plantId]) {
      this.state.portfolio[plantId] -= 10
      if (this.state.portfolio[plantId] <= 0) {
        delete this.state.portfolio[plantId]
      }
    }
    this.state.flowers += refund
    this.emit('plantSold', { plantId, refund })
    this.emit('flowersChanged', this.state.flowers)
    this.emit('portfolioChanged', this.state.portfolio)
  }

  applyEventEffects(effects: Record<string, number>, amplitude: Amplitude): void {
    const multiplier = GAME_CONFIG.AMPLITUDE_MULTIPLIERS[amplitude]
    let totalEffect = 0
    const portfolioTotal = Object.values(this.state.portfolio).reduce((sum, v) => sum + v, 0)

    if (portfolioTotal === 0) return

    Object.entries(this.state.portfolio).forEach(([plantId, allocation]) => {
      const weight = allocation / portfolioTotal
      const effect = effects[plantId] ?? this.getCategoryEffect(plantId, effects) ?? 0
      totalEffect += effect * weight * multiplier
    })

    const previousFlowers = this.state.flowers
    this.state.flowers = Math.max(0, Math.round(previousFlowers * (1 + totalEffect)))
    this.state.flowerHistory.push({
      level: this.state.currentLevel,
      value: this.state.flowers,
    })

    this.emit('flowersChanged', this.state.flowers)
    this.emit('portfolioValueChanged', {
      previous: previousFlowers,
      current: this.state.flowers,
      change: totalEffect,
    })
  }

  private getCategoryEffect(plantId: string, effects: Record<string, number>): number | null {
    const categoryMap: Record<string, string> = {
      cherry_blossom: 'oak', magnolia: 'oak', flame_tree: 'oak', apple_tree: 'oak',
      camellia: 'bush', hydrangea: 'bush', hibiscus: 'bush', bougainvillea: 'bush',
      meadow_grass_usd: 'grass', edelweiss: 'grass', clover_eur: 'grass', silver_grass_jpy: 'grass',
      golden_barrel: 'cactus', night_blooming_cactus: 'cactus', prickly_pear: 'cactus', cholla: 'cactus',
      white_phalaenopsis: 'exotic', purple_dendrobium: 'exotic', blue_exotic_orchid: 'exotic', green_cymbidium: 'exotic',
    }
    const key = categoryMap[plantId]
    if (key && effects[key] !== undefined) return effects[key]
    return null
  }

  addScore(label: string, points: number): void {
    this.state.score += points
    this.state.scoreBreakdown.push({
      label,
      points,
      level: this.state.currentLevel,
    })
    this.emit('scoreChanged', { total: this.state.score, added: points, label })
  }

  addEventResult(result: EventResult): void {
    this.state.eventsHistory.push(result)
  }

  advanceLevel(): boolean {
    if (this.state.currentLevel >= this.state.maxLevel) {
      this.emit('gameComplete', this.state)
      return false
    }
    this.state.currentLevel++
    this.state.flowers += GAME_CONFIG.FLOWERS_PER_LEVEL_WIN
    this.emit('levelAdvanced', this.state.currentLevel)
    this.emit('flowersChanged', this.state.flowers)
    return true
  }

  advanceTutorial(): number {
    this.state.tutorialStep++
    this.emit('tutorialAdvanced', this.state.tutorialStep)
    return this.state.tutorialStep
  }

  completeTutorial(): void {
    this.state.tutorialCompleted = true
    this.emit('tutorialCompleted')
  }

  getUnlockedPlantIds(): string[] {
    return this.state.unlockedPlants
  }

  setUnlockedPlants(plantIds: string[]): void {
    this.state.unlockedPlants = plantIds
  }

  reset(): void {
    this.state = this.createInitialState()
    this.emit('gameReset')
  }

  getDiversificationScore(): number {
    const portfolio = this.state.portfolio
    const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
    if (entries.length === 0) return 0

    const total = entries.reduce((sum, [_, v]) => sum + v, 0)
    if (total === 0) return 0

    let hhi = 0
    entries.forEach(([_, v]) => {
      const weight = v / total
      hhi += weight * weight
    })

    const n = entries.length
    const minHHI = 1 / n
    const maxHHI = 1
    const score = Math.round(((maxHHI - hhi) / (maxHHI - minHHI)) * 100)
    return Math.max(0, Math.min(100, score))
  }
}
