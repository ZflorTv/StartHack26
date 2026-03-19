# ⛅ Market Events — Design Document

> Every economic event has a weather equivalent. This document defines all events,
> their weather metaphor, how they affect each plant, and their JSON structure.

---

## The Core Principle

Every event has three layers:
1. **The weather** — what the player sees visually in the garden
2. **The economic event** — what it maps to in the real world
3. **The amplitude** — how severe the weather is (light / moderate / severe)

The same event type at different amplitudes creates very different outcomes. A light rain is manageable. A flood destroys everything. This teaches players that magnitude matters, not just direction.

---

## Amplitude Scale

Every event has one of three amplitudes. The same event type scales accordingly:

| Amplitude | Weather metaphor | Portfolio impact multiplier | Visual |
|---|---|---|---|
| **Light** | Passing clouds, light drizzle | 0.4x base effects | Gentle sway, slight colour shift |
| **Moderate** | Real weather — rain, wind, heat | 1.0x base effects | Clear animation, plants react visibly |
| **Severe** | Extreme — storm, drought, flood | 2.2x base effects | Full animation, some plants wilt instantly |

---

---

## EVENT 1 — Company Earnings Season 📊

### Weather metaphor: 🌤️ Partly Cloudy / ☀️ Sunshine

Earnings season is a regular, expected event — like checking the weather forecast. If results are good, the sun comes out. If results disappoint, clouds roll in. It is never a complete surprise — markets anticipate it — but the actual numbers still move things.

### Real-world trigger
Quarterly corporate earnings reports (especially large-cap indices). Q1 reports land in April, Q2 in July, Q3 in October, Q4 in January. Also covers annual GDP growth reports.

### When it appears
Levels 1–3 (first event type introduced — predictable, manageable).

### How plants react

| Plant | Light (miss) | Moderate (beat) | Severe (blowout beat / miss) |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.04 | +0.08 | ±0.18 |
| 🌿 Bush (Bonds) | +0.01 | -0.02 | -0.05 |
| 🌾 Grass (Cash) | 0.00 | 0.00 | +0.01 |
| 🏭 Coal Bush | -0.05 | +0.10 | ±0.20 |
| 🌵 Junk Weed | -0.06 | +0.09 | ±0.16 |
| 🌿 Leveraged Vine | -0.12 | +0.22 | ±0.45 |

### Key learning
Equities are the most sensitive to earnings. Bonds barely move. Cash is immune. Leverage amplifies everything.

### Flora hint
*"Earnings season is like a school report card for companies. Good grades — the garden blooms. Bad grades — it sulks. The key is that markets already expected something. It's the surprise that moves prices."*

```json
{
  "id": "earnings_season",
  "name": "Earnings Season",
  "category": "CORPORATE",
  "weatherType": "sun",
  "weatherEmoji": "☀️",
  "amplitudes": {
    "light": {
      "label": "Earnings Miss",
      "emoji": "🌤️",
      "headline": "Mixed Q3 results — markets edge lower on disappointing guidance",
      "effects": { "oak": -0.04, "bush": 0.01, "grass": 0.00, "cactus": 0.00, "exotic": -0.05, "coal_bush": -0.05, "junk_weed": -0.06, "leveraged_vine": -0.12 }
    },
    "moderate": {
      "label": "Earnings Beat",
      "emoji": "☀️",
      "headline": "S&P 500 companies beat estimates by 8% — rally extends into fourth quarter",
      "effects": { "oak": 0.08, "bush": -0.02, "grass": 0.00, "cactus": 0.01, "exotic": 0.10, "coal_bush": 0.10, "junk_weed": 0.09, "leveraged_vine": 0.22 }
    },
    "severe": {
      "label": "Blowout / Disaster",
      "emoji": "🌞",
      "headline": "Tech earnings obliterate forecasts — or — Major index reports worst quarter since 2008",
      "effects": { "oak": 0.18, "bush": -0.05, "grass": 0.01, "cactus": 0.02, "exotic": 0.24, "coal_bush": 0.20, "junk_weed": 0.16, "leveraged_vine": 0.45 }
    }
  },
  "appearsAtLevels": [1, 2, 3, 5, 7],
  "learning": "Equities react most to earnings. Bonds barely move. Leverage amplifies the reaction in both directions.",
  "floraHint": "Earnings season is the market's report card. The surprise — not the result — is what moves prices."
}
```

---

---

## EVENT 2 — Unemployment Spike 📉

### Weather metaphor: 🌧️ Cold Rain

Unemployment is cold, grey, and demoralising. It doesn't arrive dramatically — it seeps in slowly like persistent rain. Consumer spending falls. Companies stop hiring. Growth slows. Unlike a storm it doesn't destroy instantly but it creates sustained pressure on everything.

### Real-world trigger
Non-farm payrolls (US), eurozone unemployment rate, jobless claims — monthly reports showing labour market deterioration.

