/**
 * UIManager — Screen orchestrator
 *
 * Owns all HTML screen instances and coordinates transitions between them.
 * Connects player actions (risk profile selection, event responses, shop
 * purchases) to the game engine and updates the PixiJS garden scene.
 *
 * Flow: Landing → RiskProfile → Tutorial → Garden ⇄ Event → Debrief
 *       Landing → Battle (standalone)
 */

import type { ScreenName, RiskProfile, GameEvent, Amplitude } from '../types'
import { GameStateManager } from '../engine/GameState'
import { SimulationEngine } from '../engine/SimulationEngine'
import { GardenScene } from '../scenes/GardenScene'
import { WeatherEffects } from '../scenes/WeatherEffects'
import { LandingScreen } from './screens/LandingScreen'
import { RiskProfileScreen } from './screens/RiskProfileScreen'
import { TutorialScreen } from './screens/TutorialScreen'
import { GardenScreen } from './screens/GardenScreen'
import { EventScreen } from './screens/EventScreen'
import { DebriefScreen } from './screens/DebriefScreen'
import { BattleScreen } from './screens/BattleScreen'
import { getUnlockedPlants, getNewPlantsForLevel } from '../data/plants'
import { getPlantCost, getPlantSellValue } from '../data/badPlants'
import { GAME_CONFIG, RISK_PROFILES } from '../constants/config'
import { addToLeaderboard } from '../utils/leaderboard'
import { EVENTS_MAP } from '../data/events'
import { Application } from 'pixi.js'
import { gsap } from 'gsap'
import { weatherTakeover, enhancedLevelTransition } from './enhancements/ScreenTransitions'
import { recordHold, recordPanicSell, checkGameEndAchievements, unlockAchievement, fireConfetti } from './enhancements/Achievements'
import { flowerBurst, scoreFlash, animateNumber } from './enhancements/MicroInteractions'

export class UIManager {
  private uiLayer: HTMLElement
  private gameState: GameStateManager
  private simulation: SimulationEngine
  private gardenScene: GardenScene
  private weatherEffects: WeatherEffects
  private app: Application
  private currentScreen: ScreenName | null = null

  // Screen instances
  private landingScreen: LandingScreen
  private riskProfileScreen: RiskProfileScreen
  private tutorialScreen: TutorialScreen
  private gardenScreen: GardenScreen
  private eventScreen: EventScreen
  private debriefScreen: DebriefScreen
  private battleScreen: BattleScreen

  constructor(
    app: Application,
    gameState: GameStateManager,
    simulation: SimulationEngine,
    gardenScene: GardenScene,
    weatherEffects: WeatherEffects,
  ) {
    this.app = app
    this.uiLayer = document.getElementById('ui-layer')!
    this.gameState = gameState
    this.simulation = simulation
    this.gardenScene = gardenScene
    this.weatherEffects = weatherEffects

    // Create screen instances
    this.landingScreen = new LandingScreen(
      this.uiLayer,
      () => this.showScreen('riskProfile'),
      () => this.showScreen('battle'),
      () => this.quickStart(),
    )

    this.riskProfileScreen = new RiskProfileScreen(
      this.uiLayer,
      (profile: RiskProfile) => {
        this.gameState.setRiskProfile(profile)
        this.showScreen('tutorial')
      },
    )

    this.tutorialScreen = new TutorialScreen(
      this.uiLayer,
      () => {
        this.gameState.completeTutorial()
        this.startGame()
      },
      () => {
        this.gameState.completeTutorial()
        this.startGame()
      },
    )

    this.gardenScreen = new GardenScreen(
      this.uiLayer,
      {
        onNextEvent: () => this.triggerEvent(),
        onOpenShop: () => this.openShop(),
        onTutorial: () => this.showScreen('tutorial'),
        onHome: () => this.showScreen('landing'),
        onSuspenseStart: () => this.playSuspenseEffects(),
      },
      () => this.gameState.getState(),
    )

    this.eventScreen = new EventScreen(
      this.uiLayer,
      (action) => this.handleEventResponse(action),
    )

    this.debriefScreen = new DebriefScreen(
      this.uiLayer,
      () => {
        this.gameState.reset()
        this.showScreen('landing')
      },
      () => {
        this.gameState.reset()
        this.showScreen('battle')
      },
    )

    this.battleScreen = new BattleScreen(
      this.uiLayer,
      () => this.showScreen('landing'),
    )
  }

