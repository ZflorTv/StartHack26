/** Colour constants — PixiJS hex values, CSS strings, and lookup maps */

export const COLORS = {
  // PostFinance brand
  yellow:      0xFFD100,
  petrol:      0x1B4F6C,
  petrolLight: 0x2A6F96,
  grapefruit:  0xE8623C,
  lightBlue:   0x7EC8E3,

  // Backgrounds
  background:  0xF0EDE6,
  surface:     0xFFFFFF,

  // Semantic
  positive:    0x27AE60,
  negative:    0xE74C3C,
  warning:     0xF39C12,

  // Garden
  groundSand:  0xC8B89A,
  skyTop:      0xE8F4F8,
  skyBottom:   0xF0EDE6,
  grassGreen:  0x7CB342,
  soilDark:    0x5D4037,

  // Weather backgrounds
  weatherSun:       0xFFF9C4,
  weatherRain:      0x7EA8C0,
  weatherStorm:     0x1C2833,
  weatherFrost:     0xD6EAF8,
  weatherHeat:      0xF0B27A,
  weatherLightning: 0x1A252F,
  weatherCalm:      0xE8F4F8,
  weatherFog:       0xBDBDBD,
  weatherTornado:   0x37474F,
  weatherMeteor:    0x1A237E,
  weatherAcidRain:  0xAED581,

  // Plant category colors
  equity:      0x4CAF50,
  bonds:       0x2196F3,
  cash:        0x9E9E9E,
  commodities: 0xFFD100,
  crypto:      0x9C27B0,
} as const

export const CSS_COLORS = {
  yellow:     '#FFD100',
  petrol:     '#1B4F6C',
  petrolLight:'#2A6F96',
  grapefruit: '#E8623C',
  lightBlue:  '#7EC8E3',
  background: '#F0EDE6',
  surface:    '#FFFFFF',
  positive:   '#27AE60',
  negative:   '#E74C3C',
  warning:    '#F39C12',
  equity:     '#4CAF50',
  bonds:      '#2196F3',
  cash:       '#9E9E9E',
  commodities:'#FFD100',
  crypto:     '#9C27B0',
} as const

export const CATEGORY_COLORS: Record<string, string> = {
  equity: '#4CAF50',
  bonds: '#2196F3',
  cash: '#9E9E9E',
  commodities: '#FFD100',
  crypto: '#9C27B0',
}

export const WEATHER_COLORS: Record<string, number> = {
  sun:       0xFFF9C4,
  rain:      0x7EA8C0,
  storm:     0x1C2833,
  frost:     0xD6EAF8,
  heat:      0xF0B27A,
  lightning: 0x1A252F,
  fog:       0xBDBDBD,
  calm:      0xE8F4F8,
  tornado:   0x37474F,
  meteor:    0x1A237E,
  acid_rain: 0xAED581,
}