### When it appears
Levels 3–5. Introduced after the player understands basic asset classes.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.04 | -0.10 | -0.22 |
| 🌿 Bush (Bonds) | +0.03 | +0.07 | +0.14 |
| 🌾 Grass (Cash) | 0.00 | +0.01 | +0.02 |
| 🏔️ Cactus (Commodities) | -0.02 | -0.06 | -0.14 |
| 🌸 Exotic Flower (Crypto) | -0.05 | -0.12 | -0.25 |
| 🌵 Junk Weed | -0.08 | -0.18 | -0.35 |
| 🌿 Leveraged Vine | -0.15 | -0.35 | -1.00 (liquidation risk) |

### Key learning
Unemployment is a recession signal. Bonds become attractive as a safe haven. Junk bonds — despite being bonds — fall hard because default risk spikes when workers lose jobs and companies struggle.

### Flora hint
*"Cold rain doesn't destroy your garden — but it slows everything down. When unemployment rises, people spend less, companies earn less, and stocks fall. Your bonds actually grew here — when people are scared, they buy safe government debt. That's diversification working."*

```json
{
  "id": "unemployment_spike",
  "name": "Unemployment Spike",
  "category": "MACRO",
  "weatherType": "rain",
  "weatherEmoji": "🌧️",
  "amplitudes": {
    "light": {
      "label": "Labour Market Softening",
      "emoji": "🌦️",
      "headline": "Jobless claims rise for third consecutive week — economists flag slowdown risk",
      "effects": { "oak": -0.04, "bush": 0.03, "grass": 0.00, "cactus": -0.02, "exotic": -0.05, "coal_bush": -0.04, "junk_weed": -0.08, "leveraged_vine": -0.15 }
    },
    "moderate": {
      "label": "Unemployment Spike",
      "emoji": "🌧️",
      "headline": "US unemployment jumps to 5.8% — worst reading since 2020, recession risk elevated",
      "effects": { "oak": -0.10, "bush": 0.07, "grass": 0.01, "cactus": -0.06, "exotic": -0.12, "coal_bush": -0.09, "junk_weed": -0.18, "leveraged_vine": -0.35 }
    },
    "severe": {
      "label": "Recession Signal",
      "emoji": "🌨️",
      "headline": "Unemployment hits 8.2% — central banks signal emergency stimulus, recession confirmed",
      "effects": { "oak": -0.22, "bush": 0.14, "grass": 0.02, "cactus": -0.14, "exotic": -0.25, "coal_bush": -0.20, "junk_weed": -0.35, "leveraged_vine": -1.00 }
    }
  },
  "appearsAtLevels": [3, 4, 5, 6, 9],
  "learning": "Unemployment signals recession. Bonds rally as safe haven. Junk bonds fall despite being bonds — default risk spikes with unemployment.",
  "floraHint": "Cold rain doesn't destroy your garden — but it slows everything down. Diversification into bonds is working exactly as it should here."
}
```

---

---

## EVENT 3 — Oil Crisis ⛽

### Weather metaphor: 🔥 Desert Heat / Scorching Sun

An oil shock brings intense heat to the garden. Energy commodities thrive in this environment — the cactus blooms. But the heat dries out everything else: companies face higher costs, consumers have less to spend, and inflation creeps back in. Persistent heat becomes a drought.

### Real-world trigger
OPEC production cuts, geopolitical disruption to supply routes (Strait of Hormuz, pipelines), demand surge from rapid growth, supply chain bottlenecks.

### When it appears
Level 5. Introduces the cactus (commodities) plant as a defensive tool.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.02 | -0.07 | -0.15 |
| 🌿 Bush (Bonds) | -0.01 | -0.04 | -0.08 |
| 🌾 Grass (Cash) | 0.00 | -0.01 | -0.02 |
| 🏔️ Cactus (Commodities / Gold) | +0.06 | +0.14 | +0.28 |
| 🌸 Exotic Flower (Crypto) | -0.03 | -0.09 | -0.18 |
| 🏭 Coal Bush | +0.08 | +0.18 | +0.32 |
| 🌵 Junk Weed | -0.03 | -0.09 | -0.20 |

### Key learning
Commodities are a natural hedge against supply-side inflation shocks. An oil crisis rewards the cactus specifically. Notably the Coal Bush also benefits (energy stocks profit) — making it tempting but still carrying ESG risk.

### Flora hint
*"Desert heat kills most plants — but the cactus was born for this. Oil shocks are supply-side inflation: suddenly everything costs more. Energy stocks profit, everyone else suffers. This is why a small commodity allocation acts as insurance for your garden."*

