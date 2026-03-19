# PROJECT BRIEFING: GROWDEN (START Hack 2026 — PostFinance Case)

## Event Details

**Event:** START Hack 2026, St. Gallen, Switzerland
**Timeline:** Hacking started Wed ~20:00. Final submission Friday 08:00. Pitching starts Friday 08:30.
**Team:** Arnaud Butty, Kilian Huber, Paul Ludmann, Aris (4th member, no CV on file)

## Team Skills Summary

• **Kilian:** System administrator, 7+ years IT infra, Linux/Windows servers, cybersecurity, Fortinet, Azure/Intune, Python/TypeScript/PowerShell/Bash, AZ-900 certified
• **Paul:** BSc Economics at HSG (5.67/6.00 GPA), Data Science certificate, Python (Pandas, NumPy, Scikit-learn), ML, private equity intern at SWEN Capital Partners, financial analysis
• **Arnaud:** BA Business Admin at HSG (5.32/6.00 GPA), Python intermediate, SQL intermediate, HTML/CSS beginner, KYC/compliance experience at Raiffeisen, trilingual (FR/DE/EN)
• **Aris:** Skills not documented yet
• **Team weakness:** Frontend/web development. Nobody has React/Vue as a core skill.

---

## The Concept: Growden

Gamify portfolio creation by turning investments into a garden. The user picks a gardening style (conservative/balanced/aggressive) on the welcome screen, then builds and manages a garden where each plant type maps to a real world asset class. Weather events simulate real market conditions. An AI coach ("Flora") explains what happened in garden language first, then translates it to real finance terms.

---

## Plant/Asset Mapping

### Core Asset Classes (5 categories)

| Plant | Asset Class | Subtypes | Behavior |
|---|---|---|---|
| 🌳 Trees (Oak) | Equities | Tech, Healthcare, Energy, Finance | Grow fast in sunshine, sway hard in wind |
| 🌿 Bushes | Bonds | US Treasury, Corporate, High-Yield, Emerging Market | Slow growth, deep roots, barely moves in storms |
| 🌵 Cactus | Commodities | Gold, Oil, Wheat, Copper | Survives anything, barely grows, insurance against inflation/supply shocks |
| 🌸 Exotic Flower (Orchid) | Crypto | Bitcoin, Ethereum, Solana, Stablecoin | Beautiful when it blooms, dies easily, high maintenance |
| 🌾 Grass | Cash | USD, CHF, EUR, JPY | Always there, barely grows, keeps things stable |

### Special / Advanced Plants (unlocked through gameplay)

| Plant | Represents | Behavior |
|---|---|---|
| 🛡️ Fortified Oak | Defense stocks | Thrives during geopolitical shocks / war |
| 🏭 Coal Bush | Fossil fuel / ESG risky stocks | Profits from oil crises but carries ESG penalty |
| 🌵 Junk Weed | High-yield / junk bonds | Higher return than bushes but collapses under stress |
| 🌿 Leveraged Vine | Leveraged positions | Amplifies everything 2x to 3x, liquidation risk in severe events |
| 🌿 Willow | Long-term government bonds | Extra sensitive to rate changes and inflation |

---

## Game Flow (Updated)

### Step 1: Welcome Screen + Gardening Style
The user picks a gardening style (conservative / balanced / aggressive) which maps to a risk profile. No separate quiz. Choice is made right on the welcome screen.

### Step 2: Tutorial Mode (4 to 8 steps, still to be determined)
The tutorial teaches the user key lessons from long-term investing. It introduces plant types, what they represent, and basic concepts like diversification. The user can skip and return to the tutorial at any time.

### Step 3: Hard Mode (Core Gameplay)
The user starts with a small garden and a predefined number of **flowers** (the in-game currency). They can buy plants with flowers, which represent real world assets. This teaches portfolio construction. Weather events happen and the user sees how their garden sustains the weather. As the user advances and succeeds, they earn more flowers, can buy more plants, and unlock more garden plots. The garden visually grows richer the better they play.

### Step 4: Battle Mode (Side Feature)
The user sees an actual real world headline (e.g., "Trump invades Iran" / "FED increases the rate"). They choose a portfolio mix. They get scored on how tough their garden sustained the event based on three criteria:
• **Risk reliability** (did the portfolio match the declared risk profile?)
• **Profitability** (how well did it perform?)
• **ESG score** (are they holding Coal Bushes or clean assets?)

### Key Design Philosophy
As the user fails in Hard Mode, they will naturally be drawn back to the tutorial to learn how to build better portfolios. The learning loop is: fail → learn → improve → advance.

---

## Weather/Market Event System

Every event has three layers:
1. **The weather** (what the player sees visually)
2. **The economic event** (what it maps to in real world)
3. **The amplitude** (light / moderate / severe)

### Amplitude Scale

| Amplitude | Weather Metaphor | Portfolio Impact Multiplier |
|---|---|---|
| Light | Passing clouds, light drizzle | 0.4x base effects |
| Moderate | Real weather | 1.0x base effects |
| Severe | Extreme weather | 2.2x base effects |

### Full Event Reference Table (10 Events)

