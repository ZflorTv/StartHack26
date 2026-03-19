import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// FAKE DATA — all hardcoded for demo
// ─────────────────────────────────────────────

const DAILY_EVENTS = [
  {
    id: "fed_rate_hike",
    date: "March 19, 2026",
    category: "CENTRAL BANKING",
    headline: "Fed raises rates by 50bps amid persistent inflation",
    summary:
      "The Federal Reserve announced a sharper-than-expected rate hike of 50 basis points, citing CPI figures that remained stubbornly above the 3% target for the fourth consecutive month. Chair Powell signalled further tightening may follow if labour market data does not cool. Bond markets sold off sharply on the news, while the dollar strengthened against major peers.",
    expertAllocation: { bonds: 20, equities: 35, cash: 45 },
    communityAllocation: { bonds: 25, equities: 45, cash: 30 },
    threeMonthReturns: { bonds: -4.2, equities: -6.8, cash: 1.1 },
    insight:
      "When rates rise aggressively, bonds lose value because new bonds pay more. Equities also fall as borrowing becomes expensive for companies. Cash becomes relatively attractive — holding liquidity is a valid defensive move.",
    insightTitle: "Why cash wins in a rate hike environment",
  },
  {
    id: "oil_crisis",
    date: "March 20, 2026",
    category: "COMMODITIES",
    headline: "OPEC cuts output by 2M barrels — oil hits $98 a barrel",
    summary:
      "A surprise OPEC+ production cut sent oil prices surging to their highest level since 2023. Energy stocks rallied while airline and consumer discretionary sectors came under pressure. Economists warned the shock could re-ignite inflationary pressures just as central banks had begun to pause tightening cycles.",
    expertAllocation: { bonds: 15, equities: 50, cash: 35 },
    communityAllocation: { bonds: 20, equities: 55, cash: 25 },
    threeMonthReturns: { bonds: -2.1, equities: 5.4, cash: 0.8 },
    insight:
      "Oil shocks benefit energy-heavy equity indices in the short term. Bonds suffer from the inflationary pressure. Maintaining some equity exposure to capture the energy sector rally while keeping a cash buffer is the balanced approach.",
    insightTitle: "Oil shocks reward selective equity exposure",
  },
  {
    id: "recession_fears",
    date: "March 21, 2026",
    category: "MACRO",
    headline: "US unemployment jumps to 5.8% — recession risk elevated",
    summary:
      "Non-farm payrolls came in sharply below expectations, with unemployment rising to 5.8%, the highest since 2020. Consumer confidence fell to a two-year low. Markets repriced recession risk upwards, with defensive sectors and government bonds rallying as investors fled equities and risk assets.",
    expertAllocation: { bonds: 50, equities: 20, cash: 30 },
    communityAllocation: { bonds: 35, equities: 38, cash: 27 },
    threeMonthReturns: { bonds: 6.3, equities: -11.2, cash: 1.0 },
    insight:
      "Recessions are the time bonds earn their place in a portfolio. As investors flee risk, government bond prices rise. Equities fall hard. Having significant bond exposure before a recession is one of the most valuable moves a long-term investor can make.",
    insightTitle: "Bonds are your shelter in a recession",
  },
];

const FAKE_LEADERBOARD = [
  { name: "🌳 AlphaGarden", score: 94, streak: 7 },
  { name: "🌸 SwissInvestor", score: 91, streak: 5 },
  { name: "🌿 BullRunner", score: 87, streak: 12 },
  { name: "🦁 MarketLion", score: 85, streak: 3 },
  { name: "🍀 DiversiPaul", score: 82, streak: 8 },
  { name: "⭐ StableSara", score: 79, streak: 2 },
  { name: "🚀 GrowthMax", score: 76, streak: 6 },
  { name: "🌱 CalmInvestor", score: 71, streak: 4 },
  { name: "💎 GoldLeaf", score: 68, streak: 1 },
  { name: "🏔️ AlpineHedge", score: 65, streak: 3 },
];

// Get today's event (cycles through events by day)
function getTodayEvent() {
  const dayIndex = new Date().getDate() % DAILY_EVENTS.length;
  return DAILY_EVENTS[dayIndex];
}

// Calculate score based on how close to expert allocation
function calculateScore(userAlloc, expertAlloc) {
  const diff =
    Math.abs(userAlloc.bonds - expertAlloc.bonds) +
    Math.abs(userAlloc.equities - expertAlloc.equities) +
    Math.abs(userAlloc.cash - expertAlloc.cash);
  return Math.max(0, Math.round(100 - diff * 1.2));
}