  showScreen(screen: ScreenName): void {
    const previousScreen = this.currentScreen
    this.currentScreen = screen
    this.gameState.setScreen(screen)
    this.gardenScene.visible = screen === 'garden' || screen === 'event'

    // Crossfade transition — skip for 'event' (has its own overlay animation)
    // and for 'garden' when coming from 'event' (event overlay handles dismissal)
    const skipTransition = screen === 'event' || (screen === 'garden' && previousScreen === 'event')
    const uiLayer = this.uiLayer

    if (!skipTransition) {
      uiLayer.style.opacity = '0'
      uiLayer.style.transition = 'none'
    }

    switch (screen) {
      case 'landing':
        this.weatherEffects.stop()
        this.gardenScene.clearWeather()
        this.landingScreen.render()
        break
      case 'riskProfile':
        this.riskProfileScreen.render()
        break
      case 'tutorial':
        this.tutorialScreen.render()
        break
      case 'garden':
        this.renderGarden()
        break
      case 'event':
        // Event screen is triggered by triggerEvent()
        break
      case 'debrief':
        this.weatherEffects.stop()
        this.gardenScene.clearWeather()
        this.showDebrief()
        break
      case 'battle':
        this.battleScreen.render()
        break
    }

    // Fade in new screen
    if (!skipTransition) {
      requestAnimationFrame(() => {
        uiLayer.style.transition = 'opacity 0.3s ease-out'
        uiLayer.style.opacity = '1'
      })
    }
  }

  /** Quick Start — skip profile selection + tutorial, jump straight in as Meadow */
  private quickStart(): void {
    this.gameState.setRiskProfile('meadow')
    this.gameState.completeTutorial()
    this.startGame()
  }

  private startGame(): void {
    // Fresh game — clear any lingering weather and plant memory
    this.weatherEffects.stop()
    this.gardenScene.clearWeather()
    this.gardenScene.resetKnownPlants()

    const state = this.gameState.getState()

    // Unlock plants for current level
    const unlocked = getUnlockedPlants(state.currentLevel)
    this.gameState.setUnlockedPlants(unlocked.map(p => p.id))

    // Build initial portfolio from risk profile allocation
    const profile = this.gameState.getRiskProfile()
    if (profile) {
      const portfolio: Record<string, number> = {}
      const { suggestedAllocation } = RISK_PROFILES[profile]

      // Pick one representative plant per category
      const categoryDefaults: Record<string, string> = {
        equity: 'apple_tree',
        bonds: 'camellia',
        cash: 'meadow_grass_usd',
        commodities: 'golden_barrel',
        crypto: 'white_phalaenopsis',
      }

      Object.entries(suggestedAllocation).forEach(([category, pct]) => {
        if (pct > 0) {
          const plantId = categoryDefaults[category]
          if (plantId) portfolio[plantId] = pct
        }
      })

      this.gameState.setPortfolio(portfolio)
    }

    this.showScreen('garden')
  }

  private renderGarden(): void {
    const state = this.gameState.getState()

    // Ensure UI is visible (may have been faded by screen transition)
    this.uiLayer.style.opacity = '1'
    this.uiLayer.style.transition = 'none'

    // Update garden visuals — set level first for growth/season/healing
    this.gardenScene.setLevel(state.currentLevel)
    this.gardenScene.updatePortfolio(state.portfolio)
    this.gardenScene.visible = true

    // Render HUD
    this.gardenScreen.render({
      level: state.currentLevel,
      maxLevel: state.maxLevel,
      flowers: state.flowers,
      score: state.score,
      portfolio: state.portfolio,
      playerName: state.playerName,
      riskProfile: state.riskProfile,
      flowerHistory: state.flowerHistory,
    })

    // Show last event recap banner if returning from an event
    if (this.lastEventInfo) {
      this.gardenScreen.showLastEventBanner(
        this.lastEventInfo.name,
        this.lastEventInfo.action,
        this.lastEventInfo.impactPercent,
      )
      this.lastEventInfo = null
    }
  }