| # | Event | Weather | Emoji | First Appears | Primary Punished | Primary Rewarded |
|---|---|---|---|---|---|---|
| 1 | Earnings Season | Sun / Clouds | ☀️🌤️ | Level 1 | Leveraged Vine | Oak |
| 2 | Unemployment Spike | Cold Rain | 🌧️ | Level 3 | Junk Weed | Bush |
| 3 | Oil Crisis | Desert Heat | 🔥 | Level 5 | Equities | Cactus |
| 4 | Geopolitical Shock | Lightning | ⚡ | Level 8 | Leveraged Vine | Fortified Oak |
| 5a | Fed Rate Hike | Heavy Rain | 🌧️ | Level 2 | Bonds + Equities | Cash |
| 5b | Fed Rate Cut | Clearing Skies | 🌤️ | Level 9 | Cash | Bonds + Equities |
| 6 | Tariff Crisis | Thick Fog | 🌫️ | Level 6 | Global Equities | Crypto (minor) |
| 7 | Nothing Special | Calm Day | 🌤️ | Level 1 | (overtrading penalty) | All (slow) |
| 8 | Market Panic | Tornado | 🌪️ | Level 7 | Crypto + Leverage | Cash + Bonds |
| 9 | Inflation Shock | Acid Rain | 🌧️ | Level 2 | Cash + Bonds | Cactus |
| 10 | Sector Mania (Tech Bubble) | Meteor Shower | ☄️ | Level 9 | Exotic (bust phase) | Exotic (mania phase) |

### Special Event Mechanics
• **Event 7 (Nothing Special):** Penalizes overtrading. Teaches that patience = compounding.
• **Event 8 (Market Panic):** Panic selling costs double penalty (minus 50 points). Holding gets a bonus (+25).
• **Event 10 (Sector Mania):** Has TWO phases (mania then bust). Player gets a rebalance window between phases. Teaches FOMO.

---

## Scoring System

Rewards diversification, staying invested through crashes, and risk-appropriate allocation. Panic selling gets penalized. The hidden lesson is baked into the math.

Battle Mode scoring is on three axes:
• **Risk reliability** (portfolio matches declared risk profile)
• **Profitability** (performance through the event)
• **ESG** (penalizes Coal Bush and other dirty assets)

---

## Tech Stack

Still to be decided. The team is not professional coders so the stack should prioritize ease of use and fast prototyping. Candidates being evaluated.

---

## 30-Second Pitch

"Most people never start investing because it feels abstract and scary. Growden changes that by turning your portfolio into a garden. You pick a gardening style, which maps to your risk profile. You plant your 10 plots with different plants: oaks for bonds, sunflowers for stocks, orchids for crypto. Then weather hits. A hurricane is the 2008 crash. A drought is inflation. You watch your garden react in real time. After each event, an AI coach explains what just happened, in garden language first, then translates it back to real finance. So you learn diversification not by reading about it, but by watching your orchids die while your oaks stand tall. We're building it in React with Firebase and the Claude API. The prototype will be fully playable by tomorrow morning."

**Money line for judges:** "Nobody forgets watching their garden get destroyed by a hurricane. That emotional memory is what makes the financial lesson stick."

*Note: Pitch needs updating to reflect the new game flow (tutorial → hard mode → battle mode) and the flowers currency system.*

---

## Project Breakdown (30 milestones across 6 parts)

### Part 4: Infrastructure (do first)

• 4.1 Create GitHub repo, branches, git workflow
• 4.2 Firebase project setup (hosting + Firestore)
• 4.3 React app scaffolded, everyone runs locally
• 4.4 First deploy to Firebase hosting (live URL)
• 4.5 Final deploy + smoke test before submission

### Part 1: Core Game Engine

• 1.1 Define plant/asset mapping data model (5 core + 5 special plants, growth rates, volatility, visual states)
• 1.2 Build weather event library (10 events with 3 amplitudes each, impact multipliers per plant)
• 1.3 Build simulation loop (garden config → run through levels → output results)
• 1.4 Build scoring algorithm (risk reliability, profitability, ESG for battle mode)
• 1.5 Unit test the math

### Part 2: User Flow / Frontend

• 2.1 Welcome screen + gardening style selector (conservative/balanced/aggressive, no separate quiz)
• 2.2 Tutorial mode (4 to 8 steps teaching key investing lessons)
• 2.3 Plant selection / garden builder screen (buy plants with flowers currency, fill plots)
• 2.4 Plant info cards (what each plant represents)
• 2.5 Simulation screen: base layout (garden grid)
• 2.6 Simulation screen: weather event popups (pause, show event, force decision)
• 2.7 Simulation screen: animations (plants swaying, wilting, growing)
• 2.8 Results screen (final garden state, score, lessons learned)
• 2.9 PostFinance branding pass

### Part 3: AI Coach ("Flora")

• 3.1 Set up Claude API connection
• 3.2 Write the system prompt (garden metaphor → finance translation)
• 3.3 Integrate coach into simulation (after each weather event)
• 3.4 Fallback: pre-written explanations (write these BEFORE API work as insurance)

### Part 5: Pitch & Polish

• 5.1 Write pitch narrative
• 5.2 Build pitch deck (5 to 7 slides)
• 5.3 Prepare live demo flow
• 5.4 Rehearse pitch 3x minimum
• 5.5 Record backup demo video

### Part 6: Battle Mode (stretch only)

• 6.1 Real headline display + portfolio selection UI
• 6.2 Scoring engine (risk reliability / profitability / ESG)
• 6.3 QR code to join session + real time sync (Firebase)
• 6.4 Side by side results comparison screen

---

## Notion Command Center

https://www.notion.so/327532abd55a81f1ab47cfc12099503d

Contains: team roles, full timeline with checkboxes, links/resources section, task board (kanban), and the milestones database with deadlines and assignee dropdowns.

---

## Key Strategic Notes

• Frontend is the team's weakest spot. Lean on templates, keep UI simple, don't over-engineer animations.
• The AI coach fallback (3.4) is critical insurance for demo day.
• Pitch writing should start Thursday afternoon, not Friday morning.
• Sleep in shifts: Pair A midnight to 4am, Pair B 4am to 8am Thursday night.
• The "flowers as currency" mechanic and the tutorial → hard mode loop are the new X factor for judges. Make sure this progression is visible in the demo.