// Calculate portfolio return
function calculateReturn(allocation, returns) {
  return (
    (allocation.bonds / 100) * returns.bonds +
    (allocation.equities / 100) * returns.equities +
    (allocation.cash / 100) * returns.cash
  ).toFixed(1);
}

// Get percentile from score
function getPercentile(score) {
  if (score >= 90) return 95;
  if (score >= 80) return 82;
  if (score >= 70) return 68;
  if (score >= 60) return 51;
  if (score >= 50) return 38;
  return 22;
}

// ─────────────────────────────────────────────
// COLOURS (PostFinance palette)
// ─────────────────────────────────────────────
const C = {
  yellow: "#FFD100",
  petrol: "#1B4F6C",
  petrolLight: "#2A6F96",
  grapefruit: "#E8623C",
  lightBlue: "#7EC8E3",
  bg: "#F7F6F0",
  surface: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textMuted: "#8A8A9A",
  positive: "#27AE60",
  negative: "#E74C3C",
  warning: "#F39C12",
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function UsernameModal({ onConfirm }) {
  const [name, setName] = useState("");

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
        <h2 style={styles.modalTitle}>Welcome to Battle Mode</h2>
        <p style={styles.modalSubtitle}>
          Every day a real market event. One allocation challenge. Compete with
          friends.
        </p>
        <input
          style={styles.input}
          placeholder="Pick a username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
          autoFocus
        />
        <button
          style={{
            ...styles.btnPrimary,
            opacity: name.trim() ? 1 : 0.4,
            cursor: name.trim() ? "pointer" : "not-allowed",
          }}
          onClick={() => name.trim() && onConfirm(name.trim())}
        >
          Let's go →
        </button>
      </div>
    </div>
  );
}

function NewsCard({ event }) {
  return (
    <div style={styles.newsCard}>
      <div style={styles.newsHeader}>
        <span style={styles.newsCategoryBadge}>{event.category}</span>
        <span style={styles.newsDate}>{event.date}</span>
      </div>
      <div style={styles.newsDivider} />
      <h1 style={styles.newsHeadline}>{event.headline}</h1>
      <p style={styles.newsSummary}>{event.summary}</p>
      <div style={styles.newsFooter}>
        <span style={styles.newsSource}>Wealth Garden Daily</span>
        <span style={styles.newsTag}>📰 Today's Challenge</span>
      </div>
    </div>
  );
}

