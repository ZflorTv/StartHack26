# 🥀 Bad Plants — Design Document

> Three types of dangerous plants that teach advanced investing concepts through failure.
> These appear in later levels (7–10) as tempting options the player can choose — but shouldn't.

---

## The Core Design Principle

Bad plants look attractive on the surface. They promise higher returns, exciting growth, or a sense of doing good. The game lets the player pick them freely. The *consequence* is what teaches — not a warning upfront. The AI Coach (Flora) explains what went wrong afterwards.

This mirrors real investing: bad decisions rarely look bad at the moment you make them.

---

---

## BAD PLANT 1 — The Coal Bush 🏭

### What it represents
**Non-ESG / Unsustainable assets** — fossil fuels, weapons manufacturers, companies with poor governance or environmental records. High short-term returns, but increasingly toxic to a modern portfolio.

### The garden metaphor
A dark, thorny bush that produces black berries. It looks productive and grows fast in the short term. But it poisons the soil around it — nearby plants grow slower. Over time it attracts pests (regulatory risk), and in severe weather events it gets torn out entirely (divestment waves, carbon taxes).

### Visual states
| State | Appearance |
|---|---|
| Healthy | Dark green/black leaves, shiny berries, looks profitable |
| Growing | Spreads aggressively, overshadows other plants |
| Damaged | Leaves turn grey, berries fall, soil around it darkens |
| Removed | Pulled out by roots — "Regulatory divestment" event card |

### When it appears
Level 7. Introduced during a "Stable Year" event where it outperforms everything. The trap is set — it looks like the right move. It punishes during a "Carbon Tax Shock" or "ESG Regulation" event in level 8 or 9.

### Scoring impact
- Holding it through an ESG event: **-20 points**
- Holding it at game end: **-10 points** (portfolio health penalty)
- Selling it before the ESG event (anticipating risk): **+15 points**

### Key learning
> ESG is not just ethics — it is risk management. Assets exposed to environmental or governance risk carry regulatory, reputational, and financial tail risk that does not show up in short-term returns. The market is increasingly pricing this in.

### Common mistake it teaches
Chasing short-term yield without accounting for long-term systemic risk. Ignoring the fact that regulation, consumer preferences, and institutional divestment are structural headwinds for non-ESG assets.

### Flora's debrief line
*"Your coal bush grew fast — but it poisoned the soil. ESG isn't just about values. Companies with poor environmental records face real financial risks: carbon taxes, lawsuits, and being excluded from major investment funds. The market is catching up."*

---

### JSON Dictionary

```json
{
  "id": "coal_bush",
  "type": "bad_plant",
  "subtype": "non_esg",
  "name": "Coal Bush",
  "emoji": "🏭",
  "assetClass": "Non-ESG Equity",
  "realWorldEquivalent": "Fossil fuel stocks, weapons manufacturers, poor-governance companies",
  "visualStyle": {
    "healthy": "dark thorny bush, black berries, aggressive spread",
    "damaged": "grey leaves, darkened soil radius, wilting berries",
    "removed": "pulled by roots, grey soil patch remains"
  },
  "appearsAtLevel": 7,
  "introEvent": "stable_year",
  "punishmentEvent": "esg_regulation_shock",
  "shortTermReturn": 0.12,
  "baseEffects": {
    "stable_year": 0.12,
    "bull_market": 0.09,
    "esg_regulation": -0.28,
    "carbon_tax": -0.22,
    "market_crash": -0.18
  },
  "soilPoisonEffect": {
    "description": "Reduces return of adjacent ESG-positive plants by 2% per level held",
    "affectedPlants": ["willow", "solar_flower"]
  },
  "scoringImpact": {
    "holdThroughESGEvent": -20,
    "holdAtGameEnd": -10,
    "sellBeforeESGEvent": 15
  },
  "learning": {
    "concept": "ESG investing and sustainability risk",
    "level": 7,
    "keyInsight": "ESG is risk management, not just ethics. Non-ESG assets carry regulatory, reputational and financial tail risk.",
    "commonMistake": "Chasing short-term yield while ignoring structural headwinds from regulation and divestment",
    "floraDebrief": "Your coal bush grew fast — but it poisoned the soil. ESG isn't just about values. Companies with poor environmental records face real financial risks: carbon taxes, lawsuits, and exclusion from major funds."
  },
  "warningSign": "Unusually high yield compared to similar assets — always ask why",
  "riskLabel": "ESG Risk",
  "riskColor": "#5D4037"
}
```