```json
{
  "id": "oil_crisis",
  "name": "Oil Crisis",
  "category": "COMMODITIES",
  "weatherType": "heat",
  "weatherEmoji": "🔥",
  "amplitudes": {
    "light": {
      "label": "Oil Price Pressure",
      "emoji": "☀️",
      "headline": "Crude edges above $85 as OPEC signals production discipline",
      "effects": { "oak": -0.02, "bush": -0.01, "grass": 0.00, "cactus": 0.06, "exotic": -0.03, "coal_bush": 0.08, "junk_weed": -0.03, "leveraged_vine": -0.08 }
    },
    "moderate": {
      "label": "Oil Shock",
      "emoji": "🔥",
      "headline": "OPEC cuts 2M barrels — oil surges to $98, inflation fears reignite",
      "effects": { "oak": -0.07, "bush": -0.04, "grass": -0.01, "cactus": 0.14, "exotic": -0.09, "coal_bush": 0.18, "junk_weed": -0.09, "leveraged_vine": -0.22 }
    },
    "severe": {
      "label": "Energy Crisis",
      "emoji": "🌋",
      "headline": "Supply routes disrupted — oil hits $130, governments declare energy emergency",
      "effects": { "oak": -0.15, "bush": -0.08, "grass": -0.02, "cactus": 0.28, "exotic": -0.18, "coal_bush": 0.32, "junk_weed": -0.20, "leveraged_vine": -0.50 }
    }
  },
  "appearsAtLevels": [5, 6, 8],
  "learning": "Commodities hedge against supply shocks. Oil crises reward energy exposure but punish growth assets.",
  "floraHint": "The cactus was born for desert heat. A small commodity allocation is insurance against exactly this kind of supply shock."
}
```

---

---

## EVENT 4 — Geopolitical Shock / War 🪖

### Weather metaphor: ⚡ Lightning Storm

War arrives suddenly, like a lightning bolt out of a dark sky. It creates immediate, sharp destruction in the garden — but the aftermath varies. Defense stocks grow in conflict. Gold (cactus) surges as a safe haven. Growth equities collapse. The storm passes but the landscape has changed.

### Real-world trigger
Military conflict, geopolitical escalation, territorial disputes with economic consequences, sanctions packages.

### When it appears
Level 8. Unlocks the Fortified Oak (defense stocks) as a new plant type.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Equities — general) | -0.06 | -0.14 | -0.26 |
| 🌿 Bush (Bonds) | +0.04 | +0.08 | +0.12 |
| 🌾 Grass (Cash) | +0.01 | +0.02 | +0.03 |
| 🏔️ Cactus (Gold / Commodities) | +0.08 | +0.18 | +0.30 |
| 🌸 Exotic Flower (Crypto) | -0.10 | -0.20 | -0.35 |
| 🛡️ Fortified Oak (Defense) | +0.10 | +0.22 | +0.38 |
| 🏭 Coal Bush | +0.05 | +0.12 | +0.20 |
| 🌿 Leveraged Vine | -0.20 | -0.60 | -1.00 |

### Key learning
Geopolitical shocks create winners and losers simultaneously. Defense stocks, gold, and cash all benefit. This is why portfolio construction matters — the right mix absorbs shocks rather than being destroyed by them.

### Flora hint
*"Lightning doesn't give warnings. Geopolitical shocks are the same — sudden, sharp, and indiscriminate. But look: your fortified oak and cactus held up. Defense companies and gold have always been safe havens in times of conflict. A well-diversified garden doesn't just survive storms — parts of it thrive."*

```json
{
  "id": "geopolitical_shock",
  "name": "Geopolitical Shock",
  "category": "GEOPOLITICAL",
  "weatherType": "lightning",
  "weatherEmoji": "⚡",
  "amplitudes": {
    "light": {
      "label": "Rising Tensions",
      "emoji": "🌩️",
      "headline": "Diplomatic tensions escalate — markets price in geopolitical risk premium",
      "effects": { "oak": -0.06, "bush": 0.04, "grass": 0.01, "cactus": 0.08, "exotic": -0.10, "fortified_oak": 0.10, "coal_bush": 0.05, "junk_weed": -0.07, "leveraged_vine": -0.20 }
    },
    "moderate": {
      "label": "Armed Conflict",
      "emoji": "⚡",
      "headline": "Military conflict breaks out — global markets sell off, gold and defence rally sharply",
      "effects": { "oak": -0.14, "bush": 0.08, "grass": 0.02, "cactus": 0.18, "exotic": -0.20, "fortified_oak": 0.22, "coal_bush": 0.12, "junk_weed": -0.15, "leveraged_vine": -0.60 }
    },
    "severe": {
      "label": "Full-Scale War",
      "emoji": "🌪️",
      "headline": "Major conflict declared — emergency G7 summit, circuit breakers triggered on global exchanges",
      "effects": { "oak": -0.26, "bush": 0.12, "grass": 0.03, "cactus": 0.30, "exotic": -0.35, "fortified_oak": 0.38, "coal_bush": 0.20, "junk_weed": -0.28, "leveraged_vine": -1.00 }
    }
  },
  "unlocksPlant": "fortified_oak",
  "appearsAtLevels": [8, 9, 10],
  "learning": "Geopolitical shocks reward defense stocks and gold. Diversification into these assets is the only protection against sudden conflict risk.",
  "floraHint": "Lightning doesn't give warnings. But a well-built garden has plants that thrive in storms — your fortified oak and cactus just proved it."
}
```

