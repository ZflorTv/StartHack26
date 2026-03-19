# 🎮 Growden — PixiJS + TypeScript Adaptation

> This file complements GROWDEN-VISUAL-DESIGN.md.
> It replaces all HTML/CSS/React patterns with PixiJS + TypeScript equivalents.
> Read both files together.

---

## The Core Architecture

PixiJS renders to a `<canvas>` element using WebGL. CSS does not apply to anything inside that canvas. The app therefore splits into two layers:

```
┌─────────────────────────────────────┐
│  HTML/CSS layer  (UI)               │  ← Cards, buttons, sliders, chat, nav
│  position: absolute, top of canvas  │
├─────────────────────────────────────┤
│  PixiJS canvas layer  (game world)  │  ← Garden, plants, weather, animations
│  WebGL rendered                     │
└─────────────────────────────────────┘
```

**Rule:** Everything visual in the garden = PixiJS. Everything UI = HTML/CSS overlaid on top of the canvas.

This is the standard PixiJS pattern for games with UI. It gives you full WebGL performance for the garden scene and full browser layout power for the interface.

---

## Project Setup

```bash
npm create vite@latest growden -- --template vanilla-ts
cd growden
npm install pixi.js@8
npm install gsap          # for animation (replaces CSS keyframes)
npm install @pixi/ui      # optional: PixiJS UI components
```

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Growden 🌱</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- PixiJS canvas goes here (injected by main.ts) -->
  <div id="game-canvas"></div>

  <!-- HTML UI layer sits on top -->
  <div id="ui-layer"></div>

  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### `style.css` — layout only
```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: #F0EDE6;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

#game-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
}

#ui-layer {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 10;
  pointer-events: none; /* passes clicks through to canvas by default */
}

/* Re-enable pointer events only on actual UI elements */
#ui-layer button,
#ui-layer input,
#ui-layer .card,
#ui-layer .nav {
  pointer-events: all;
}
```

---

## TypeScript Setup

### `src/types/index.ts`
```typescript
export type RiskProfile = 'zen' | 'meadow' | 'jungle'
export type Amplitude = 'light' | 'moderate' | 'severe'
export type PlantState = 'healthy' | 'growing' | 'damaged' | 'wilted'
export type WeatherType = 'sun' | 'rain' | 'storm' | 'frost' | 'heat' | 'lightning' | 'fog' | 'calm' | 'tornado' | 'meteor'

export interface Portfolio {
  bonds: number
  equities: number
  cash: number
  [key: string]: number
}

export interface GameEvent {
  id: string
  name: string
  category: string
  weatherType: WeatherType
  weatherEmoji: string
  severity: Amplitude
  headline: string
  explanation: string
  effects: Portfolio
  learning: string
  coachHint: string
  appearsAtLevels: number[]
}

export interface Plant {
  id: string
  name: string
  icon: string          // path to PNG asset
  category: string
  subCategory: string
  color: string
  unlocksAtLevel: number
  baseEffects: Partial<Record<string, number>>
  riskLevel: string
  volatility: string
  visualStates: Record<PlantState, string>
}

export interface GameState {
  riskProfile: RiskProfile | null
  portfolio: Portfolio
  currentLevel: number
  portfolioValue: number
  portfolioHistory: { level: number; value: number }[]
  score: number
  scoreBreakdown: ScoreEvent[]
  unlockedPlants: string[]
  playerName: string
}

export interface ScoreEvent {
  label: string
  points: number
  level: number
}
```

---

## PixiJS Application Init

### `src/main.ts`
```typescript
import { Application, Assets } from 'pixi.js'
import { GardenScene } from './scenes/GardenScene'
import { UIManager } from './ui/UIManager'

const app = new Application()

await app.init({
  resizeTo: window,
  backgroundColor: 0xF0EDE6,    // warm off-white background
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
})

document.getElementById('game-canvas')!.appendChild(app.canvas)

// Preload all plant PNG assets
await Assets.load([
  'assets/plants/cherry-blossom.png',
  'assets/plants/magnolia.png',
  'assets/plants/flame-tree.png',
  // ... all plant PNGs
])

// Init garden scene (PixiJS)
const garden = new GardenScene(app)
app.stage.addChild(garden)

// Init UI layer (HTML)
const ui = new UIManager()
ui.showScreen('landing')
```

---

## Garden Scene — PixiJS

