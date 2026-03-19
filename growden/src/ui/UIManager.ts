import type { ScreenName, RiskProfile, GameEvent, Amplitude, Portfolio } from '../types'
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
import { getUnlockedPlants } from '../data/plants'
import { GAME_CONFIG, RISK_PROFILES } from '../constants/config'
import { Application } from 'pixi.js'

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
      },
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
    this.currentScreen = screen
    this.gameState.setScreen(screen)
    this.gardenScene.visible = screen === 'garden' || screen === 'event'

    switch (screen) {
      case 'landing':
        this.weatherEffects.stop()
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
        this.showDebrief()
        break
      case 'battle':
        this.battleScreen.render()
        break
    }
  }

  private startGame(): void {
    const state = this.gameState.getState()

    // Unlock plants for current level
    const unlocked = getUnlockedPlants(state.currentLevel)
    this.gameState.setUnlockedPlants(unlocked.map(p => p.id))

    // Build initial portfolio from risk profile allocation
    const profile = this.gameState.getRiskProfile()
    if (profile) {
      const portfolio: Portfolio = {}
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

    // Update garden visuals
    this.gardenScene.updatePortfolio(state.portfolio)
    this.gardenScene.visible = true
    this.weatherEffects.stop()
    this.gardenScene.clearWeather()

    // Render HUD
    this.gardenScreen.render({
      level: state.currentLevel,
      maxLevel: state.maxLevel,
      flowers: state.flowers,
      score: state.score,
      portfolioValue: state.portfolioValue,
      portfolio: state.portfolio,
      playerName: state.playerName,
    })
  }

  private currentEvent: { event: GameEvent; amplitude: Amplitude } | null = null

  private triggerEvent(): void {
    // Pick and apply event
    const picked = this.simulation.pickEventForLevel()
    this.currentEvent = picked

    // Apply event effects
    const result = this.simulation.applyEvent(picked.event, picked.amplitude)

    // Calculate portfolio change percentage
    const change = (result.portfolioAfter - result.portfolioBefore) / result.portfolioBefore

    // Show weather effects
    this.gardenScene.setWeatherBackground(picked.event.weatherType)
    this.weatherEffects.start(picked.event.weatherType)

    // Animate plant reactions
    if (picked.event.amplitudes?.[picked.amplitude]) {
      this.gardenScene.animateEventEffects(picked.event.amplitudes[picked.amplitude].effects)
    }

    // Show event card
    this.currentScreen = 'event'
    this.eventScreen.render(picked.event, picked.amplitude, change)
  }

  private handleEventResponse(action: 'hold' | 'rebalance' | 'panic_sell'): void {
    if (!this.currentEvent) return

    const result = this.simulation.applyEvent(this.currentEvent.event, this.currentEvent.amplitude)
    result.playerAction = action

    // Score the response
    const points = this.simulation.scoreEventResponse(this.currentEvent.event, result, action)

    // Show Flora's hint
    this.eventScreen.showFloraHint(this.currentEvent.event.floraHint)

    // After a delay, advance
    setTimeout(() => {
      // Clear weather
      this.weatherEffects.stop()
      this.gardenScene.clearWeather()
      this.gardenScene.resetPlantStates()

      // Handle panic sell
      if (action === 'panic_sell') {
        // Convert portfolio to cash
        const totalAlloc = Object.values(this.gameState.getPortfolio()).reduce((s, v) => s + v, 0)
        this.gameState.setPortfolio({ meadow_grass_usd: totalAlloc })
      }

      // Advance level
      const canContinue = this.simulation.completeLevel()

      // Update unlocked plants
      const unlocked = getUnlockedPlants(this.gameState.getCurrentLevel())
      this.gameState.setUnlockedPlants(unlocked.map(p => p.id))

      if (canContinue) {
        this.showScreen('garden')
      } else {
        this.showScreen('debrief')
      }

      this.currentEvent = null
    }, 3000)
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
      cost: GAME_CONFIG.PLANT_COST,
    }))

    this.gardenScreen.showShopModal(
      shopPlants,
      state.flowers,
      (plantId: string) => {
        this.gameState.buyPlant(plantId, GAME_CONFIG.PLANT_COST)
        this.gardenScene.updatePortfolio(this.gameState.getPortfolio())
        this.renderGarden()
      },
      () => {
        // Shop closed
      },
    )
  }

  private showDebrief(): void {
    const finalScores = this.simulation.calculateFinalScore()
    this.debriefScreen.render(this.gameState.getState(), finalScores.breakdown)
  }
}
