import type { GameEvent, Amplitude, EventResult } from '../types'
import { GameStateManager } from './GameState'
import { GAME_EVENTS, EVENTS_MAP, getEventsForLevel } from '../data/events'
import { GAME_CONFIG, LEVEL_EVENTS } from '../constants/config'

export class SimulationEngine {
  private gameState: GameStateManager

  constructor(gameState: GameStateManager) {
    this.gameState = gameState
  }

  // Pick a random event for the current level
  pickEventForLevel(level?: number): { event: GameEvent; amplitude: Amplitude } {
    const currentLevel = level ?? this.gameState.getCurrentLevel()

    // Get event IDs configured for this level
    const eventIds = LEVEL_EVENTS[currentLevel] || ['calm_year']

    // Pick random event from available ones
    const eventId = eventIds[Math.floor(Math.random() * eventIds.length)]
    const event = EVENTS_MAP[eventId]

    if (!event) {
      // Fallback to calm year
      return { event: EVENTS_MAP['calm_year'], amplitude: 'moderate' }
    }

    // Pick amplitude weighted by level (higher levels = more severe)
    const amplitude = this.pickAmplitude(currentLevel)

    return { event, amplitude }
  }

  private pickAmplitude(level: number): Amplitude {
    // As level increases, severe events become more likely
    const rand = Math.random()
    const severeThreshold = 0.1 + (level / 10) * 0.3  // 10% at L1, 40% at L10
    const moderateThreshold = severeThreshold + 0.4     // always 40% moderate

    if (rand < severeThreshold) return 'severe'
    if (rand < moderateThreshold) return 'moderate'
    return 'light'
  }

  // Apply an event to the portfolio
  applyEvent(event: GameEvent, amplitude: Amplitude): EventResult {
    const portfolioBefore = this.gameState.getPortfolioValue()

    if (event.twoPhase && event.phase1 && event.phase2) {
      // Two-phase events (sector mania): apply phase1 first
      this.gameState.applyEventEffects(event.phase1.effects, 'moderate')
    } else if (event.amplitudes) {
      const amplitudeData = event.amplitudes[amplitude]
      if (amplitudeData) {
        this.gameState.applyEventEffects(amplitudeData.effects, amplitude)
      }
    }

    const portfolioAfter = this.gameState.getPortfolioValue()

    const result: EventResult = {
      eventId: event.id,
      amplitude,
      level: this.gameState.getCurrentLevel(),
      portfolioBefore,
      portfolioAfter,
      playerAction: 'hold',
      pointsEarned: 0,
    }

    return result
  }

  // Apply phase 2 of a two-phase event
  applyEventPhase2(event: GameEvent): void {
    if (event.twoPhase && event.phase2) {
      this.gameState.applyEventEffects(event.phase2.effects, 'moderate')
    }
  }

  // Score the player's response to an event
  scoreEventResponse(event: GameEvent, result: EventResult, action: 'hold' | 'rebalance' | 'panic_sell'): number {
    result.playerAction = action
    let points = 0

    // Base scoring
    const changePercent = (result.portfolioAfter - result.portfolioBefore) / result.portfolioBefore

    if (changePercent > 0) {
      points += Math.round(changePercent * 100)
    }

    // Bonus for holding through volatility
    if (action === 'hold' && event.holdBonusPoints) {
      points += event.holdBonusPoints
      this.gameState.addScore(`Held through ${event.name}`, event.holdBonusPoints)
    }

    // Penalty for panic selling
    if (action === 'panic_sell') {
      const penalty = event.panicSellPenalty || GAME_CONFIG.PANIC_SELL_PENALTY
      points += penalty
      this.gameState.addScore(`Panic sold during ${event.name}`, penalty)
    }

    // Overtrading penalty for calm events
    if (event.penaltyForOvertrading && action === 'rebalance') {
      const penalty = event.overtradingPenalty || GAME_CONFIG.OVERTRADING_PENALTY
      points += penalty
      this.gameState.addScore(`Overtaded during ${event.name}`, penalty)
    }

    // Diversification bonus
    const diversScore = this.gameState.getDiversificationScore()
    if (diversScore >= 60) {
      const bonus = Math.round(diversScore / 10)
      points += bonus
      this.gameState.addScore('Diversification bonus', bonus)
    }

    result.pointsEarned = points
    this.gameState.addEventResult(result)
    if (points !== 0) {
      this.gameState.addScore(`Level ${result.level} performance`, points)
    }

    return points
  }

  // Complete the current level and advance
  completeLevel(): boolean {
    return this.gameState.advanceLevel()
  }

  // Check for bad plant penalties at end of game
  calculateFinalScore(): { total: number; breakdown: Array<{ label: string; points: number }> } {
    const state = this.gameState.getState()
    const breakdown: Array<{ label: string; points: number }> = []
    let total = state.score

    // ESG penalty for holding coal_bush
    if (state.portfolio['coal_bush'] && state.portfolio['coal_bush'] > 0) {
      const penalty = -10
      total += penalty
      breakdown.push({ label: 'Held Coal Bush at end', points: penalty })
      this.gameState.addScore('Held Coal Bush at end', penalty)
    }

    // Diversification final bonus
    const diversScore = this.gameState.getDiversificationScore()
    if (diversScore >= 80) {
      const bonus = GAME_CONFIG.DIVERSIFICATION_BONUS
      total += bonus
      breakdown.push({ label: 'Excellent diversification', points: bonus })
      this.gameState.addScore('Excellent diversification', bonus)
    }

    // Portfolio growth bonus
    const growth = (state.portfolioValue - GAME_CONFIG.BASE_PORTFOLIO_VALUE) / GAME_CONFIG.BASE_PORTFOLIO_VALUE
    if (growth > 0) {
      const growthBonus = Math.round(growth * 50)
      total += growthBonus
      breakdown.push({ label: `Portfolio grew ${Math.round(growth * 100)}%`, points: growthBonus })
      this.gameState.addScore(`Portfolio grew ${Math.round(growth * 100)}%`, growthBonus)
    }

    return { total, breakdown }
  }
}
