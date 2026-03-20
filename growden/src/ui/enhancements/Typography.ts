/**
 * Typography — Enhanced font loading, number formatting,
 * gradient text effects, and visual hierarchy improvements.
 */

/** Format numbers with locale-aware currency formatting */
export function formatNumber(value: number, options?: {
  decimals?: number
  prefix?: string
  suffix?: string
  locale?: string
}): string {
  const { decimals = 0, prefix = '', suffix = '', locale = 'en-US' } = options || {}
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
  return `${prefix}${formatted}${suffix}`
}

/** Format portfolio value with proper currency display */
export function formatPortfolioValue(value: number): string {
  return formatNumber(value, { prefix: '', suffix: '' })
}

/** Format percentage with sign */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/** Gradient text wrapper for score/value highlights */
export function gradientText(text: string, gradient = 'linear-gradient(135deg, #1B4F6C, #7EC8E3)'): string {
  return `<span class="gradient-text" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${text}</span>`
}

/** Score gradient based on value */
export function scoreGradient(score: number): string {
  if (score >= 600) return 'linear-gradient(135deg, #FFD100, #E8623C)'
  if (score >= 400) return 'linear-gradient(135deg, #27AE60, #2ECC71)'
  if (score >= 200) return 'linear-gradient(135deg, #1B4F6C, #7EC8E3)'
  return 'linear-gradient(135deg, #7C7C8E, #B0B3C0)'
}

/** Load display font for headlines */
export function loadDisplayFont(): void {
  // Add Cabinet Grotesk as display font via Google Fonts
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap'
  document.head.appendChild(link)
}

/** Enhanced text styles injected dynamically */
export function getTypographyCSS(): string {
  return `
    /* Display font for heroes */
    .text-display {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    /* Gradient text utility */
    .gradient-text {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Tabular nums for all numbers */
    .num {
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum";
    }

    /* Enhanced hero size */
    .text-hero-xl {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 56px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.04em;
    }
  `
}
