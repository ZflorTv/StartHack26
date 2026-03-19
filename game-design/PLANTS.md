# 🌿 Classic Plants — Design Document

> The full plant universe for Wealth Garden. Every asset class, sub-category, plant name, behaviour, and JSON schema. Do not change the plant-to-asset mapping.

------------------------------------------------------------------------


---

## CATEGORY 1 — EQUITY (Trees)

Trees represent equity investments. They grow tall in good conditions, provide shade (returns) over time, but can lose leaves (value) during bad weather. Their height and fullness signal portfolio performance.
---

### TECH — Cherry Blossom Tree 🌸

**Asset:** Technology equities (e.g. Nasdaq, FAANG, growth tech stocks) **Color:** Pink

The cherry blossom is the most visually dramatic tree in the garden. It blooms explosively in spring (bull markets), creating a spectacular display. But its petals fall instantly at the first sign of cold — tech stocks are the first to sell off in risk-off environments. The blossom always returns, often stronger than before, reflecting tech's strong rebound cycles after corrections.

**Visual states**

| State   | Appearance                                     |
|---------|------------------------------------------------|
| Healthy | Full pink blossom canopy, petals at peak       |
| Growing | New pink buds opening, branches filling out    |
| Damaged | Petals falling, sparse branches, pale pink     |
| Wilted  | Bare branches, a few remaining buds, grey tint |

**When it appears** Level 3. Introduced as the first sub-sector equity, after the player understands basic equity exposure through generic trees.

**How it reacts to events**

| Event                       | Reaction                                     |
|-----------------------------|----------------------------------------------|
| Bull Market / Earnings Beat | +++ Strong bloom, petals multiply            |
| Fed Rate Cut                | ++ Growth stocks love cheap money            |
| Inflation Shock             | -- Petals fall, high-multiple stocks reprice |
| Fed Rate Hike               | --- Severe petal loss, duration risk         |
| Market Crash                | --- Near-bare branches                       |
| Sector Mania (intro)        | ++++ Explosive bloom                         |
| Sector Mania (bust)         | ---- Instantly stripped bare                 |

**Scoring behaviour** Rewarded for holding through corrections (+15 if player holds through a crash and cherry blossom recovers in next level). Penalised if player panic-sells after petal loss and misses the rebound.

**Flora's insight** *"Your cherry blossom dropped every petal in the storm — but look at it now. Tech stocks are the garden's most dramatic performers. They fall hard and fast, but their roots are strong. The investors who held through the bare branches are now enjoying the full bloom."*

``` json
{
  "id": "cherry_blossom",
  "name": "Cherry Blossom Tree",
  "icon": "assets/plants/cherry-blossom.png",
  "category": "equity",
  "subCategory": "tech",
  "realWorldEquivalent": "Technology equities — Nasdaq, FAANG, growth tech stocks",
  "color": "#FFB7C5",
  "colorName": "Pink",
  "keywords": ["fast growth", "fragile", "hype", "volatility"],
  "unlocksAtLevel": 3,
  "visualStates": {
    "healthy": "full pink blossom canopy, petals at peak",
    "growing": "new pink buds opening, branches filling out",
    "damaged": "petals falling, sparse branches, pale pink",
    "wilted": "bare branches, few remaining buds, grey tint"
  },
  "baseEffects": {
    "bull_market": 0.14,
    "earnings_beat": 0.12,
    "fed_rate_cut": 0.10,
    "calm_year": 0.04,
    "inflation_shock": -0.10,
    "fed_rate_hike": -0.14,
    "market_crash": -0.24,
    "unemployment_spike": -0.10,
    "sector_mania_up": 0.40,
    "sector_mania_down": -0.38
  },
  "riskLevel": "high",
  "volatility": "very_high",
  "rebound": true,
  "floraInsight": "Tech stocks fall hard and fast — but their roots are strong. The investors who held through the bare branches are now enjoying the full bloom."
}
```

------------------------------------------------------------------------

### HEALTHCARE — Magnolia Tree 🤍

**Asset:** Healthcare equities (pharmaceuticals, medical devices, defensive health stocks) **Color:** White

The magnolia is the most resilient tree in the garden. Its thick waxy petals barely move in a storm. Healthcare is a defensive sector — people need medicine regardless of the economy. The magnolia grows slowly and steadily, never spectacular, never devastating. It is the anchor of a well-built portfolio.

**Visual states**

| State   | Appearance                                           |
|---------|------------------------------------------------------|
| Healthy | Full white blooms, thick glossy leaves, sturdy trunk |
| Growing | New white flowers opening slowly                     |
| Damaged | A few petals drop, but structure intact              |
| Wilted  | Slightly reduced canopy — still mostly intact        |

**When it appears** Level 4. Introduced to show the value of defensive sector allocation.

**How it reacts to events**

| Event              | Reaction                                   |
|--------------------|--------------------------------------------|
| Bull Market        | \+ Moderate — misses the rally             |
| Market Crash       | Minimal damage — the defensive anchor      |
| Unemployment Spike | Neutral to slightly positive               |
| Fed Rate Hike      | Minor negative                             |
| Geopolitical Shock | \+ Slightly positive — flight to defensive |
| Calm Year          | \+ Steady quiet growth                     |

**Flora's insight** *"Your magnolia barely noticed the storm. Healthcare companies sell products people need whether the economy grows or shrinks. It will never be your fastest-growing plant — but when the storm hits and everything else is losing petals, you'll be very glad it's there."*

``` json
{
  "id": "magnolia",
  "name": "Magnolia Tree",
  "icon": "assets/plants/magnolia.png",
  "category": "equity",
  "subCategory": "healthcare",
  "realWorldEquivalent": "Healthcare equities — pharmaceuticals, medical devices, defensive health",
  "color": "#F5F5F0",
  "colorName": "White",
  "keywords": ["defensive", "resilient", "stable", "longevity"],
  "unlocksAtLevel": 4,
  "visualStates": {
    "healthy": "full white blooms, thick glossy leaves, sturdy trunk",
    "growing": "new white flowers opening slowly",
    "damaged": "few petals drop, structure intact",
    "wilted": "slightly reduced canopy — mostly intact"
  },
  "baseEffects": {
    "bull_market": 0.04,
    "earnings_beat": 0.05,
    "fed_rate_cut": 0.03,
    "calm_year": 0.03,
    "inflation_shock": -0.02,
    "fed_rate_hike": -0.03,
    "market_crash": -0.04,
    "unemployment_spike": 0.01,
    "geopolitical_shock": 0.03,
    "sector_mania_up": 0.02,
    "sector_mania_down": -0.03
  },
  "riskLevel": "low",
  "volatility": "very_low",
  "rebound": false,
  "floraInsight": "Your magnolia barely noticed the storm. Healthcare companies sell products people need whether the economy grows or shrinks. Never your fastest — but invaluable in a crisis."
}
```

------------------------------------------------------------------------

### ENERGY — Flame Tree 🔴

**Asset:** Energy equities (oil majors, energy producers, cyclical energy stocks) **Color:** Red

The flame tree is the most cyclical tree in the garden. Named for its fiery red canopy, it blazes during energy booms — oil crises, supply shocks, geopolitical tension — and goes dormant in downturns. It is macro-driven: global energy demand and geopolitics determine its fate more than anything the company does. Beautiful in the right conditions, dangerous to rely on.

**Visual states**

| State   | Appearance                                    |
|---------|-----------------------------------------------|
| Healthy | Blazing red-orange canopy, vivid and dominant |
| Growing | Canopy expanding, deeper red tones            |
| Damaged | Canopy thinning, orange fading to yellow      |
| Wilted  | Sparse yellow-brown leaves, bare sections     |