  /** Show garden, but first show new plant unlocks if any */
  private showGardenWithUnlocks(): void {
    const level = this.gameState.getCurrentLevel()
    const newPlants = getNewPlantsForLevel(level)

    if (newPlants.length > 0) {
      // Render garden behind the modal so it's visible when modal closes
      this.renderGarden()

      this.gardenScreen.showNewPlantsModal(
        newPlants.map(p => ({
          id: p.id,
          name: p.name,
          emoji: p.emoji,
          category: p.category,
          color: p.color,
          cost: getPlantCost(p.id),
          riskLevel: p.riskLevel,
          volatility: p.volatility,
          floraInsight: p.floraInsight,
          realWorldEquivalent: p.realWorldEquivalent,
        })),
        level,
        () => {
          // Modal dismissed — garden is already rendered
        },
      )
    } else {
      this.showScreen('garden')
    }
  }

  /** Suspense effects on the PixiJS garden scene — plant sway + amber sky tint */
  private playSuspenseEffects(): void {
    // 5) Plant sprite sway — gentle ±3° rotation on all plants
    const plants = this.gardenScene.getPlants()
    plants.forEach((plant, i) => {
      gsap.to(plant, {
        rotation: 0.05,
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.05,
      })
    })

    // 6) Sky tint shift — warm amber tint to signal incoming event
    this.gardenScene.setWeatherBackground('heat')
    // Reset after suspense (triggerEvent will set the real weather)
    setTimeout(() => this.gardenScene.clearWeather(), 1800)
  }

  private currentEvent: { event: GameEvent; amplitude: Amplitude } | null = null
  private lastEventInfo: { name: string; action: string; impactPercent: number } | null = null

  private triggerEvent(): void {
    // Pick and apply event
    const picked = this.simulation.pickEventForLevel()
    this.currentEvent = picked

    // Apply event effects
    const result = this.simulation.applyEvent(picked.event, picked.amplitude)

    // Calculate portfolio change percentage
    const change = (result.flowersAfter - result.flowersBefore) / result.flowersBefore

    // Show weather effects
    this.gardenScene.setWeatherBackground(picked.event.weatherType)
    this.weatherEffects.start(picked.event.weatherType)

    // Animate plant reactions
    if (picked.event.amplitudes?.[picked.amplitude]) {
      this.gardenScene.animateEventEffects(picked.event.amplitudes[picked.amplitude].effects)
    }

    // Weather takeover animation, then show event card
    const ampData = picked.event.amplitudes?.[picked.amplitude] || picked.event.phase1
    const emoji = ampData?.emoji || '⛅'

    this.currentScreen = 'event'
    weatherTakeover(emoji, () => {
      this.eventScreen.render(picked.event, picked.amplitude, change, this.gameState.getPortfolio())
    })
  }

