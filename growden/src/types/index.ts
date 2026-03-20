/** Shared type definitions for the entire Growden application */

export type RiskProfile = 'zen' | 'meadow' | 'jungle'
export type Amplitude = 'light' | 'moderate' | 'severe'
export type PlantState = 'healthy' | 'growing' | 'damaged' | 'wilted'
export type WeatherType = 'sun' | 'rain' | 'storm' | 'frost' | 'heat' | 'lightning' | 'fog' | 'calm' | 'tornado' | 'meteor' | 'acid_rain'
export type PlantCategory = 'equity' | 'bonds' | 'cash' | 'commodities' | 'crypto'
export type PlantType = 'classic' | 'bad'
export type ScreenName = 'landing' | 'riskProfile' | 'tutorial' | 'garden' | 'event' | 'debrief' | 'battle'

export interface AmplitudeData {
  label: string
  emoji: string
  headline: string
  effects: Record<string, number>
}

export interface GameEvent {
  id: string
  name: string
  category: string
  weatherType: WeatherType
  weatherEmoji: string
  variant?: string
  twoPhase?: boolean
  amplitudes?: Record<Amplitude, AmplitudeData>
  phase1?: AmplitudeData
  phase2?: AmplitudeData
  rebalanceWindowBetweenPhases?: boolean
  appearsAtLevels: number[]
  unlocksPlant?: string
  learning: string
  floraHint: string
  penaltyForOvertrading?: boolean
  overtradingPenalty?: number
  panicSellPenalty?: number
  holdBonusPoints?: number
}

export interface PlantVisualStates {
  seed: string
  sprout: string
  growing: string
  blooming: string
}

export interface Plant {
  id: string
  name: string
  emoji: string
  icon: string
  category: PlantCategory
  subCategory: string
  realWorldEquivalent: string
  color: string
  colorName: string
  keywords: string[]
  unlocksAtLevel: number
  visualStates: PlantVisualStates
  baseEffects: Record<string, number>
  riskLevel: string
  volatility: string
  rebound?: boolean
  cost: number           // flowers to buy one unit (10% allocation)
  sellRatio?: number     // fraction of cost refunded on sell (default 0.5)
  floraInsight: string
  // Bond-specific
  couponYield?: number
  creditRating?: string
  // Cash-specific
  inflationRisk?: boolean
  safeHaven?: boolean
  carryTradeRisk?: boolean
  // Commodity-specific
  incomeYield?: boolean
  economicIndicator?: boolean
  essentialGood?: boolean
  // Crypto-specific
  cryptoCategory?: string
  // Equity-specific
  dividendYield?: boolean
  comparisonPlant?: string
  currencyRisk?: boolean
}

export interface BadPlant extends Plant {
  isBadPlant: true
  badPlantType: string
  scoringImpact: Record<string, number>
  // Junk Weed specific
  couponYield?: number
  defaultRisk?: Record<string, number>
  // Leveraged Vine specific
  leverageMultiplier?: number
  liquidationThreshold?: number
}

export interface Portfolio {
  [plantId: string]: number  // plantId -> allocation (number of units or percentage)
}

export interface GameState {
  riskProfile: RiskProfile | null
  portfolio: Portfolio
  currentLevel: number
  maxLevel: number
  flowers: number  // unified currency — replaces both old "portfolioValue" and "flowers"
  flowerHistory: { level: number; value: number }[]
  score: number
  scoreBreakdown: ScoreEvent[]
  unlockedPlants: string[]
  playerName: string
  currentScreen: ScreenName
  tutorialStep: number
  tutorialCompleted: boolean
  eventsHistory: EventResult[]
}

export interface ScoreEvent {
  label: string
  points: number
  level: number
}

export interface EventResult {
  eventId: string
  amplitude: Amplitude
  level: number
  flowersBefore: number
  flowersAfter: number
  playerAction: 'hold' | 'rebalance' | 'panic_sell'
  pointsEarned: number
}

export interface GardenPlot {
  x: number
  y: number
  plantId: string | null
  state: PlantState
}

export interface TutorialStep {
  id: number
  title: string
  content: string
  emoji: string
  highlightPlants?: string[]
}

export interface BattleModeState {
  headline: string
  eventId: string
  amplitude: Amplitude
  players: BattlePlayer[]
  phase: 'setup' | 'reveal' | 'results'
}

export interface BattlePlayer {
  id: string
  name: string
  portfolio: Portfolio
  score: number
  riskScore: number
  profitScore: number
  esgScore: number
}