**When it appears** Level 5. Introduced during the Oil Crisis event to show sector-specific behaviour.

**How it reacts to events**

| Event                    | Reaction                                     |
|--------------------------|----------------------------------------------|
| Oil Crisis               | +++ Blazes — primary beneficiary             |
| Bull Market              | \+ Moderate positive                         |
| Inflation Shock          | \+ Modest positive (energy drives inflation) |
| Geopolitical Shock       | ++ Positive — conflict drives energy demand  |
| Recession / Unemployment | --- Sharp decline, demand collapse           |
| Fed Rate Hike            | \- Moderate negative                         |
| Market Crash             | -- Significant decline                       |

**Flora's insight** *"Your flame tree lit up during the oil shock — that's what it does. Energy stocks are tied to the price of oil and global demand. They shine in crises that hurt everything else. But when the economy slows and demand drops, that same fire burns out fast. Keep it in the garden for the insurance value — just don't let it dominate."*

``` json
{
  "id": "flame_tree",
  "name": "Flame Tree",
  "icon": "assets/plants/flame-tree.png",
  "category": "equity",
  "subCategory": "energy",
  "realWorldEquivalent": "Energy equities — oil majors, energy producers, cyclical energy stocks",
  "color": "#E8623C",
  "colorName": "Red",
  "keywords": ["cyclical", "explosive", "macro-driven", "unstable"],
  "unlocksAtLevel": 5,
  "visualStates": {
    "healthy": "blazing red-orange canopy, vivid and dominant",
    "growing": "canopy expanding, deeper red tones",
    "damaged": "canopy thinning, orange fading to yellow",
    "wilted": "sparse yellow-brown leaves, bare sections"
  },
  "baseEffects": {
    "oil_crisis": 0.22,
    "bull_market": 0.08,
    "inflation_shock": 0.06,
    "geopolitical_shock": 0.14,
    "calm_year": 0.02,
    "unemployment_spike": -0.14,
    "fed_rate_hike": -0.06,
    "market_crash": -0.16,
    "recession": -0.20
  },
  "riskLevel": "high",
  "volatility": "high",
  "rebound": false,
  "floraInsight": "Your flame tree lit up during the oil shock — that's what it does. It shines in crises that hurt everything else. Keep it for insurance value — just don't let it dominate."
}
```

------------------------------------------------------------------------

### FINANCE — Apple Tree 🍏

**Asset:** Financial equities (banks, insurance, asset managers) **Color:** Green

The apple tree is the steady productive member of the equity family. It bears fruit (dividends) regularly, grows at a moderate pace, and withstands most weather without drama. Financial stocks are yield-oriented — they pay consistent dividends and provide structural returns. Sensitive to interest rates (rate hikes can help banks, rate cuts hurt), but never the most volatile plant in the garden.

**Visual states**

| State   | Appearance                                                  |
|---------|-------------------------------------------------------------|
| Healthy | Full green canopy, visible red apples (dividend indicators) |
| Growing | New apples forming, branches filling                        |
| Damaged | Some apples drop, canopy slightly reduced                   |
| Wilted  | Few apples, yellowing leaves                                |

**When it appears** Level 2. One of the first equity types introduced — familiar and comprehensible.

**How it reacts to events**

| Event           | Reaction                           |
|-----------------|------------------------------------|
| Bull Market     | \+ Moderate positive               |
| Fed Rate Hike   | \+ Banks profit from higher rates  |
| Fed Rate Cut    | \- Lower net interest margin       |
| Market Crash    | -- Financials often lead downturns |
| Calm Year       | \+ Steady dividend fruit           |
| Earnings Beat   | \+ Moderate positive               |
| Inflation Shock | Neutral — mixed impact             |

**Flora's insight** *"Your apple tree kept producing fruit even during moderate stress. Financial stocks are workhorses — not exciting, but reliable. Notice how it actually did better when interest rates rose? Banks earn more on the spread between what they pay depositors and what they charge borrowers. Rate environment matters enormously for this plant."*

``` json
{
  "id": "apple_tree",
  "name": "Apple Tree",
  "icon": "assets/plants/apple-tree.png",
  "category": "equity",
  "subCategory": "finance",
  "realWorldEquivalent": "Financial equities — banks, insurance companies, asset managers",
  "color": "#4CAF50",
  "colorName": "Green",
  "keywords": ["yield", "structured", "productive", "steady"],
  "unlocksAtLevel": 2,
  "visualStates": {
    "healthy": "full green canopy, visible red apples as dividend indicators",
    "growing": "new apples forming, branches filling",
    "damaged": "some apples drop, canopy slightly reduced",
    "wilted": "few apples, yellowing leaves"
  },
  "baseEffects": {
    "bull_market": 0.07,
    "fed_rate_hike": 0.05,
    "fed_rate_cut": -0.04,
    "market_crash": -0.14,
    "calm_year": 0.04,
    "earnings_beat": 0.06,
    "inflation_shock": 0.01,
    "unemployment_spike": -0.08,
    "geopolitical_shock": -0.06
  },
  "riskLevel": "medium",
  "volatility": "medium",
  "dividendYield": true,
  "rebound": false,
  "floraInsight": "Your apple tree kept producing fruit even in moderate stress. Banks actually benefit from rate hikes — they earn more on the spread between deposits and loans. Rate environment is this plant's defining variable."
}
```

---
---

## CATEGORY 2 — BONDS (Bushes)

Bushes represent fixed income. They provide structure and stability to the garden. During storms, they are more resistant than trees. Their role is not to grow fast — it is to hold the garden together when conditions deteriorate.
---

### US TREASURY BONDS — Camellia Bush ⬜

**Asset:** US Government bonds (T-bills, T-notes, T-bonds) **Color:** White

The camellia is the safest plant in the garden. Government-backed, minimal risk of default, providing the foundation all other plants lean on during hard times. It grows slowly — you'll never be excited by its performance. But during every crash in history, investors have run toward it, pushing its price up. The ultimate safe haven.

**Visual states**

| State   | Appearance                                             |
|---------|--------------------------------------------------------|
| Healthy | Dense white blooms, perfectly structured, compact      |
| Growing | New white buds emerging slowly                         |
| Damaged | Barely changes — slight leaf drop only                 |
| Wilted  | Very minor reduction — the most crisis-resistant plant |

**When it appears** Level 1. The very first plant. Anchors the garden from day one.

**How it reacts to events**

| Event              | Reaction                                        |
|--------------------|-------------------------------------------------|
| Market Crash       | ++ Investors flee to safety — price rises       |
| Geopolitical Shock | ++ Safe haven demand                            |
| Unemployment Spike | \+ Flight to safety                             |
| Calm Year          | \+ Slow steady coupon                           |
| Fed Rate Hike      | -- Price falls (inverse bond-rate relationship) |
| Inflation Shock    | -- Real value eroded                            |
| Bull Market        | \- Underperforms as risk appetite grows         |

**Flora's insight** *"Your camellia barely moved. That is exactly what it is supposed to do. US government bonds are the world's benchmark safe asset. When fear grips markets, everyone buys them. The price goes up even as everything else falls. It will never excite you — and that is its value."*

