/**
 * Growden — Entry point
 *
 * Bootstraps the PixiJS renderer, creates the core game systems
 * (state, simulation, scenes), wires them together via UIManager,
 * and shows the landing screen.
 */

import { Application } from 'pixi.js'
import { GameStateManager } from './engine/GameState'
import { SimulationEngine } from './engine/SimulationEngine'
import { GardenScene } from './scenes/GardenScene'
import { WeatherEffects } from './scenes/WeatherEffects'
import { UIManager } from './ui/UIManager'
import { initButtonPressEffects } from './ui/enhancements/MicroInteractions'
import { initDarkMode, isDarkMode, onThemeChange } from './ui/enhancements/DarkMode'
import { loadDisplayFont } from './ui/enhancements/Typography'
import { resetAchievements } from './ui/enhancements/Achievements'

const BG_LIGHT = 0xF0EDE6
const BG_DARK  = 0x0F1117

async function init(): Promise<void> {
  const app = new Application()

  await app.init({
    resizeTo: window,
    backgroundColor: BG_LIGHT,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  document.getElementById('game-canvas')!.appendChild(app.canvas)

  // Initialize UI enhancements
  initDarkMode()
  initButtonPressEffects()
  loadDisplayFont()

  // Sync PixiJS canvas background with dark mode
  onThemeChange((dark) => {
    app.renderer.background.color = dark ? BG_DARK : BG_LIGHT
  })
  // Apply initial state
  if (isDarkMode()) {
    app.renderer.background.color = BG_DARK
  }

  // Core game systems
  const gameState = new GameStateManager()
  const simulation = new SimulationEngine(gameState)

  // PixiJS scene layers (garden behind weather)
  const gardenScene = new GardenScene(app)
  gardenScene.visible = false
  app.stage.addChild(gardenScene)

  const weatherEffects = new WeatherEffects(app)
  app.stage.addChild(weatherEffects)

  // UIManager orchestrates all screens and connects game logic to visuals
  const ui = new UIManager(app, gameState, simulation, gardenScene, weatherEffects)
  ui.showScreen('landing')

  // Expose debug helpers (also allows achievement reset from console)
  ;(window as any).__growden = { gameState, simulation, gardenScene, weatherEffects, ui, app, resetAchievements }

  console.log('Growden initialized')
}

init().catch(console.error)