---

---

## BAD PLANT 2 — The Junk Weed 🌵

### What it represents
**High-yield / Junk bonds** — bonds rated below investment grade (BB or lower by S&P). They pay very high interest because they have a real chance of defaulting. Also called speculative-grade bonds.

### The garden metaphor
A fast-growing, spiky weed with bright orange flowers. It looks exciting and pays out visibly each turn (the high coupon). But its roots are shallow — in any drought or storm it collapses completely. Unlike the solid Bush (investment-grade bonds), it has no structural strength.

### The bond rating system — key context
This plant is the entry point to teaching the bond rating ladder:

| Rating | Category | Plant equivalent |
|---|---|---|
| AAA / AA | Investment grade — top quality | Willow Tree (solid, safe) |
| A / BBB | Investment grade — acceptable | Standard Bush |
| BB | Junk — speculative | Junk Weed (this plant) |
| B and below | Junk — highly speculative | Junk Weed (severe version) |
| D | Default | Dead stump |

### When it appears
Level 6. Introduced alongside standard bonds so the player can compare. It pays more every turn which is tempting. It punishes during a "Credit Crisis" or "Recession" event when default rates spike.

### Scoring impact
- Allocating more than 20% to junk bonds: **-15 points** (concentration in speculative debt)
- Holding through a credit crisis: **-25 points**
- Mixing small amount (under 10%) as diversification: **neutral** — acceptable in a growth profile
- Selling before recession event: **+10 points**

### Key learning
> Bonds are not all the same. A bond rated BBB and one rated B both pay "interest" — but the risk of not getting your money back is radically different. Junk bonds pay more because they have to. The extra yield is compensation for the extra risk of default.

### Common mistake it teaches
Treating all bonds as "safe." Buying junk bonds for the yield without understanding that they behave more like equities in a crisis — they crash when the economy deteriorates, exactly when you need your bonds to hold.

### Flora's debrief line
*"Your junk weed paid well — until it didn't. High-yield bonds offer attractive coupons because they carry real default risk. In a recession, they fall almost as hard as stocks. The extra interest was never free — it was payment for the risk you were taking."*

---

### JSON Dictionary

```json
{
  "id": "junk_weed",
  "type": "bad_plant",
  "subtype": "junk_bond",
  "name": "Junk Weed",
  "emoji": "🌵",
  "assetClass": "High-Yield Bond (Sub-Investment Grade)",
  "realWorldEquivalent": "BB-rated and below corporate bonds, leveraged loan funds",
  "bondRating": "BB and below",
  "investmentGrade": false,
  "visualStyle": {
    "healthy": "spiky weed, bright orange flowers, fast spreading",
    "damaged": "flowers drop, spikes remain, yellowing stem",
    "removed": "collapses flat, roots exposed — default animation"
  },
  "appearsAtLevel": 6,
  "introEvent": "stable_year",
  "punishmentEvent": "credit_crisis",
  "couponYield": 0.08,
  "baseEffects": {
    "stable_year": 0.08,
    "bull_market": 0.07,
    "recession": -0.22,
    "credit_crisis": -0.35,
    "market_crash": -0.28,
    "rate_hike": -0.10
  },
  "defaultRisk": {
    "stable": 0.04,
    "recession": 0.18,
    "crisis": 0.35
  },
  "scoringImpact": {
    "allocationAbove20pct": -15,
    "holdThroughCreditCrisis": -25,
    "allocationBelow10pct": 0,
    "sellBeforeRecession": 10
  },
  "bondRatingLadder": [
    { "rating": "AAA/AA", "category": "Investment Grade", "plantEquivalent": "willow_tree", "defaultRisk": "< 0.1%" },
    { "rating": "A/BBB",  "category": "Investment Grade", "plantEquivalent": "bush",        "defaultRisk": "0.1 – 0.5%" },
    { "rating": "BB",     "category": "Junk / Speculative","plantEquivalent": "junk_weed",  "defaultRisk": "1 – 4%" },
    { "rating": "B",      "category": "Highly Speculative","plantEquivalent": "junk_weed",  "defaultRisk": "4 – 10%" },
    { "rating": "CCC/D",  "category": "Near Default",      "plantEquivalent": "dead_stump", "defaultRisk": "> 20%" }
  ],
  "learning": {
    "concept": "Bond ratings and junk bonds",
    "level": 6,
    "keyInsight": "Bonds are not all safe. Junk bonds pay more because they carry real default risk — and in a recession they crash like equities.",
    "commonMistake": "Treating all bonds as defensive. Overweighting high-yield for the coupon without understanding correlation with economic cycles.",
    "floraDebrief": "Your junk weed paid well — until it didn't. High-yield bonds offer attractive coupons because they carry real default risk. In a recession, they fall almost as hard as stocks."
  },
  "warningSign": "Yield significantly above government bond rate — the gap (spread) is the market's estimate of default risk",
  "riskLabel": "Default Risk",
  "riskColor": "#E65100"
}
```