  /**
   * Build a fully contextual Flora comment referencing:
   * - the specific event name + severity
   * - the player's chosen action + its consequence
   * - what the alternative actions would have earned/cost
   * - the educational learning tied to this event
   */
  private buildFloraComment(
    event: GameEvent,
    amplitude: Amplitude,
    action: 'hold' | 'rebalance' | 'panic_sell',
    result: { flowersBefore: number; flowersAfter: number },
  ): string {
    const changePct = ((result.flowersAfter - result.flowersBefore) / result.flowersBefore * 100).toFixed(1)
    const isUp = result.flowersAfter >= result.flowersBefore
    const ampLabel = amplitude === 'severe' ? 'severe' : amplitude === 'moderate' ? 'moderate' : 'mild'
    const holdPts = event.holdBonusPoints || 0
    const panicPts = event.panicSellPenalty || GAME_CONFIG.PANIC_SELL_PENALTY
    const overtradePts = event.penaltyForOvertrading ? (event.overtradingPenalty || GAME_CONFIG.OVERTRADING_PENALTY) : 0

    // --- Reaction to player action ---
    let reaction = ''
    if (action === 'hold') {
      if (isUp) {
        reaction = `<strong>${event.name}</strong> hit with ${ampLabel} intensity and your garden moved <strong style="color:var(--color-positive);">${changePct}%</strong>. You held steady — patience paid off.`
      } else {
        reaction = `<strong>${event.name}</strong> hit with ${ampLabel} intensity, pushing your garden <strong style="color:var(--color-negative);">${changePct}%</strong>. You held through the pain — that takes real discipline.`
      }
    } else if (action === 'panic_sell') {
      reaction = `<strong>${event.name}</strong> hit with ${ampLabel} intensity. You liquidated everything — selling at a ${Math.round(50)}% discount. That's the real cost of panic.`
    } else {
      reaction = `<strong>${event.name}</strong> hit with ${ampLabel} intensity (garden <strong>${isUp ? '+' : ''}${changePct}%</strong>). You chose to rebalance${event.penaltyForOvertrading ? ' — but was there really a need to act?' : '.'}`
    }

    // --- What-if comparison ---
    const whatIfs: string[] = []
    if (action === 'hold') {
      if (holdPts > 0) whatIfs.push(`Holding earned you <strong>+${holdPts} pts</strong>.`)
      whatIfs.push(`Panic selling would have cost <strong>${panicPts} pts</strong> and 50% of your portfolio value.`)
    } else if (action === 'panic_sell') {
      whatIfs.push(`Panic selling cost you <strong>${panicPts} pts</strong>.`)
      if (holdPts > 0) whatIfs.push(`Holding would have earned <strong>+${holdPts} pts</strong> instead.`)
      else whatIfs.push(`Simply holding would have avoided this loss entirely.`)
    } else {
      if (overtradePts < 0) whatIfs.push(`Rebalancing during a ${event.penaltyForOvertrading ? 'calm' : 'volatile'} period cost you <strong>${overtradePts} pts</strong>.`)
      if (holdPts > 0) whatIfs.push(`Holding would have earned <strong>+${holdPts} pts</strong>.`)
      whatIfs.push(`Panic selling would have cost <strong>${panicPts} pts</strong>.`)
    }

    // --- Educational lesson ---
    const lesson = event.learning

    return `
      <div>${reaction}</div>
      <div class="flora-whatif">${whatIfs.join(' ')}</div>
      <div class="flora-lesson">${lesson}</div>
    `
  }

  private handleEventResponse(action: 'hold' | 'rebalance' | 'panic_sell'): void {
    if (!this.currentEvent) return

    const result = this.simulation.applyEvent(this.currentEvent.event, this.currentEvent.amplitude)
    result.playerAction = action

    // Track achievements
    if (action === 'hold') {
      recordHold()
      // Check for severe event hold
      if (this.currentEvent.amplitude === 'severe') {
        unlockAchievement('survivor')
      }
    } else if (action === 'panic_sell') {
      recordPanicSell()
    }

    // Score the response
    const points = this.simulation.scoreEventResponse(this.currentEvent.event, result, action)

    // Animate score change in nav
    const scoreEl = document.getElementById('score-value')
    if (scoreEl) {
      animateNumber(scoreEl, this.gameState.getState().score, 0.6)
      scoreFlash(scoreEl, points)
    }

    // Flower burst on earning flowers
    const flowersEl = document.getElementById('flowers-value')
    if (flowersEl) {
      const rect = flowersEl.getBoundingClientRect()
      flowerBurst(rect.left + rect.width / 2, rect.top)
    }

    // Build contextual Flora comment
    const hintHtml = this.buildFloraComment(
      this.currentEvent.event,
      this.currentEvent.amplitude,
      action,
      result,
    )

    // Store last event info for the recap banner
    const changePctNum = ((result.flowersAfter - result.flowersBefore) / result.flowersBefore) * 100
    this.lastEventInfo = {
      name: this.currentEvent.event.name,
      action: action,
      impactPercent: parseFloat(changePctNum.toFixed(1)),
    }

    // Flash plant chips in garden HUD with per-plant effects
    const ampData = this.currentEvent.event.amplitudes?.[this.currentEvent.amplitude]
    if (ampData) {
      this.gardenScreen.flashPlantChipEffects(ampData.effects)
    }

    // Show Flora's hint — user dismisses it to advance
    this.eventScreen.showFloraHint(hintHtml, () => {
      // Reset plant damage/growth states (weather stays for the level)
      this.gardenScene.resetPlantStates()

      // Handle panic sell — liquidate everything back into flowers
      if (action === 'panic_sell') {
        const portfolio = this.gameState.getPortfolio()
        Object.entries(portfolio).forEach(([plantId, allocation]) => {
          const units = Math.floor(allocation / 10)
          const refundPerUnit = getPlantSellValue(plantId)
          for (let i = 0; i < units; i++) {
            this.gameState.sellPlant(plantId, refundPerUnit)
          }
        })
      }

      // Advance level
      const canContinue = this.simulation.completeLevel()

      // Update unlocked plants
      const unlocked = getUnlockedPlants(this.gameState.getCurrentLevel())
      this.gameState.setUnlockedPlants(unlocked.map(p => p.id))

      if (canContinue) {
        // Show enhanced level transition, then garden
        enhancedLevelTransition(this.gameState.getCurrentLevel(), () => this.showGardenWithUnlocks())
      } else {
        // Check end-game achievements + confetti
        const state = this.gameState.getState()
        checkGameEndAchievements(state)
        if (state.score > 400) fireConfetti()
        this.showScreen('debrief')
      }

      this.currentEvent = null
    })
  }

