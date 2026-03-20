/**
 * Achievements — Badge system, streak tracking, confetti celebrations.
 * Pure JS confetti implementation (no external dependency needed).
 */

import gsap from 'gsap'
import { GAME_CONFIG } from '../../constants/config'

export interface Achievement {
  id: string
  name: string
  emoji: string
  description: string
  unlocked: boolean
}

const STORAGE_KEY = 'growden_achievements'
const STREAK_KEY = 'growden_streak'

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first_hold', name: 'Diamond Hands', emoji: '💎', description: 'Hold steady through your first event' },
  { id: 'hold_streak_3', name: 'Iron Will', emoji: '🛡️', description: 'Hold through 3 events in a row' },
  { id: 'hold_streak_5', name: 'Zen Master', emoji: '🧘', description: 'Hold through 5 events in a row' },
  { id: 'diversifier', name: 'Diversification Pro', emoji: '🌈', description: 'Own 4+ different plant types' },
  { id: 'esg_champion', name: 'ESG Champion', emoji: '♻️', description: 'Complete a game without buying bad plants' },
  { id: 'big_gains', name: 'Bull Run', emoji: '🐂', description: 'Grow portfolio by 30%+' },
  { id: 'survivor', name: 'Storm Survivor', emoji: '⛈️', description: 'Survive a severe event without selling' },
  { id: 'full_garden', name: 'Master Gardener', emoji: '🏆', description: 'Reach level 10' },
  { id: 'high_score', name: 'Top Scorer', emoji: '⭐', description: 'Score over 500 points' },
  { id: 'no_panic', name: 'Cool Head', emoji: '🧊', description: 'Complete entire game without panic selling' },
]

let holdStreak = 0

export function getAchievements(): Achievement[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
    return ACHIEVEMENT_DEFS.map(a => ({ ...a, unlocked: saved.includes(a.id) }))
  } catch {
    return ACHIEVEMENT_DEFS.map(a => ({ ...a, unlocked: false }))
  }
}

export function unlockAchievement(id: string): Achievement | null {
  const achievements = getAchievements()
  const achievement = achievements.find(a => a.id === id)
  if (!achievement || achievement.unlocked) return null

  // Save
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
    saved.push(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch { /* ignore */ }

  // Show toast
  showAchievementToast(ACHIEVEMENT_DEFS.find(a => a.id === id)!)
  // Fire confetti
  fireConfetti()

  return { ...achievement, unlocked: true }
}

export function recordHold(): void {
  holdStreak++
  try { localStorage.setItem(STREAK_KEY, String(holdStreak)) } catch { /* ignore */ }

  unlockAchievement('first_hold')
  if (holdStreak >= 3) unlockAchievement('hold_streak_3')
  if (holdStreak >= 5) unlockAchievement('hold_streak_5')
}

export function recordPanicSell(): void {
  holdStreak = 0
  try { localStorage.setItem(STREAK_KEY, '0') } catch { /* ignore */ }
}

export function getHoldStreak(): number {
  return holdStreak
}

export function resetStreak(): void {
  holdStreak = 0
}

/** Clear all unlocked achievements and streak — start fresh */
export function resetAchievements(): void {
  holdStreak = 0
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STREAK_KEY)
  } catch { /* ignore */ }
}

export function checkGameEndAchievements(state: {
  score: number
  currentLevel: number
  flowers: number
  eventsHistory: Array<{ playerAction?: string }>
  portfolio: Record<string, number>
}): void {
  if (state.currentLevel >= 10) unlockAchievement('full_garden')
  if (state.score > 500) unlockAchievement('high_score')

  const growth = ((state.flowers - GAME_CONFIG.STARTING_FLOWERS) / GAME_CONFIG.STARTING_FLOWERS) * 100
  if (growth >= 30) unlockAchievement('big_gains')

  const panicCount = state.eventsHistory.filter(e => e.playerAction === 'panic_sell').length
  if (panicCount === 0 && state.eventsHistory.length > 0) unlockAchievement('no_panic')

  // Check diversification
  const plantCount = Object.values(state.portfolio).filter(v => v > 0).length
  if (plantCount >= 4) unlockAchievement('diversifier')

  // Check ESG
  const hasBadPlants = ['coal_bush', 'junk_weed', 'leveraged_vine'].some(id => (state.portfolio[id] || 0) > 0)
  if (!hasBadPlants && state.eventsHistory.length > 0) unlockAchievement('esg_champion')
}

function showAchievementToast(achievement: Omit<Achievement, 'unlocked'>): void {
  const toast = document.createElement('div')
  toast.className = 'achievement-toast'
  toast.innerHTML = `
    <div class="achievement-toast-inner">
      <span class="achievement-emoji">${achievement.emoji}</span>
      <div>
        <div class="achievement-title">Achievement Unlocked!</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.description}</div>
      </div>
    </div>
  `
  const container = document.getElementById('toast-layer') || document.body
  container.appendChild(toast)

  gsap.fromTo(toast,
    { x: 100, opacity: 0, scale: 0.8 },
    { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
  )

  setTimeout(() => {
    gsap.to(toast, {
      x: 100, opacity: 0, duration: 0.3,
      onComplete: () => toast.remove(),
    })
  }, 4000)
}

/** Render achievements badge display */
export function renderAchievementsBadges(): string {
  const achievements = getAchievements()
  const unlocked = achievements.filter(a => a.unlocked)
  const total = achievements.length

  return `
    <div class="achievements-display">
      <div class="achievements-header">
        <span class="text-caption text-muted">ACHIEVEMENTS</span>
        <span class="badge badge-neutral">${unlocked.length}/${total}</span>
      </div>
      <div class="achievements-grid">
        ${achievements.map(a => `
          <div class="achievement-badge ${a.unlocked ? 'achievement-unlocked' : 'achievement-locked'}"
               title="${a.name}: ${a.description}">
            <span class="achievement-badge-emoji">${a.unlocked ? a.emoji : '🔒'}</span>
            <span class="achievement-badge-name">${a.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

/** Pure JS confetti implementation */
export function fireConfetti(x?: number, y?: number): void {
  const centerX = x ?? window.innerWidth / 2
  const centerY = y ?? window.innerHeight / 3
  const colors = ['#FFD100', '#1B4F6C', '#E8623C', '#7EC8E3', '#27AE60', '#9C27B0']
  const container = document.getElementById('toast-layer') || document.body

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-particle'
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 6 + Math.random() * 6
    const isCircle = Math.random() > 0.5
    confetti.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${size}px;
      height: ${isCircle ? size : size * 0.6}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 99999;
    `
    container.appendChild(confetti)

    const angle = Math.random() * Math.PI * 2
    const velocity = 100 + Math.random() * 200
    const rotation = Math.random() * 720 - 360

    gsap.to(confetti, {
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity + 200, // gravity pull
      rotation,
      opacity: 0,
      duration: 1 + Math.random() * 1,
      ease: 'power2.out',
      onComplete: () => confetti.remove(),
    })
  }
}