---

---

## EVENT 5 — Fed Rate Decision 🏦

### Weather metaphor: 🌧️ Heavy Rain (hike) / 🌤️ Clearing Skies (cut)

Central bank decisions are the single most powerful force in financial markets. A rate hike is like heavy rain — it cools everything down, hurts bonds and growth stocks, but strengthens cash. A rate cut is like the sun coming out after rain — everything begins to grow again, especially interest-sensitive assets.

### Real-world trigger
Federal Reserve FOMC meetings (8 per year), ECB rate decisions, SNB decisions. Powell press conferences, dot plot projections.

### When it appears
Levels 2 and 4 (rate hike introduced early), Level 9 (rate cut as a surprise recovery event).

### How plants react — Rate Hike

| Plant | Light (+0.25%) | Moderate (+0.50%) | Severe (+0.75%) |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.04 | -0.09 | -0.16 |
| 🌿 Bush (Bonds) | -0.05 | -0.11 | -0.20 |
| 🌾 Grass (Cash) | +0.02 | +0.04 | +0.06 |
| 🏔️ Cactus (Commodities) | -0.01 | -0.03 | -0.07 |
| 🌸 Exotic Flower (Crypto) | -0.08 | -0.18 | -0.32 |
| 🌵 Junk Weed | -0.07 | -0.16 | -0.28 |
| 🌿 Leveraged Vine | -0.18 | -0.40 | -0.85 |

### How plants react — Rate Cut

| Plant | Light (-0.25%) | Moderate (-0.50%) | Severe (-0.75%) |
|---|---|---|---|
| 🌳 Oak (Equities) | +0.05 | +0.10 | +0.18 |
| 🌿 Bush (Bonds) | +0.04 | +0.09 | +0.16 |
| 🌾 Grass (Cash) | -0.01 | -0.02 | -0.03 |
| 🏔️ Cactus (Commodities) | +0.02 | +0.05 | +0.09 |
| 🌸 Exotic Flower (Crypto) | +0.06 | +0.14 | +0.25 |
| 🌵 Junk Weed | +0.04 | +0.10 | +0.18 |
| 🌿 Leveraged Vine | +0.15 | +0.35 | +0.70 |

### Key learning
Rate hikes hurt bonds AND equities simultaneously — this surprises beginners who think bonds are always safe. Rate cuts do the opposite. Cash is the one asset that benefits from hikes (higher savings rates) and suffers from cuts.

### Flora hint (hike)
*"The Fed turned on the cold water. Higher rates mean borrowing costs more — bad for companies, bad for bonds already paying less than new ones. Cash is actually the winner here. It's one of the few moments in investing where doing nothing — holding cash — is the active right choice."*

### Flora hint (cut)
*"The sun came out. Lower rates mean cheaper borrowing, more investment, more growth. Bonds rally because older bonds paying more become valuable. Equities love it. Only cash suffers — your savings earn less. This is why staying invested beats hiding in cash."*

```json
{
  "id": "fed_rate_hike",
  "name": "Fed Rate Hike",
  "category": "CENTRAL BANKING",
  "weatherType": "rain",
  "weatherEmoji": "🌧️",
  "variant": "hike",
  "amplitudes": {
    "light": {
      "label": "Rate Nudge +0.25%",
      "emoji": "🌦️",
      "headline": "Fed raises rates 25bps — signals data-dependent approach going forward",
      "effects": { "oak": -0.04, "bush": -0.05, "grass": 0.02, "cactus": -0.01, "exotic": -0.08, "coal_bush": -0.03, "junk_weed": -0.07, "leveraged_vine": -0.18 }
    },
    "moderate": {
      "label": "Rate Hike +0.50%",
      "emoji": "🌧️",
      "headline": "Fed delivers 50bps hike — Powell warns rates will stay higher for longer",
      "effects": { "oak": -0.09, "bush": -0.11, "grass": 0.04, "cactus": -0.03, "exotic": -0.18, "coal_bush": -0.07, "junk_weed": -0.16, "leveraged_vine": -0.40 }
    },
    "severe": {
      "label": "Aggressive Hike +0.75%",
      "emoji": "⛈️",
      "headline": "Shock 75bps hike — largest in 30 years, markets reprice entire rate path",
      "effects": { "oak": -0.16, "bush": -0.20, "grass": 0.06, "cactus": -0.07, "exotic": -0.32, "coal_bush": -0.14, "junk_weed": -0.28, "leveraged_vine": -0.85 }
    }
  },
  "appearsAtLevels": [2, 4, 7],
  "learning": "Rate hikes hurt both bonds and equities. Cash is the rare winner. The severity of the hike determines the magnitude of the damage.",
  "floraHint": "The Fed turned on the cold water. Higher rates mean borrowing costs more — bad for companies, bad for existing bonds."
},
{
  "id": "fed_rate_cut",
  "name": "Fed Rate Cut",
  "category": "CENTRAL BANKING",
  "weatherType": "sun",
  "weatherEmoji": "🌤️",
  "variant": "cut",
  "amplitudes": {
    "light": {
      "label": "Rate Trim -0.25%",
      "emoji": "🌤️",
      "headline": "Fed cuts 25bps — cautious easing as inflation cools toward target",
      "effects": { "oak": 0.05, "bush": 0.04, "grass": -0.01, "cactus": 0.02, "exotic": 0.06, "coal_bush": 0.04, "junk_weed": 0.04, "leveraged_vine": 0.15 }
    },
    "moderate": {
      "label": "Rate Cut -0.50%",
      "emoji": "☀️",
      "headline": "Fed cuts 50bps — signals pivot to easing cycle, risk assets surge",
      "effects": { "oak": 0.10, "bush": 0.09, "grass": -0.02, "cactus": 0.05, "exotic": 0.14, "coal_bush": 0.09, "junk_weed": 0.10, "leveraged_vine": 0.35 }
    },
    "severe": {
      "label": "Emergency Cut -0.75%",
      "emoji": "🌞",
      "headline": "Emergency rate cut — Fed acts between meetings to prevent financial contagion",
      "effects": { "oak": 0.18, "bush": 0.16, "grass": -0.03, "cactus": 0.09, "exotic": 0.25, "coal_bush": 0.15, "junk_weed": 0.18, "leveraged_vine": 0.70 }
    }
  },
  "appearsAtLevels": [9, 10],
  "learning": "Rate cuts lift both bonds and equities. Cash suffers. Leverage amplifies the upside — but remember it amplifies the downside too.",
  "floraHint": "The sun came out. Lower rates mean cheaper borrowing and more growth. This is why staying invested beats hiding in cash."
}
```