---

---

## BAD PLANT 3 — The Leveraged Vine 🌿⚡

### What it represents
**Over-leveraged investments** — using borrowed money to amplify returns. Leverage multiplies gains when things go right, and multiplies losses when things go wrong. At extreme levels (10x, 20x) a small move against you wipes out your entire position — this is called liquidation.

### The garden metaphor
A fast-climbing vine that wraps around everything. When it grows, it grows explosively — doubling and tripling in size. But it depends entirely on a support structure (borrowed capital). If the support collapses — one bad storm, one dry week — the vine has no roots of its own and falls completely. The bigger it grew, the harder it falls. It can also pull down the plants it was climbing on.

### The leverage mechanics — key context
This plant introduces the concept of leverage multipliers:

| Leverage | Meaning | 10% market drop becomes |
|---|---|---|
| 1x | No leverage (normal) | -10% loss |
| 2x | Borrowed equal to invested | -20% loss |
| 5x | Borrowed 4x your capital | -50% loss |
| 10x | Borrowed 9x your capital | -100% loss → liquidation |
| 20x | Common in crypto/CFDs | Liquidated on a 5% move |

### Liquidation explained (for Flora's coaching)
When you use leverage, your broker sets a **liquidation threshold**. If losses exceed your collateral, your position is automatically closed at a total loss — before you can react. This is not a metaphor. It happens in seconds.

### When it appears
Level 8. The vine grows explosively during a bull market (level 8 intro event), making the player feel clever. It gets liquidated during the level 9 volatility event. The wipeout is instant and complete — the plant simply disappears from the garden.

### Scoring impact
- Allocating more than 15% to the leveraged vine: **-20 points**
- Getting liquidated: **-35 points** + Flora explains liquidation in detail
- Using small leverage (under 5%) as a learning experiment: **-5 points** (gentle penalty, acknowledged as a lesson)
- Correctly avoiding it entirely: **+10 points** (wisdom bonus)

### Key learning
> Leverage is a tool, not a strategy. Used carefully by professionals for specific purposes, it can improve capital efficiency. Used carelessly — especially by beginners chasing returns — it is the fastest way to lose everything. The asymmetry is brutal: you can only gain what you invested, but you can lose far more.

### Common mistake it teaches
Confusing high returns in a bull market with skill. Leveraged positions look like genius during a rally. The trap closes during any sudden volatility — and leverage means you never have enough time to react before liquidation.

### Flora's debrief line
*"Your vine grew spectacularly — and then it had nothing left to hold onto. Leverage multiplies everything: your gains when you're right, and your losses when you're wrong. A 10% move against a 10x leveraged position wipes you out completely. That's not bad luck — that's mathematics."*

---

### JSON Dictionary