``` json
{
  "id": "camellia",
  "name": "Camellia Bush",
  "icon": "assets/plants/camellia.png",
  "category": "bonds",
  "subCategory": "us_treasury",
  "realWorldEquivalent": "US Government Bonds — T-bills, T-notes, 10Y Treasury",
  "color": "#FFFFFF",
  "colorName": "White",
  "keywords": ["safe haven", "stable", "resilient", "low risk"],
  "unlocksAtLevel": 1,
  "visualStates": {
    "healthy": "dense white blooms, perfectly structured, compact",
    "growing": "new white buds emerging slowly",
    "damaged": "barely changes — slight leaf drop only",
    "wilted": "very minor reduction — most crisis-resistant plant"
  },
  "baseEffects": {
    "market_crash": 0.08,
    "geopolitical_shock": 0.06,
    "unemployment_spike": 0.05,
    "calm_year": 0.02,
    "fed_rate_hike": -0.09,
    "inflation_shock": -0.07,
    "bull_market": -0.02,
    "fed_rate_cut": 0.06,
    "sector_mania_down": 0.07
  },
  "riskLevel": "very_low",
  "volatility": "very_low",
  "couponYield": 0.04,
  "rebound": false,
  "floraInsight": "Your camellia barely moved — that is exactly its purpose. US government bonds are the world's benchmark safe asset. It will never excite you. And that is precisely its value."
}
```

------------------------------------------------------------------------

### CORPORATE BONDS — Hydrangea Bush 🔵

**Asset:** Investment-grade corporate bonds (BBB and above) **Color:** Blue

The hydrangea is the most environment-sensitive bush. Its colour literally shifts with conditions (in nature, pH of soil changes its hue — a perfect metaphor for how corporate bonds respond to the credit environment). It offers more yield than treasuries, with slightly more risk. In stable conditions it thrives. Under real stress, its performance depends on the issuing company's credit quality.

**Visual states**

| State   | Appearance                                       |
|---------|--------------------------------------------------|
| Healthy | Full blue flower clusters, lush and full         |
| Growing | New clusters forming, rich blue tones            |
| Damaged | Flowers fade to pale blue/purple, fewer clusters |
| Wilted  | Drooping clusters, grey-blue, sparse             |

**When it appears** Level 2. Introduced alongside the Apple Tree to show the bond-equity pairing.

**How it reacts to events**

| Event              | Reaction                                   |
|--------------------|--------------------------------------------|
| Calm Year          | \+ Good performance — credit spreads tight |
| Bull Market        | \+ Moderate — credit quality strong        |
| Market Crash       | -- Credit spreads widen                    |
| Unemployment Spike | \- Companies face revenue pressure         |
| Fed Rate Hike      | \- Price declines                          |
| Fed Rate Cut       | \+ Price rises                             |
| Inflation Shock    | \- Real yield eroded                       |

**Flora's insight** *"Your hydrangea did well in the calm — corporate bonds reward patient investors in stable conditions. Notice it's more sensitive than your camellia: it depends not just on rates, but on whether companies can repay their debts. That's what the 'credit spread' means — the extra yield you earn for that extra risk."*

``` json
{
  "id": "hydrangea",
  "name": "Hydrangea Bush",
  "icon": "assets/plants/hydrangea.png",
  "category": "bonds",
  "subCategory": "corporate_bonds",
  "realWorldEquivalent": "Investment-grade corporate bonds — BBB and above rated issuers",
  "color": "#6C9BD1",
  "colorName": "Blue",
  "keywords": ["balanced", "adaptive", "moderate risk", "environment-dependent"],
  "unlocksAtLevel": 2,
  "visualStates": {
    "healthy": "full blue flower clusters, lush and full",
    "growing": "new clusters forming, rich blue tones",
    "damaged": "flowers fade to pale blue/purple, fewer clusters",
    "wilted": "drooping clusters, grey-blue, sparse"
  },
  "baseEffects": {
    "calm_year": 0.05,
    "bull_market": 0.04,
    "market_crash": -0.10,
    "unemployment_spike": -0.06,
    "fed_rate_hike": -0.08,
    "fed_rate_cut": 0.07,
    "inflation_shock": -0.06,
    "geopolitical_shock": -0.04
  },
  "riskLevel": "low_medium",
  "volatility": "low",
  "couponYield": 0.055,
  "creditRating": "investment_grade",
  "rebound": false,
  "floraInsight": "Corporate bonds reward patient investors in stable conditions. More sensitive than your camellia — they depend on whether companies can repay debts. That gap in yield is called the credit spread."
}
```

------------------------------------------------------------------------

### HIGH-YIELD BONDS — Hibiscus Bush 🔴

**Asset:** High-yield / junk bonds (BB and below) **Color:** Red

The hibiscus is the most dangerous bush. Its large red flowers are visually striking — it produces the most visible growth (high coupon payments) in good conditions. But it is fragile. Unlike the junk weed bad plant (which is purely speculative), the hibiscus represents legitimate high-yield bonds — they exist in real portfolios — but they carry real default risk that most beginners ignore. Introduced alongside the Junk Weed bad plant to show the contrast.

**Visual states**

| State   | Appearance                              |
|---------|-----------------------------------------|
| Healthy | Large vivid red flowers, abundant bloom |
| Growing | New flowers opening rapidly             |
| Damaged | Flowers drop, stems weaken              |
| Wilted  | Bare stems, very few flowers, faded red |

**When it appears** Level 6. Introduced at the same level as the Junk Weed bad plant — players must learn to distinguish "risky but legitimate" from "purely speculative."

**How it reacts to events**

| Event              | Reaction                               |
|--------------------|----------------------------------------|
| Bull Market / Calm | \+ High coupon, credit performing      |
| Earnings Beat      | \+ Strong                              |
| Recession          | --- Near-collapse. Default risk spikes |
| Market Crash       | -- Severe                              |
| Fed Rate Cut       | \+ Strong recovery signal              |
| Unemployment Spike | -- Companies struggle to service debt  |
| Geopolitical Shock | -- Risk-off environment                |

**Flora's insight** *"Your hibiscus paid well — but notice how much it dropped in the downturn. This is the high-yield dilemma: the extra coupon is real, but so is the default risk. In a recession, high-yield bonds behave more like equities than bonds. Your camellia held steady. Your hibiscus stumbled. That gap is why diversification across bond types matters."*

``` json
{
  "id": "hibiscus",
  "name": "Hibiscus Bush",
  "icon": "assets/plants/hibiscus.png",
  "category": "bonds",
  "subCategory": "high_yield",
  "realWorldEquivalent": "High-yield bonds — BB and below rated corporate debt",
  "color": "#E8302A",
  "colorName": "Red",
  "keywords": ["high return", "risky", "fragile", "volatile"],
  "unlocksAtLevel": 6,
  "visualStates": {
    "healthy": "large vivid red flowers, abundant bloom",
    "growing": "new flowers opening rapidly",
    "damaged": "flowers drop, stems weaken",
    "wilted": "bare stems, very few flowers, faded red"
  },
  "baseEffects": {
    "bull_market": 0.08,
    "calm_year": 0.07,
    "earnings_beat": 0.07,
    "fed_rate_cut": 0.10,
    "recession": -0.22,
    "market_crash": -0.18,
    "unemployment_spike": -0.14,
    "geopolitical_shock": -0.10,
    "fed_rate_hike": -0.09
  },
  "riskLevel": "high",
  "volatility": "high",
  "couponYield": 0.08,
  "creditRating": "high_yield",
  "rebound": false,
  "comparisonPlant": "camellia",
  "floraInsight": "The extra coupon is real — but so is the default risk. In a recession, high-yield bonds behave more like equities. Your camellia held steady. Your hibiscus stumbled. That gap is why bond diversification matters."
}
```

------------------------------------------------------------------------

