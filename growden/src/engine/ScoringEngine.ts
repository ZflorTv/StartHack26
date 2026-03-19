import type { Portfolio, RiskProfile, Amplitude } from '../types'
import { RISK_PROFILES } from '../constants/config'
import { PLANTS_MAP } from '../data/plants'
import { BAD_PLANTS_MAP } from '../data/badPlants'

export interface BattleScore {
  total: number
  riskReliability: number    // 0-100
  profitability: number      // 0-100
  esgScore: number           // 0-100
  breakdown: {
    riskDetail: string
    profitDetail: string
    esgDetail: string
  }
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
    const esgScore = ScoringEngine.calculateESG(portfolio)

    // Weighted total: risk 30%, profit 40%, ESG 30%
    const total = Math.round(
      riskReliability * 0.30 +
      profitability * 0.40 +
      esgScore * 0.30
    )

    return {
      total,
      riskReliability,
      profitability,
      esgScore,
      breakdown: {
        riskDetail: `Portfolio alignment with ${declaredProfile} profile`,
        profitDetail: `Performance through the event`,
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
      const effect = effects[plantId] ?? 0
      weightedEffect += effect * weight
    })

    const totalReturn = weightedEffect * multiplier

    // Map return to 0-100 score. +30% = 100, -30% = 0, 0% = 50
    const score = Math.max(0, Math.min(100, Math.round(50 + totalReturn * 166.7)))
    return score
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
