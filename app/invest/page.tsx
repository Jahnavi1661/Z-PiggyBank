"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Concept {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  difficulty: "Beginner" | "Intermediate";
  readTime: string;
  xp: number;
  summary: string;
  body: string[];
  example: { label: string; result: string };
  tags: string[];
}

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

interface UserProgress {
  completedConcepts: string[];
  xpEarned: number;
  level: number;
  streakDays: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS  (Birdwingo-inspired neo-brutalist palette)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  yellow:   "#E8F900",
  cyan:     "#00D4E8",
  pink:     "#FF6FD8",
  purple:   "#C8B4FF",
  green:    "#72F7AE",
  black:    "#0A0A0A",
  white:    "#FFFFFF",
  offwhite: "#F5F4EE",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (TODO: replace with → supabase.from('invest_concepts').select('*'))
// ─────────────────────────────────────────────────────────────────────────────
const CONCEPTS: Concept[] = [
  {
    id: "sip", emoji: "📅", title: "SIP",
    subtitle: "Systematic Investment Plan", color: C.yellow,
    difficulty: "Beginner", readTime: "3 min", xp: 50,
    summary: "Invest a fixed amount every month automatically — like an EMI, but for your future self.",
    body: [
      "A SIP lets you invest ₹500, ₹1,000 or any fixed amount every month into a mutual fund.",
      "Because you invest regularly, you buy more units when prices are low — this is Rupee Cost Averaging.",
      "Over time, compounding turns even small monthly amounts into serious wealth.",
      "SIPs are the #1 recommended way for beginners to start investing in India.",
    ],
    example: { label: "₹1,000/month for 10 years @ 12%", result: "≈ ₹2.32 L invested → ₹4.0 L total" },
    tags: ["mutual funds", "monthly", "beginner"],
  },
  {
    id: "mutual-funds", emoji: "🧺", title: "Mutual Funds",
    subtitle: "Pooled investment vehicles", color: C.cyan,
    difficulty: "Beginner", readTime: "4 min", xp: 60,
    summary: "A basket of stocks/bonds managed by a professional. You own a small slice of everything inside.",
    body: [
      "Your money is pooled with thousands of other investors.",
      "A professional fund manager picks which stocks or bonds to buy.",
      "You get diversification — owning a tiny piece of 50–200 companies — with as little as ₹100.",
      "Historically, equity mutual funds have given 10–14% annual returns in India.",
    ],
    example: { label: "Nifty 50 Index Fund over 15 years", result: "₹5,000/month → ≈ ₹25 Lakhs" },
    tags: ["diversification", "managed", "equity"],
  },
  {
    id: "index-funds", emoji: "📊", title: "Index Funds",
    subtitle: "Track the market, don't beat it", color: C.pink,
    difficulty: "Beginner", readTime: "3 min", xp: 50,
    summary: "This fund just copies an index like Nifty 50. Lower fees, consistent returns.",
    body: [
      "An index fund automatically holds all stocks in an index — e.g. Nifty 50 = top 50 Indian companies.",
      "No expensive fund manager = lower expense ratios. Often 0.1–0.5% vs 1–2% for active funds.",
      "Research shows most actively managed funds underperform their index over 10+ years.",
      "Warren Buffett himself recommends index funds for everyday investors.",
    ],
    example: { label: "UTI Nifty 50 Index Fund (Direct)", result: "Expense ratio: 0.2% | 10Y CAGR: ~13%" },
    tags: ["passive", "low-cost", "nifty"],
  },
  {
    id: "compound-interest", emoji: "⚡", title: "Compounding",
    subtitle: "The 8th wonder of the world", color: C.purple,
    difficulty: "Beginner", readTime: "2 min", xp: 40,
    summary: "Earning returns on your returns. The longer you stay invested, the more explosive your growth.",
    body: [
      "Compounding = your returns also earn returns. ₹10,000 at 12% → ₹11,200 in year 1. That ₹1,200 also earns 12% in year 2.",
      "Rule of 72: divide 72 by your return rate to find years to double. At 12%, money doubles every 6 years.",
      "Starting 10 years earlier can double your final corpus even investing the same total amount.",
      "Time in the market > timing the market.",
    ],
    example: { label: "₹1 Lakh invested at 12% CAGR", result: "10 yrs → ₹3.1L | 20 yrs → ₹9.6L | 30 yrs → ₹29.9L" },
    tags: ["core concept", "time", "returns"],
  },
  {
    id: "diversification", emoji: "🌐", title: "Diversification",
    subtitle: "Don't put all eggs in one basket", color: C.green,
    difficulty: "Intermediate", readTime: "3 min", xp: 55,
    summary: "Spreading money across different asset types so one bad investment can't wipe you out.",
    body: [
      "Diversification = investing in different sectors, asset classes, and geographies.",
      "If one stock crashes 80%, a diversified portfolio might only drop 5–10%.",
      "Common beginner split: 80% equity (growth) + 20% debt (stability).",
      "As you age, shift more toward debt for capital preservation.",
    ],
    example: { label: "Sample beginner portfolio", result: "60% index fund + 25% debt fund + 15% gold ETF" },
    tags: ["risk management", "portfolio", "balance"],
  },
  {
    id: "risk", emoji: "⚖️", title: "Risk vs Return",
    subtitle: "Higher return = higher risk (always)", color: C.yellow,
    difficulty: "Intermediate", readTime: "4 min", xp: 65,
    summary: "Every investment has a risk level. Understanding yours helps you pick the right type of fund.",
    body: [
      "Risk = the chance your investment loses value temporarily or permanently.",
      "Equity (stocks) = high risk, high potential return (10–18% long-term).",
      "Debt funds = low risk, stable return (6–8%). Good for short-term goals.",
      "Liquid funds = almost no risk, ~4–5%. Better than savings account for your emergency fund.",
    ],
    example: { label: "Risk ladder", result: "Savings → Liquid → Debt → Hybrid → Index → Small Cap" },
    tags: ["core concept", "equity", "debt"],
  },
];

// TODO: replace with → supabase.from('invest_quizzes').select('*').eq('concept_id', id)
const QUIZZES: Record<string, QuizQuestion[]> = {
  sip: [
    { q: "What does SIP stand for?", options: ["Standard Investment Protocol", "Systematic Investment Plan", "Stock Index Portfolio", "Savings Interest Plan"], answer: 1, explain: "SIP = Systematic Investment Plan. You invest a fixed amount at regular intervals." },
    { q: "What is Rupee Cost Averaging?", options: ["Buying only when prices are low", "Investing in USD instead of INR", "Buying more units when cheap, fewer when expensive — by investing regularly", "Getting a fixed rupee return every year"], answer: 2, explain: "Because you invest the same amount every month, you automatically buy more units when prices dip." },
  ],
  "mutual-funds": [
    { q: "What does a fund manager do?", options: ["They guarantee your returns", "They pick which stocks/bonds to buy on your behalf", "They give you a loan", "They file your taxes"], answer: 1, explain: "A fund manager professionally manages the pooled money by selecting investments." },
  ],
  "index-funds": [
    { q: "Why are index funds cheaper than active funds?", options: ["They only invest in cheap stocks", "They don't need an expensive manager — they just copy an index", "They're government-backed", "They skip brokerage fees"], answer: 1, explain: "No active management = much lower expense ratios. Those saved fees compound hugely over time." },
  ],
  "compound-interest": [
    { q: "Using the Rule of 72, how many years to double at 12%?", options: ["12 years", "8 years", "6 years", "4 years"], answer: 2, explain: "72 ÷ 12 = 6. Your money doubles every 6 years at 12% annual return." },
  ],
  diversification: [
    { q: "Which is most diversified for a beginner?", options: ["100% in one stock you believe in", "50% index fund + 30% debt + 20% gold ETF", "100% in savings account", "All in crypto"], answer: 1, explain: "Mixing equity, debt, and gold spreads risk across asset classes with different behaviour." },
  ],
  risk: [
    { q: "Which is the LOWEST risk option?", options: ["Small Cap Equity Fund", "Liquid Fund", "Cryptocurrency", "Direct Stocks"], answer: 1, explain: "Liquid funds invest in very short-term government securities — almost zero risk, ~4–5% return." },
  ],
};

const GLOSSARY = [
  { term: "NAV (Net Asset Value)",             def: "The price per unit of a mutual fund. Calculated daily as total fund assets ÷ number of units." },
  { term: "CAGR",                              def: "Compound Annual Growth Rate — the rate at which an investment grows year-over-year assuming compounding. Best metric to compare returns." },
  { term: "Expense Ratio",                     def: "Annual fee a mutual fund charges to manage your money. 0.1% = index fund. 1–2% = active fund. Lower is better." },
  { term: "Lump Sum",                          def: "Investing a large one-time amount all at once, as opposed to SIP which spreads it monthly." },
  { term: "Asset Allocation",                  def: "How you split your portfolio between equity, debt, gold, real estate, etc." },
  { term: "Bull Market / Bear Market",         def: "Bull = prices rising. Bear = prices falling. Both are normal parts of every market cycle." },
  { term: "Equity",                            def: "Ownership in a company. Buying equity = buying shares. Higher return potential but more volatile." },
  { term: "Debt Fund",                         def: "Mutual fund that invests in bonds/loans. More stable than equity. Good for 1–3 year goals." },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function QuizBlock({ conceptId, onComplete }: { conceptId: string; onComplete: (score: number) => void }) {
  const questions = QUIZZES[conceptId] ?? [];
  const [idx,         setIdx]         = useState(0);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [score,       setScore]       = useState(0);
  const [done,        setDone]        = useState(false);

  if (!questions.length) return null;
  const q = questions[idx];

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setShowExplain(true);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    const finalScore = score + (selected === q.answer ? 1 : 0);
    if (idx + 1 >= questions.length) { setDone(true); onComplete(finalScore); }
    else { setIdx((x) => x + 1); setSelected(null); setShowExplain(false); }
  }

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: C.green, border: `2.5px solid ${C.black}`, borderRadius: 24, padding: "32px 28px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
      <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Quiz Complete!</h3>
      <p style={{ fontSize: 15, fontWeight: 600, opacity: 0.7 }}>{score}/{questions.length} correct</p>
    </motion.div>
  );