### EMERGING MARKET BONDS — Bougainvillea Bush 🟣

**Asset:** Emerging market sovereign and corporate bonds **Color:** Purple

The bougainvillea is the most dramatic bush — it grows in explosions of colour in the right conditions and collapses under adverse ones. Emerging market bonds offer high yields because they come with political risk, currency risk, and weaker institutional frameworks. They bloom spectacularly in global growth phases when capital flows to developing economies, and get hit hardest when global risk appetite collapses.

**Visual states**

| State   | Appearance                                    |
|---------|-----------------------------------------------|
| Healthy | Cascading purple blooms, vivid and spreading  |
| Growing | New bursts of colour expanding outward        |
| Damaged | Colour fading, blooms contracting sharply     |
| Wilted  | Mostly green thorny stems, purple nearly gone |

**When it appears** Level 7. Late introduction — high complexity asset for experienced players.

**How it reacts to events**

| Event | Reaction |
|------------------------------------|------------------------------------|
| Bull Market | ++ Capital flows to EM in risk-on |
| Calm Year | \+ Good carry trade environment |
| Fed Rate Hike | --- USD strengthens, EM debt becomes expensive to service |
| Market Crash | --- Capital flight from EM |
| Geopolitical Shock | -- Specific country exposure amplified |
| Tariff Crisis | -- Trade flows disrupted |
| Inflation Shock | \- Higher global rates = EM pressure |

**Flora's insight** *"Your bougainvillea blazed in the calm — and collapsed in the storm. Emerging market bonds offer some of the highest yields in the fixed income world, but they carry currency risk, political risk, and the constant threat of capital flight. When global investors get scared, they pull money out of emerging markets first. The bougainvillea blooms hardest precisely where the ground is least stable."*

``` json
{
  "id": "bougainvillea",
  "name": "Bougainvillea Bush",
  "icon": "assets/plants/bougainvillea.png",
  "category": "bonds",
  "subCategory": "emerging_market_bonds",
  "realWorldEquivalent": "Emerging market bonds — EM sovereign and corporate debt",
  "color": "#9B59B6",
  "colorName": "Purple",
  "keywords": ["high potential", "volatile", "climate-sensitive", "growth"],
  "unlocksAtLevel": 7,
  "visualStates": {
    "healthy": "cascading purple blooms, vivid and spreading",
    "growing": "new bursts of colour expanding outward",
    "damaged": "colour fading, blooms contracting sharply",
    "wilted": "mostly green thorny stems, purple nearly gone"
  },
  "baseEffects": {
    "bull_market": 0.12,
    "calm_year": 0.08,
    "fed_rate_hike": -0.18,
    "market_crash": -0.20,
    "geopolitical_shock": -0.12,
    "tariff_crisis": -0.10,
    "inflation_shock": -0.08,
    "fed_rate_cut": 0.14,
    "unemployment_spike": -0.10
  },
  "riskLevel": "high",
  "volatility": "very_high",
  "couponYield": 0.09,
  "currencyRisk": true,
  "rebound": false,
  "floraInsight": "Emerging market bonds offer the highest yields in fixed income — but currency risk, political risk, and capital flight make them the first to sell off when fear strikes. They bloom hardest where the ground is least stable."
}
```

---
---

## CATEGORY 3 — CASH (Grass)

Grass represents cash and currency holdings. It is always present, always growing slowly, never exciting. It covers the ground — providing stability and preventing the garden from becoming all-or-nothing. During storms it holds its form. During droughts (inflation) it fades silently.
---

### USD — Meadow Grass (Cosmos Mix) 🌸 light

**Asset:** US Dollar cash / USD money market **Color:** Light Pink

The meadow grass spreads everywhere. The dollar is the world's reserve currency — the baseline against which all other assets are measured. It offers liquidity, global acceptance, and relative stability. It never grows dramatically, but it also never collapses. In a crisis, holding dollars is a legitimate strategy.

**Visual states**

| State   | Appearance                                       |
|---------|--------------------------------------------------|
| Healthy | Wide spreading meadow, light pink cosmos flowers |
| Growing | Expanding outward, more flowers appearing        |
| Damaged | Flowers fade slightly, grass thins marginally    |
| Wilted  | Grass persists — only colour fades               |

**When it appears** Level 1. Present from the start — the foundation of every garden.

**How it reacts to events**

| Event              | Reaction                                   |
|--------------------|--------------------------------------------|
| Fed Rate Hike      | \+ USD strengthens                         |
| Geopolitical Shock | \+ Safe haven demand                       |
| Market Crash       | \+ Flight to dollars                       |
| Bull Market        | \- Opportunity cost vs equities            |
| Inflation Shock    | -- Real value eroded by domestic inflation |
| Tariff Crisis      | \+ Slight positive                         |

``` json
{
  "id": "meadow_grass_usd",
  "name": "Meadow Grass (Cosmos Mix)",
  "icon": "assets/plants/meadow-grass.png",
  "category": "cash",
  "subCategory": "usd",
  "realWorldEquivalent": "USD cash, US money market funds",
  "color": "#FFD1DC",
  "colorName": "Light Pink",
  "keywords": ["global dominance", "liquidity", "widespread", "adaptable"],
  "unlocksAtLevel": 1,
  "visualStates": {
    "healthy": "wide spreading meadow, light pink cosmos flowers",
    "growing": "expanding outward, more flowers appearing",
    "damaged": "flowers fade slightly, grass thins marginally",
    "wilted": "grass persists — only colour fades"
  },
  "baseEffects": {
    "fed_rate_hike": 0.04,
    "geopolitical_shock": 0.03,
    "market_crash": 0.03,
    "bull_market": -0.01,
    "inflation_shock": -0.05,
    "tariff_crisis": 0.02,
    "calm_year": 0.01
  },
  "riskLevel": "very_low",
  "volatility": "very_low",
  "inflationRisk": true,
  "floraInsight": "The dollar is the world's reserve currency. Holding it gives you liquidity and safety — but inflation silently eats its real value. Cash is a position, not a default."
}
```

------------------------------------------------------------------------

### CHF — Edelweiss Grass ⬜

**Asset:** Swiss Franc cash / CHF money market **Color:** White

The edelweiss is rare, mountain-tough, and famous for thriving in conditions that kill everything else. The Swiss Franc is the world's most reliable safe-haven currency — it strengthens in every crisis, often dramatically. The SNB (Swiss National Bank) actively manages it, but the market's demand for CHF in times of fear always pushes it up. It grows almost imperceptibly in good times and becomes a fortress in bad ones.

**Visual states**

| State   | Appearance                                        |
|---------|---------------------------------------------------|
| Healthy | Small white star-shaped flowers, dense and alpine |
| Growing | Expanding slowly, more stars appearing            |
| Damaged | Remains nearly unchanged                          |
| Wilted  | Barely visible change — the most resilient grass  |

**When it appears** Level 3. Introduced as the first currency alternative to USD.

**How it reacts to events**

| Event              | Reaction                            |
|--------------------|-------------------------------------|
| Market Crash       | +++ CHF surges as global safe haven |
| Geopolitical Shock | ++ Strong safe haven demand         |
| Fed Rate Hike      | \+ USD competes — CHF holds         |
| Bull Market        | \- Opportunity cost                 |
| Inflation (global) | \+ CHF holds real value better      |
| Calm Year          | Minimal growth                      |