```json
{
  "id": "leveraged_vine",
  "type": "bad_plant",
  "subtype": "over_leveraged",
  "name": "Leveraged Vine",
  "emoji": "🌿",
  "assetClass": "Leveraged Investment (CFD / Margin / Leveraged ETF)",
  "realWorldEquivalent": "Leveraged ETFs (3x), CFDs, margin trading, leveraged crypto positions",
  "visualStyle": {
    "healthy": "explosive climbing vine, wraps around everything, bright aggressive green",
    "growing": "doubles in size each turn, starts to overwhelm other plants",
    "damaged": "support post cracks, vine begins unwinding",
    "liquidated": "instantly disappears — no wilting, just gone. Grey outline remains."
  },
  "appearsAtLevel": 8,
  "introEvent": "bull_market_strong",
  "punishmentEvent": "volatility_spike",
  "leverageMultiplier": 5,
  "baseEffects": {
    "bull_market": 0.45,
    "stable_year": 0.12,
    "mild_correction": -0.30,
    "volatility_spike": -1.0,
    "market_crash": -1.0
  },
  "liquidationThreshold": -0.20,
  "liquidationEffect": {
    "portfolioImpact": -1.0,
    "description": "Position wiped to zero. No recovery possible.",
    "visualEffect": "plant_disappears",
    "floraTriggered": true
  },
  "leverageTable": [
    { "leverage": "1x",  "tenPctDropBecomes": "-10%",  "liquidationAt": "never" },
    { "leverage": "2x",  "tenPctDropBecomes": "-20%",  "liquidationAt": "-50% move" },
    { "leverage": "5x",  "tenPctDropBecomes": "-50%",  "liquidationAt": "-20% move" },
    { "leverage": "10x", "tenPctDropBecomes": "-100%", "liquidationAt": "-10% move" },
    { "leverage": "20x", "tenPctDropBecomes": "-200%", "liquidationAt": "-5% move" }
  ],
  "scoringImpact": {
    "allocationAbove15pct": -20,
    "getLiquidated": -35,
    "allocationBelow5pct": -5,
    "avoidEntirely": 10
  },
  "learning": {
    "concept": "Leverage and liquidation risk",
    "level": 8,
    "keyInsight": "Leverage multiplies both gains and losses. At high multiples, small market moves cause total loss through liquidation.",
    "commonMistake": "Mistaking leveraged bull market gains for skill. Not understanding that liquidation removes all ability to wait for recovery.",
    "floraDebrief": "Your vine grew spectacularly — and then it had nothing left to hold onto. Leverage multiplies everything: gains when right, losses when wrong. A 10% move against a 10x position wipes you out completely. That's not bad luck — that's mathematics."
  },
  "warningSign": "Returns that seem too good compared to the underlying asset — always ask how the return is being amplified",
  "riskLabel": "Liquidation Risk",
  "riskColor": "#B71C1C"
}
```

---

---

## How the three bad plants work together

| Plant | Concept taught | Level | Punishment trigger | Core lesson |
|---|---|---|---|---|
| 🏭 Coal Bush | ESG / sustainability risk | 7 | ESG regulation shock | Risk is not just financial — regulation and values reshape markets |
| 🌵 Junk Weed | Bond ratings / default risk | 6 | Credit crisis / recession | Not all bonds are safe. Yield = compensation for risk |
| 🌿 Leveraged Vine | Leverage and liquidation | 8 | Volatility spike | Leverage is a tool. Misused, it guarantees ruin |

---

## How to add them to your `events.js`

Each bad plant's effects plug directly into the existing event structure. Add the bad plants to your existing `PLANTS` array in your data file and reference them by `id` in event effects:

```js
// In data/events.js — add to your plants array:
const BAD_PLANTS = [
  {
    id: "coal_bush",
    name: "Coal Bush",
    emoji: "🏭",
    type: "bad",
    unlocksAtLevel: 7
  },
  {
    id: "junk_weed",
    name: "Junk Weed",
    emoji: "🌵",
    type: "bad",
    unlocksAtLevel: 6
  },
  {
    id: "leveraged_vine",
    name: "Leveraged Vine",
    emoji: "🌿",
    type: "bad",
    unlocksAtLevel: 8
  }
]

// Then in your event effects, reference them by id:
{
  id: "esg_regulation_shock",
  level: 8,
  name: "ESG Regulation",
  emoji: "⚖️",
  effects: {
    bush: +0.02,
    oak: -0.04,
    grass: +0.01,
    coal_bush: -0.28,      // bad plant gets destroyed
    junk_weed: -0.06,
    leveraged_vine: -0.15
  }
}
```

---

## Note on UX for bad plants

When a bad plant is introduced for the first time, Flora should **not warn the player upfront**. The temptation is intentional. The coaching comes after the consequence — that is when learning sticks.

The only visual hint is subtle: bad plants have a slightly darker, more aggressive visual style compared to the clean pastels of good plants. A player paying attention might notice. Most won't — and that is the point.
