"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  color: string;
  deadline: string | null; // ISO date
  createdAt: string;
}

interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  note: string;
}

interface StreakData {
  current: number;
  longest: number;
  lastSavedDate: string | null;
  history: string[]; // ISO dates with at least one contribution
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  yellow:   "#E8F900",
  cyan:     "#00D4E8",
  pink:     "#FF6FD8",
  purple:   "#C8B4FF",
  green:    "#72F7AE",
  red:      "#FF6B6B",
  black:    "#0A0A0A",
  white:    "#FFFFFF",
  offwhite: "#F5F4EE",
} as const;

const GOAL_COLORS = [C.yellow, C.cyan, C.pink, C.purple, C.green, "#FFB347"];
const GOAL_EMOJIS = ["🎯","💻","✈️","🎮","🏠","👟","📱","🎸","🏍️","💍","🎓","🌴"];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
function uid() { return Math.random().toString(36).slice(2, 9); }

function formatINR(n: number) {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)   return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString()}`;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - new Date(today()).getTime();
  return Math.ceil(diff / 86400000);
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (TODO: replace with supabase.from('goals').select('*').eq('user_id', userId))
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_GOALS: Goal[] = [
  { id: "g1", name: "MacBook Air M3", emoji: "💻", target: 110000, saved: 79200, color: C.cyan,   deadline: daysAgo(-90),  createdAt: daysAgo(60) },
  { id: "g2", name: "Trip to Japan",  emoji: "✈️", target: 150000, saved: 32000, color: C.pink,   deadline: daysAgo(-200), createdAt: daysAgo(40) },
  { id: "g3", name: "Emergency Fund", emoji: "🎯", target: 50000,  saved: 50000, color: C.green,  deadline: null,          createdAt: daysAgo(120) },
  { id: "g4", name: "Gaming Setup",   emoji: "🎮", target: 60000,  saved: 18500, color: C.purple, deadline: daysAgo(-60),  createdAt: daysAgo(20) },
];

// TODO: replace with supabase.from('contributions').select('*').eq('user_id', userId)
const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: "c1", goalId: "g1", amount: 1000, date: today(),     note: "Daily save" },
  { id: "c2", goalId: "g3", amount: 500,  date: today(),     note: "Daily save" },
  { id: "c3", goalId: "g1", amount: 1000, date: daysAgo(1),  note: "Daily save" },
  { id: "c4", goalId: "g4", amount: 800,  date: daysAgo(1),  note: "Pocket money" },
  { id: "c5", goalId: "g1", amount: 1000, date: daysAgo(2),  note: "Daily save" },
  { id: "c6", goalId: "g2", amount: 2000, date: daysAgo(2),  note: "Freelance gig" },
  { id: "c7", goalId: "g1", amount: 1000, date: daysAgo(3),  note: "Daily save" },
  { id: "c8", goalId: "g1", amount: 1000, date: daysAgo(4),  note: "Daily save" },
  { id: "c9", goalId: "g4", amount: 500,  date: daysAgo(5),  note: "Daily save" },
  { id: "c10",goalId: "g1", amount: 1000, date: daysAgo(6),  note: "Daily save" },
];

// TODO: replace with supabase.from('user_streaks').select('*').eq('user_id', userId)
const MOCK_STREAK: StreakData = {
  current: 7,
  longest: 23,
  lastSavedDate: today(),
  history: [today(), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(6)],
};

// ─────────────────────────────────────────────────────────────────────────────
// STREAK HEATMAP (last 35 days)
// ─────────────────────────────────────────────────────────────────────────────
function StreakHeatmap({ history }: { history: string[] }) {
  const days = useMemo(() => {
    const arr: { date: string; active: boolean }[] = [];
    for (let i = 34; i >= 0; i--) {
      const d = daysAgo(i);
      arr.push({ date: d, active: history.includes(d) });
    }
    return arr;
  }, [history]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {days.map(({ date, active }, i) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.012 }}
            title={date}
            style={{
              aspectRatio: "1", borderRadius: 6,
              background: active ? C.green : "rgba(255,255,255,0.08)",
              border: active ? `1.5px solid ${C.black}` : "1.5px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, fontWeight: 700, opacity: 0.4 }}>
        <span>5 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE GOAL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
interface CreateGoalDrawerProps { onCreate: (g: Goal) => void; onClose: () => void; }

function CreateGoalDrawer({ onCreate, onClose }: CreateGoalDrawerProps) {
  const [name,     setName]     = useState("");
  const [target,   setTarget]   = useState("");
  const [emoji,    setEmoji]    = useState(GOAL_EMOJIS[0]);
  const [color,    setColor]    = useState(GOAL_COLORS[0]);
  const [deadline, setDeadline] = useState("");
  const [error,    setError]    = useState("");

  function submit() {
    if (!name.trim()) { setError("Give your goal a name"); return; }
    const t = parseFloat(target);
    if (!target || isNaN(t) || t <= 0) { setError("Enter a valid target amount"); return; }

    const goal: Goal = {
      id: uid(), name: name.trim(), emoji, target: t, saved: 0,
      color, deadline: deadline || null, createdAt: today(),
    };
    // TODO: supabase.from('goals').insert({ ...goal, user_id })
    onCreate(goal);
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,10,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.offwhite, borderRadius: "32px 32px 0 0", border: `3px solid ${C.black}`, borderBottom: "none", width: "100%", maxWidth: 520, padding: "28px 28px 48px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ width: 36, height: 4, background: "rgba(0,0,0,0.15)", borderRadius: 99, margin: "0 auto 24px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>New Goal</h2>
          <button onClick={onClose} style={{ background: C.black, color: C.white, border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 14, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Emoji picker */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 10 }}>ICON</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {GOAL_EMOJIS.map((e) => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                fontSize: 22, padding: "10px 0", borderRadius: 12,
                background: emoji === e ? color : C.white,
                border: `2px solid ${emoji === e ? C.black : "rgba(0,0,0,0.12)"}`,
                cursor: "pointer", boxShadow: emoji === e ? `2px 3px 0 ${C.black}` : "none",
                transition: "all 0.15s",
              }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 10 }}>COLOR</label>
          <div style={{ display: "flex", gap: 10 }}>
            {GOAL_COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{
                width: 38, height: 38, borderRadius: "50%", background: c,
                border: `2.5px solid ${C.black}`, cursor: "pointer",
                boxShadow: color === c ? `0 0 0 3px ${C.offwhite}, 0 0 0 5px ${C.black}` : "none",
                transition: "all 0.15s",
              }} />
            ))}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>GOAL NAME</label>
          <input
            type="text" placeholder="e.g. New Phone, Trip to Goa"
            value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
            maxLength={40}
            style={{ width: "100%", border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px 16px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", background: C.white, outline: "none", boxShadow: `2px 3px 0 ${C.black}` }}
          />
        </div>

        {/* Target */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>TARGET AMOUNT</label>
          <div style={{ display: "flex", alignItems: "center", background: C.white, border: `2.5px solid ${error.includes("target") ? C.red : C.black}`, borderRadius: 16, padding: "0 16px", boxShadow: `3px 4px 0 ${C.black}` }}>
            <span style={{ fontSize: 20, fontWeight: 800, opacity: 0.4, marginRight: 8 }}>₹</span>
            <input
              type="number" placeholder="0"
              value={target} onChange={(e) => { setTarget(e.target.value); setError(""); }}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 24, fontWeight: 800, fontFamily: "inherit", background: "transparent", padding: "14px 0", width: "100%" }}
            />
          </div>
        </div>

        {/* Deadline (optional) */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 8 }}>TARGET DATE (optional)</label>
          <input
            type="date" value={deadline} min={today()}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ width: "100%", border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px 16px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", background: C.white, outline: "none", boxShadow: `2px 3px 0 ${C.black}` }}
          />
        </div>

        {error && <p style={{ fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 14, textAlign: "center" }}>{error}</p>}

        <button onClick={submit} style={{
          width: "100%", background: C.black, color: C.yellow,
          border: `2.5px solid ${C.black}`, borderRadius: 18,
          padding: "16px", fontWeight: 800, fontSize: 17,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `4px 5px 0 rgba(0,0,0,0.25)`,
        }}>Create Goal ✓</button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL DETAIL DRAWER (log savings + history)
// ─────────────────────────────────────────────────────────────────────────────
interface GoalDetailProps {
  goal: Goal;
  contributions: Contribution[];
  onClose: () => void;
  onLog: (goalId: string, amount: number, note: string) => void;
  onDelete: (goalId: string) => void;
}

function GoalDetail({ goal, contributions, onClose, onLog, onDelete }: GoalDetailProps) {
  const [amount, setAmount] = useState("");
  const [note,   setNote]   = useState("");
  const [error,  setError]  = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pct = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
  const remaining = Math.max(goal.target - goal.saved, 0);
  const dleft = daysUntil(goal.deadline);

  const history = useMemo(
    () => contributions.filter((c) => c.goalId === goal.id).sort((a, b) => b.date.localeCompare(a.date)),
    [contributions, goal.id]
  );

  function logSaving() {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError("Enter a valid amount"); return; }
    // TODO: supabase.from('contributions').insert({ goal_id: goal.id, amount: amt, note, date: today(), user_id })
    // TODO: supabase.from('goals').update({ saved: goal.saved + amt }).eq('id', goal.id)
    // TODO: update streak: supabase.rpc('update_streak', { user_id })
    onLog(goal.id, amt, note.trim() || "Manual save");
    setAmount(""); setNote("");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,10,0.65)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.offwhite, borderRadius: "32px 32px 0 0", border: `3px solid ${C.black}`, borderBottom: "none", width: "100%", maxWidth: 600, padding: "28px 28px 48px", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div style={{ width: 36, height: 4, background: "rgba(0,0,0,0.15)", borderRadius: 99, margin: "0 auto 24px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 54, height: 54, background: goal.color, border: `2.5px solid ${C.black}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{goal.emoji}</div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{goal.name}</h2>
              {dleft !== null && (
                <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.45, marginTop: 2 }}>
                  {dleft >= 0 ? `${dleft} days left` : `${Math.abs(dleft)} days overdue`}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: C.black, color: C.white, border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 14, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ background: goal.color, border: `2.5px solid ${C.black}`, borderRadius: 22, padding: "22px 22px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" }}>{formatINR(goal.saved)}</div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6 }}>of {formatINR(goal.target)}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em" }}>{pct}%</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.12)", borderRadius: 99, height: 12, overflow: "hidden", border: `1.5px solid rgba(0,0,0,0.2)` }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ height: "100%", background: C.black, borderRadius: 99 }} />
          </div>
          {pct < 100 && <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, marginTop: 10 }}>{formatINR(remaining)} more to go 💪</p>}
          {pct >= 100 && <p style={{ fontSize: 13, fontWeight: 800, marginTop: 10 }}>🎉 Goal complete! Amazing work.</p>}
        </div>

        {/* Log saving */}
        {pct < 100 && (
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 10 }}>LOG A SAVING</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", background: C.white, border: `2px solid ${error ? C.red : C.black}`, borderRadius: 14, padding: "0 14px", flex: 1, boxShadow: `2px 3px 0 ${C.black}` }}>
                <span style={{ fontSize: 16, fontWeight: 800, opacity: 0.4, marginRight: 6 }}>₹</span>
                <input
                  type="number" placeholder="Amount"
                  value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontWeight: 800, fontFamily: "inherit", background: "transparent", padding: "12px 0" }}
                />
              </div>
            </div>
            <input
              type="text" placeholder="Note (optional)"
              value={note} onChange={(e) => setNote(e.target.value)}
              maxLength={40}
              style={{ width: "100%", border: `2px solid ${C.black}`, borderRadius: 14, padding: "11px 14px", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: C.white, outline: "none", boxShadow: `2px 3px 0 ${C.black}`, marginBottom: 12 }}
            />
            {error && <p style={{ fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 10 }}>{error}</p>}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {[100, 500, 1000].map((q) => (
                <button key={q} onClick={() => setAmount(String(q))} style={{ border: `1.5px solid ${C.black}`, borderRadius: 99, padding: "6px 16px", fontSize: 12, fontWeight: 800, background: C.white, cursor: "pointer", fontFamily: "inherit" }}>+₹{q}</button>
              ))}
            </div>
            <button onClick={logSaving} style={{ width: "100%", background: C.black, color: C.yellow, border: `2.5px solid ${C.black}`, borderRadius: 16, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `3px 4px 0 rgba(0,0,0,0.25)` }}>
              Add to Savings ⚡ +10 XP
            </button>
          </div>
        )}

        {/* History */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", opacity: 0.5, display: "block", marginBottom: 10 }}>HISTORY ({history.length})</label>
          {history.length === 0 ? (
            <p style={{ fontSize: 13, opacity: 0.4, fontWeight: 600, textAlign: "center", padding: "20px 0" }}>No contributions yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.white, border: `1.5px solid ${C.black}`, borderRadius: 14, padding: "10px 16px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{c.note}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.4 }}>{new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#2a7a2a" }}>+{formatINR(c.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        {confirmDelete ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onDelete(goal.id)} style={{ flex: 1, background: C.red, color: C.white, border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Yes, delete goal</button>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, background: C.white, border: `2px solid ${C.black}`, borderRadius: 14, padding: "12px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} style={{ width: "100%", background: "transparent", border: `1.5px solid rgba(0,0,0,0.15)`, borderRadius: 14, padding: "10px", fontWeight: 700, fontSize: 13, opacity: 0.4, cursor: "pointer", fontFamily: "inherit" }}>Delete Goal</button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL CARD
// ─────────────────────────────────────────────────────────────────────────────
function GoalCard({ goal, onClick }: { goal: Goal; onClick: (g: Goal) => void }) {
  const pct = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
  const dleft = daysUntil(goal.deadline);
  const done = pct >= 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(goal)}
      style={{
        background: C.white, border: `2.5px solid ${C.black}`, borderRadius: 26,
        padding: "22px 22px", cursor: "pointer",
        boxShadow: `3px 4px 0 ${C.black}`, transition: "box-shadow 0.18s, transform 0.18s",
        position: "relative",
      }}
    >
      {done && <div style={{ position: "absolute", top: 16, right: 16, background: C.green, border: `2px solid ${C.black}`, borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 800 }}>✓ DONE</div>}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, background: goal.color, border: `2.5px solid ${C.black}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{goal.emoji}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{goal.name}</h3>
          {dleft !== null && !done && (
            <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.45 }}>
              {dleft >= 0 ? `${dleft} days left` : `Overdue by ${Math.abs(dleft)}d`}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em" }}>{formatINR(goal.saved)}</span>
        <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.4 }}>of {formatINR(goal.target)}</span>
      </div>
      <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 10, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: done ? C.green : goal.color, borderRadius: 99 }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, opacity: 0.5 }}>{pct}% complete</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SavingsPage() {
  const [goals,         setGoals]         = useState<Goal[]>(MOCK_GOALS);
  const [contributions, setContributions] = useState<Contribution[]>(MOCK_CONTRIBUTIONS);
  const [streak,        setStreak]        = useState<StreakData>(MOCK_STREAK);
  const [selectedGoal,  setSelectedGoal]  = useState<Goal | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [filter,        setFilter]        = useState<"All" | "Active" | "Completed">("All");

  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct  = totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0;

  function createGoal(g: Goal) { setGoals((prev) => [g, ...prev]); }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setContributions((prev) => prev.filter((c) => c.goalId !== id));
    setSelectedGoal(null);
  }

  function logSaving(goalId: string, amount: number, note: string) {
    const contrib: Contribution = { id: uid(), goalId, amount, date: today(), note };
    setContributions((prev) => [contrib, ...prev]);
    setGoals((prev) => prev.map((g) => g.id === goalId ? { ...g, saved: g.saved + amount } : g));
    setSelectedGoal((prev) => prev ? { ...prev, saved: prev.saved + amount } : prev);

    // Update streak
    if (streak.lastSavedDate !== today()) {
      const isConsecutive = streak.lastSavedDate === daysAgo(1);
      const newCurrent = isConsecutive ? streak.current + 1 : 1;
      setStreak({
        current: newCurrent,
        longest: Math.max(streak.longest, newCurrent),
        lastSavedDate: today(),
        history: [today(), ...streak.history],
      });
    }
    // TODO: persist streak via supabase.rpc('update_streak', { user_id })
  }

  const filtered = goals.filter((g) => {
    const pct = (g.saved / g.target) * 100;
    if (filter === "Active") return pct < 100;
    if (filter === "Completed") return pct >= 100;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: C.offwhite, color: C.black, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 99px; }
        .goal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 600px) {
          .goal-grid { grid-template-columns: 1fr !important; }
          .stat-strip { flex-direction: column !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: C.black, borderBottom: `3px solid ${C.black}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontSize: 20 }}>🐷</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.yellow }}>Z-PiggyBank</span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600 }}>Savings</span>
          </div>
          <div style={{ background: C.pink, color: C.black, borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: 800 }}>
            🔥 {streak.current} day streak
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 100px" }}>

        {/* HERO */}
        <div style={{ marginBottom: 32 }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-block", background: C.cyan, border: `2px solid ${C.black}`, borderRadius: 40, padding: "5px 16px", fontWeight: 800, fontSize: 12, letterSpacing: "0.07em", marginBottom: 14 }}>
            SAVING GOALS 🎯
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            style={{ fontSize: "clamp(36px, 7vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 14 }}>
            Build the future<br />
            <span style={{ background: C.yellow, padding: "0 6px", borderRadius: 8 }}>one save at a time.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
            style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, opacity: 0.6, maxWidth: 460 }}>
            Set goals, log daily savings, and keep your streak alive.
          </motion.p>
        </div>

        {/* STREAK + OVERVIEW CARD */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          style={{ background: C.black, border: `2.5px solid ${C.black}`, borderRadius: 28, padding: "26px 28px", marginBottom: 32, color: C.white, boxShadow: `5px 6px 0 rgba(0,0,0,0.3)` }}>
          <div className="stat-strip" style={{ display: "flex", gap: 24, marginBottom: 22, flexWrap: "wrap" }}>
            {[
              { label: "Total Saved",     val: formatINR(totalSaved),         color: C.yellow },
              { label: "Total Target",    val: formatINR(totalTarget),        color: C.cyan   },
              { label: "🔥 Current Streak", val: `${streak.current} days`,    color: C.green  },
              { label: "🏆 Longest Streak", val: `${streak.longest} days`,    color: C.pink   },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ flex: 1, minWidth: 130 }}>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.4, marginBottom: 5 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.4 }}>Overall Progress</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.yellow }}>{overallPct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 12, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
                style={{ height: "100%", background: C.yellow, borderRadius: 99 }} />
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.4, marginBottom: 10 }}>Last 35 days</div>
            <StreakHeatmap history={streak.history} />
          </div>
        </motion.div>

        {/* FILTER + CREATE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(["All", "Active", "Completed"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? C.yellow : "transparent",
                border: `1.5px solid ${C.black}`, borderRadius: 99,
                padding: "6px 18px", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: filter === f ? `2px 3px 0 ${C.black}` : "none",
              }}>{f}</button>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            background: C.black, color: C.yellow, border: `2.5px solid ${C.black}`,
            borderRadius: 14, padding: "10px 22px", fontWeight: 800, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit", boxShadow: `3px 4px 0 rgba(0,0,0,0.25)`,
          }}>+ New Goal</button>
        </div>

        {/* GOALS GRID */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
            <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>No goals here</p>
            <p style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}>Create a goal to get started</p>
          </div>
        ) : (
          <div className="goal-grid">
            {filtered.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <GoalCard goal={g} onClick={setSelectedGoal} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 32, right: 28,
          width: 64, height: 64, background: C.yellow, color: C.black,
          border: `3px solid ${C.black}`, borderRadius: "50%",
          fontSize: 28, fontWeight: 800, cursor: "pointer",
          boxShadow: `4px 5px 0 ${C.black}`,
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40,
        }}
      >+</motion.button>

      {/* DRAWERS */}
      <AnimatePresence>
        {showCreate && <CreateGoalDrawer onCreate={createGoal} onClose={() => setShowCreate(false)} />}
        {selectedGoal && (
          <GoalDetail
            goal={selectedGoal}
            contributions={contributions}
            onClose={() => setSelectedGoal(null)}
            onLog={logSaving}
            onDelete={deleteGoal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}