``` json
{
  "id": "edelweiss",
  "name": "Edelweiss Grass",
  "icon": "assets/plants/edelweiss.png",
  "category": "cash",
  "subCategory": "chf",
  "realWorldEquivalent": "Swiss Franc — CHF cash, Swiss money market",
  "color": "#F2F2F0",
  "colorName": "White",
  "keywords": ["safe haven", "resilient", "rare", "protective"],
  "unlocksAtLevel": 3,
  "visualStates": {
    "healthy": "small white star-shaped flowers, dense and alpine",
    "growing": "expanding slowly, more stars appearing",
    "damaged": "remains nearly unchanged",
    "wilted": "barely visible change — most resilient grass"
  },
  "baseEffects": {
    "market_crash": 0.06,
    "geopolitical_shock": 0.05,
    "fed_rate_hike": 0.02,
    "bull_market": -0.01,
    "inflation_shock": 0.03,
    "calm_year": 0.01,
    "tariff_crisis": 0.02,
    "unemployment_spike": 0.02
  },
  "riskLevel": "very_low",
  "volatility": "very_low",
  "safeHaven": true,
  "floraInsight": "The Swiss Franc strengthens in every crisis — almost without exception. Rare in good times, invaluable in bad ones. For a Swiss-made game, this is your home ground advantage."
}
```

------------------------------------------------------------------------

### EUR — Clover Grass 🍀

**Asset:** Euro cash / EUR money market **Color:** Green

The clover represents the collective strength and moderate stability of the Eurozone. It is well-balanced across conditions — not the strongest safe haven (that's CHF), not the most liquid (that's USD), but a stable and diversified currency covering the world's largest single market. Occasionally fragile at its edges (peripheral European debt risk), but structurally sound at its core.

**Visual states**

| State   | Appearance                                              |
|---------|---------------------------------------------------------|
| Healthy | Dense green clover coverage, occasional four-leaf found |
| Growing | Spreading steadily                                      |
| Damaged | Some patches thin — slightly uneven coverage            |
| Wilted  | Thin coverage — core patches remain                     |

**When it appears** Level 2.

**How it reacts to events**

| Event              | Reaction                           |
|--------------------|------------------------------------|
| Calm Year          | \+ Steady moderate growth          |
| Bull Market        | \+ Moderate                        |
| Fed Rate Hike      | \- USD relative strength hurts EUR |
| Geopolitical Shock | \- European proximity risk         |
| Market Crash       | Neutral to slight negative         |
| Tariff Crisis      | \- EU heavily export-dependent     |

``` json
{
  "id": "clover_eur",
  "name": "Clover Grass",
  "icon": "assets/plants/clover.png",
  "category": "cash",
  "subCategory": "eur",
  "realWorldEquivalent": "Euro — EUR cash, ECB rate environment",
  "color": "#4A9E5C",
  "colorName": "Green",
  "keywords": ["balanced", "collective", "stable", "moderate"],
  "unlocksAtLevel": 2,
  "visualStates": {
    "healthy": "dense green clover coverage, occasional four-leaf found",
    "growing": "spreading steadily",
    "damaged": "some patches thin — slightly uneven coverage",
    "wilted": "thin coverage — core patches remain"
  },
  "baseEffects": {
    "calm_year": 0.02,
    "bull_market": 0.02,
    "fed_rate_hike": -0.03,
    "geopolitical_shock": -0.03,
    "market_crash": -0.01,
    "tariff_crisis": -0.04,
    "inflation_shock": -0.03,
    "fed_rate_cut": 0.02
  },
  "riskLevel": "very_low",
  "volatility": "low",
  "floraInsight": "The euro covers the world's largest single market. Stable, balanced — not the strongest safe haven, but a reliable anchor. Sensitive to anything that threatens European trade."
}
```

------------------------------------------------------------------------

### JPY — Silver Grass (Miscanthus) 🪶

**Asset:** Japanese Yen cash / JPY money market **Color:** Beige

Silver grass bends and flows with the wind — flexible, reactive, but always returning to form. The Japanese Yen is the world's most reactive safe-haven currency. In risk-off periods, the famous "yen carry trade" unwinds and JPY surges. In risk-on periods, it weakens as investors borrow cheap yen to invest in higher-yielding assets. It is a currency that moves with the tide of global risk appetite more than almost any other.

**Visual states**

| State   | Appearance                                           |
|---------|------------------------------------------------------|
| Healthy | Tall silver-beige grass, moving gracefully in breeze |
| Growing | Plumes extending upward                              |
| Damaged | Stems bend lower, plumes lose structure              |
| Wilted  | Flat and sparse — flows back quickly                 |

**When it appears** Level 5. Introduced to teach carry trade dynamics.

**How it reacts to events**

| Event              | Reaction                            |
|--------------------|-------------------------------------|
| Market Crash       | +++ Carry trade unwind — JPY surges |
| Geopolitical Shock | ++ Safe haven demand                |
| Bull Market        | \- Carry trade active — JPY weakens |
| Fed Rate Hike      | \- USD-JPY differential widens      |
| Calm Year          | Neutral / slight negative           |
| High Volatility    | ++ Reactivity is its strength       |

``` json
{
  "id": "silver_grass_jpy",
  "name": "Silver Grass (Miscanthus)",
  "icon": "assets/plants/silver-grass.png",
  "category": "cash",
  "subCategory": "jpy",
  "realWorldEquivalent": "Japanese Yen — JPY cash, carry trade dynamics",
  "color": "#C8B89A",
  "colorName": "Beige",
  "keywords": ["reactive", "flexible", "flow-driven", "safe haven"],
  "unlocksAtLevel": 5,
  "visualStates": {
    "healthy": "tall silver-beige grass, moving gracefully in breeze",
    "growing": "plumes extending upward",
    "damaged": "stems bend lower, plumes lose structure",
    "wilted": "flat and sparse — recovers quickly"
  },
  "baseEffects": {
    "market_crash": 0.08,
    "geopolitical_shock": 0.05,
    "high_volatility": 0.06,
    "bull_market": -0.03,
    "fed_rate_hike": -0.04,
    "calm_year": -0.01,
    "tariff_crisis": 0.02
  },
  "riskLevel": "low",
  "volatility": "medium",
  "carryTradeRisk": true,
  "floraInsight": "The yen is the world's most reactive safe haven. In a crash, investors unwind their carry trades and JPY surges. In calm markets, they borrow cheap yen to chase yield — and it weakens. It moves with global fear more than any other grass."
}
```

---
---

## CATEGORY 4 — COMMODITIES (Cacti)

Cacti represent real assets and commodities. They thrive in conditions that hurt other plants — inflation, supply shocks, geopolitical stress. They grow slowly and rarely spectacularly, but they are nearly indestructible. Their role in the garden is defensive insurance, not growth.
---

### GOLD — Golden Barrel Cactus 🌕

**Asset:** Gold (spot, ETFs, gold miners) **Color:** Yellow

The golden barrel cactus is the oldest store of value in the world — squat, solid, and immovable. Gold has been used as money for 5,000 years. In the game it is the definitive crisis hedge: it barely moves in good times and surges when everything else falls. It earns no income (no dividend, no coupon), but its price rises when real interest rates are negative and when fear is high.

**Visual states**

| State   | Appearance                                   |
|---------|----------------------------------------------|
| Healthy | Round golden-yellow barrel, golden spines    |
| Growing | Barrel expanding, small yellow flower on top |
| Damaged | Very minor — slight colour fade              |
| Wilted  | Almost unchanged — the most durable plant    |

**When it appears** Level 1. Present from the start as the original safe haven.

**How it reacts to events**

