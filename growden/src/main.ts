import { Application } from 'pixi.js'
import { GameStateManager } from './engine/GameState'
import { SimulationEngine } from './engine/SimulationEngine'
import { GardenScene } from './scenes/GardenScene'
import { WeatherEffects } from './scenes/WeatherEffects'
import { UIManager } from './ui/UIManager'

async function init(): Promise<void> {
  // Create PixiJS application
  const app = new Application()

  await app.init({
    resizeTo: window,
    backgroundColor: 0xF0EDE6,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  // Add canvas to DOM
  const canvasContainer = document.getElementById('game-canvas')!
  canvasContainer.appendChild(app.canvas)

  // Create game systems
  const gameState = new GameStateManager()
  const simulation = new SimulationEngine(gameState)

  // Create PixiJS scenes
  const gardenScene = new GardenScene(app)
  gardenScene.visible = false
  app.stage.addChild(gardenScene)

  const weatherEffects = new WeatherEffects(app)
  app.stage.addChild(weatherEffects)

  // Create UI manager (connects everything)
  const ui = new UIManager(app, gameState, simulation, gardenScene, weatherEffects)

  // Start at landing screen
  ui.showScreen('landing')

  // Debug: expose to window for development
  if (import.meta.env.DEV) {
    (window as any).__growden = { gameState, simulation, gardenScene, weatherEffects, ui, app }
  }

  console.log('Growden initialized')
}

init().catch(console.error)