---

---

## EVENT 6 — Tariff Crisis / Trade War 🚢

### Weather metaphor: 🌫️ Thick Fog

A trade war doesn't destroy the garden — it disorients it. Fog makes everything uncertain. Some plants that rely on global trade routes shrink. Domestic producers may benefit. The overall effect is inefficiency — growth slows because the economic machine runs with friction.

### Real-world trigger
Import tariffs (US-China, EU-US), retaliatory trade measures, trade agreement collapses, supply chain nationalisation.

### When it appears
Level 6. Introduces the concept of global vs domestic exposure in equity investing.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Global Equities) | -0.03 | -0.08 | -0.16 |
| 🌿 Bush (Bonds) | +0.02 | +0.04 | +0.07 |
| 🌾 Grass (Cash) | 0.00 | +0.01 | +0.02 |
| 🏔️ Cactus (Commodities) | -0.02 | -0.05 | -0.10 |
| 🌸 Exotic Flower (Crypto) | +0.02 | +0.05 | +0.10 |
| 🏭 Coal Bush | -0.04 | -0.10 | -0.18 |
| 🌵 Junk Weed | -0.04 | -0.10 | -0.20 |

### Key learning
Trade wars introduce economic friction. Crypto occasionally benefits as a non-sovereign asset outside the trade system. Globally exposed equities suffer. Bonds benefit modestly as a safe haven.

### Flora hint
*"Fog doesn't destroy your garden — it makes everything harder. Trade wars slow global commerce. Companies that sell internationally get squeezed. Interestingly, some players move to crypto during trade wars — it exists outside any single nation's trade policy. Whether that's smart or not depends on your risk appetite."*

```json
{
  "id": "tariff_crisis",
  "name": "Tariff Crisis",
  "category": "TRADE",
  "weatherType": "fog",
  "weatherEmoji": "🌫️",
  "amplitudes": {
    "light": {
      "label": "Trade Friction",
      "emoji": "🌫️",
      "headline": "US announces targeted tariffs on select imports — trade partners warn of retaliation",
      "effects": { "oak": -0.03, "bush": 0.02, "grass": 0.00, "cactus": -0.02, "exotic": 0.02, "coal_bush": -0.04, "junk_weed": -0.04, "leveraged_vine": -0.10 }
    },
    "moderate": {
      "label": "Trade War",
      "emoji": "🌁",
      "headline": "Full trade war erupts — 25% tariffs imposed, retaliation swift and broad",
      "effects": { "oak": -0.08, "bush": 0.04, "grass": 0.01, "cactus": -0.05, "exotic": 0.05, "coal_bush": -0.10, "junk_weed": -0.10, "leveraged_vine": -0.25 }
    },
    "severe": {
      "label": "Trade Collapse",
      "emoji": "🏚️",
      "headline": "WTO rules suspended — major economies retreat into protectionism, global supply chains fracture",
      "effects": { "oak": -0.16, "bush": 0.07, "grass": 0.02, "cactus": -0.10, "exotic": 0.10, "coal_bush": -0.18, "junk_weed": -0.20, "leveraged_vine": -0.50 }
    }
  },
  "appearsAtLevels": [6, 8],
  "learning": "Trade wars create uncertainty and slow global growth. Domestically focused assets and non-sovereign stores of value (gold, crypto) can benefit.",
  "floraHint": "Fog doesn't destroy your garden — it makes everything harder and slower. Trade wars tax the whole global machine."
}
```