| Event              | Reaction                                  |
|--------------------|-------------------------------------------|
| Market Crash       | +++ Classic safe haven                    |
| Geopolitical Shock | +++ Conflict drives gold demand           |
| Inflation Shock    | ++ Real asset, store of value             |
| High Volatility    | ++ Fear = gold                            |
| Bull Market        | \- Opportunity cost                       |
| Fed Rate Hike      | \- Real rates rise = gold less attractive |
| Calm Year          | Minimal movement                          |

``` json
{
  "id": "golden_barrel",
  "name": "Golden Barrel Cactus",
  "icon": "assets/plants/golden-barrel.png",
  "category": "commodities",
  "subCategory": "gold",
  "realWorldEquivalent": "Gold — spot price, gold ETFs, gold miners",
  "color": "#FFD100",
  "colorName": "Yellow",
  "keywords": ["store of value", "safe haven", "durable", "scarce"],
  "unlocksAtLevel": 1,
  "visualStates": {
    "healthy": "round golden-yellow barrel, golden spines, small flower on top",
    "growing": "barrel expanding, flower blooming",
    "damaged": "very minor colour fade",
    "wilted": "almost unchanged — most durable plant"
  },
  "baseEffects": {
    "market_crash": 0.12,
    "geopolitical_shock": 0.14,
    "inflation_shock": 0.10,
    "high_volatility": 0.09,
    "bull_market": -0.02,
    "fed_rate_hike": -0.06,
    "calm_year": 0.01,
    "oil_crisis": 0.08
  },
  "riskLevel": "low",
  "volatility": "low",
  "incomeYield": false,
  "safeHaven": true,
  "floraInsight": "Gold earns nothing — no dividend, no coupon. Its only job is to hold value when everything else fails. It has done this for 5,000 years. A small allocation is the oldest form of portfolio insurance."
}
```

------------------------------------------------------------------------

### OIL — Night-Blooming Cactus ⬜

**Asset:** Oil (crude, energy futures, oil ETFs) **Color:** White

The night-blooming cactus flowers rarely, briefly, and unpredictably — exactly like oil price spikes. Most of the time it sits dormant. Then one geopolitical event or OPEC decision causes a dramatic overnight bloom. Its cycles are driven entirely by supply-demand dynamics outside any individual investor's control.

**Visual states**

| State   | Appearance                                            |
|---------|-------------------------------------------------------|
| Healthy | Green cactus with occasional large white night flower |
| Growing | Flower emerging — rare and striking                   |
| Damaged | Flower drops, cactus returns to dormant state         |
| Wilted  | Lean green cactus, no flower — neutral                |

**When it appears** Level 5. Introduced during the Oil Crisis event.

**How it reacts to events**

| Event              | Reaction                      |
|--------------------|-------------------------------|
| Oil Crisis         | ++++ Dramatic overnight bloom |
| Geopolitical Shock | ++ Supply disruption premium  |
| Inflation Shock    | ++ Oil drives inflation       |
| Recession          | --- Demand collapse           |
| Bull Market        | \+ Moderate demand growth     |
| Fed Rate Hike      | \- Demand concern             |

``` json
{
  "id": "night_blooming_cactus",
  "name": "Night-Blooming Cactus",
  "icon": "assets/plants/night-blooming-cactus.png",
  "category": "commodities",
  "subCategory": "oil",
  "realWorldEquivalent": "Crude oil — WTI, Brent, energy futures, oil ETFs",
  "color": "#F5F5F0",
  "colorName": "White",
  "keywords": ["volatile", "cyclical", "unpredictable", "spike-driven"],
  "unlocksAtLevel": 5,
  "visualStates": {
    "healthy": "green cactus with occasional large white night flower",
    "growing": "flower emerging — rare and striking",
    "damaged": "flower drops, returns to dormant state",
    "wilted": "lean green cactus, no flower"
  },
  "baseEffects": {
    "oil_crisis": 0.30,
    "geopolitical_shock": 0.14,
    "inflation_shock": 0.10,
    "recession": -0.22,
    "bull_market": 0.06,
    "fed_rate_hike": -0.05,
    "market_crash": -0.10,
    "calm_year": 0.01
  },
  "riskLevel": "high",
  "volatility": "very_high",
  "floraInsight": "Oil blooms dramatically when supply is shocked — and collapses when demand disappears. It is the most event-driven commodity. Own it for the spike protection, but never let it dominate."
}
```

------------------------------------------------------------------------

### WHEAT — Prickly Pear Cactus 🟠

**Asset:** Agricultural commodities (wheat, food staples) **Color:** Orange

The prickly pear is the most practical cactus — it produces food reliably across a wide range of conditions. Agricultural commodities are essential goods. Demand is inelastic — people eat regardless of the economy. This makes wheat and food staples the most consistently performing commodity. Less exciting than oil, more defensive than copper, it belongs in a balanced commodity allocation.

**Visual states**

| State   | Appearance                                     |
|---------|------------------------------------------------|
| Healthy | Flat green pads with orange/red fruit clusters |
| Growing | New pads extending, fruit forming              |
| Damaged | Fruit drops, pads thin                         |
| Wilted  | Fewer pads, minimal fruit                      |

**When it appears** Level 6.

**How it reacts to events**

| Event              | Reaction                           |
|--------------------|------------------------------------|
| Inflation Shock    | ++ Food prices rise with inflation |
| Geopolitical Shock | ++ Supply route disruption premium |
| Calm Year          | \+ Moderate steady growth          |
| Bull Market        | \+ Modest positive                 |
| Recession          | Neutral — food demand inelastic    |
| Market Crash       | Near-neutral — essential goods     |

``` json
{
  "id": "prickly_pear",
  "name": "Prickly Pear Cactus",
  "icon": "assets/plants/prickly-pear.png",
  "category": "commodities",
  "subCategory": "wheat",
  "realWorldEquivalent": "Agricultural commodities — wheat, corn, food staples",
  "color": "#E8823C",
  "colorName": "Orange",
  "keywords": ["essential", "consumption", "resilient", "basic need"],
  "unlocksAtLevel": 6,
  "visualStates": {
    "healthy": "flat green pads with orange/red fruit clusters",
    "growing": "new pads extending, fruit forming",
    "damaged": "fruit drops, pads thin",
    "wilted": "fewer pads, minimal fruit"
  },
  "baseEffects": {
    "inflation_shock": 0.10,
    "geopolitical_shock": 0.07,
    "calm_year": 0.03,
    "bull_market": 0.03,
    "recession": 0.01,
    "market_crash": 0.01,
    "oil_crisis": 0.05,
    "tariff_crisis": -0.04
  },
  "riskLevel": "low_medium",
  "volatility": "low",
  "essentialGood": true,
  "floraInsight": "People eat in recessions. Agricultural commodities are among the most defensive real assets — their demand barely moves with the economic cycle. Reliable, unexciting, and quietly valuable."
}
```

------------------------------------------------------------------------

### COPPER — Cholla Cactus 🟤

**Asset:** Industrial metals (copper, industrial commodities) **Color:** Brown

The cholla cactus is the most industrial-looking plant — angular, structural, spreading like supply chains across a landscape. Copper is called "Dr. Copper" by economists because its price predicts economic health. It is used in everything: construction, electronics, electric vehicles. When the global economy expands, copper demand surges. When it contracts, copper is the first to signal the slowdown.

**Visual states**

| State   | Appearance                                        |
|---------|---------------------------------------------------|
| Healthy | Dense brown-orange cholla network, spreading wide |
| Growing | New angular branches extending outward            |
| Damaged | Branch network contracting, browning              |
| Wilted  | Sparse structure, few joints remaining            |

