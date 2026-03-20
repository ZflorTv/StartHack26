/**
 * PortfolioViz — Enhanced portfolio visualization.
 * Interactive donut chart, animated treemap, before/after comparison.
 */

import { CATEGORY_COLORS } from '../../constants/colors'
import { PLANTS_MAP } from '../../data/plants'
import { BAD_PLANTS_MAP } from '../../data/badPlants'
import type { Portfolio } from '../../types'

/** SVG Donut chart with interactive segments */
export function renderDonutChart(
  portfolio: Portfolio,
  size = 180,
  strokeWidth = 28,
): string {
  const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
  const total = entries.reduce((sum, [_, v]) => sum + v, 0)
  if (total === 0) return ''

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let currentOffset = 0
  const segments: string[] = []
  const legends: string[] = []

  // Aggregate by category
  const categoryTotals: Record<string, number> = {}
  entries.forEach(([plantId, alloc]) => {
    const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
    if (!plant) return
    categoryTotals[plant.category] = (categoryTotals[plant.category] || 0) + alloc
  })

  Object.entries(categoryTotals).forEach(([category, alloc]) => {
    const pct = alloc / total
    const dashLength = pct * circumference
    const gapLength = circumference - dashLength
    const color = CATEGORY_COLORS[category] || '#ccc'

    segments.push(`
      <circle class="donut-segment"
        cx="${center}" cy="${center}" r="${radius}"
        fill="none" stroke="${color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${dashLength} ${gapLength}"
        stroke-dashoffset="${-currentOffset}"
        style="transition: stroke-dasharray 0.8s ease, stroke-dashoffset 0.8s ease; cursor: pointer;"
        data-category="${category}" data-pct="${(pct * 100).toFixed(0)}"
      />
    `)

    legends.push(`
      <div class="donut-legend-item" data-category="${category}">
        <span class="donut-legend-dot" style="background: ${color};"></span>
        <span class="donut-legend-label">${category}</span>
        <span class="donut-legend-pct">${(pct * 100).toFixed(0)}%</span>
      </div>
    `)

    currentOffset += dashLength
  })

  return `
    <div class="donut-chart-wrapper">
      <svg class="donut-chart" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        ${segments.join('')}
        <text x="${center}" y="${center - 6}" text-anchor="middle" fill="var(--text-primary)"
              font-size="22" font-weight="700" font-family="Inter, sans-serif">
          ${Math.round(total)}%
        </text>
        <text x="${center}" y="${center + 14}" text-anchor="middle" fill="var(--text-muted)"
              font-size="10" font-weight="600" font-family="Inter, sans-serif" text-transform="uppercase">
          ALLOCATED
        </text>
      </svg>
      <div class="donut-legend">
        ${legends.join('')}
      </div>
    </div>
  `
}

/** Before/after comparison slider for events */
export function renderBeforeAfter(
  before: number,
  after: number,
): string {
  const change = after - before
  const changePct = ((change / before) * 100).toFixed(1)
  const isPositive = change >= 0
  const color = isPositive ? 'var(--color-positive)' : 'var(--color-negative)'

  const maxVal = Math.max(before, after) * 1.1
  const beforeWidth = (before / maxVal) * 100
  const afterWidth = (after / maxVal) * 100

  return `
    <div class="before-after-comparison">
      <div class="before-after-row">
        <span class="before-after-label">Before</span>
        <div class="before-after-bar-track">
          <div class="before-after-bar" style="width: ${beforeWidth}%; background: var(--text-muted);"></div>
        </div>
        <span class="before-after-value">${formatCurrency(before)}</span>
      </div>
      <div class="before-after-row">
        <span class="before-after-label">After</span>
        <div class="before-after-bar-track">
          <div class="before-after-bar" style="width: ${afterWidth}%; background: ${color};"></div>
        </div>
        <span class="before-after-value" style="color: ${color};">${formatCurrency(after)}</span>
      </div>
      <div class="before-after-change" style="color: ${color};">
        ${isPositive ? '↑' : '↓'} ${isPositive ? '+' : ''}${changePct}%
      </div>
    </div>
  `
}

/** Enhanced portfolio bar with animated segments */
export function renderAnimatedPortfolioBar(portfolio: Portfolio): string {
  const entries = Object.entries(portfolio).filter(([_, v]) => v > 0)
  const total = entries.reduce((sum, [_, v]) => sum + v, 0)
  if (total === 0) return '<div class="portfolio-bar-enhanced"></div>'

  const segments = entries.map(([plantId, allocation], i) => {
    const plant = PLANTS_MAP[plantId] || BAD_PLANTS_MAP[plantId]
    const color = plant ? CATEGORY_COLORS[plant.category] || '#ccc' : '#ccc'
    const pct = (allocation / total) * 100

    return `<div class="portfolio-bar-segment-enhanced"
      style="width: ${pct}%; background: ${color}; animation-delay: ${i * 0.05}s;"
      title="${plant?.name || plantId}: ${Math.round(pct)}%"
      data-plant-id="${plantId}">
    </div>`
  }).join('')

  return `<div class="portfolio-bar-enhanced">${segments}</div>`
}

/** Sparkline for nav bar - tiny inline chart */
export function renderSparkline(values: number[], width = 60, height = 20): string {
  if (values.length < 2) return ''

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const color = values[values.length - 1] >= values[0] ? 'var(--color-positive)' : 'var(--color-negative)'

  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${(width).toFixed(1)}" cy="${points.split(' ').pop()?.split(',')[1] || height / 2}"
              r="2" fill="${color}"/>
    </svg>
  `
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}