---

---

## EVENT 7 — Nothing Special 😶

### Weather metaphor: 🌤️ Calm Clear Day

The market does nothing. This is actually one of the most important events in the game — because the correct response is also nothing. Many investors can't resist tinkering in calm periods, which introduces unnecessary transaction costs and tax events.

### Real-world trigger
Low-volatility periods. No major macro events. Markets drift. GDP growth is moderate. Inflation is contained.

### When it appears
Levels 1, 4, 7 — scattered throughout to test patient behaviour.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| All plants | +0.01 | +0.03 | +0.05 |

Small steady growth for everything. The lesson is compounding: boring is beautiful over time.

### Key learning
Long-term investing is mostly waiting. The investors who do best are often the ones who do the least. Compounding works in silence.

### Flora hint
*"A calm day in the garden. Nothing dramatic happened — and that's the point. Your plants grew a little just by existing. Most of investing is exactly this: patient, boring, steady. The investors who compounded the most wealth over decades were often the ones who checked their portfolios the least."*

```json
{
  "id": "calm_year",
  "name": "Nothing Special",
  "category": "MACRO",
  "weatherType": "calm",
  "weatherEmoji": "🌤️",
  "amplitudes": {
    "light": {
      "label": "Quiet Quarter",
      "emoji": "🌤️",
      "headline": "Markets drift sideways — low volatility persists, investors await catalysts",
      "effects": { "oak": 0.01, "bush": 0.01, "grass": 0.01, "cactus": 0.01, "exotic": 0.01, "coal_bush": 0.02, "junk_weed": 0.02, "leveraged_vine": 0.03 }
    },
    "moderate": {
      "label": "Steady Growth",
      "emoji": "☀️",
      "headline": "Goldilocks conditions persist — moderate growth, contained inflation, no surprises",
      "effects": { "oak": 0.03, "bush": 0.02, "grass": 0.01, "cactus": 0.02, "exotic": 0.04, "coal_bush": 0.03, "junk_weed": 0.03, "leveraged_vine": 0.07 }
    },
    "severe": {
      "label": "Strong Bull Run",
      "emoji": "🌞",
      "headline": "Broad-based rally as all conditions align — equities reach all-time highs",
      "effects": { "oak": 0.05, "bush": 0.02, "grass": 0.01, "cactus": 0.03, "exotic": 0.08, "coal_bush": 0.06, "junk_weed": 0.05, "leveraged_vine": 0.12 }
    }
  },
  "appearsAtLevels": [1, 4, 7],
  "penaltyForOvertrading": true,
  "overtradingPenalty": -10,
  "learning": "Most of investing is waiting. Compounding works in silence. Tinkering during calm periods destroys value through costs and poor timing.",
  "floraHint": "A calm day. Nothing dramatic happened — and that's the point. Boring is the secret weapon of long-term investing."
}
```

---

---

## EVENT 8 — High Volatility / Market Panic 😱

### Weather metaphor: 🌪️ Tornado Warning

Volatility is different from a crash. The market moves violently in both directions — up 3%, down 4%, up 2%, down 5%. No clear direction. This is psychologically the hardest event because every move feels like a signal. The correct answer is usually to hold still and let the tornado pass.

### Real-world trigger
VIX spike (fear index above 30), bank failures, flash crashes, unexpected policy announcements, pandemic-type uncertainty events.

### When it appears
Level 7. Tests whether the player panic-trades or stays disciplined.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.05 | -0.14 | -0.25 |
| 🌿 Bush (Bonds) | +0.03 | +0.06 | +0.10 |
| 🌾 Grass (Cash) | +0.01 | +0.02 | +0.04 |
| 🏔️ Cactus (Commodities) | -0.02 | -0.05 | +0.08 |
| 🌸 Exotic Flower (Crypto) | -0.12 | -0.28 | -0.50 |
| 🌿 Leveraged Vine | -0.30 | -0.80 | -1.00 |
| 🌵 Junk Weed | -0.10 | -0.25 | -0.42 |

### Special mechanic
**Panic selling during this event costs double the usual penalty (-50 points instead of -25)**. The lesson is that volatility is the price of long-term returns. Selling during a tornado locks in losses and guarantees you miss the recovery.

### Key learning
Volatility is temporary. Selling during it is permanent. The emotional experience of watching your portfolio drop 15% is real — but acting on that emotion is the single most destructive thing a long-term investor can do.

### Flora hint
*"Tornado weather. Everything is moving violently and it feels like you should do something. The hardest — and most important — skill in investing is doing nothing when everything in your brain screams 'act'. The tornado will pass. The investors who stayed put are about to be rewarded. The ones who ran already locked in their losses."*