**When it appears** Level 7. Introduced as a leading economic indicator plant.

**How it reacts to events**

| Event              | Reaction                                 |
|--------------------|------------------------------------------|
| Bull Market        | +++ Dr Copper signals expansion          |
| Earnings Beat      | ++ Economic strength                     |
| Calm Year          | \+ Steady industrial demand              |
| Recession          | --- First commodity to signal slowdown   |
| Market Crash       | -- Sharp demand collapse                 |
| Geopolitical Shock | Mixed — supply disruption vs demand fear |
| Tariff Crisis      | --- Supply chains disrupted              |

``` json
{
  "id": "cholla",
  "name": "Cholla Cactus",
  "icon": "assets/plants/cholla.png",
  "category": "commodities",
  "subCategory": "copper",
  "realWorldEquivalent": "Industrial metals — copper, aluminium, industrial commodities",
  "color": "#8B6914",
  "colorName": "Brown",
  "keywords": ["industrial", "cyclical", "structural", "growth-linked"],
  "unlocksAtLevel": 7,
  "visualStates": {
    "healthy": "dense brown-orange cholla network, spreading wide",
    "growing": "new angular branches extending outward",
    "damaged": "branch network contracting, browning",
    "wilted": "sparse structure, few joints remaining"
  },
  "baseEffects": {
    "bull_market": 0.14,
    "earnings_beat": 0.10,
    "calm_year": 0.05,
    "recession": -0.20,
    "market_crash": -0.14,
    "geopolitical_shock": -0.04,
    "tariff_crisis": -0.12,
    "fed_rate_cut": 0.10,
    "unemployment_spike": -0.10
  },
  "riskLevel": "medium_high",
  "volatility": "high",
  "economicIndicator": true,
  "floraInsight": "Copper is called Dr Copper for a reason — its price predicts economic health. It surges in expansions and collapses first in recessions. Watch this plant: it will often tell you what is coming before it arrives."
}
```

---
---

## CATEGORY 5 — CRYPTO (Orchids)

Orchids represent cryptocurrency. They are the most exotic, fragile, and unpredictable plants in the garden. They require specific conditions to thrive, can bloom spectacularly, and can collapse completely. Each orchid has a distinct character mapped to the specific cryptocurrency it represents.
---

### BITCOIN — White Phalaenopsis Orchid ⬜

**Asset:** Bitcoin (BTC) **Color:** White

The white phalaenopsis is the dominant orchid — the one that stabilises the rest. Bitcoin is the reference cryptocurrency: the oldest, most liquid, most institutionally held. It is still highly volatile compared to any traditional asset, but within the crypto category it is the most resilient and the most likely to recover. When the broader crypto market crashes, Bitcoin falls the least. When it recovers, it leads.

**Visual states**

| State   | Appearance                                            |
|---------|-------------------------------------------------------|
| Healthy | Pure white five-petal flowers, structured and elegant |
| Growing | New flower spikes extending                           |
| Damaged | Flowers pale, some petals drop                        |
| Wilted  | Bare spike — but roots intact                         |

**When it appears** Level 6. First crypto introduced.

**How it reacts to events**

| Event               | Reaction                               |
|---------------------|----------------------------------------|
| Bull Market         | ++ Moderate — less volatile than alts  |
| Sector Mania (up)   | +++                                    |
| Sector Mania (down) | -- Less severe than altcoins           |
| Market Crash        | -- Significant but leads recovery      |
| Geopolitical Shock  | Mixed — sometimes safe haven narrative |
| Fed Rate Cut        | \+ Liquidity drives risk assets        |
| Tariff Crisis       | \+ Non-sovereign asset benefit         |

``` json
{
  "id": "white_phalaenopsis",
  "name": "White Phalaenopsis Orchid",
  "icon": "assets/plants/white-phalaenopsis.png",
  "category": "crypto",
  "subCategory": "bitcoin",
  "realWorldEquivalent": "Bitcoin (BTC)",
  "color": "#F8F8F8",
  "colorName": "White",
  "keywords": ["dominant", "reference", "store of value", "relative stability"],
  "unlocksAtLevel": 6,
  "visualStates": {
    "healthy": "pure white five-petal flowers, structured and elegant",
    "growing": "new flower spikes extending",
    "damaged": "flowers pale, some petals drop",
    "wilted": "bare spike — roots intact"
  },
  "baseEffects": {
    "bull_market": 0.16,
    "sector_mania_up": 0.55,
    "sector_mania_down": -0.35,
    "market_crash": -0.22,
    "geopolitical_shock": 0.04,
    "fed_rate_cut": 0.12,
    "fed_rate_hike": -0.14,
    "tariff_crisis": 0.06,
    "calm_year": 0.05
  },
  "riskLevel": "high",
  "volatility": "very_high",
  "cryptoCategory": "store_of_value",
  "rebound": true,
  "floraInsight": "Bitcoin is the anchor of the crypto garden. It falls hard but leads the recovery. Within an already-risky category, it is the most resilient. Own it if you want crypto exposure — but keep it small."
}
```

------------------------------------------------------------------------

### ETHEREUM — Purple Dendrobium Orchid 🟣

**Asset:** Ethereum (ETH) **Color:** Purple

The purple dendrobium is multi-stemmed and ecosystem-driven — it grows through its connections to other plants, just as Ethereum's value comes from the applications built on its network. It is more volatile than Bitcoin but less than Solana. Its performance is tied to activity on its blockchain — DeFi, NFTs, staking yields — making it an innovation-driven asset.

**Visual states**

| State   | Appearance                                         |
|---------|----------------------------------------------------|
| Healthy | Multiple purple flower clusters on branching stems |
| Growing | New stems branching outward, more clusters forming |
| Damaged | Some stems wilt, clusters reduce                   |
| Wilted  | Main stem survives, branches bare                  |

**When it appears** Level 8. Introduced after Bitcoin.

**How it reacts to events**

| Event               | Reaction                           |
|---------------------|------------------------------------|
| Bull Market         | +++ More growth-sensitive than BTC |
| Sector Mania (up)   | ++++                               |
| Sector Mania (down) | ---                                |
| Market Crash        | ---                                |
| Fed Rate Hike       | -- Risk asset selloff              |
| Fed Rate Cut        | +++                                |

``` json
{
  "id": "purple_dendrobium",
  "name": "Purple Dendrobium Orchid",
  "icon": "assets/plants/purple-dendrobium.png",
  "category": "crypto",
  "subCategory": "ethereum",
  "realWorldEquivalent": "Ethereum (ETH)",
  "color": "#8E44AD",
  "colorName": "Purple",
  "keywords": ["innovation", "ecosystem", "technology", "evolving"],
  "unlocksAtLevel": 8,
  "visualStates": {
    "healthy": "multiple purple flower clusters on branching stems",
    "growing": "new stems branching outward, more clusters forming",
    "damaged": "some stems wilt, clusters reduce",
    "wilted": "main stem survives, branches bare"
  },
  "baseEffects": {
    "bull_market": 0.22,
    "sector_mania_up": 0.70,
    "sector_mania_down": -0.50,
    "market_crash": -0.30,
    "fed_rate_hike": -0.18,
    "fed_rate_cut": 0.20,
    "calm_year": 0.06,
    "tariff_crisis": 0.04
  },
  "riskLevel": "very_high",
  "volatility": "very_high",
  "cryptoCategory": "utility_platform",
  "rebound": true,
  "floraInsight": "Ethereum's value comes from its network — the applications, the activity, the ecosystem built on top of it. More volatile than Bitcoin, but driven by genuine innovation. Rewarding in bull runs, punishing in drawdowns."
}
```

