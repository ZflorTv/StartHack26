/** Local leaderboard — persisted in localStorage, capped at 10 entries sorted by score */

export interface LeaderboardEntry {
  score: number
  profile: string
  portfolioGrowth: number
  level: number
  date: string
}

const STORAGE_KEY = 'growden_leaderboard'
const MAX_ENTRIES = 10

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const board = getLeaderboard()
  board.push(entry)
  board.sort((a, b) => b.score - a.score)
  const trimmed = board.slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch { /* storage full — ignore */ }
  return trimmed
}