```json
{
  "id": "high_volatility",
  "name": "Market Panic",
  "category": "MARKET STRUCTURE",
  "weatherType": "tornado",
  "weatherEmoji": "🌪️",
  "amplitudes": {
    "light": {
      "label": "Market Jitters",
      "emoji": "🌬️",
      "headline": "VIX spikes to 22 — investors rotate defensively as uncertainty builds",
      "effects": { "oak": -0.05, "bush": 0.03, "grass": 0.01, "cactus": -0.02, "exotic": -0.12, "coal_bush": -0.05, "junk_weed": -0.10, "leveraged_vine": -0.30 }
    },
    "moderate": {
      "label": "Volatility Shock",
      "emoji": "🌪️",
      "headline": "Flash crash wipes 8% in minutes — circuit breakers triggered on three major exchanges",
      "effects": { "oak": -0.14, "bush": 0.06, "grass": 0.02, "cactus": -0.05, "exotic": -0.28, "coal_bush": -0.13, "junk_weed": -0.25, "leveraged_vine": -0.80 }
    },
    "severe": {
      "label": "Full Market Panic",
      "emoji": "🌀",
      "headline": "Black swan event — global markets in freefall, coordinated central bank intervention announced",
      "effects": { "oak": -0.25, "bush": 0.10, "grass": 0.04, "cactus": 0.08, "exotic": -0.50, "coal_bush": -0.22, "junk_weed": -0.42, "leveraged_vine": -1.00 }
    }
  },
  "appearsAtLevels": [7, 9, 10],
  "panicSellPenalty": -50,
  "holdBonusPoints": 25,
  "learning": "Volatility is temporary. Selling during it is permanent. Emotional discipline is the most valuable skill in investing.",
  "floraHint": "Tornado weather. The hardest — and most important — skill in investing is doing nothing when everything in your brain screams act."
}
```

---

---

## EVENT 9 — Inflation Shock 💸

### Weather metaphor: 🌧️ Acid Rain

Inflation is rain that damages rather than nourishes. It eats away at the real value of everything — especially cash and bonds. Unlike a storm it can persist for years, silently destroying purchasing power. It is the event that introduces the cactus (real assets / commodities) as the natural antidote.

### Real-world trigger
CPI print above expectations, energy price surge, wage-price spiral, supply chain disruption, excessive money printing.

### When it appears
Levels 2 and 5.

### How plants react

| Plant | Light | Moderate | Severe |
|---|---|---|---|
| 🌳 Oak (Equities) | -0.02 | -0.06 | -0.12 |
| 🌿 Bush (Bonds) | -0.04 | -0.09 | -0.17 |
| 🌾 Grass (Cash) | -0.03 | -0.06 | -0.10 |
| 🏔️ Cactus (Real assets / Gold) | +0.05 | +0.12 | +0.22 |
| 🌸 Exotic Flower (Crypto) | -0.04 | -0.10 | -0.20 |
| 🌿 Willow (Gov Bonds — long) | -0.06 | -0.14 | -0.25 |
| 🌵 Junk Weed | -0.05 | -0.11 | -0.20 |

### Key learning
Inflation is the silent killer of cash and bonds. Real assets (gold, commodities, real estate) are the antidote. This is why the cactus belongs in every garden — not for growth, but as insurance against the rain that corrodes.

```json
{
  "id": "inflation_shock",
  "name": "Inflation Shock",
  "category": "MACRO",
  "weatherType": "acid_rain",
  "weatherEmoji": "🌧️",
  "amplitudes": {
    "light": {
      "label": "Inflation Uptick",
      "emoji": "🌦️",
      "headline": "CPI rises to 4.1% — above target but central banks hold rates, monitoring situation",
      "effects": { "oak": -0.02, "bush": -0.04, "grass": -0.03, "cactus": 0.05, "exotic": -0.04, "willow": -0.06, "junk_weed": -0.05, "leveraged_vine": -0.12 }
    },
    "moderate": {
      "label": "Inflation Surge",
      "emoji": "🌧️",
      "headline": "CPI hits 7.2% — four-decade high, central bank signals aggressive tightening",
      "effects": { "oak": -0.06, "bush": -0.09, "grass": -0.06, "cactus": 0.12, "exotic": -0.10, "willow": -0.14, "junk_weed": -0.11, "leveraged_vine": -0.30 }
    },
    "severe": {
      "label": "Hyperinflation Risk",
      "emoji": "⛈️",
      "headline": "Inflation reaches 12% — emergency rate hikes, purchasing power collapse, currency crisis fears",
      "effects": { "oak": -0.12, "bush": -0.17, "grass": -0.10, "cactus": 0.22, "exotic": -0.20, "willow": -0.25, "junk_weed": -0.20, "leveraged_vine": -0.60 }
    }
  },
  "appearsAtLevels": [2, 5, 8],
  "learning": "Inflation destroys cash and bonds in real terms. Real assets are the antidote. This is why every portfolio needs inflation protection.",
  "floraHint": "Inflation is rain that corrodes rather than nourishes. Your cactus thrives here — real assets are inflation's natural enemy."
}
```

---

---

## EVENT 10 — Tech Bubble / Sector Mania 🚀