------------------------------------------------------------------------

### SOLANA — Blue Exotic Orchid 🔵

**Asset:** Solana (SOL) **Color:** Blue

The blue exotic orchid is the most spectacular and most fragile plant in the entire garden. Solana is the highest-risk, highest-reward crypto in the portfolio. Its performance in favourable conditions is staggering — and its crashes are total. It represents the speculative edge of the crypto market: faster, newer, less proven.

**Visual states**

| State   | Appearance                                  |
|---------|---------------------------------------------|
| Healthy | Vivid blue exotic bloom, striking and showy |
| Growing | Rapid new flowers emerging                  |
| Damaged | Colour bleaches rapidly, petals drop        |
| Wilted  | Near-bare stem — most extreme wilting       |

**When it appears** Level 9. Last plant unlocked — maximum volatility.

**How it reacts to events**

| Event               | Reaction           |
|---------------------|--------------------|
| Bull Market         | ++++ Explosive     |
| Sector Mania (up)   | +++++              |
| Sector Mania (down) | ----- Near wipeout |
| Market Crash        | ----               |
| Any negative event  | Severe reaction    |

``` json
{
  "id": "blue_exotic_orchid",
  "name": "Blue Exotic Orchid",
  "icon": "assets/plants/blue-exotic-orchid.png",
  "category": "crypto",
  "subCategory": "solana",
  "realWorldEquivalent": "Solana (SOL) — high-speed blockchain, speculative crypto",
  "color": "#2E86C1",
  "colorName": "Blue",
  "keywords": ["speculative", "high growth", "volatile", "emerging"],
  "unlocksAtLevel": 9,
  "visualStates": {
    "healthy": "vivid blue exotic bloom, striking and showy",
    "growing": "rapid new flowers emerging",
    "damaged": "colour bleaches rapidly, petals drop",
    "wilted": "near-bare stem — most extreme wilting"
  },
  "baseEffects": {
    "bull_market": 0.35,
    "sector_mania_up": 1.20,
    "sector_mania_down": -0.80,
    "market_crash": -0.45,
    "fed_rate_hike": -0.25,
    "fed_rate_cut": 0.30,
    "geopolitical_shock": -0.20,
    "calm_year": 0.08
  },
  "riskLevel": "extreme",
  "volatility": "extreme",
  "cryptoCategory": "speculative",
  "rebound": true,
  "floraInsight": "The most spectacular and most fragile plant in your garden. Solana thrives when everything is growing — and collapses hardest when fear arrives. Only plant it if you are prepared to watch it nearly disappear."
}
```

------------------------------------------------------------------------

### STABLECOIN — Green Cymbidium Orchid 🟢

**Asset:** Stablecoins (USDC, USDT) **Color:** Green

The green cymbidium is the odd one in the orchid family — it does not bloom dramatically, does not lose petals, and does not move. Its entire purpose is to absorb volatility from the other orchids. A stablecoin is pegged to USD — it is worth exactly \$1, always. It earns yield through DeFi protocols. In the game it acts as a stabiliser: holding it reduces the overall crypto allocation's volatility without reducing exposure to the ecosystem.

**Visual states**

| State   | Appearance                                   |
|---------|----------------------------------------------|
| Healthy | Clean green waxy blooms, steady and constant |
| Growing | No visual change — perfectly stable          |
| Damaged | No visual change — perfectly stable          |
| Wilted  | No visual change — perfectly stable          |

**When it appears** Level 7. Introduced alongside the Ethereum plant to teach crypto portfolio structure.

**How it reacts to events**

| Event              | Reaction                                    |
|--------------------|---------------------------------------------|
| All events         | 0.00 — pegged to USD                        |
| Sector Mania crash | Acts as buffer — no loss                    |
| DePeg risk (rare)  | Special event: stablecoin loses peg — -0.20 |

``` json
{
  "id": "green_cymbidium",
  "name": "Green Cymbidium Orchid",
  "icon": "assets/plants/green-cymbidium.png",
  "category": "crypto",
  "subCategory": "stablecoin",
  "realWorldEquivalent": "Stablecoins — USDC, USDT, DAI",
  "color": "#27AE60",
  "colorName": "Green",
  "keywords": ["stable", "liquidity", "neutral", "low risk"],
  "unlocksAtLevel": 7,
  "visualStates": {
    "healthy": "clean green waxy blooms, steady and constant",
    "growing": "no visual change — perfectly stable",
    "damaged": "no visual change — perfectly stable",
    "wilted": "no visual change — perfectly stable"
  },
  "baseEffects": {
    "bull_market": 0.00,
    "market_crash": 0.00,
    "inflation_shock": 0.00,
    "sector_mania_up": 0.00,
    "sector_mania_down": 0.00,
    "calm_year": 0.02
  },
  "specialEvent": {
    "id": "stablecoin_depeg",
    "probability": "rare",
    "effect": -0.20,
    "description": "Stablecoin loses its peg — a rare but real systemic risk"
  },
  "riskLevel": "very_low",
  "volatility": "zero",
  "cryptoCategory": "stable",
  "rebound": false,
  "floraInsight": "A stablecoin is always worth one dollar. Its job is not to grow — it is to hold value and absorb the volatility of your other orchids. But remember: even stablecoins can fail. It has happened before."
}
```

------------------------------------------------------------------------

## Full Plant Reference Table

| Category | Sub-category | Plant | Color | Risk | Unlocks | Icon file |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| Equity | Tech | Cherry Blossom Tree | Pink | High | L3 | cherry-blossom.png |
| Equity | Healthcare | Magnolia Tree | White | Low | L4 | magnolia.png |
| Equity | Energy | Flame Tree | Red | High | L5 | flame-tree.png |
| Equity | Finance | Apple Tree | Green | Medium | L2 | apple-tree.png |
| Bonds | US Treasury | Camellia Bush | White | Very Low | L1 | camellia.png |
| Bonds | Corporate | Hydrangea Bush | Blue | Low-Med | L2 | hydrangea.png |
| Bonds | High-Yield | Hibiscus Bush | Red | High | L6 | hibiscus.png |
| Bonds | EM Bonds | Bougainvillea Bush | Purple | High | L7 | bougainvillea.png |
| Cash | USD | Meadow Grass | Light Pink | Very Low | L1 | meadow-grass.png |
| Cash | CHF | Edelweiss Grass | White | Very Low | L3 | edelweiss.png |
| Cash | EUR | Clover Grass | Green | Very Low | L2 | clover.png |
| Cash | JPY | Silver Grass | Beige | Low | L5 | silver-grass.png |
| Commodities | Gold | Golden Barrel Cactus | Yellow | Low | L1 | golden-barrel.png |
| Commodities | Oil | Night-Blooming Cactus | White | Very High | L5 | night-blooming-cactus.png |
| Commodities | Wheat | Prickly Pear Cactus | Orange | Low-Med | L6 | prickly-pear.png |
| Commodities | Copper | Cholla Cactus | Brown | Med-High | L7 | cholla.png |
| Crypto | Bitcoin | White Phalaenopsis Orchid | White | High | L6 | white-phalaenopsis.png |
| Crypto | Ethereum | Purple Dendrobium Orchid | Purple | Very High | L8 | purple-dendrobium.png |
| Crypto | Solana | Blue Exotic Orchid | Blue | Extreme | L9 | blue-exotic-orchid.png |
| Crypto | Stablecoin | Green Cymbidium Orchid | Green | Very Low | L7 | green-cymbidium.png |