  return (
    <div style={{ background: C.offwhite, border: `2.5px solid ${C.black}`, borderRadius: 24, padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", opacity: 0.45 }}>Q {idx + 1}/{questions.length}</span>
        <span style={{ background: C.yellow, color: C.black, fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 99, border: `1.5px solid ${C.black}` }}>QUIZ ⚡</span>
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 18 }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg     = C.white;
          let border = `2px solid ${C.black}`;
          if (selected !== null) {
            if      (i === q.answer)                         { bg = C.green;   }
            else if (i === selected && i !== q.answer)       { bg = "#FFB3B3"; }
            else                                             { border = `2px solid rgba(0,0,0,0.15)`; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              background: bg, border, borderRadius: 13, padding: "12px 16px",
              textAlign: "left", fontWeight: 700, fontSize: 14,
              cursor: selected !== null ? "default" : "pointer",
              fontFamily: "inherit", transition: "background 0.2s",
            }}>
              <span style={{ opacity: 0.4, marginRight: 8 }}>{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {showExplain && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: 16, background: C.cyan, border: `2px solid ${C.black}`, borderRadius: 14, padding: "13px 16px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>💡 {q.explain}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {selected !== null && (
        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={next}
          style={{ marginTop: 14, width: "100%", background: C.black, color: C.yellow, border: "none", borderRadius: 13, padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          {idx + 1 >= questions.length ? "Finish Quiz 🎉" : "Next →"}
        </motion.button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIP CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
function SIPCalculator() {
  const [monthly, setMonthly] = useState(1000);
  const [years,   setYears]   = useState(10);
  const [rate,    setRate]    = useState(12);

  const r        = rate / 100 / 12;
  const n        = years * 12;
  const fv       = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains    = fv - invested;
  const gainPct  = Math.round((gains / invested) * 100);
  const barW     = Math.round((invested / fv) * 100);

  const sliders = [
    { label: "Monthly Investment",     val: monthly, set: setMonthly, min: 100,  max: 50000, step: 100, fmt: (v: number) => `₹${v.toLocaleString()}` },
    { label: "Time Period",            val: years,   set: setYears,   min: 1,    max: 40,    step: 1,   fmt: (v: number) => `${v} yrs` },
    { label: "Expected Annual Return", val: rate,    set: setRate,    min: 1,    max: 30,    step: 0.5, fmt: (v: number) => `${v}%` },
  ];

  return (
    <div style={{ background: C.black, border: `3px solid ${C.black}`, borderRadius: 32, padding: "40px 36px", color: C.white, boxShadow: `6px 8px 0 ${C.black}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
        <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" }}>SIP Calculator</h3>
        <span style={{ background: C.yellow, color: C.black, borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 800, border: `1.5px solid ${C.yellow}` }}>INTERACTIVE</span>
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 36 }}>
        {sliders.map(({ label, val, set, min, max, step, fmt }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.6 }}>{label}</span>
              <span style={{ background: C.yellow, color: C.black, borderRadius: 10, padding: "4px 14px", fontSize: 15, fontWeight: 800 }}>{fmt(val)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.yellow, height: 6, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, opacity: 0.25 }}>
              <span style={{ fontSize: 11 }}>{fmt(min)}</span>
              <span style={{ fontSize: 11 }}>{fmt(max)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Result cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {([
          { label: "Invested",     val: formatINR(invested), bg: "rgba(255,255,255,0.06)", color: C.white },
          { label: "Est. Returns", val: formatINR(gains),    bg: C.green,                  color: C.black },
          { label: "Total Value",  val: formatINR(fv),       bg: C.yellow,                 color: C.black },
        ] as const).map(({ label, val, bg, color }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid rgba(255,255,255,0.1)`, borderRadius: 18, padding: "16px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.6, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Visual bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.45 }}>Invested vs Returns</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.green }}>+{gainPct}% growth</span>
        </div>
        <div style={{ height: 18, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden", display: "flex" }}>
          <motion.div animate={{ width: `${barW}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: "100%", background: C.white, borderRadius: "99px 0 0 99px" }} />
          <motion.div animate={{ width: `${100 - barW}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: "100%", background: C.green }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {([[C.white, "Invested"], [C.green, "Returns"]] as [string, string][]).map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.5 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, opacity: 0.3, lineHeight: 1.55, marginTop: 24 }}>
        ⚠️ Educational estimate only. Actual returns vary. Z-PiggyBank does not provide financial advice.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOSSARY ITEM
// ─────────────────────────────────────────────────────────────────────────────
function GlossaryItem({ term, def }: { term: string; def: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen((o) => !o)} style={{
      border: `2.5px solid ${C.black}`, borderRadius: 18, overflow: "hidden",
      cursor: "pointer", background: open ? C.yellow : C.white,
      transition: "background 0.18s", boxShadow: open ? `3px 4px 0 ${C.black}` : "none",
    }}>
      <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>{term}</span>
        <span style={{ fontWeight: 800, fontSize: 20, transition: "transform 0.2s", display: "block", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 22px 18px", fontSize: 14, lineHeight: 1.65, fontWeight: 500, opacity: 0.72 }}>{def}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ConceptCard({ concept, isCompleted, onClick }: { concept: Concept; isCompleted: boolean; onClick: (c: Concept) => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `6px 8px 0 ${C.black}` }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(concept)}
      style={{
        background: isCompleted ? concept.color : C.white,
        border: `2.5px solid ${C.black}`, borderRadius: 26,
        padding: "28px 24px", cursor: "pointer", position: "relative",
        boxShadow: isCompleted ? `4px 5px 0 ${C.black}` : `2px 3px 0 ${C.black}`,
        transition: "box-shadow 0.18s, transform 0.18s",
      }}
    >
      {isCompleted && (
        <div style={{ position: "absolute", top: 14, right: 14, background: C.black, color: C.white, borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 800 }}>✓ DONE</div>
      )}
      <div style={{ fontSize: 38, marginBottom: 14 }}>{concept.emoji}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ background: C.black, color: C.white, borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{concept.difficulty}</span>
        <span style={{ border: `1.5px solid ${C.black}`, borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 700, opacity: 0.5 }}>{concept.readTime} read</span>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>{concept.title}</h3>
      <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, marginBottom: 12 }}>{concept.subtitle}</p>
      <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7, fontWeight: 500 }}>{concept.summary}</p>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1.5px solid ${C.black}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55 }}>+{concept.xp} XP</span>
        <span style={{ background: C.black, color: C.yellow, borderRadius: 12, padding: "7px 18px", fontSize: 13, fontWeight: 800 }}>Learn →</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
interface DetailProps { concept: Concept; isCompleted: boolean; onClose: () => void; onMarkDone: (c: Concept) => void; }

function ConceptDetail({ concept, isCompleted, onClose, onMarkDone }: DetailProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizDone,    setQuizDone]    = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,10,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.offwhite, borderRadius: "32px 32px 0 0",
          border: `3px solid ${C.black}`, borderBottom: "none",
          width: "100%", maxWidth: 720, maxHeight: "92vh", overflowY: "auto",
          padding: "36px 32px 60px",
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: "rgba(0,0,0,0.15)", borderRadius: 99, margin: "0 auto 28px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 58, height: 58, background: concept.color, border: `2.5px solid ${C.black}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{concept.emoji}</div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em" }}>{concept.title}</h2>
              <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.45, marginTop: 2 }}>{concept.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: C.black, color: C.white, border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 16, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Tags + XP */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {concept.tags.map((t) => (
            <span key={t} style={{ background: C.white, border: `1.5px solid ${C.black}`, borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 700, opacity: 0.65 }}>#{t}</span>
          ))}
          <span style={{ background: C.yellow, border: `1.5px solid ${C.black}`, borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 800 }}>+{concept.xp} XP</span>
        </div>

        {/* Summary callout */}
        <div style={{ background: concept.color, border: `2px solid ${C.black}`, borderRadius: 20, padding: "18px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.6 }}>{concept.summary}</p>
        </div>

        {/* Body points */}
        <div style={{ marginBottom: 24 }}>
          {concept.body.map((para, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12, padding: "14px 16px", background: C.white, border: `1.5px solid ${C.black}`, borderRadius: 16 }}>
              <span style={{ minWidth: 26, height: 26, background: C.black, color: C.yellow, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <p style={{ fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{para}</p>
            </div>
          ))}
        </div>

        {/* Example */}
        <div style={{ background: C.black, color: C.white, border: `2.5px solid ${C.black}`, borderRadius: 20, padding: "20px 22px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 8 }}>REAL EXAMPLE</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.65, marginBottom: 6 }}>{concept.example.label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.yellow }}>{concept.example.result}</div>
        </div>

        {/* Quiz */}
        {(QUIZZES[concept.id]?.length ?? 0) > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Test Your Knowledge</h4>
              {!quizStarted && (
                <button onClick={() => setQuizStarted(true)} style={{ background: C.purple, color: C.black, border: `2px solid ${C.black}`, borderRadius: 12, padding: "8px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Start Quiz ⚡
                </button>
              )}
            </div>
            {quizStarted && !quizDone && <QuizBlock conceptId={concept.id} onComplete={() => setQuizDone(true)} />}
          </div>
        )}

        {/* CTA */}
        {!isCompleted ? (
          <button onClick={() => { onMarkDone(concept); onClose(); }} style={{ width: "100%", background: C.black, color: C.yellow, border: `2.5px solid ${C.black}`, borderRadius: 18, padding: "16px", fontWeight: 800, fontSize: 17, cursor: "pointer", fontFamily: "inherit", boxShadow: `4px 5px 0 rgba(0,0,0,0.25)` }}>
            Mark as Learned ✓ (+{concept.xp} XP)
          </button>
        ) : (
          <div style={{ width: "100%", background: C.green, color: C.black, border: `2.5px solid ${C.black}`, borderRadius: 18, padding: "16px", fontWeight: 800, fontSize: 17, textAlign: "center" }}>
            ✓ Completed — +{concept.xp} XP earned
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
const TABS = ["Learn", "SIP Calculator", "Glossary"] as const;
type Tab  = (typeof TABS)[number];
type Diff = "All" | "Beginner" | "Intermediate";

// TODO: replace with → supabase.from('user_invest_progress').select('*').eq('user_id', userId)
const MOCK_PROGRESS: UserProgress = { completedConcepts: ["sip", "compound-interest"], xpEarned: 90, level: 3, streakDays: 4 };
const TOTAL_XP = CONCEPTS.reduce((s, c) => s + c.xp, 0);

export default function InvestPage() {
  const [progress,         setProgress]         = useState<UserProgress>(MOCK_PROGRESS);
  const [activeTab,        setActiveTab]        = useState<Tab>("Learn");
  const [selectedConcept,  setSelectedConcept]  = useState<Concept | null>(null);
  const [filter,           setFilter]           = useState<Diff>("All");

  // TODO: supabase.from('user_invest_progress').upsert({ user_id, concept_id, completed: true, xp_earned })
  function markDone(concept: Concept) {
    if (progress.completedConcepts.includes(concept.id)) return;
    setProgress((p) => ({
      ...p,
      completedConcepts: [...p.completedConcepts, concept.id],
      xpEarned: p.xpEarned + concept.xp,
      level: Math.floor((p.xpEarned + concept.xp) / 100) + 1,
    }));
  }

  const filtered       = filter === "All" ? CONCEPTS : CONCEPTS.filter((c) => c.difficulty === filter);
  const completedCount = progress.completedConcepts.length;
  const xpPct          = Math.round((progress.xpEarned / TOTAL_XP) * 100);

  return (
    <div style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: C.offwhite, color: C.black, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.15); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${C.yellow}; border: 2.5px solid ${C.black}; cursor: pointer; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 99px; }
        .concept-grid  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        .result-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-strip    { display: flex; gap: 20px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .concept-grid  { grid-template-columns: 1fr !important; }
          .result-grid   { grid-template-columns: 1fr 1fr !important; }
          .stat-strip    { flex-direction: column; }
          h1             { font-size: 42px !important; }
        }
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────────────────────── */}
      <div style={{ background: C.black, borderBottom: `3px solid ${C.black}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontSize: 22 }}>🐷</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: C.yellow }}>Z-PiggyBank</span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 16, marginLeft: 2 }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 600 }}>Safe Investing</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ background: C.yellow, color: C.black, borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 800 }}>⚡ {progress.xpEarned} XP</span>
            <span style={{ background: C.pink,   color: C.black, borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 800 }}>LVL {progress.level}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "44px 24px 80px" }}>

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 44 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ display: "inline-block", background: C.green, border: `2px solid ${C.black}`, borderRadius: 40, padding: "6px 18px", fontWeight: 800, fontSize: 12, letterSpacing: "0.07em", marginBottom: 18 }}>
              BEGINNER FINANCE 📈
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            style={{ fontSize: "clamp(40px, 6.5vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.93, marginBottom: 18 }}>
            Safe Investing,<br />
            <span style={{ background: C.yellow, padding: "2px 8px", borderRadius: 10 }}>Zero Jargon.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.13 }}
            style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.65, opacity: 0.6, maxWidth: 500 }}>
            Learn SIPs, mutual funds, compounding and more — one card at a time. Complete lessons, earn XP, level up your financial IQ.
          </motion.p>
        </div>

        {/* ── PROGRESS CARD ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ background: C.black, border: `2.5px solid ${C.black}`, borderRadius: 28, padding: "28px 30px", marginBottom: 40, color: C.white, boxShadow: `5px 6px 0 rgba(0,0,0,0.3)` }}>
          <div className="stat-strip" style={{ marginBottom: 22 }}>
            {([
              { label: "Concepts Learned", val: `${completedCount} / ${CONCEPTS.length}`, color: C.yellow },
              { label: "XP Earned",        val: `${progress.xpEarned} / ${TOTAL_XP}`,     color: C.green  },
              { label: "Current Level",    val: `Level ${progress.level}`,                color: C.pink   },
              { label: "🔥 Streak",        val: `${progress.streakDays} days`,            color: C.cyan   },
            ] as const).map(({ label, val, color }) => (
              <div key={label} style={{ flex: 1, minWidth: 110 }}>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.4, marginBottom: 5 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.4 }}>Overall Progress</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.yellow }}>{xpPct}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 12, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
              style={{ height: "100%", background: C.yellow, borderRadius: 99 }} />
          </div>
        </motion.div>

        {/* ── TABS ───────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? C.black : C.white,
              color:      activeTab === tab ? C.yellow : C.black,
              border: `2.5px solid ${C.black}`, borderRadius: 40,
              padding: "10px 26px", fontWeight: 800, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: activeTab === tab ? `3px 4px 0 rgba(0,0,0,0.3)` : `2px 3px 0 ${C.black}`,
              transition: "all 0.15s",
            }}>{tab}</button>
          ))}
        </div>

        {/* ── LEARN TAB ──────────────────────────────────────────────────── */}
        {activeTab === "Learn" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Difficulty filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
              {(["All", "Beginner", "Intermediate"] as Diff[]).map((d) => (
                <button key={d} onClick={() => setFilter(d)} style={{
                  background: filter === d ? C.yellow : "transparent",
                  border: `1.5px solid ${C.black}`, borderRadius: 99,
                  padding: "6px 18px", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: filter === d ? `2px 3px 0 ${C.black}` : "none",
                }}>{d}</button>
              ))}
            </div>

            <div className="concept-grid">
              {filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <ConceptCard concept={c} isCompleted={progress.completedConcepts.includes(c.id)} onClick={setSelectedConcept} />
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ marginTop: 32, background: C.white, border: `2px solid ${C.black}`, borderRadius: 20, padding: "18px 22px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.5, lineHeight: 1.6 }}>
                ⚠️ <strong style={{ opacity: 1 }}>Educational Only.</strong> Z-PiggyBank provides financial literacy content only. We do not provide investment advice or manage funds. Please consult a SEBI-registered financial advisor before investing.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── SIP CALCULATOR TAB ─────────────────────────────────────────── */}
        {activeTab === "SIP Calculator" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <SIPCalculator />
          </motion.div>
        )}

        {/* ── GLOSSARY TAB ───────────────────────────────────────────────── */}
        {activeTab === "Glossary" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Finance Glossary</h3>
              <p style={{ fontSize: 14, fontWeight: 500, opacity: 0.55 }}>Every term explained simply. Tap to expand.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {GLOSSARY.map(({ term, def }) => <GlossaryItem key={term} term={term} def={def} />)}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── CONCEPT DETAIL DRAWER ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedConcept && (
          <ConceptDetail
            concept={selectedConcept}
            isCompleted={progress.completedConcepts.includes(selectedConcept.id)}
            onClose={() => setSelectedConcept(null)}
            onMarkDone={markDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
}