  private openShop(): void {
    const state = this.gameState.getState()
    const unlockedPlants = getUnlockedPlants(state.currentLevel)

    const shopPlants = unlockedPlants.map(p => ({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      category: p.category,
      color: p.color,
      cost: getPlantCost(p.id),
      sellValue: getPlantSellValue(p.id),
      riskLevel: p.riskLevel,
      volatility: p.volatility,
      floraInsight: p.floraInsight,
      realWorldEquivalent: p.realWorldEquivalent,
    }))

    this.gardenScreen.showShopModal(
      shopPlants,
      state.flowers,
      { ...state.portfolio },
      (plantId: string) => {
        this.gameState.buyPlant(plantId, getPlantCost(plantId))
        return this.gameState.getFlowers()
      },
      (plantId: string) => {
        this.gameState.sellPlant(plantId, getPlantSellValue(plantId))
        return this.gameState.getFlowers()
      },
      () => {
        // Shop closed — refresh garden with final state
        this.gardenScene.updatePortfolio(this.gameState.getPortfolio())
        this.renderGarden()
      },
    )
  }

  private showDebrief(): void {
    const finalScores = this.simulation.calculateFinalScore()
    const state = this.gameState.getState()

    // Save to leaderboard
    const growth = ((state.flowers - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS * 100)
    addToLeaderboard({
      score: state.score,
      profile: state.riskProfile || 'unknown',
      portfolioGrowth: Math.round(growth * 10) / 10,
      level: state.currentLevel,
      date: new Date().toLocaleDateString(),
    })

    // Simulate other risk profiles through same events for comparison
    const profileComparison = this.simulateProfileComparison(state.eventsHistory)

    this.debriefScreen.render(state, finalScores.breakdown, profileComparison)
  }

  /** Simulate what other risk profiles would have achieved given the same events */
  private simulateProfileComparison(eventsHistory: Array<{ eventId: string; amplitude: 'light' | 'moderate' | 'severe' }>): Record<string, number> {
    const categoryEffectKey: Record<string, string> = {
      equity: 'oak', bonds: 'bush', cash: 'grass', commodities: 'cactus', crypto: 'exotic',
    }
    const ampMult: Record<string, number> = { light: 0.4, moderate: 1.0, severe: 2.2 }

    const results: Record<string, number> = {}

    for (const [profileId, profile] of Object.entries(RISK_PROFILES)) {
      let value = 10000
      const alloc = profile.suggestedAllocation
      const total = Object.values(alloc).reduce((s, v) => s + v, 0)

      for (const ev of eventsHistory) {
        const event = EVENTS_MAP[ev.eventId]
        const ampData = event?.amplitudes?.[ev.amplitude]
        if (!ampData) continue

        let weightedEffect = 0
        for (const [cat, pct] of Object.entries(alloc)) {
          const key = categoryEffectKey[cat] || ''
          const effect = ampData.effects[key] ?? 0
          weightedEffect += (pct / total) * effect
        }
        value *= (1 + weightedEffect * (ampMult[ev.amplitude] || 1))
      }

      results[profileId] = Math.round(value)
    }

    return results
  }
}