### Weather metaphor: ☄️ Meteor Shower

Once in a generation, one sector goes vertical. It looks like opportunity. It feels like missing out is the biggest risk. Then it corrects — violently and completely. The meteor shower is beautiful going up and devastating coming down.

### Real-world trigger
Dot-com bubble (1999–2001), crypto mania (2017, 2021), AI hype cycles, meme stock events, speculative IPO waves.

### When it appears
Level 9. The exotic flower (crypto / speculative tech) grows 10x before collapsing. Designed to teach FOMO — Fear Of Missing Out.

### How plants react

| Plant | Mania Phase | Bust Phase |
|---|---|---|
| 🌸 Exotic Flower | +0.80 | -0.75 |
| 🌳 Oak (Equities) | +0.15 | -0.20 |
| 🌿 Bush (Bonds) | -0.05 | +0.08 |
| 🌾 Grass (Cash) | 0.00 | +0.03 |
| 🌿 Leveraged Vine | +2.50 | -1.00 |

### Special mechanic
This event has two phases within the same level. Players see Phase 1 (mania) and are invited to rebalance before Phase 2 (bust). If they don't: the lesson is harsh but unforgettable.

### Key learning
FOMO is one of the most expensive emotions in investing. A 10x gain that becomes a -75% loss still results in a net loss if you enter too late. The best move is often watching from a distance with a small exploratory position.

```json
{
  "id": "sector_mania",
  "name": "Sector Mania",
  "category": "MARKET STRUCTURE",
  "weatherType": "meteor",
  "weatherEmoji": "☄️",
  "twoPhase": true,
  "phase1": {
    "label": "The Mania",
    "emoji": "🚀",
    "headline": "Crypto / AI stocks up 300% this year — everyone is talking about it",
    "effects": { "oak": 0.15, "bush": -0.05, "grass": 0.00, "exotic": 0.80, "leveraged_vine": 2.50 }
  },
  "phase2": {
    "label": "The Bust",
    "emoji": "💥",
    "headline": "Bubble bursts — speculative assets down 75%, contagion spreads to growth stocks",
    "effects": { "oak": -0.20, "bush": 0.08, "grass": 0.03, "exotic": -0.75, "leveraged_vine": -1.00 }
  },
  "rebalanceWindowBetweenPhases": true,
  "appearsAtLevels": [9, 10],
  "learning": "FOMO is one of the most expensive emotions in investing. Speculative manias always end. Timing them is nearly impossible.",
  "floraHint": "The meteor shower was dazzling — and then it hit the ground. Every speculative mania in history has ended the same way. The only question is whether you were out before it landed."
}
```

---

---

## Full Event Reference Table

| # | Event | Weather | Emoji | First appears | Primary punished plant | Primary rewarded plant |
|---|---|---|---|---|---|---|
| 1 | Earnings Season | Sun / Clouds | ☀️🌤️ | Level 1 | Leveraged Vine | Oak |
| 2 | Unemployment Spike | Cold Rain | 🌧️ | Level 3 | Junk Weed | Bush |
| 3 | Oil Crisis | Desert Heat | 🔥 | Level 5 | Equities | Cactus |
| 4 | Geopolitical Shock | Lightning | ⚡ | Level 8 | Leveraged Vine | Fortified Oak |
| 5a | Fed Rate Hike | Heavy Rain | 🌧️ | Level 2 | Bonds + Equities | Cash |
| 5b | Fed Rate Cut | Clearing Skies | 🌤️ | Level 9 | Cash | Bonds + Equities |
| 6 | Tariff Crisis | Thick Fog | 🌫️ | Level 6 | Global Equities | Crypto (minor) |
| 7 | Nothing Special | Calm Day | 🌤️ | Level 1 | — | All (slow) |
| 8 | Market Panic | Tornado | 🌪️ | Level 7 | Crypto + Leverage | Cash + Bonds |
| 9 | Inflation Shock | Acid Rain | 🌧️ | Level 2 | Cash + Bonds | Cactus |
| 10 | Sector Mania | Meteor Shower | ☄️ | Level 9 | Exotic (bust) | Exotic (mania) |

---

## Adding a new event — template

```json
{
  "id": "unique_snake_case_id",
  "name": "Display Name",
  "category": "MACRO / CORPORATE / GEOPOLITICAL / CENTRAL BANKING / TRADE / MARKET STRUCTURE",
  "weatherType": "sun / rain / storm / frost / heat / lightning / fog / calm / tornado / meteor / acid_rain",
  "weatherEmoji": "emoji",
  "amplitudes": {
    "light":    { "label": "", "emoji": "", "headline": "", "effects": {} },
    "moderate": { "label": "", "emoji": "", "headline": "", "effects": {} },
    "severe":   { "label": "", "emoji": "", "headline": "", "effects": {} }
  },
  "appearsAtLevels": [],
  "unlocksPlant": null,
  "learning": "One sentence — the core financial lesson",
  "floraHint": "Flora's debrief line — conversational, uses garden metaphor"
}
```
