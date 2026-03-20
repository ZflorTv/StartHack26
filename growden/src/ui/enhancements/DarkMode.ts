/**
 * DarkMode — CSS variable toggle with localStorage persistence.
 * Works with existing CSS custom properties architecture.
 */

const STORAGE_KEY = 'growden_dark_mode'

const DARK_VARS: Record<string, string> = {
  '--bg-main': '#0F1117',
  '--bg-surface': '#1A1D27',
  '--bg-surface-hover': '#222635',
  '--text-primary': '#EEEEF0',
  '--text-secondary': '#B0B3C0',
  '--text-muted': '#6B6F80',
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  '--shadow-md': '0 2px 8px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2)',
  '--shadow-lg': '0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)',
  '--shadow-xl': '0 8px 28px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.2)',
}

const LIGHT_VARS: Record<string, string> = {
  '--bg-main': '#F5F5F3',
  '--bg-surface': '#FFFFFF',
  '--bg-surface-hover': '#FAFAF9',
  '--text-primary': '#141428',
  '--text-secondary': '#3D3D50',
  '--text-muted': '#7C7C8E',
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
  '--shadow-md': '0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
  '--shadow-lg': '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  '--shadow-xl': '0 8px 28px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.04)',
}

let isDark = false

export function initDarkMode(): void {
  // Check saved preference or system preference
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isDark = saved === 'true'
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

export function toggleDarkMode(): void {
  isDark = !isDark
  localStorage.setItem(STORAGE_KEY, String(isDark))
  applyTheme()
}

export function isDarkMode(): boolean {
  return isDark
}

/** Listeners notified whenever the theme changes (used by PixiJS scenes) */
type ThemeListener = (dark: boolean) => void
const themeListeners: ThemeListener[] = []

/** Register a callback that fires on every theme change */
export function onThemeChange(fn: ThemeListener): void {
  themeListeners.push(fn)
}

function applyTheme(): void {
  const root = document.documentElement
  const vars = isDark ? DARK_VARS : LIGHT_VARS
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
  document.body.classList.toggle('dark-mode', isDark)

  // Notify listeners (e.g. PixiJS canvas background, sky tint)
  themeListeners.forEach(fn => fn(isDark))
}

/** Returns HTML for the dark mode toggle button */
export function darkModeToggleHtml(): string {
  return `<button class="btn-codex dark-mode-toggle" id="btn-dark-mode" title="Toggle dark mode">
    ${isDark ? '☀️' : '🌙'}
  </button>`
}
