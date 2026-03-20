/**
 * Bad plant definitions — risky assets that teach ESG and leverage lessons.
 *
 * Coal Bush (non-ESG), Junk Weed (distressed bonds), Leveraged Vine (margin).
 * Each carries scoring penalties if held at the wrong time.
 */

import { BadPlant, Plant } from '../types';
import { PLANTS } from './plants';

export const BAD_PLANTS: BadPlant[] = [
  {
    id: 'coal_bush',
    name: 'Coal Bush',
    emoji: '🏭',
    icon: 'assets/plants/coal_bush.png',
    category: 'equity',
    subCategory: 'Non-ESG',
    realWorldEquivalent: 'Coal & Fossil Fuel Companies',
    color: '#4A4A4A',
    colorName: 'Dark Gray',
    keywords: ['coal', 'fossil', 'esg', 'carbon', 'dirty'],
    unlocksAtLevel: 7,
    cost: 40,
    sellRatio: 0.3,
    visualStates: {
      seed: 'coal_bush_seed',
      sprout: 'coal_bush_sprout',
      growing: 'coal_bush_growing',
      blooming: 'coal_bush_blooming',
    },
    baseEffects: {
      stable_year: 0.12,
      bull_market: 0.09,
      esg_regulation: -0.28,
      carbon_tax: -0.22,
      market_crash: -0.18,
    },
    riskLevel: 'high',
    volatility: 'high',
    rebound: false,
    floraInsight: 'The coal bush looks sturdy but poisons the soil around it. ESG regulation is coming — will you sell before the garden judges you?',
    isBadPlant: true,
    badPlantType: 'non_esg',
    scoringImpact: {
      holdThroughESGEvent: -20,
      holdAtGameEnd: -10,
      sellBeforeESGEvent: 15,
    },
  },
  {
    id: 'junk_weed',
    name: 'Junk Weed',
    emoji: '🌵',
    icon: 'assets/plants/junk_weed.png',
    category: 'bonds',
    subCategory: 'Junk Bond',
    realWorldEquivalent: 'Distressed / CCC-Rated Bonds',
    color: '#8B4513',
    colorName: 'Saddle Brown',
    keywords: ['junk', 'distressed', 'default', 'credit'],
    unlocksAtLevel: 6,
    cost: 60,
    sellRatio: 0.25,
    visualStates: {
      seed: 'junk_weed_seed',
      sprout: 'junk_weed_sprout',
      growing: 'junk_weed_growing',
      blooming: 'junk_weed_blooming',
    },
    baseEffects: {
      stable_year: 0.08,
      bull_market: 0.07,
      recession: -0.22,
      credit_crisis: -0.35,
      market_crash: -0.28,
      rate_hike: -0.10,
    },
    riskLevel: 'very_high',
    volatility: 'very_high',
    rebound: false,
    floraInsight: 'Junk weed spreads fast and pays a sweet nectar — until it doesn\'t. When credit dries up, this plant collapses overnight.',
    isBadPlant: true,
    badPlantType: 'junk_bond',
    couponYield: 0.08,
    defaultRisk: {
      stable: 0.04,
      recession: 0.18,
      crisis: 0.35,
    },
    scoringImpact: {
      allocationAbove20pct: -15,
      holdThroughCreditCrisis: -25,
      allocationBelow10pct: 0,
      sellBeforeRecession: 10,
    },
  },
  {
    id: 'leveraged_vine',
    name: 'Leveraged Vine',
    emoji: '🌿',
    icon: 'assets/plants/leveraged_vine.png',
    category: 'equity',
    subCategory: 'Over-leveraged',
    realWorldEquivalent: 'Leveraged ETFs / Margin Positions',
    color: '#2ECC71',
    colorName: 'Emerald Green',
    keywords: ['leveraged', 'margin', 'amplified', 'liquidation'],
    unlocksAtLevel: 8,
    cost: 120,
    sellRatio: 0.2,
    visualStates: {
      seed: 'leveraged_vine_seed',
      sprout: 'leveraged_vine_sprout',
      growing: 'leveraged_vine_growing',
      blooming: 'leveraged_vine_blooming',
    },
    baseEffects: {
      bull_market: 0.45,
      stable_year: 0.12,
      mild_correction: -0.30,
      volatility_spike: -1.0,
      market_crash: -1.0,
    },
    riskLevel: 'extreme',
    volatility: 'extreme',
    rebound: false,
    floraInsight: 'The leveraged vine climbs faster than anything in the garden — but one strong wind and it snaps, taking everything with it.',
    isBadPlant: true,
    badPlantType: 'over_leveraged',
    leverageMultiplier: 5,
    liquidationThreshold: -0.20,
    scoringImpact: {
      allocationAbove15pct: -20,
      getLiquidated: -35,
      allocationBelow5pct: -5,
      avoidEntirely: 10,
    },
  },
];

export const BAD_PLANTS_MAP: Record<string, BadPlant> = {};
BAD_PLANTS.forEach(p => BAD_PLANTS_MAP[p.id] = p);

export const ALL_PLANTS: (Plant | BadPlant)[] = [...PLANTS, ...BAD_PLANTS];

const ALL_PLANTS_MAP: Record<string, Plant | BadPlant> = {}
ALL_PLANTS.forEach(p => ALL_PLANTS_MAP[p.id] = p)

/** Get buy cost for any plant (regular or bad) */
export function getPlantCost(plantId: string): number {
  return ALL_PLANTS_MAP[plantId]?.cost ?? 100
}

/** Get sell refund for any plant (regular or bad) */
export function getPlantSellValue(plantId: string): number {
  const plant = ALL_PLANTS_MAP[plantId]
  if (!plant) return 50
  return Math.round(plant.cost * (plant.sellRatio ?? 0.5))
}
