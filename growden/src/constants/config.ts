/**
 * Game configuration constants — tuning knobs for levels, scoring,
 * risk profiles, tutorial steps, and per-level event pools.
 */

import type { RiskProfile, TutorialStep } from '../types'

export const GAME_CONFIG = {
  MAX_LEVEL: 10,
  STARTING_FLOWERS: 10000,
  FLOWERS_PER_LEVEL_WIN: 200,
  PLANT_COST: 100,
  MAX_GARDEN_PLOTS: 10,

  // Amplitude multipliers
  AMPLITUDE_MULTIPLIERS: {
    light: 0.4,
    moderate: 1.0,
    severe: 2.2,
  } as const,

  // Scoring
  PANIC_SELL_PENALTY: -25,
  HOLD_BONUS: 15,
  DIVERSIFICATION_BONUS: 20,
  OVERTRADING_PENALTY: -10,
  ESG_PENALTY: -10,

  // Animation timings (ms)
  WEATHER_TRANSITION_DURATION: 1000,
  PLANT_REACTION_DURATION: 800,
  EVENT_CARD_DELAY: 500,
  LEVEL_TRANSITION_DURATION: 1500,
} as const

export const RISK_PROFILES: Record<RiskProfile, {
  name: string
  emoji: string
  description: string
  suggestedAllocation: Record<string, number>
  color: string
}> = {
  zen: {
    name: 'Zen Garden',
    emoji: '🧘',
    description: 'Conservative. Mostly bonds and cash. Slow and steady growth. Your garden will survive any storm.',
    suggestedAllocation: { bonds: 50, cash: 25, equity: 15, commodities: 10, crypto: 0 },
    color: '#7EC8E3',
  },
  meadow: {
    name: 'Meadow',
    emoji: '🌿',
    description: 'Balanced. A mix of everything. Moderate growth with moderate risk. The all-rounder.',
    suggestedAllocation: { bonds: 30, cash: 10, equity: 35, commodities: 15, crypto: 10 },
    color: '#27AE60',
  },
  jungle: {
    name: 'Jungle',
    emoji: '🌴',
    description: 'Aggressive. Equity-focused for maximum growth potential. Can get wild in storms.',
    suggestedAllocation: { bonds: 10, cash: 5, equity: 45, commodities: 15, crypto: 25 },
    color: '#E8623C',
  },
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Growden',
    content: 'Your garden represents your investment portfolio. Each plant is a real financial asset. Grow your garden wisely and watch your wealth bloom.',
    emoji: '🌱',
  },
  {
    id: 2,
    title: 'Meet the Plants',
    content: 'Trees are stocks — they grow tall but sway in storms. Bushes are bonds — steady and reliable. Grass is cash — always there. Cacti are commodities — tough survivors. Orchids are crypto — beautiful but fragile.',
    emoji: '🌳',
    highlightPlants: ['apple_tree', 'camellia', 'meadow_grass_usd', 'golden_barrel', 'white_phalaenopsis'],
  },
  {
    id: 3,
    title: 'Weather is the Market',
    content: 'Sunshine means good earnings. Rain is rising interest rates. Storms are market crashes. Each weather event affects your plants differently — that is why you diversify.',
    emoji: '⛅',
  },
  {
    id: 4,
    title: 'Diversification',
    content: 'Don\'t plant only orchids! When a storm hits, they all die. Mix your garden: trees for growth, bushes for stability, grass for safety, cacti for insurance.',
    emoji: '🌈',
  },
  {
    id: 5,
    title: 'Flowers = Currency',
    content: 'You earn flowers by surviving weather events and making smart decisions. Spend flowers to buy new plants and expand your garden. The better you play, the more options you unlock.',
    emoji: '🌸',
  },
  {
    id: 6,
    title: 'Stay Calm',
    content: 'The biggest mistake in investing: panic selling during a storm. Your plants may look damaged, but most recover. Patience is rewarded. Panic is penalized.',
    emoji: '🧘',
  },
]

export const LEVEL_EVENTS: Record<number, string[]> = {
  1: ['calm_year', 'earnings_season'],
  2: ['fed_rate_hike', 'inflation_shock', 'earnings_season'],
  3: ['unemployment_spike', 'earnings_season', 'calm_year'],
  4: ['fed_rate_hike', 'calm_year'],
  5: ['oil_crisis', 'inflation_shock'],
  6: ['tariff_crisis', 'earnings_season'],
  7: ['high_volatility', 'calm_year', 'unemployment_spike'],
  8: ['geopolitical_shock', 'fed_rate_hike'],
  9: ['sector_mania', 'fed_rate_cut'],
  10: ['high_volatility', 'geopolitical_shock', 'sector_mania'],
}
