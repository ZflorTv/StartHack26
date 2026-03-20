/**
 * Market events data — 10 event types with light / moderate / severe amplitudes.
 *
 * Each event defines per-category financial effects using abstract plant keys
 * (oak = equity, bush = bonds, grass = cash, cactus = commodities, exotic = crypto).
 * Bad plants (coal_bush, junk_weed, leveraged_vine) have their own effect entries.
 */

import { GameEvent } from '../types'

export const GAME_EVENTS: GameEvent[] = [
  // ── Event 1: Earnings Season ──────────────────────────────────────────
  {
    id: 'earnings_season',
    name: 'Earnings Season',
    category: 'CORPORATE',
    weatherType: 'sun',
    weatherEmoji: '☀️',
    appearsAtLevels: [1, 2, 3, 5, 7],
    learning:
      'Equities react most to earnings. Bonds barely move. Leverage amplifies the reaction in both directions.',
    floraHint:
      "Earnings season is the market's report card. The surprise — not the result — is what moves prices.",
    amplitudes: {
      light: {
        label: 'Earnings Miss',
        emoji: '🌤️',
        headline:
          'Mixed Q3 results — markets edge lower on disappointing guidance',
        effects: {
          oak: -0.04,
          bush: 0.01,
          grass: 0.0,
          cactus: 0.0,
          exotic: -0.05,
          coal_bush: -0.05,
          junk_weed: -0.06,
          leveraged_vine: -0.12,
        },
      },
      moderate: {
        label: 'Earnings Beat',
        emoji: '☀️',
        headline:
          'S&P 500 companies beat estimates by 8% — rally extends into fourth quarter',
        effects: {
          oak: 0.08,
          bush: -0.02,
          grass: 0.0,
          cactus: 0.01,
          exotic: 0.1,
          coal_bush: 0.1,
          junk_weed: 0.09,
          leveraged_vine: 0.22,
        },
      },
      severe: {
        label: 'Blowout / Disaster',
        emoji: '🌞',
        headline:
          'Tech earnings obliterate forecasts — or — Major index reports worst quarter since 2008',
        effects: {
          oak: 0.18,
          bush: -0.05,
          grass: 0.01,
          cactus: 0.02,
          exotic: 0.24,
          coal_bush: 0.2,
          junk_weed: 0.16,
          leveraged_vine: 0.45,
        },
      },
    },
  },

  // ── Event 2: Unemployment Spike ───────────────────────────────────────
  {
    id: 'unemployment_spike',
    name: 'Unemployment Spike',
    category: 'MACRO',
    weatherType: 'rain',
    weatherEmoji: '🌧️',
    appearsAtLevels: [3, 4, 5, 6, 9],
    learning:
      'Unemployment signals recession. Bonds rally as safe haven. Junk bonds fall despite being bonds — default risk spikes with unemployment.',
    floraHint:
      "Cold rain doesn't destroy your garden — but it slows everything down. Diversification into bonds is working exactly as it should here.",
    amplitudes: {
      light: {
        label: 'Labour Market Softening',
        emoji: '🌦️',
        headline:
          'Jobless claims rise for third consecutive week — economists flag slowdown risk',
        effects: {
          oak: -0.04,
          bush: 0.03,
          grass: 0.0,
          cactus: -0.02,
          exotic: -0.05,
          coal_bush: -0.04,
          junk_weed: -0.08,
          leveraged_vine: -0.15,
        },
      },
      moderate: {
        label: 'Unemployment Spike',
        emoji: '🌧️',
        headline:
          'US unemployment jumps to 5.8% — worst reading since 2020, recession risk elevated',
        effects: {
          oak: -0.1,
          bush: 0.07,
          grass: 0.01,
          cactus: -0.06,
          exotic: -0.12,
          coal_bush: -0.09,
          junk_weed: -0.18,
          leveraged_vine: -0.35,
        },
      },
      severe: {
        label: 'Recession Signal',
        emoji: '🌨️',
        headline:
          'Unemployment hits 8.2% — central banks signal emergency stimulus, recession confirmed',
        effects: {
          oak: -0.22,
          bush: 0.14,
          grass: 0.02,
          cactus: -0.14,
          exotic: -0.25,
          coal_bush: -0.2,
          junk_weed: -0.35,
          leveraged_vine: -1.0,
        },
      },
    },
  },

  // ── Event 3: Oil Crisis ───────────────────────────────────────────────
  {
    id: 'oil_crisis',
    name: 'Oil Crisis',
    category: 'COMMODITIES',
    weatherType: 'heat',
    weatherEmoji: '🔥',
    appearsAtLevels: [5, 6, 8],
    learning:
      'Commodities hedge against supply shocks. Oil crises reward energy exposure but punish growth assets.',
    floraHint:
      'The cactus was born for desert heat. A small commodity allocation is insurance against exactly this kind of supply shock.',
    amplitudes: {
      light: {
        label: 'Oil Price Pressure',
        emoji: '☀️',
        headline:
          'Crude edges above $85 as OPEC signals production discipline',
        effects: {
          oak: -0.02,
          bush: -0.01,
          grass: 0.0,
          cactus: 0.06,
          exotic: -0.03,
          coal_bush: 0.08,
          junk_weed: -0.03,
          leveraged_vine: -0.08,
        },
      },
      moderate: {
        label: 'Oil Shock',
        emoji: '🔥',
        headline:
          'OPEC cuts 2M barrels — oil surges to $98, inflation fears reignite',
        effects: {
          oak: -0.07,
          bush: -0.04,
          grass: -0.01,
          cactus: 0.14,
          exotic: -0.09,
          coal_bush: 0.18,
          junk_weed: -0.09,
          leveraged_vine: -0.22,
        },
      },
      severe: {
        label: 'Energy Crisis',
        emoji: '🌋',
        headline:
          'Supply routes disrupted — oil hits $130, governments declare energy emergency',
        effects: {
          oak: -0.15,
          bush: -0.08,
          grass: -0.02,
          cactus: 0.28,
          exotic: -0.18,
          coal_bush: 0.32,
          junk_weed: -0.2,
          leveraged_vine: -0.5,
        },
      },
    },
  },

  // ── Event 4: Geopolitical Shock ───────────────────────────────────────
  {
    id: 'geopolitical_shock',
    name: 'Geopolitical Shock',
    category: 'GEOPOLITICAL',
    weatherType: 'lightning',
    weatherEmoji: '⚡',
    appearsAtLevels: [8, 9, 10],
    unlocksPlant: 'fortified_oak',
    learning:
      'Geopolitical shocks reward defense stocks and gold. Diversification into these assets is the only protection against sudden conflict risk.',
    floraHint:
      "Lightning doesn't give warnings. But a well-built garden has plants that thrive in storms — your fortified oak and cactus just proved it.",
    amplitudes: {
      light: {
        label: 'Rising Tensions',
        emoji: '🌩️',
        headline:
          'Diplomatic tensions escalate — markets price in geopolitical risk premium',
        effects: {
          oak: -0.06,
          bush: 0.04,
          grass: 0.01,
          cactus: 0.08,
          exotic: -0.1,
          fortified_oak: 0.1,
          coal_bush: 0.05,
          junk_weed: -0.07,
          leveraged_vine: -0.2,
        },
      },
      moderate: {
        label: 'Armed Conflict',
        emoji: '⚡',
        headline:
          'Military conflict breaks out — global markets sell off, gold and defence rally sharply',
        effects: {
          oak: -0.14,
          bush: 0.08,
          grass: 0.02,
          cactus: 0.18,
          exotic: -0.2,
          fortified_oak: 0.22,
          coal_bush: 0.12,
          junk_weed: -0.15,
          leveraged_vine: -0.6,
        },
      },
      severe: {
        label: 'Full-Scale War',
        emoji: '🌪️',
        headline:
          'Major conflict declared — emergency G7 summit, circuit breakers triggered on global exchanges',
        effects: {
          oak: -0.26,
          bush: 0.12,
          grass: 0.03,
          cactus: 0.3,
          exotic: -0.35,
          fortified_oak: 0.38,
          coal_bush: 0.2,
          junk_weed: -0.28,
          leveraged_vine: -1.0,
        },
      },
    },
  },

  // ── Event 5a: Fed Rate Hike ───────────────────────────────────────────
  {
    id: 'fed_rate_hike',
    name: 'Fed Rate Hike',
    category: 'CENTRAL BANKING',
    weatherType: 'rain',
    weatherEmoji: '🌧️',
    variant: 'hike',
    appearsAtLevels: [2, 4, 7],
    learning:
      'Rate hikes hurt both bonds and equities. Cash is the rare winner. The severity of the hike determines the magnitude of the damage.',
    floraHint:
      'The Fed turned on the cold water. Higher rates mean borrowing costs more — bad for companies, bad for existing bonds.',
    amplitudes: {
      light: {
        label: 'Rate Nudge +0.25%',
        emoji: '🌦️',
        headline:
          'Fed raises rates 25bps — signals data-dependent approach going forward',
        effects: {
          oak: -0.04,
          bush: -0.05,
          grass: 0.02,
          cactus: -0.01,
          exotic: -0.08,
          coal_bush: -0.03,
          junk_weed: -0.07,
          leveraged_vine: -0.18,
        },
      },
      moderate: {
        label: 'Rate Hike +0.50%',
        emoji: '🌧️',
        headline:
          'Fed delivers 50bps hike — Powell warns rates will stay higher for longer',
        effects: {
          oak: -0.09,
          bush: -0.11,
          grass: 0.04,
          cactus: -0.03,
          exotic: -0.18,
          coal_bush: -0.07,
          junk_weed: -0.16,
          leveraged_vine: -0.4,
        },
      },
      severe: {
        label: 'Aggressive Hike +0.75%',
        emoji: '⛈️',
        headline:
          'Shock 75bps hike — largest in 30 years, markets reprice entire rate path',
        effects: {
          oak: -0.16,
          bush: -0.2,
          grass: 0.06,
          cactus: -0.07,
          exotic: -0.32,
          coal_bush: -0.14,
          junk_weed: -0.28,
          leveraged_vine: -0.85,
        },
      },
    },
  },

  // ── Event 5b: Fed Rate Cut ────────────────────────────────────────────
  {
    id: 'fed_rate_cut',
    name: 'Fed Rate Cut',
    category: 'CENTRAL BANKING',
    weatherType: 'sun',
    weatherEmoji: '🌤️',
    variant: 'cut',
    appearsAtLevels: [9, 10],
    learning:
      'Rate cuts lift both bonds and equities. Cash suffers. Leverage amplifies the upside — but remember it amplifies the downside too.',
    floraHint:
      'The sun came out. Lower rates mean cheaper borrowing and more growth. This is why staying invested beats hiding in cash.',
    amplitudes: {
      light: {
        label: 'Rate Trim -0.25%',
        emoji: '🌤️',
        headline:
          'Fed cuts 25bps — cautious easing as inflation cools toward target',
        effects: {
          oak: 0.05,
          bush: 0.04,
          grass: -0.01,
          cactus: 0.02,
          exotic: 0.06,
          coal_bush: 0.04,
          junk_weed: 0.04,
          leveraged_vine: 0.15,
        },
      },
      moderate: {
        label: 'Rate Cut -0.50%',
        emoji: '☀️',
        headline:
          'Fed cuts 50bps — signals pivot to easing cycle, risk assets surge',
        effects: {
          oak: 0.1,
          bush: 0.09,
          grass: -0.02,
          cactus: 0.05,
          exotic: 0.14,
          coal_bush: 0.09,
          junk_weed: 0.1,
          leveraged_vine: 0.35,
        },
      },
      severe: {
        label: 'Emergency Cut -0.75%',
        emoji: '🌈',
        headline:
          'Emergency rate cut — Fed acts between meetings to prevent financial contagion',
        effects: {
          oak: 0.18,
          bush: 0.16,
          grass: -0.03,
          cactus: 0.09,
          exotic: 0.25,
          coal_bush: 0.15,
          junk_weed: 0.18,
          leveraged_vine: 0.7,
        },
      },
    },
  },

  // ── Event 6: Tariff Crisis ────────────────────────────────────────────
  {
    id: 'tariff_crisis',
    name: 'Tariff Crisis',
    category: 'TRADE',
    weatherType: 'fog',
    weatherEmoji: '🌫️',
    appearsAtLevels: [6, 8],
    learning:
      'Trade wars create uncertainty and slow global growth. Domestically focused assets and non-sovereign stores of value (gold, crypto) can benefit.',
    floraHint:
      "Fog doesn't destroy your garden — it makes everything harder and slower. Trade wars tax the whole global machine.",
    amplitudes: {
      light: {
        label: 'Trade Friction',
        emoji: '🌫️',
        headline:
          'US announces targeted tariffs on select imports — trade partners warn of retaliation',
        effects: {
          oak: -0.03,
          bush: 0.02,
          grass: 0.0,
          cactus: -0.02,
          exotic: 0.02,
          coal_bush: -0.04,
          junk_weed: -0.04,
          leveraged_vine: -0.1,
        },
      },
      moderate: {
        label: 'Trade War',
        emoji: '🏭',
        headline:
          'Full trade war erupts — 25% tariffs imposed, retaliation swift and broad',
        effects: {
          oak: -0.08,
          bush: 0.04,
          grass: 0.01,
          cactus: -0.05,
          exotic: 0.05,
          coal_bush: -0.1,
          junk_weed: -0.1,
          leveraged_vine: -0.25,
        },
      },
      severe: {
        label: 'Trade Collapse',
        emoji: '🏚️',
        headline:
          'WTO rules suspended — major economies retreat into protectionism, global supply chains fracture',
        effects: {
          oak: -0.16,
          bush: 0.07,
          grass: 0.02,
          cactus: -0.1,
          exotic: 0.1,
          coal_bush: -0.18,
          junk_weed: -0.2,
          leveraged_vine: -0.5,
        },
      },
    },
  },

  // ── Event 7: Nothing Special (Calm Year) ──────────────────────────────
  {
    id: 'calm_year',
    name: 'Nothing Special',
    category: 'MACRO',
    weatherType: 'calm',
    weatherEmoji: '🌤️',
    appearsAtLevels: [1, 4, 7],
    penaltyForOvertrading: true,
    overtradingPenalty: -10,
    learning:
      'Most of investing is waiting. Compounding works in silence. Tinkering during calm periods destroys value through costs and poor timing.',
    floraHint:
      "A calm day. Nothing dramatic happened — and that's the point. Boring is the secret weapon of long-term investing.",
    amplitudes: {
      light: {
        label: 'Quiet Quarter',
        emoji: '🌤️',
        headline:
          'Markets drift sideways — low volatility persists, investors await catalysts',
        effects: {
          oak: 0.01,
          bush: 0.01,
          grass: 0.01,
          cactus: 0.01,
          exotic: 0.01,
          coal_bush: 0.02,
          junk_weed: 0.02,
          leveraged_vine: 0.03,
        },
      },
      moderate: {
        label: 'Steady Growth',
        emoji: '☀️',
        headline:
          'Goldilocks conditions persist — moderate growth, contained inflation, no surprises',
        effects: {
          oak: 0.03,
          bush: 0.02,
          grass: 0.01,
          cactus: 0.02,
          exotic: 0.04,
          coal_bush: 0.03,
          junk_weed: 0.03,
          leveraged_vine: 0.07,
        },
      },
      severe: {
        label: 'Strong Bull Run',
        emoji: '🚀',
        headline:
          'Broad-based rally as all conditions align — equities reach all-time highs',
        effects: {
          oak: 0.05,
          bush: 0.02,
          grass: 0.01,
          cactus: 0.03,
          exotic: 0.08,
          coal_bush: 0.06,
          junk_weed: 0.05,
          leveraged_vine: 0.12,
        },
      },
    },
  },

  // ── Event 8: Market Panic (High Volatility) ───────────────────────────
  {
    id: 'high_volatility',
    name: 'Market Panic',
    category: 'MARKET STRUCTURE',
    weatherType: 'tornado',
    weatherEmoji: '🌪️',
    appearsAtLevels: [7, 9, 10],
    panicSellPenalty: -50,
    holdBonusPoints: 25,
    learning:
      'Volatility is temporary. Selling during it is permanent. Emotional discipline is the most valuable skill in investing.',
    floraHint:
      'Tornado weather. The hardest — and most important — skill in investing is doing nothing when everything in your brain screams act.',
    amplitudes: {
      light: {
        label: 'Market Jitters',
        emoji: '🌬️',
        headline:
          'VIX spikes to 22 — investors rotate defensively as uncertainty builds',
        effects: {
          oak: -0.05,
          bush: 0.03,
          grass: 0.01,
          cactus: -0.02,
          exotic: -0.12,
          coal_bush: -0.05,
          junk_weed: -0.1,
          leveraged_vine: -0.3,
        },
      },
      moderate: {
        label: 'Volatility Shock',
        emoji: '🌪️',
        headline:
          'Flash crash wipes 8% in minutes — circuit breakers triggered on three major exchanges',
        effects: {
          oak: -0.14,
          bush: 0.06,
          grass: 0.02,
          cactus: -0.05,
          exotic: -0.28,
          coal_bush: -0.13,
          junk_weed: -0.25,
          leveraged_vine: -0.8,
        },
      },
      severe: {
        label: 'Full Market Panic',
        emoji: '💀',
        headline:
          'Black swan event — global markets in freefall, coordinated central bank intervention announced',
        effects: {
          oak: -0.25,
          bush: 0.1,
          grass: 0.04,
          cactus: 0.08,
          exotic: -0.5,
          coal_bush: -0.22,
          junk_weed: -0.42,
          leveraged_vine: -1.0,
        },
      },
    },
  },

  // ── Event 9: Inflation Shock ──────────────────────────────────────────
  {
    id: 'inflation_shock',
    name: 'Inflation Shock',
    category: 'MACRO',
    weatherType: 'acid_rain',
    weatherEmoji: '🌧️',
    appearsAtLevels: [2, 5, 8],
    learning:
      'Inflation destroys cash and bonds in real terms. Real assets are the antidote. This is why every portfolio needs inflation protection.',
    floraHint:
      "Inflation is rain that corrodes rather than nourishes. Your cactus thrives here — real assets are inflation's natural enemy.",
    amplitudes: {
      light: {
        label: 'Inflation Uptick',
        emoji: '🌦️',
        headline:
          'CPI rises to 4.1% — above target but central banks hold rates, monitoring situation',
        effects: {
          oak: -0.02,
          bush: -0.04,
          grass: -0.03,
          cactus: 0.05,
          exotic: -0.04,
          willow: -0.06,
          junk_weed: -0.05,
          leveraged_vine: -0.12,
        },
      },
      moderate: {
        label: 'Inflation Surge',
        emoji: '🌧️',
        headline:
          'CPI hits 7.2% — four-decade high, central bank signals aggressive tightening',
        effects: {
          oak: -0.06,
          bush: -0.09,
          grass: -0.06,
          cactus: 0.12,
          exotic: -0.1,
          willow: -0.14,
          junk_weed: -0.11,
          leveraged_vine: -0.3,
        },
      },
      severe: {
        label: 'Hyperinflation Risk',
        emoji: '⛈️',
        headline:
          'Inflation reaches 12% — emergency rate hikes, purchasing power collapse, currency crisis fears',
        effects: {
          oak: -0.12,
          bush: -0.17,
          grass: -0.1,
          cactus: 0.22,
          exotic: -0.2,
          willow: -0.25,
          junk_weed: -0.2,
          leveraged_vine: -0.6,
        },
      },
    },
  },

  // ── Event 10: Sector Mania ────────────────────────────────────────────
  {
    id: 'sector_mania',
    name: 'Sector Mania',
    category: 'MARKET STRUCTURE',
    weatherType: 'meteor',
    weatherEmoji: '☄️',
    appearsAtLevels: [9, 10],
    twoPhase: true,
    rebalanceWindowBetweenPhases: true,
    learning:
      'FOMO is one of the most expensive emotions in investing. Speculative manias always end. Timing them is nearly impossible.',
    floraHint:
      'The meteor shower was dazzling — and then it hit the ground. Every speculative mania in history has ended the same way.',
    phase1: {
      label: 'The Mania',
      emoji: '🚀',
      headline:
        'Crypto / AI stocks up 300% this year — everyone is talking about it',
      effects: {
        oak: 0.15,
        bush: -0.05,
        grass: 0.0,
        exotic: 0.8,
        leveraged_vine: 2.5,
      },
    },
    phase2: {
      label: 'The Bust',
      emoji: '💥',
      headline:
        'Bubble bursts — speculative assets down 75%, contagion spreads to growth stocks',
      effects: {
        oak: -0.2,
        bush: 0.08,
        grass: 0.03,
        exotic: -0.75,
        leveraged_vine: -1.0,
      },
    },
  },
]

export const EVENTS_MAP: Record<string, GameEvent> = {}
GAME_EVENTS.forEach((e) => (EVENTS_MAP[e.id] = e))

export function getEventsForLevel(level: number): GameEvent[] {
  return GAME_EVENTS.filter((e) => e.appearsAtLevels.includes(level))
}
