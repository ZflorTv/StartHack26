/**
 * ScoringEngine — Battle mode scoring
 *
 * Evaluates a portfolio against a specific event across three axes:
 *  1. Risk reliability  — how well the portfolio matches the declared risk profile
 *  2. Profitability     — how the portfolio performed through the event
 *  3. ESG score         — penalises dirty / speculative assets (coal, leverage, junk)
 */

import type { Portfolio, RiskProfile, Amplitude } from '../types'
import { RISK_PROFILES } from '../constants/config'
import { PLANTS_MAP } from '../data/plants'
import { BAD_PLANTS_MAP } from '../data/badPlants'

export interface BattleScore {
  total: number
  riskReliability: number    // 0-100
  profitability: number      // 0-100
  returnRiskRatio: number    // 0-100
  esgScore: number           // 0-100
  breakdown: {
    riskDetail: string
    profitDetail: string
    returnRiskDetail: string
    esgDetail: string
  }
}

// Maps plant categories to the abstract effect keys used in event data
const CATEGORY_EFFECT_KEY: Record<string, string> = {
  equity: 'oak',
  bonds: 'bush',
  cash: 'grass',
  commodities: 'cactus',
  crypto: 'exotic',
}

export class ScoringEngine {

  // Calculate battle mode score
  static scoreBattle(
    portfolio: Portfolio,
    declaredProfile: RiskProfile,
    eventEffects: Record<string, number>,
    amplitude: Amplitude,
  ): BattleScore {
    const riskReliability = ScoringEngine.calculateRiskReliability(portfolio, declaredProfile)
    const profitability = ScoringEngine.calculateProfitability(portfolio, eventEffects, amplitude)
    const returnRiskRatio = ScoringEngine.calculateReturnRiskRatio(portfolio, eventEffects, amplitude)
    const esgScore = ScoringEngine.calculateESG(portfolio)

    // Weighted total: risk 25%, profit 30%, return/risk 25%, ESG 20%
    const total = Math.round(
      riskReliability * 0.25 +
      profitability * 0.30 +
      returnRiskRatio * 0.25 +
      esgScore * 0.20
    )

    return {
      total,
      riskReliability,
      profitability,
      returnRiskRatio,
      esgScore,
      breakdown: {
        riskDetail: `Portfolio alignment with ${declaredProfile} profile`,
        profitDetail: `Performance through the event`,
        returnRiskDetail: 'Expected reward per unit of volatility',
        esgDetail: `Sustainability and clean asset score`,
      },
    }
  }

  // How well does the portfolio match the declared risk profile?
  static calculateRiskReliability(portfolio: Portfolio, declaredProfile: RiskProfile): number {
    const suggested = RISK_PROFILES[declaredProfile].suggestedAllocation
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    if (total === 0) return 0

    // Normalize portfolio to percentages by category
    const actualByCategory: Record<string, number> = {}
    Object.entries(portfolio).forEach(([plantId, allocation]) => {
      const plant = PLANTS_MAP[plantId]
      if (plant) {
        const cat = plant.category
        actualByCategory[cat] = (actualByCategory[cat] || 0) + (allocation / total) * 100
      }
    })

    // Calculate deviation from suggested
    let totalDeviation = 0
    Object.entries(suggested).forEach(([category, targetPct]) => {
      const actual = actualByCategory[category] || 0
      totalDeviation += Math.abs(actual - targetPct)
    })

    // Convert to 0-100 score (0 deviation = 100, 200 deviation = 0)
    const score = Math.max(0, Math.round(100 - totalDeviation / 2))
    return score
  }

  // How well did the portfolio perform through the event?
  static calculateProfitability(
    portfolio: Portfolio,
    effects: Record<string, number>,
    amplitude: Amplitude,
  ): number {
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    if (total === 0) return 50  // neutral

    const amplitudeMultipliers = { light: 0.4, moderate: 1.0, severe: 2.2 }
    const multiplier = amplitudeMultipliers[amplitude]

    let weightedEffect = 0
    Object.entries(portfolio).forEach(([plantId, allocation]) => {
      const weight = allocation / total
      // Bad plants have direct effect keys; regular plants use category mapping
      const plant = PLANTS_MAP[plantId]
      const effectKey = plant ? (CATEGORY_EFFECT_KEY[plant.category] ?? plantId) : plantId
      const effect = effects[effectKey] ?? effects[plantId] ?? 0
      weightedEffect += effect * weight
    })

    const totalReturn = weightedEffect * multiplier

    // Map return to 0-100 score. +30% = 100, -30% = 0, 0% = 50
    const score = Math.max(0, Math.min(100, Math.round(50 + totalReturn * 166.7)))
    return score
  }

  // Return/Risk ratio proxy: expected return divided by expected volatility.
  static calculateReturnRiskRatio(
    portfolio: Portfolio,
    effects: Record<string, number>,
    amplitude: Amplitude,
  ): number {
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    if (total === 0) return 0

    const amplitudeMultipliers = { light: 0.4, moderate: 1.0, severe: 2.2 }
    const multiplier = amplitudeMultipliers[amplitude]

    const weightedReturns: Array<{ weight: number; effect: number }> = []
    let expectedReturn = 0

    Object.entries(portfolio).forEach(([plantId, allocation]) => {
      const weight = allocation / total
      const effect = (effects[plantId] ?? 0) * multiplier
      expectedReturn += effect * weight
      weightedReturns.push({ weight, effect })
    })

    const variance = weightedReturns.reduce((sum, item) => {
      const diff = item.effect - expectedReturn
      return sum + item.weight * diff * diff
    }, 0)
    const volatility = Math.sqrt(Math.max(variance, 0))

    // Add a small floor to avoid division explosion on near-zero volatility.
    const sharpeLike = expectedReturn / (volatility + 0.02)

    // Map roughly [-1.0, +1.0] to [0, 100].
    const normalized = 50 + sharpeLike * 50
    return Math.max(0, Math.min(100, Math.round(normalized)))
  }

  // ESG score: penalize dirty assets, reward clean ones
  static calculateESG(portfolio: Portfolio): number {
    const total = Object.values(portfolio).reduce((sum, v) => sum + v, 0)
    if (total === 0) return 100  // no allocation = no penalty

    let esgPenalty = 0

    Object.entries(portfolio).forEach(([plantId, allocation]) => {
      const weight = allocation / total
      // Bad plants carry ESG penalties
      if (plantId === 'coal_bush') {
        esgPenalty += weight * 80  // heavy penalty
      } else if (plantId === 'leveraged_vine') {
        esgPenalty += weight * 20  // moderate penalty (speculation)
      } else if (plantId === 'junk_weed') {
        esgPenalty += weight * 10  // mild penalty
      }
    })

    return Math.max(0, Math.round(100 - esgPenalty))
  }
}