### `src/scenes/GardenScene.ts`
```typescript
import { Container, Sprite, Application } from 'pixi.js'
import { gsap } from 'gsap'
import { PlantSprite } from '../components/PlantSprite'
import type { Portfolio } from '../types'

export class GardenScene extends Container {
  private platform: Sprite
  private plantLayer: Container
  private weatherLayer: Container
  private plants: PlantSprite[] = []

  constructor(private app: Application) {
    super()
    this.platform = this.createPlatform()
    this.plantLayer = new Container()
    this.weatherLayer = new Container()
    this.addChild(this.platform)
    this.addChild(this.plantLayer)
    this.addChild(this.weatherLayer)
    this.positionCenter()
  }

  private createPlatform(): Sprite {
    // Load your isometric platform sprite
    // This is the green soil base from image 3
    const sprite = Sprite.from('assets/garden/platform.png')
    sprite.anchor.set(0.5, 0.5)
    return sprite
  }

  private positionCenter(): void {
    this.x = this.app.screen.width / 2
    this.y = this.app.screen.height / 2
  }

  updatePortfolio(portfolio: Portfolio): void {
    // Clear existing plants
    this.plantLayer.removeChildren()
    this.plants = []

    // Add plants based on allocation
    // Each 20 units = 1 plant instance
    Object.entries(portfolio).forEach(([assetClass, units]) => {
      const count = Math.floor(units / 20)
      for (let i = 0; i < count; i++) {
        const plant = new PlantSprite(assetClass, this.getPlantPosition(i, count))
        this.plants.push(plant)
        this.plantLayer.addChild(plant)
      }
    })

    this.startIdleAnimations()
  }

  private getPlantPosition(index: number, total: number): { x: number; y: number; scale: number } {
    // Distribute plants across 3 depth rows
    const row = index % 3   // 0 = back, 1 = mid, 2 = front
    const depthScales = [0.70, 0.85, 1.00]
    const depthY = [-80, 0, 80]   // Y offset per row on the platform

    return {
      x: (Math.random() - 0.5) * 300,
      y: depthY[row] + (Math.random() - 0.5) * 20,
      scale: depthScales[row]
    }
  }

  private startIdleAnimations(): void {
    this.plants.forEach((plant, i) => {
      gsap.to(plant, {
        rotation: 0.03,      // ~1.7 degrees
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4       // stagger per plant
      })
    })
  }

  animatePlantReaction(assetClass: string, effect: number): void {
    const plant = this.plants.find(p => p.assetClass === assetClass)
    if (!plant) return

    if (effect > 0) {
      // Grow animation
      gsap.to(plant.scale, {
        x: 1.15, y: 1.15,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(2)'
      })
      plant.setState('growing')
    } else {
      // Wilt animation
      gsap.to(plant.scale, {
        x: 0.9, y: 0.85,
        duration: 1.0,
        ease: 'power2.out'
      })
      gsap.to(plant, {
        alpha: 0.7,
        duration: 1.0
      })
      plant.setState('damaged')
    }
  }

  setWeather(weatherType: string): void {
    // Change background colour and trigger weather overlay
    // Background colour is on the app, overlay is in weatherLayer
    const colours: Record<string, number> = {
      sun:       0xFFF9C4,
      rain:      0x7EA8C0,
      storm:     0x1C2833,
      frost:     0xD6EAF8,
      heat:      0xF0B27A,
      lightning: 0x1A252F,
      calm:      0xE8F4F8,
    }
    gsap.to(this.app.renderer, {
      // Note: background colour change via tween requires custom approach
      // Use a fullscreen coloured rect as background instead
      duration: 1.0
    })
  }
}
```

### `src/components/PlantSprite.ts`
```typescript
import { Container, Sprite } from 'pixi.js'
import type { PlantState } from '../types'

export class PlantSprite extends Container {
  public assetClass: string
  private sprite: Sprite
  private currentState: PlantState = 'healthy'

  constructor(assetClass: string, position: { x: number; y: number; scale: number }) {
    super()
    this.assetClass = assetClass

    // Load PNG icon for this plant
    this.sprite = Sprite.from(`assets/plants/${assetClass}.png`)
    this.sprite.anchor.set(0.5, 1.0)   // anchor at bottom-centre for ground placement
    this.addChild(this.sprite)

    this.x = position.x
    this.y = position.y
    this.scale.set(position.scale)
  }

  setState(state: PlantState): void {
    this.currentState = state
    // Swap texture based on state
    // e.g. cherry-blossom-healthy.png, cherry-blossom-wilted.png
    this.sprite.texture = Sprite.from(`assets/plants/${this.assetClass}-${state}.png`).texture
  }
}
```

