"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  yellow: "#dff770",
  pink: "#ff93d5",
  cyan: "#bdeef5",
  green: "#b9ffcf",
  black: "#0A0A0A",
  white: "#FFFFFF",
  offwhite: "#F8F7F0",
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const CONCEPTS = [
  { id: "sip", emoji: "📅", title: "SIP", subtitle: "Systematic Investment Plan", difficulty: "Beginner", xp: 50, summary: "Invest fixed amount every month automatically.", color: C.yellow },
  { id: "mutual-funds", emoji: "🧺", title: "Mutual Funds", subtitle: "Pooled investment vehicles", difficulty: "Beginner", xp: 60, summary: "A basket of stocks managed by professionals.", color: C.cyan },
  { id: "index-funds", emoji: "📊", title: "Index Funds", subtitle: "Track the market", difficulty: "Beginner", xp: 50, summary: "Low-cost funds that copy Nifty 50.", color: C.pink },
  { id: "compound-interest", emoji: "⚡", title: "Compounding", subtitle: "The 8th wonder", difficulty: "Beginner", xp: 40, summary: "Returns on your returns.", color: C.green },
  { id: "diversification", emoji: "🌐", title: "Diversification", subtitle: "Don't put all eggs in one basket", difficulty: "Intermediate", xp: 55, summary: "Spreading risk across assets.", color: C.yellow },
  { id: "risk", emoji: "⚖️", title: "Risk vs Return", subtitle: "Higher return = higher risk", difficulty: "Intermediate", xp: 65, summary: "Understanding different risk levels.", color: C.pink },
];

const QUIZZES = {
  sip: [{ q: "What does SIP stand for?", options: ["Standard Investment Protocol", "Systematic Investment Plan", "Stock Index Portfolio"], answer: 1, explain: "SIP = Systematic Investment Plan." }],
  "mutual-funds": [{ q: "What does a fund manager do?", options: ["Guarantee returns", "Pick stocks for you", "Give loans"], answer: 1, explain: "They professionally manage the fund." }],
  // Add more quizzes as needed...
};

const GLOSSARY = [
  { term: "NAV", def: "Net Asset Value - Price per unit of a mutual fund." },
  { term: "CAGR", def: "Compound Annual Growth Rate - Best way to compare returns." },
  { term: "Expense Ratio", def: "Annual fee charged by the fund." },
];

// ─────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────
function SIPCalculator() {
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const r = rate / 100 / 12;
  const n = years * 12;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains = fv - invested;

  return (
    <div className="bg-black text-white rounded-3xl p-10 border-4 border-black">
      <h3 className="text-3xl font-bold mb-8">SIP Calculator</h3>
      {/* Add sliders and results here (simplified for now) */}
      <p className="text-lg">Monthly: ₹{monthly} | Years: {years} | Expected Return: {rate}%</p>
      <p className="text-2xl mt-6">Final Amount: ₹{Math.round(fv).toLocaleString()}</p>
    </div>
  );
}

function GlossaryItem({ term, def }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="border-2 border-black rounded-2xl bg-white p-6 cursor-pointer hover:bg-[#dff770] transition-all"
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{term}</span>
        <span className="text-2xl transition-transform">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="mt-4 text-gray-700">{def}</p>}
    </div>
  );
}

function ConceptDetail({ concept, isCompleted, onClose, onMarkDone }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-t-3xl border-t-4 border-black p-8 max-h-[90vh] overflow-auto"
        >
          <button onClick={onClose} className="float-right text-2xl">✕</button>
          <div className="text-6xl mb-4">{concept.emoji}</div>
          <h2 className="text-4xl font-bold">{concept.title}</h2>
          <p className="text-xl opacity-70">{concept.subtitle}</p>

          <div className="mt-8">
            <p className="text-lg">{concept.summary}</p>
          </div>

          {!isCompleted && (
            <button
              onClick={() => { onMarkDone(concept); onClose(); }}
              className="mt-10 w-full bg-black text-white py-5 rounded-2xl text-xl font-bold hover:bg-[#dff770] hover:text-black transition-all"
            >
              Mark as Learned (+{concept.xp} XP)
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SafeInvesting() {
  const [progress, setProgress] = useState({
    completedConcepts: ["sip", "compound-interest"],
    xpEarned: 90,
    level: 3,
    streakDays: 4,
  });

  const [activeTab, setActiveTab] = useState("Learn");
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [filter, setFilter] = useState("All");

  function markDone(concept) {
    if (progress.completedConcepts.includes(concept.id)) return;
    setProgress((p) => ({
      ...p,
      completedConcepts: [...p.completedConcepts, concept.id],
      xpEarned: p.xpEarned + concept.xp,
      level: Math.floor((p.xpEarned + concept.xp) / 100) + 1,
    }));
  }

  const filtered = filter === "All" 
    ? CONCEPTS 
    : CONCEPTS.filter((c) => c.difficulty === filter);

  return (
    <div className="min-h-screen bg-[#bdeef5] font-['Space_Grotesk'] text-[#111]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 mx-auto mt-6 max-w-[92%] rounded-[30px] bg-[#dff770] px-8 py-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-black text-3xl">🐷</div>
            <h2 className="text-3xl font-bold">Z-PiggyBank</h2>
          </div>
          <div className="flex gap-4">
            <div className="rounded-full bg-black px-5 py-2 text-sm font-bold text-[#dff770]">⚡ {progress.xpEarned} XP</div>
            <div className="rounded-full bg-[#ff93d5] px-5 py-2 text-sm font-bold">LVL {progress.level}</div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto pt-32 px-6 pb-20">
        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
          Safe Investing<br />
          <span className="text-[#ff93d5]">Made Fun</span>
        </h1>
        <p className="text-xl mt-4 max-w-md">Learn finance concepts without the boring lectures.</p>

        {/* Progress */}
        <div className="mt-12 bg-white border-4 border-black rounded-3xl p-8">
          <div className="flex justify-between mb-4 font-bold">
            <span>Your Progress</span>
            <span className="text-[#ff93d5]">{Math.round((progress.xpEarned / 500) * 100)}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.xpEarned / 500) * 100}%` }}
              className="h-full bg-[#dff770]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-12 mb-8 flex-wrap">
          {["Learn", "SIP Calculator", "Glossary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-2xl font-bold border-2 border-black transition-all ${
                activeTab === tab ? "bg-black text-white" : "bg-white hover:bg-[#dff770]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "Learn" && (
          <div>
            <div className="flex gap-3 mb-8">
              {["All", "Beginner", "Intermediate"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-6 py-3 rounded-full border-2 border-black font-bold ${
                    filter === d ? "bg-[#dff770]" : "bg-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((concept) => (
                <motion.div
                  key={concept.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedConcept(concept)}
                  className="cursor-pointer border-4 border-black rounded-3xl p-8 bg-white hover:bg-[#dff770] transition-all"
                >
                  <div className="text-6xl mb-6">{concept.emoji}</div>
                  <h3 className="text-3xl font-bold">{concept.title}</h3>
                  <p className="mt-2 opacity-70">{concept.subtitle}</p>
                  <div className="mt-8 flex justify-between">
                    <span className="font-bold">+{concept.xp} XP</span>
                    <span className="bg-black text-white px-6 py-3 rounded-2xl">Learn →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "SIP Calculator" && <SIPCalculator />}
        {activeTab === "Glossary" && (
          <div className="space-y-4">
            {GLOSSARY.map((item) => (
              <GlossaryItem key={item.term} term={item.term} def={item.def} />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
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