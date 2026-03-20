# Changelog - Growden

## [Audit] - 2026-03-19 - Full Codebase Analysis & Improvement Roadmap

### Codebase Overview

- **Stack:** TypeScript 5.7 + PixiJS 8.6 + GSAP 3.12 + Vite 6.2
- **Architecture:** MVC + Event-Driven Pub/Sub (GameStateManager, SimulationEngine, ScoringEngine)
- **Total:** 31 TypeScript files, ~4,400 lines of code
- **Screens:** Landing, RiskProfile, Tutorial, Garden, Event, Debrief, Battle + Codex/Stats modals
- **Styling:** Custom CSS design system (2,600+ lines), PostFinance brand tokens, no UI framework
- **Storage:** LocalStorage only (leaderboard), no backend, no API calls
- **Testing:** None

---

### 10 Key Aspects to Elevate

#### 1. Backend & Multiplayer Infrastructure
- Currently 100% client-side with localStorage only
- **Recommendation:** Add lightweight backend (Supabase, Firebase, or Express)
- Unlocks: cloud saves, global leaderboard, real multiplayer Battle Mode, user accounts

#### 2. Real Financial Data Integration
- All market data is hardcoded in local data files
- **Recommendation:** Integrate live financial API (Alpha Vantage, Yahoo Finance, Polygon.io)
- Unlocks: real market conditions, actual asset return mapping, "real world mode", educational credibility

#### 3. Testing & Quality Assurance
- Zero tests exist across the entire codebase
- **Recommendation:** Vitest for unit tests (ScoringEngine, SimulationEngine, GameState are pure logic), Playwright for E2E
- Engine logic is pure functions - ideal for testing

#### 4. Analytics & Learning Metrics
- No tracking of user behavior or learning outcomes
- **Recommendation:** Add Mixpanel, PostHog, or Plausible
- Unlocks: panic-sell rate analysis, tutorial drop-off tracking, score progression patterns, educational value proof

#### 5. Internationalization (i18n)
- All strings hardcoded in English
- **Recommendation:** i18next or simple key-value system
- Required for PostFinance (Swiss market): French, German, Italian support
- Financial terms need localized explanations

#### 6. Accessibility (a11y)
- No ARIA labels, no keyboard navigation, no screen reader support
- PixiJS canvas is inaccessible
- **Recommendation:** Add aria-label, role, aria-live regions, keyboard shortcuts for Hold/Rebalance/PanicSell, high-contrast mode, pixi-accessibility

#### 7. Progressive Web App (PWA)
- App already works offline (no API calls) - ideal PWA candidate
- **Recommendation:** Add service worker + manifest via vite-plugin-pwa
- Unlocks: "Add to Home Screen", true offline caching, push notifications, near-native mobile experience

#### 8. Sound Design & Audio Feedback
- Zero audio in the current app
- **Recommendation:** Add Howler.js or Tone.js
- Weather ambient sounds, score gain/loss feedback, plant growth celebration, background music per risk profile

#### 9. AI-Powered Flora Coach
- Flora currently shows static hardcoded hints
- **Recommendation:** Integrate Claude API
- Unlocks: personalized feedback, conversational financial explanations, adaptive language, dynamic "what-if" analysis

#### 10. Game State Persistence & Replay
- No save/load, no replay functionality
- **Recommendation:** Add game state serialization + localStorage/backend persistence
- Unlocks: resume interrupted games, replay mode, shareable game summaries, PDF export

---

### 10 Key UI/UX Points to Enhance

#### 1. Onboarding & First-Time Experience
- Current 6-step tutorial is text-heavy and passive
- **Tools:** Shepherd.js or Driver.js (guided tooltips), lottie-web (animated illustrations)
- Add skip option with contextual "learn as you play" hints, mini-interactions per step

#### 2. Data Visualization
- Debrief SVG chart is basic and static
- **Tools:** D3.js or Chart.js (interactive charts), Recharts (if moving to React)
- Add animated pie charts, nav bar sparklines, plant performance heatmaps

#### 3. Micro-interactions & Feedback
- Button clicks feel flat, score changes are instant
- **Tools:** GSAP (already installed)
- Add button press scale animations, rolling number counters (odometer), flower particle bursts, portfolio value color flash, plant chip wiggle on events

#### 4. Dark Mode
- No dark mode exists
- **Tools:** CSS custom properties (already using them) + prefers-color-scheme
- Remap --bg-main, --bg-surface, --text-primary to dark variants, swap PixiJS sky texture
- Low effort given existing CSS variable architecture

#### 5. Mobile Experience Polish
- Responsive breakpoints exist but are minimal
- **Tools:** Hammer.js (swipe gestures)
- Add swipe navigation, drag-to-dismiss bottom sheets, floating action button, horizontal scroll plant carousel

#### 6. Transition & Screen Flow
- Screen changes use basic fade
- **Tools:** View Transitions API, FLIP animations
- Add shared element transitions, plant scatter/regroup animations, weather morphing, staggered content entry

#### 7. Portfolio Visualization
- Stacked bar is functional but static
- **Tools:** anime.js or Framer Motion
- Add animated treemap, interactive donut chart, before/after comparison slider, drag-to-adjust allocation

#### 8. Event Card Presentation
- Events appear as plain modal overlays
- **Tools:** SplitType + GSAP (text reveal), canvas effects
- Add full-screen weather takeover, breaking news ticker animation, glow pulse on affected plants, dramatic impact number counter, severity thermometer

#### 9. Gamification Layer
- Score is just a number with no visible progression
- **Tools:** canvas-confetti (celebrations)
- Add achievement badges (First Hold, Diversification Master, ESG Champion), XP bar with level-up confetti, streak counter, plant evolution animations, daily challenge system

#### 10. Typography & Visual Hierarchy
- Inter is functional but generic
- **Tools:** Variable fonts, Intl.NumberFormat
- Add display font for headlines (Clash Display, Cabinet Grotesk), locale-aware currency formatting, gradient text highlights, improved event card size contrast

---

### Quick-Win Tool Summary

| Enhancement | Tool/Library | Effort |
|------------|-------------|--------|
| Guided onboarding | Driver.js | Low |
| Charts & graphs | Chart.js / D3.js | Medium |
| Confetti & celebrations | canvas-confetti | Low |
| Swipe gestures | Hammer.js | Low |
| Sound effects | Howler.js | Low |
| Lottie animations | lottie-web | Medium |
| Dark mode | CSS variables (built-in) | Low |
| PWA | vite-plugin-pwa | Low |
| i18n | i18next | Medium |
| AI coach | Claude API | Medium |
| Testing | Vitest + Playwright | Medium |
| Analytics | PostHog (open source) | Low |