---

## CSS Animations → GSAP

Everything that was a CSS `@keyframes` in the original doc becomes a GSAP tween.

| Original CSS | GSAP equivalent |
|---|---|
| `plantAppear` keyframe | `gsap.from(plant, { scale: 0, y: 10, opacity: 0, duration: 0.5, ease: 'back.out(2)' })` |
| `plantWilt` keyframe | `gsap.to(plant, { scaleY: 0.85, rotation: -0.05, alpha: 0.7, duration: 1.0, ease: 'power2.out' })` |
| `sway` keyframe | `gsap.to(plant, { rotation: 0.03, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })` |
| Screen fade in | `gsap.from(element, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.out' })` |
| Score count up | `gsap.to(counter, { innerText: targetScore, duration: 1.5, ease: 'power2.out', snap: { innerText: 1 } })` |
| Confetti fall | `gsap.to(piece, { y: window.innerHeight, rotation: 720, opacity: 0, duration: 2.5, ease: 'power1.in' })` |

---

## UI Layer — HTML + CSS

The nav bar, cards, sliders, buttons, and chat interface are **not** built in PixiJS. They are plain HTML elements positioned absolutely over the canvas. All CSS values from GROWDEN-VISUAL-DESIGN.md apply here unchanged.

### `src/ui/UIManager.ts`
```typescript
export class UIManager {
  private uiLayer: HTMLElement

  constructor() {
    this.uiLayer = document.getElementById('ui-layer')!
  }

  showScreen(screen: 'landing' | 'riskProfile' | 'garden' | 'event' | 'battle' | 'debrief'): void {
    this.uiLayer.innerHTML = ''   // clear current screen

    const screenComponents: Record<string, () => string> = {
      landing:     this.renderLanding,
      riskProfile: this.renderRiskProfile,
      garden:      this.renderGardenControls,
      event:       this.renderEventCard,
      battle:      this.renderBattleMode,
      debrief:     this.renderDebrief,
    }

    this.uiLayer.innerHTML = screenComponents[screen]()
    this.attachEventListeners(screen)
  }

  private renderLanding(): string {
    return `
      <nav class="nav">
        <div class="nav-logo">🌱 Growden <span class="nav-mode">MAIN GAME</span></div>
      </nav>
      <div class="landing-content">
        <p class="landing-label">PostFinance · Wealth Manager Arena</p>
        <h1 class="landing-title">Growden 🌱</h1>
        <p class="landing-sub">Grow your knowledge. Grow your wealth.</p>
        <button class="btn-primary" id="btn-start">Start Growing →</button>
        <a class="link-muted" id="btn-battle">Daily Challenge ⚡</a>
      </div>
    `
  }

  // ... other render methods
}
```

All CSS for these HTML components matches exactly what is in GROWDEN-VISUAL-DESIGN.md — colours, fonts, padding, border-radius, shadows. No changes needed there.

---

## Colour Tokens — TypeScript Version

Use these instead of raw hex strings anywhere in PixiJS code.
PixiJS uses hex as numbers (prefix `0x` instead of `#`).

### `src/constants/colors.ts`
```typescript
export const COLORS = {
  // PostFinance brand
  yellow:      0xFFD100,
  petrol:      0x1B4F6C,
  petrolLight: 0x2A6F96,
  grapefruit:  0xE8623C,
  lightBlue:   0x7EC8E3,

  // Backgrounds
  background:  0xF0EDE6,
  surface:     0xFFFFFF,

  // Text (as CSS strings — used in HTML layer only)
  textPrimary: '#1A1A2E',
  textMuted:   '#8A8A9A',

  // Semantic
  positive:    0x27AE60,
  negative:    0xE74C3C,
  warning:     0xF39C12,

  // Garden
  groundSand:  0xC8B89A,
  skyTop:      0xE8F4F8,
  skyBottom:   0xF0EDE6,

  // Weather
  weatherSun:       0xFFF9C4,
  weatherRain:      0x7EA8C0,
  weatherStorm:     0x1C2833,
  weatherFrost:     0xD6EAF8,
  weatherHeat:      0xF0B27A,
  weatherLightning: 0x1A252F,
  weatherCalm:      0xE8F4F8,
} as const

// CSS hex strings — for HTML UI layer
export const CSS_COLORS = {
  yellow:     '#FFD100',
  petrol:     '#1B4F6C',
  grapefruit: '#E8623C',
  lightBlue:  '#7EC8E3',
  background: '#F0EDE6',
  surface:    '#FFFFFF',
  positive:   '#27AE60',
  negative:   '#E74C3C',
  warning:    '#F39C12',
} as const
```

