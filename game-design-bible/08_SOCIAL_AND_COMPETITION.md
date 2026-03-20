# Social & Competition

> *Investing is personal, but comparing notes is universal — Growden turns portfolio strategy into a shared conversation.*

---

## 🌟 The Fantasy

The player doesn't just want to build a great garden. They want to build a **better garden than their friend**. They want to say "I'm a Master Gardener" and watch their colleague's Sprout status crumble in comparison. The social fantasy is **being the wisest person in the room** — not through bragging, but through demonstrated skill.

## 🔄 The Loop

### The Leaderboard

Growden's current social layer centers on a **local Top 10 leaderboard** that captures:

- Player name
- Final score
- Risk profile chosen (Zen, Meadow, or Jungle)
- Portfolio growth percentage
- Highest level reached
- Completion date

The leaderboard lives on the debrief screen — the moment of maximum emotional engagement. The player just finished their run. Their score is fresh. And there, right below their result, is the question: **"Where do you rank?"**

For event activations (school workshops, PostFinance conferences, hackathon demos), the leaderboard transforms a solo experience into a room-wide competition. Twenty people playing simultaneously, all watching the same Top 10 update in real time. This is where Growden becomes electric.

### Battle Mode as Social Currency

Battle Mode (covered in detail in [02_BATTLE_SYSTEM.md](02_BATTLE_SYSTEM.md)) is designed as the game's primary social mechanic — even though multiplayer isn't yet implemented:

- **Same headline, different strategies** — Two players can face the same event and build completely different portfolios. The comparison reveals philosophy: "You went all-in on commodities? I hedged with bonds." These conversations ARE financial education.
- **Three-axis scoring prevents simple comparison** — One player might win on Profitability but lose on ESG. "I made more money, but you were more responsible." This is a genuinely interesting debate.
- **QR code sharing** — The design includes QR codes for joining battle sessions, enabling spontaneous competition at events.

### The Debrief as Social Object

The debrief screen — with its score, tier, achievements, and portfolio breakdown — is designed to be **screenshot-worthy**. A player who earns Master Gardener or Diamond Hands wants to share that. The debrief is a social object: something that provokes conversation, comparison, and competition when shared.

## 🎲 The Tension & Drama

Social competition creates a unique kind of tension: **comparative anxiety**. The player isn't just worried about their garden surviving. They're worried about surviving *better than the person next to them*.

This drives specific behaviors:
- **Risk-taking increases** when competing — players choose Jungle more often in social settings because conservative play doesn't make for exciting comparisons
- **Replaying for score** — a player who placed 4th wants to crack the Top 3
- **Strategy debate** — "Is Zen actually better because you avoid panic penalties?" becomes a real conversation

The drama also comes from **asymmetric information in Battle Mode**. Two players face the same headline, but they can't see each other's portfolio until results reveal. The moment of reveal — "Wait, you put 40% in crypto?!" — is pure social energy.

## 🧠 The Psychology

- **Social Proof** — Seeing other players' scores normalizes financial engagement. "If my friend is playing a garden investing game, maybe investing isn't as intimidating as I thought."

- **Status Signaling** — Tier names (Seedling → Master Gardener) create a portable identity. "I'm a Botanist" is a claim about financial literacy that feels earned, not pretentious.

- **Cooperative Competition** — Growden's competition is collaborative, not zero-sum. When a friend scores higher, the player learns from their strategy rather than losing something. The leaderboard motivates without punishing.

- **Social Learning** — Research consistently shows that people learn better in social contexts. Discussing why one portfolio outperformed another is a more effective financial education than any lecture.

## 💰 The Business Connection

**Viral Mechanics:** Every social interaction around Growden is an organic marketing moment. Screenshots shared, scores compared, strategies debated — each is a touchpoint that introduces new potential players to the game and to PostFinance's brand.

**Event Activation:** The leaderboard + Battle Mode combination makes Growden a ready-made event activity. School workshops, corporate training sessions, financial literacy events, and PostFinance marketing activations all benefit from the competitive social layer.

**Network Effects:** When multiplayer launches, each player who invites a friend doubles the game's social surface area. Real-time portfolio duels create the kind of moments people talk about — and that drives organic growth.

**Community Building:** A community of Growden players is a community of financially literate young adults — PostFinance's ideal customer demographic. The game builds the community; the community builds the customer base.

## ⚠️ Design Gaps & Open Questions

- ⚠️ **Design Gap** — *The leaderboard is localStorage-only (device-local). Players can't compare across devices, and scores are lost if the browser cache clears. Cloud persistence is essential for the social layer to function beyond single-session events.*
- ⚠️ **Design Gap** — *No friend system, no profile pages, no way to challenge a specific person. The social infrastructure is currently implicit (shared device, same room) rather than explicit (networked). Firebase integration is designed but not built.*
- ⚠️ **Design Gap** — *No cooperative mode exists. All social interaction is competitive. A "Garden Together" mode where two players tend one garden could teach collaboration and delegation — important financial concepts for couples and families.*
- ⚠️ **Design Gap** — *No spectator mode. Watching a skilled player navigate a Market Panic event would be both entertaining and educational. Live-stream or replay features could serve this need.*

## 🔮 Design Opportunities

1. **Guild Gardens:** Groups of players (families, classrooms, office teams) tend a shared garden together. Each member manages one asset class. The group's collective decisions determine the garden's health. This teaches delegation, trust, and the value of specialized knowledge — concepts central to real-world financial planning.

2. **Weekly Tournaments:** Every week, all players face the same 5-event sequence. Global leaderboard resets weekly. Top performers earn exclusive cosmetics. This creates appointment gaming, community events, and recurring engagement — without requiring new content.

3. **Mentor Matching:** Pair Master Gardeners with Seedlings. The mentor reviews the learner's portfolio after each level and offers one piece of advice. Teaching is the deepest form of learning — and the mentor engagement keeps experienced players invested.