function AllocationSliders({ allocation, onChange, total }) {
  const assets = [
    { key: "bonds", label: "Bonds", emoji: "🌿", color: C.lightBlue },
    { key: "equities", label: "Equities", emoji: "🌳", color: C.petrol },
    { key: "cash", label: "Cash", emoji: "🌾", color: C.yellow },
  ];

  return (
    <div style={styles.slidersCard}>
      <div style={styles.slidersHeader}>
        <h3 style={styles.slidersTitle}>Adjust your portfolio</h3>
        <div
          style={{
            ...styles.totalBadge,
            backgroundColor: total === 100 ? "#E8F5E9" : "#FFF3E0",
            color: total === 100 ? C.positive : C.warning,
            border: `1.5px solid ${total === 100 ? C.positive : C.warning}`,
          }}
        >
          {total}% / 100%
        </div>
      </div>

      {total !== 100 && (
        <p style={styles.sliderWarning}>
          ⚠️ Allocations must total exactly 100%
        </p>
      )}

      {assets.map(({ key, label, emoji, color }) => (
        <div key={key} style={styles.sliderRow}>
          <div style={styles.sliderLabelRow}>
            <span style={styles.sliderEmoji}>{emoji}</span>
            <span style={styles.sliderLabel}>{label}</span>
            <span style={{ ...styles.sliderValue, color }}>{allocation[key]}%</span>
          </div>
          <div style={styles.sliderTrack}>
            <div
              style={{
                ...styles.sliderFill,
                width: `${allocation[key]}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={allocation[key]}
            onChange={(e) => onChange(key, parseInt(e.target.value))}
            style={styles.rangeInput}
          />
        </div>
      ))}
    </div>
  );
}

function ResultsPanel({ event, userAlloc, userName }) {
  const score = calculateScore(userAlloc, event.expertAllocation);
  const percentile = getPercentile(score);
  const userReturn = parseFloat(calculateReturn(userAlloc, event.threeMonthReturns));
  const expertReturn = parseFloat(
    calculateReturn(event.expertAllocation, event.threeMonthReturns)
  );
  const communityReturn = parseFloat(
    calculateReturn(event.communityAllocation, event.threeMonthReturns)
  );

  // Inject real player into leaderboard
  const fullLeaderboard = [...FAKE_LEADERBOARD, { name: `⚡ ${userName}`, score, streak: 1 }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const playerRank = fullLeaderboard.findIndex((p) => p.name === `⚡ ${userName}`) + 1;

  const allocs = [
    { label: "Your allocation", alloc: userAlloc, ret: userReturn, color: C.petrol, bold: true },
    { label: "Community average", alloc: event.communityAllocation, ret: communityReturn, color: C.textMuted, bold: false },
    { label: "Expert answer", alloc: event.expertAllocation, ret: expertReturn, color: C.positive, bold: false },
  ];

  return (
    <div style={styles.resultsWrapper}>

      {/* Score hero */}
      <div style={styles.scoreHero}>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreNumber}>{score}</span>
          <span style={styles.scoreLabel}>/ 100</span>
        </div>
        <div>
          <h2 style={styles.scoreTitle}>
            {score >= 80 ? "Excellent move 🎯" : score >= 60 ? "Solid thinking 👍" : "Room to grow 🌱"}
          </h2>
          <p style={styles.scoreSubtitle}>
            You scored better than <strong>{percentile}%</strong> of players today
          </p>
        </div>
      </div>

      {/* 3-month performance */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>📈 3-Month Simulated Return</h3>
        <div style={styles.returnsRow}>
          {allocs.map(({ label, ret, color, bold }) => (
            <div key={label} style={styles.returnBox}>
              <span style={{ ...styles.returnPct, color: ret >= 0 ? C.positive : C.negative, fontWeight: bold ? 700 : 400 }}>
                {ret >= 0 ? "+" : ""}{ret}%
              </span>
              <span style={{ ...styles.returnLabel, color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation comparison */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>⚖️ Allocation Comparison</h3>
        <div style={styles.comparisonHeader}>
          <span />
          <span style={styles.comparisonColLabel}>Bonds</span>
          <span style={styles.comparisonColLabel}>Equities</span>
          <span style={styles.comparisonColLabel}>Cash</span>
        </div>
        {allocs.map(({ label, alloc, color, bold }) => (
          <div key={label} style={styles.comparisonRow}>
            <span style={{ ...styles.comparisonRowLabel, color, fontWeight: bold ? 700 : 400 }}>
              {label}
            </span>
            <span style={styles.comparisonCell}>{alloc.bonds}%</span>
            <span style={styles.comparisonCell}>{alloc.equities}%</span>
            <span style={styles.comparisonCell}>{alloc.cash}%</span>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div style={styles.insightCard}>
        <div style={styles.insightBadge}>💡 Key Insight</div>
        <h3 style={styles.insightTitle}>{event.insightTitle}</h3>
        <p style={styles.insightText}>{event.insight}</p>
      </div>

      {/* Leaderboard */}
      <div style={styles.sectionCard}>
        <div style={styles.leaderboardHeader}>
          <h3 style={styles.sectionTitle}>🏆 Today's Leaderboard</h3>
          {playerRank <= 10 && (
            <span style={styles.rankBadge}>You're #{playerRank}</span>
          )}
        </div>
        {fullLeaderboard.map((player, i) => {
          const isMe = player.name === `⚡ ${userName}`;
          return (
            <div
              key={i}
              style={{
                ...styles.leaderRow,
                backgroundColor: isMe ? "#FFFBEA" : i % 2 === 0 ? "#FAFAF8" : C.surface,
                border: isMe ? `1.5px solid ${C.yellow}` : "1.5px solid transparent",
              }}
            >
              <span style={styles.leaderRank}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span style={{ ...styles.leaderName, fontWeight: isMe ? 700 : 400 }}>
                {player.name}
              </span>
              <div style={styles.leaderRight}>
                <span style={styles.leaderScore}>{player.score} pts</span>
                <span style={styles.leaderStreak}>🔥 {player.streak}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Come back tomorrow */}
      <div style={styles.tomorrowCard}>
        <span style={{ fontSize: 28 }}>⏰</span>
        <div>
          <p style={styles.tomorrowTitle}>New challenge tomorrow</p>
          <p style={styles.tomorrowSub}>Come back daily to build your streak</p>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function BattleMode({ onBack }) {
  const [phase, setPhase] = useState("username"); // username | challenge | results
  const [userName, setUserName] = useState("");
  const [allocation, setAllocation] = useState({ bonds: 33, equities: 34, cash: 33 });
  const event = getTodayEvent();

  useEffect(() => {
    const saved = localStorage.getItem("wealthGardenUsername");
    if (saved) {
      setUserName(saved);
      setPhase("challenge");
    }
  }, []);

  function handleUsernameConfirm(name) {
    localStorage.setItem("wealthGardenUsername", name);
    setUserName(name);
    setPhase("challenge");
  }

  function handleSliderChange(key, value) {
    setAllocation((prev) => ({ ...prev, [key]: value }));
  }

  const total = allocation.bonds + allocation.equities + allocation.cash;

  return (
    <div style={styles.wrapper}>

      {/* Header */}
      <div style={styles.header}>
        {onBack && (
          <button style={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
        )}
        <div style={styles.headerCenter}>
          <span style={styles.headerLogo}>🌱 Wealth Garden</span>
          <span style={styles.headerSub}>Battle Mode</span>
        </div>
        {userName && (
          <span style={styles.headerUser}>⚡ {userName}</span>
        )}
      </div>

      {/* Username modal */}
      {phase === "username" && (
        <UsernameModal onConfirm={handleUsernameConfirm} />
      )}

      {/* Challenge phase */}
      {phase === "challenge" && (
        <div style={styles.content}>
          <div style={styles.challengeLabel}>
            <span style={styles.liveDot} />
            Today's Challenge
          </div>

          <NewsCard event={event} />

          <AllocationSliders
            allocation={allocation}
            onChange={handleSliderChange}
            total={total}
          />

          <button
            style={{
              ...styles.btnPrimary,
              opacity: total === 100 ? 1 : 0.4,
              cursor: total === 100 ? "pointer" : "not-allowed",
              width: "100%",
              marginTop: 8,
            }}
            onClick={() => total === 100 && setPhase("results")}
          >
            Submit my allocation →
          </button>
        </div>
      )}

      {/* Results phase */}
      {phase === "results" && (
        <div style={styles.content}>
          <ResultsPanel
            event={event}
            userAlloc={allocation}
            userName={userName}
          />
          <button
            style={{ ...styles.btnSecondary, width: "100%", marginTop: 16 }}
            onClick={() => setPhase("challenge")}
          >
            ← Revise my answer
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: C.bg,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    backgroundColor: C.surface,
    boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerLogo: {
    fontSize: 15,
    fontWeight: 700,
    color: C.petrol,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: 600,
    color: C.yellow,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  headerUser: {
    fontSize: 13,
    fontWeight: 600,
    color: C.petrol,
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    color: C.petrol,
    cursor: "pointer",
    padding: "4px 0",
  },

  // Content
  content: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "24px 16px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  challengeLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: C.grapefruit,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: C.grapefruit,
    display: "inline-block",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  // News card (WSJ style)
  newsCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    borderTop: `4px solid ${C.petrol}`,
  },
  newsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newsCategoryBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: C.grapefruit,
    textTransform: "uppercase",
    backgroundColor: "#FEF0EC",
    padding: "4px 10px",
    borderRadius: 50,
  },
  newsDate: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: 300,
  },
  newsDivider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginBottom: 14,
  },
  newsHeadline: {
    fontSize: 20,
    fontWeight: 700,
    color: C.textPrimary,
    lineHeight: 1.3,
    marginBottom: 10,
  },
  newsSummary: {
    fontSize: 15,
    fontWeight: 300,
    color: "#444",
    lineHeight: 1.7,
    marginBottom: 16,
  },
  newsFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #F0EEE6",
  },
  newsSource: {
    fontSize: 11,
    fontWeight: 700,
    color: C.petrol,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  newsTag: {
    fontSize: 12,
    color: C.textMuted,
  },

  // Sliders
  slidersCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
  slidersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  slidersTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: C.textPrimary,
  },
  totalBadge: {
    fontSize: 13,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
  },
  sliderWarning: {
    fontSize: 13,
    color: C.warning,
    fontWeight: 500,
    marginBottom: 12,
    padding: "8px 12px",
    backgroundColor: "#FFF8EC",
    borderRadius: 8,
  },
  sliderRow: {
    marginBottom: 20,
  },
  sliderLabelRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  sliderEmoji: {
    fontSize: 18,
  },
  sliderLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 600,
    color: C.textPrimary,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 700,
    minWidth: 44,
    textAlign: "right",
  },
  sliderTrack: {
    height: 6,
    backgroundColor: "#F0EEE6",
    borderRadius: 50,
    marginBottom: 6,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 50,
    transition: "width 150ms ease",
  },
  rangeInput: {
    width: "100%",
    appearance: "none",
    height: 0,
    opacity: 0,
    display: "block",
    cursor: "pointer",
    marginTop: -6,
    marginBottom: 0,
    padding: "12px 0",
  },

  // Buttons
  btnPrimary: {
    backgroundColor: C.yellow,
    color: C.textPrimary,
    fontSize: 16,
    fontWeight: 700,
    padding: "14px 36px",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(255,209,0,0.35)",
    transition: "transform 150ms ease",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    color: C.petrol,
    fontSize: 15,
    fontWeight: 600,
    padding: "13px 36px",
    border: `1.5px solid ${C.petrol}`,
    borderRadius: 50,
    cursor: "pointer",
  },

  // Input
  input: {
    width: "100%",
    backgroundColor: "#F0EEE6",
    border: "1.5px solid transparent",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 16,
    color: C.textPrimary,
    outline: "none",
    marginBottom: 16,
    boxSizing: "border-box",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(27,79,108,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 100,
  },
  modal: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 40,
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: C.petrol,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: 300,
    color: C.textMuted,
    lineHeight: 1.6,
    marginBottom: 28,
  },

  // Results
  resultsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  scoreHero: {
    backgroundColor: C.petrol,
    borderRadius: 20,
    padding: 28,
    display: "flex",
    alignItems: "center",
    gap: 20,
    color: C.surface,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: C.yellow,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 700,
    color: C.textPrimary,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textPrimary,
    opacity: 0.7,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: C.surface,
    marginBottom: 6,
  },
  scoreSubtitle: {
    fontSize: 14,
    fontWeight: 300,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.5,
  },

  sectionCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.textPrimary,
    marginBottom: 16,
  },

  // Returns
  returnsRow: {
    display: "flex",
    gap: 8,
  },
  returnBox: {
    flex: 1,
    backgroundColor: "#FAFAF8",
    borderRadius: 12,
    padding: "14px 8px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  returnPct: {
    fontSize: 22,
    fontWeight: 700,
  },
  returnLabel: {
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.3,
  },

  // Comparison table
  comparisonHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px 60px",
    gap: 8,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #F0EEE6",
  },
  comparisonColLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textMuted,
    textAlign: "center",
    letterSpacing: "0.04em",
  },
  comparisonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px 60px",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid #F7F6F0",
    alignItems: "center",
  },
  comparisonRowLabel: {
    fontSize: 13,
  },
  comparisonCell: {
    fontSize: 14,
    fontWeight: 600,
    color: C.textPrimary,
    textAlign: "center",
  },

  // Insight card
  insightCard: {
    backgroundColor: "#FFFBEA",
    border: `1.5px solid ${C.yellow}`,
    borderRadius: 16,
    padding: 20,
  },
  insightBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7D5A00",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: C.textPrimary,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  insightText: {
    fontSize: 14,
    fontWeight: 300,
    color: "#444",
    lineHeight: 1.7,
  },

  // Leaderboard
  leaderboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rankBadge: {
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: C.yellow,
    color: C.textPrimary,
    padding: "4px 12px",
    borderRadius: 50,
  },
  leaderRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 4,
    gap: 10,
  },
  leaderRank: {
    fontSize: 14,
    minWidth: 28,
    textAlign: "center",
  },
  leaderName: {
    flex: 1,
    fontSize: 14,
    color: C.textPrimary,
  },
  leaderRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  leaderScore: {
    fontSize: 14,
    fontWeight: 700,
    color: C.petrol,
  },
  leaderStreak: {
    fontSize: 12,
    color: C.textMuted,
  },

  // Tomorrow card
  tomorrowCard: {
    backgroundColor: C.petrol,
    borderRadius: 16,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 16,
    color: C.surface,
  },
  tomorrowTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.surface,
    marginBottom: 2,
  },
  tomorrowSub: {
    fontSize: 13,
    fontWeight: 300,
    color: "rgba(255,255,255,0.65)",
  },
};