---

## Asset Loading

All plant PNGs and garden assets must be preloaded before the PixiJS scene starts.

### `src/constants/assets.ts`
```typescript
export const PLANT_ASSETS = [
  // Equities
  { id: 'cherry_blossom',      path: 'assets/plants/cherry-blossom.png' },
  { id: 'magnolia',            path: 'assets/plants/magnolia.png' },
  { id: 'flame_tree',          path: 'assets/plants/flame-tree.png' },
  { id: 'apple_tree',          path: 'assets/plants/apple-tree.png' },
  // Bonds
  { id: 'camellia',            path: 'assets/plants/camellia.png' },
  { id: 'hydrangea',           path: 'assets/plants/hydrangea.png' },
  { id: 'hibiscus',            path: 'assets/plants/hibiscus.png' },
  { id: 'bougainvillea',       path: 'assets/plants/bougainvillea.png' },
  // Cash
  { id: 'meadow_grass',        path: 'assets/plants/meadow-grass.png' },
  { id: 'edelweiss',           path: 'assets/plants/edelweiss.png' },
  { id: 'clover',              path: 'assets/plants/clover.png' },
  { id: 'silver_grass',        path: 'assets/plants/silver-grass.png' },
  // Commodities
  { id: 'golden_barrel',       path: 'assets/plants/golden-barrel.png' },
  { id: 'night_blooming',      path: 'assets/plants/night-blooming-cactus.png' },
  { id: 'prickly_pear',        path: 'assets/plants/prickly-pear.png' },
  { id: 'cholla',              path: 'assets/plants/cholla.png' },
  // Crypto
  { id: 'white_phalaenopsis',  path: 'assets/plants/white-phalaenopsis.png' },
  { id: 'purple_dendrobium',   path: 'assets/plants/purple-dendrobium.png' },
  { id: 'blue_exotic_orchid',  path: 'assets/plants/blue-exotic-orchid.png' },
  { id: 'green_cymbidium',     path: 'assets/plants/green-cymbidium.png' },
  // Garden
  { id: 'platform',            path: 'assets/garden/platform.png' },
  { id: 'sky',                 path: 'assets/garden/sky-background.png' },
]

export async function preloadAll(): Promise<void> {
  const { Assets } = await import('pixi.js')
  await Assets.load(PLANT_ASSETS.map(a => ({ alias: a.id, src: a.path })))
}
```

---

## What does NOT change from the original doc

Everything in GROWDEN-VISUAL-DESIGN.md that is HTML/CSS-based is **unchanged**:

- All colour hex values
- All typography rules (font family, weights, sizes)
- All spacing tokens
- All border-radius tokens
- All shadow values
- All component CSS specs (buttons, cards, badges, sliders, chat bubbles)
- All screen layouts (nav, cards, allocation controls, results panels)
- All responsive behaviour rules
- Accessibility rules

Those apply to the HTML/CSS UI layer exactly as written.

---

## What changes from the original doc

| Original (HTML/CSS/React) | PixiJS + TypeScript replacement |
|---|---|
| CSS `@keyframes` for plant animations | GSAP tweens in `GardenScene.ts` |
| `<img src="...">` for plant icons | `Sprite.from('assets/...')` |
| `style.backgroundColor` | `app.renderer.background.color = 0xF0EDE6` |
| React `useState` for game state | TypeScript class `GameState` + event emitter |
| React Router for screens | `UIManager.showScreen()` method |
| CSS filter for wilt effect | GSAP alpha + scale tween on Sprite |
| CSS `transform: scale()` for growth | GSAP scale tween on Container |
| Recharts LineChart | PixiJS `Graphics` API for the portfolio chart, or keep as HTML canvas overlay |

---

## Recommended Folder Structure

```
growden/
├── index.html
├── style.css
├── src/
│   ├── main.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── assets.ts
│   │   └── config.ts
│   ├── scenes/
│   │   └── GardenScene.ts
│   ├── components/
│   │   └── PlantSprite.ts
│   ├── ui/
│   │   └── UIManager.ts
│   ├── data/
│   │   ├── events.ts
│   │   └── plants.ts
│   ├── utils/
│   │   ├── scoring.ts
│   │   └── firebaseService.ts
│   └── services/
│       └── coachService.ts
├── assets/
│   ├── plants/
│   └── garden/
└── public/
```
